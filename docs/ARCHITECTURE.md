# Architecture

## In one picture

```
Browser ──HTTPS──▶ Hostinger CDN ──▶ Apache (public_html/)
                                      ├── static HTML/CSS/JS/images   ← web/out (Next.js static export)
                                      ├── .htaccess                   ← headers, caching, blocking, 404
                                      └── send-lead.php  (+ /free-system/send-lead.php)
                                              └── _server/lead-handler.php ──▶ GoHighLevel API (contacts)
                                                        │                        ▲
                                                        ▼                        │ token + location ID
                                      private/ (outside web root): config.php, leads/*.jsonl, logs/
Booking page iframe ──▶ booking.docsscale.com (GoHighLevel calendar)
```

There's no database and no Node server in production: every page is a static file.
The only server code is the PHP lead handler.

## Frontend (`web/`)

- **Next.js 16, App Router, `output: 'export'`, `trailingSlash: true`.** `npm run build` writes plain HTML files to `web/out/`, one folder per route (`/about/index.html`).
- **Two route groups with separate shells:**
  - `app/(site)/`: the main site. Its layout adds the footer, fonts, global CSS and motion CSS; each page renders its own `<Nav active="…">`.
  - `app/(funnel)/free-system/`: the lead magnet. Designed separately, so it has its own stylesheet (`funnel.css`), header and footer. Links from the funnel to the main site are plain `<a>` tags (full page loads), so the two stylesheets never mix.
  - `app/not-found.tsx`: the 404 page. It brings the main-site shell itself, and Apache serves it for every missing URL, funnel included.
- **The root layout** (`app/layout.tsx`) holds what every page shares: `metadataBase`, the favicon set, the web manifest, and GA4 (only when a Measurement ID is set).
- **Content is data:** all copy lives in `src/content/*.ts`. Components in `src/features/<area>/` render it. Changing text never means touching layout code.
- **Server Components by default.** Client components are small leaves:
  - navigation (dropdown, burger);
  - forms;
  - the funnel gallery and booking switch;
  - motion;
  - the consent banner.
- **Design tokens:** `src/styles/tokens.ts` (inline styles) and the same values as CSS variables in `globals.css`. Stage colours (Attract, Capture, Convert, Retain) come from `STAGE_COLORS`.
- **Motion:**
  - page headlines use `AnimatedHeading`. The server renders plain text (exactly as the original site did), and a tiny inline script splits words before first paint, only when the visitor allows motion. CSS animates them.
  - Scroll animations use GSAP, loaded lazily after the page is interactive (`SiteMotion`).
  - Reduced-motion visitors get static content.
- **Images:**
  - content photos go through `ResponsiveImage` (`<picture>` with AVIF and WebP at several widths; the JPEG is the fallback);
  - variants are pre-built by `scripts/optimise-images.sh` and committed, so no image tooling is needed at build time;
  - the logo is pre-sized WebP (`BrandLogo`).
- **SEO:**
  - `features/seo/metadata.ts` builds each page's title, description, canonical, Open Graph and Twitter tags (including the social image);
  - `content/structured-data.ts` holds JSON-LD (one Organization `@id` referenced everywhere);
  - `public/sitemap.xml`, `robots.txt` and `llms.txt` are static files.

## Forms and the lead handler

1. **Form types:** three forms, all posting JSON with `fetch`.
   - the homepage form and the Book a Call form go to `/send-lead.php`;
   - the funnel form goes to `/free-system/send-lead.php`.
2. **Endpoints:** each endpoint is a 2-line shim that picks a form definition from `_server/forms.php` (fields, lengths, required fields, GoHighLevel mapping) and runs `_server/lead-handler.php`.
3. **Handler steps, in order:**
   1. method check;
   2. config;
   3. same-origin check;
   4. size and JSON check;
   5. **honeypot:** a hidden `website` field. If it's filled, the handler returns a fake success and sends nothing;
   6. validation;
   7. per-IP and global rate limits;
   8. local backup to `private/leads/YYYY-MM.jsonl`;
   9. the GoHighLevel contacts API call.
4. **When GoHighLevel fails:** the lead is still saved locally and the visitor sees a friendly error with the email fallback.
5. **Secrets:** the GoHighLevel token and location ID are only in `private/config.php` on the server, outside the web root. It's never in git and never printed.
6. **Staging:** `environment.php` points the handler at `private-staging/`, whose config sets `test_mode` (validated and saved, never sent to GoHighLevel).

Details, limits and runbooks: [SERVER.md](SERVER.md).

## Analytics and consent

`content/analytics.ts` holds `GA_MEASUREMENT_ID`. When it's empty, nothing analytics-related is rendered. When it's set:
- Consent Mode v2 defaults deny everything;
- a saved choice is applied before GA starts;
- the banner asks once, and "Cookie settings" in the footer reopens it.

Events: see [TRACKING.md](TRACKING.md).

## Quality gates

| Check | Tool | When |
|---|---|---|
| Lint, types, formatting, build | ESLint 9, TypeScript 6, Prettier 3, Next build | CI, every push |
| Lead handler (36 tests: responses, exact GHL payloads, backups, rate limits, honeypot, test mode) | `tests/server/lead-handler.sh` with PHP's built-in server and a fake GHL | CI |
| Dependency audit | `npm audit --omit=dev --audit-level=high` | CI |
| Pixel parity (every route × 3 widths, threshold 0) | Playwright + pixelmatch vs `reference/approved/` | CI |
| Behaviour parity (19 scenarios: nav, filters, forms incl. exact payloads, lightbox, booking) | `tests/visual/interactions.mjs` | CI |

Screenshots are deterministic:
- fake clock;
- reduced motion;
- fonts, images and animations settled (`settle.mjs`);
- third-party requests blocked and a consent choice preset (`isolate.mjs`).

A deliberate visible change is approved by the owner, then frozen with `npm run visual:approve`.

## Environments and deploys

| | URL | Folder on Hostinger | Lead handler |
|---|---|---|---|
| Production | https://docsscale.com | `public_html/` | live, sends to GoHighLevel |
| Staging | https://staging.docsscale.com (password) | `public_html/staging_html/` | test mode |

- **How it deploys:** `scripts/deploy.mjs` builds, assembles `release/<target>/` (static export + server files, plus the staging additions), and uploads over the existing files. Nothing on the server is deleted; old hashed `/_next/` files stay harmlessly.
- **Production gates:** it only deploys from a clean `main` that is pushed to GitHub and has all CI checks green, and it needs `--yes`.
- **Rollback:** see [RELEASE.md](RELEASE.md).

## Decisions worth knowing

- **Static export instead of a Node server:** Hostinger shared hosting, no server to patch, fast CDN delivery, and nothing to crash.
- **PHP for the lead handler:** it's what the host runs natively. It keeps the GoHighLevel token server-side, and it's small enough to test completely.
- **Inline styles plus tokens:** kept from the original design so the rebuild could match it pixel for pixel. New work may use CSS modules; keep the tokens as the source of truth.
- **Pixel-parity tests at threshold 0:** the promise was "no visible change unless approved", and this is how it's proven.
