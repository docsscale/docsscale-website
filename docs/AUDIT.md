# docsscale.com — Phase 1 Audit

Date: 2026-09-25 · Scope: read-only · Branch: `audit-hardening` · Nothing on the live server was changed.

## 0. What was audited, and what could not be

| Audited | How |
|---|---|
| Deployed site (`public_html`, 109 files) | Your hPanel backup `Backup/5 22 AM 25 Sep 26public_html.zip`, unpacked to `site/` and committed as the baseline |
| Live server behaviour | HTTP headers, redirects, caching, compression, TLS, DNS against https://docsscale.com |
| Performance / SEO / a11y | Lighthouse 12 (mobile, simulated throttling) on a local copy of the build |
| Lead endpoints | Source of `send-lead.php` and `free-system/send-lead.php` |

**Not available: the Next.js source code.** What is on the server is a *static export* of two
Next.js 15.5.25 apps (the main site, and the `/free-system` funnel with `basePath: /free-system`).
No `package.json`, components, tests or git history were found on this machine
(`~/Downloads/docsscale-website` and `~/Downloads/DocsScale Funnel` hold specs and wireframes, not the app).
Consequences:

- `npm audit`, the build, the linter, the type checker and tests **cannot be run** yet.
- Component-level fixes (JS bundle, markup, a11y attributes) must be made in the source. Editing the
  exported HTML is fragile: client-side navigation re-renders from the `index.txt` RSC payloads and
  the next deploy overwrites it.
- There is **no database**. The only server code is the two PHP relays to GoHighLevel (GHL), so the
  DB-query items in the brief (N+1, indexes, query times) don't apply.

Fixes are therefore split into two tracks:
- **Track A**: server-level changes I can make now through Hostinger without the source (`.htaccess`, PHP, robots/sitemap/llms, stray files).
- **Track B**: changes that need the source.

## 1. Baseline metrics (local Lighthouse, mobile)

| Page | Perf | A11y | Best Pr. | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 82 | 91 | 100 | 100 | 4.9 s | 0 ms | 0 |
| `/services/dental/` | 85 | 95 | 100 | 100 | 4.4 s | 0 ms | 0 |
| `/book-a-call/` | 85 | 91 | 100 | 100 | 4.4 s | 0 ms | 0 |
| `/free-system/` | 80 | 91 | 96 | 100 | 5.5 s | 0 ms | 0 |

These scores are from a local server with no compression. The live CDN serves Brotli, so live Performance
will likely be a few points higher. I couldn't take a live PageSpeed Insights baseline because the public
API's daily quota was exhausted. I'll re-run it for REPORT.md.

JS per page (first load): home 637 KB raw / **~201 KB gzip** (Lighthouse: ~187 KB unused), services 191 KB gz, funnel 145 KB gz.
HTML: 92–130 KB raw (14–20 KB compressed), about half of it inline RSC payload.

## 2. Findings

Severity: **Critical**: live harm now (legal/trust exposure, credential risk). **High**: meaningful
security, conversion or ranking loss. **Medium**: measurable quality gap. **Low**: hygiene.
Track: **A** = fixable now on the server · **B** = needs source · **You** = needs your decision or an hPanel/GHL action.

### Critical

**C1. Placeholder business data is live and machine-readable** · Track: You, then A/B
- `llms.txt` says so itself: *"Placeholder sample data on the site (client names, figures, contact details) must be replaced with verified information before launch."*
- Phone `+1-512-555-0148` is a fictional 555 number. It appears in the JSON-LD `LocalBusiness` schema (all pages), in `llms.txt`, and on the forms themselves ("Or call (512) 555-0148"). The form error message also says "Please call us instead".
- The street address `2100 S Lamar Blvd, Suite 210, Austin` appears in schema. Named doctors (e.g. "Dr. Sam Whitfield", "Dr. Anita Patel") and figures appear on `/results/`.
- Risk: fabricated testimonials and case studies fall under FTC rules on endorsements. A fake address or phone in `LocalBusiness` schema can get a Google Business Profile suspended. Leads who fail to submit are sent to a dead number.
- Fix: you confirm which data is real. I replace or remove the rest. Copy changes are visible, so each one needs your approval.

**C2. GoHighLevel API token hard-coded in the web root** · `send-lead.php:13`, `free-system/send-lead.php` · Track: You + A
- A Private Integration Token (`pit-…`) and the location ID are PHP constants inside `public_html`. PHP executes rather than being served, so the token isn't directly downloadable today. But it is now in the hPanel zip, the local backup, this local git repo and this working session. It would also be exposed in full by any PHP handler misconfiguration.
- Fix: **rotate the token in GHL** (Settings → Private Integrations) and scope it to Contacts write only. Store the new one in a config file **outside** `public_html` (e.g. `/home/u145389112/domains/docsscale.com/ghl-config.php`), loaded with `require`. One shared file also removes the duplication (M7).

### High

**H1. `lead-debug-log.txt` is publicly downloadable** · `/lead-debug-log.txt` (HTTP 200) · Track: A
- It contains test submissions with emails and phone numbers, the GHL location ID, contact IDs and full GHL API responses. Nothing references it (the current PHP no longer writes it), so it is proven unused.
- Fix: delete it. As a fallback, block `*.log` and `*debug*` files in `.htaccess`.

**H2. Lead endpoints are unprotected and can lose leads** · both `send-lead.php` · Track: A
- **No abuse protection:** no rate limit, honeypot, Origin/Referer check or field length caps. Anyone can script unlimited POSTs straight into the CRM (spam contacts, GHL API rate limit of about 100 requests per 10 s, triggered automations and SMS costs).
- **Leaks internals:** on failure the endpoint returns `'debug' => $response`, the raw GHL body, to the browser. It also shows GHL's raw error text to the visitor and puts `curl_error()` text in responses.
- **Silent lead loss:** if GHL is down or rejects the request, the lead is dropped. There's no fallback email, log or retry.
- **Spoofable source:** `source` on the funnel endpoint is client-controlled.
- Fix, with no UI change:
  - hidden honeypot check server-side, plus per-IP rate limiting (file-based)
  - same-origin check, and length caps on every field
  - generic error messages; drop `debug`
  - on GHL failure, write the lead to a private file outside the web root and/or email it
  - pin `source` server-side
  - The honeypot needs a hidden input in the forms, which is Track B. Rate limiting and the rest are Track A.

**H3. `www.docsscale.com` has an invalid TLS certificate** · Track: You (hPanel)
- DNS points `www` at the Hostinger CDN, but the certificate doesn't cover it. Anyone typing `www.` gets a browser security warning. Search engines and backlinks that use `www` get no redirect.
- Fix: hPanel → SSL, issue or cover `www.docsscale.com`, then add a 301 from `www` to the apex domain. This is an infrastructure change, so it's your call.

**H4. No analytics or conversion tracking anywhere** · all pages · Track: You + B
- There's no GA4, GTM, Meta Pixel or any other tag. Form success, funnel steps and calendar bookings aren't measured, so ad spend and funnel drop-off can't be optimised.
- Fix: this adds third-party scripts (a new feature), so it needs your approval. Recommended: GA4 plus Meta Pixel via one GTM container, loaded after interaction/idle to protect LCP, with events `generate_lead` (both forms), `view_funnel`, `thank_you`, `book_call`, and a consent banner if you advertise to EU/CA visitors.

**H5. Security headers missing** · live response headers · Track: A
- The only header is `content-security-policy: upgrade-insecure-requests`. Missing: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors` (clickjacking of the lead forms), `Referrer-Policy`, `Permissions-Policy`.
- Fix: add them via `.htaccess` `mod_headers`. Start CSP in Report-Only mode, because Next's inline scripts need `'unsafe-inline'` until nonces or hashes are set up in the source.

**H6. Mobile LCP 4.4–5.5 s (target ≤ 2.5 s)** · all pages · Track: B
- The LCP element is text (the hero H1 or paragraph) on the main site and the hero image on the funnel. Almost all of the time is *render delay* (~4 s), not network, so the main thread is busy with ~200 KB gz of JS and hydration before the final paint.
- Likely causes, to confirm in source:
  - client components high in the tree (the specialty switcher, "Tap one, the page adapts")
  - page-wide `"use client"`
  - React **canary** build (`19.2.0-canary`)
  - legacy polyfills (~43 KB)
- Fix: move static sections to Server Components, lazy-load below-the-fold interactive parts, drop legacy browserslist targets, and check the hero doesn't re-render after hydration. Pixel-identical output is achievable.

### Medium

**M1. Sitemap disagrees with canonicals** · `sitemap.xml` · Track: A (+B so it survives rebuilds)
- The sitemap lists `/about` while the canonical is `/about/`. The live server 301s the first to the second, so every sitemap URL is a redirect (Search Console reports "Page with redirect").
- `/free-system/` is indexable with a canonical but missing from the sitemap.
- Every `lastmod` is hard-coded to 2026-09-15.
- Fix: trailing-slash URLs, add `/free-system/` and `/free-system/book-a-call/`, and use real lastmod dates.

**M2. No `og:image` / `twitter:image` on any page** · Track: B (+ an image from you)
- `twitter:card` is `summary_large_image`, but there's no image, so shared links on LinkedIn, Facebook, X, Slack and iMessage render bare.
- Fix: a 1200×630 image per page, or one site-wide. It's invisible on the site but visible in shares, so it needs your approval.

**M3. Caching** · Track: A
- Hashed `/_next/static/*` assets are served with `max-age=604800` (7 days). They are content-hashed, so they should be `max-age=31536000, immutable`.
- HTML is `x-hcdn-cache-status: DYNAMIC` (not edge-cached). A short edge TTL would cut TTFB (~450 ms) and absorb traffic spikes.

**M4. Accessibility** · Track: B (labels) / You (contrast)
- All form inputs use placeholder-only labels, and the `<select>`s have no accessible name (Lighthouse `select-name`) on `/`, `/book-a-call/` and `/free-system/`.
  - Fix: `aria-label`s, which are invisible.
- Contrast failures: 3 on home (text at `opacity:0.75/0.8`), 38 on `/free-system/`.
  - Fixing these changes colours, so it's **proposal only**.
- No `<main>` landmark and no skip link.
  - `<main>` is invisible. A skip link only appears on keyboard focus, so it's proposal only.

**M5. Funnel images** · `free-system/images/*` · Track: A (files) + B (markup)
- `hero-mockup.jpg` is the LCP element: 362 KB JPEG, 1600×1000, no `fetchpriority="high"`, no `srcset`, no WebP/AVIF.
- Six 1200 px JPEGs (~76–94 KB each) are rendered in small cards.
- Fix: same visual quality as AVIF/WebP (~60–70 % smaller), responsive sizes, and `fetchpriority` on the hero.

**M6. RSC payload files are crawlable duplicates** · `**/index.txt` · Track: A
- Every page also exists as `/…/index.txt` with its full text. Fix: `X-Robots-Tag: noindex` on `*.txt`, except `robots.txt` and `llms.txt`.

**M7. Code duplication** · Track: A/B
- There are two diverging copies of `send-lead.php`.
- Two separate Next apps ship duplicate framework chunks and fonts under `/_next` and `/free-system/_next`, so a visitor moving from the funnel to the site downloads React twice.
- Recommendation: one shared PHP lead handler with per-form config (Track A). Longer term, merge the funnel into the main app as a route group (Track B, Phase 2).

### Low

- **L1. 404 pages:** `404.html` reuses the homepage `<title>` and description. `/free-system/404.html` is the default unstyled Next.js 404. `/free-system/` has no favicon (`/favicon.ico` 404, which is Lighthouse's Best-Practices 96).
- **L2. Funnel SEO:** `/free-system/book-a-call/` has no `<h1>`. Meta descriptions on `/free-system/` (217 chars), `/book-a-call/` (181) and `/thank-you/` (192) get truncated in results (~155–160 max). Rewording them changes SERP snippets, not the page, so it's proposal only.
- **L3.** `llms.txt` publishes the internal "placeholder data" note (see C1).
- **L4.** Schema `sameAs` includes `https://doctorsscalepartners.com`. Please confirm you own it, otherwise remove it.
- **L5. Dependencies:** Next 15.5.25 and React 19.2 canary. Because the site is a static export on Apache, the known Next server-side CVEs (middleware bypass, RSC server actions) don't apply. A canary React build in production is still unwise. A full `npm audit` needs the source.
- **L6.** `robots.txt` is fine. It explicitly allows AI crawlers, which is consistent with having `llms.txt`.
- **L7. Works well already:**
  - HTTPS redirect, Brotli, font preload with `font-display:swap`
  - CLS 0, TBT 0
  - one H1 per page (except L2)
  - canonical tags, robots meta, and 4–6 JSON-LD blocks per page (Organization/LocalBusiness, Service, FAQPage, Breadcrumb)
  - thank-you page set to `noindex`

## 3. Scalability

The site is static files behind Hostinger's CDN, which scales well. What breaks first under load or attack:
1. **The PHP → GHL relay (H2).** Each submission holds a PHP worker for up to 15 s (`CURLOPT_TIMEOUT`) waiting on GHL. There's no rate limit or queue, and GHL throttles at about 100 requests per 10 s per location. A spike or bot run exhausts shared-hosting PHP workers and drops leads.
2. **HTML not edge-cached (M3).** Every page view reaches the origin.
3. **No lead fallback.** A GHL outage means lost leads.

## 4. Funnel

- **Critical:** a fake phone number is used as the fallback CTA in both form error states (C1).
- **High:** zero measurement (H4).
- **High:** silent lead loss on GHL errors (H2).
- **Medium:** when GHL rejects a submission, raw technical GHL messages reach the visitor.
- **Medium:** LCP 5.5 s on `/free-system/`, the paid-traffic landing page (H6, M5).
- The funnel form redirects to `/free-system/thank-you/` only on `ok:true`. The main form shows an inline success message. Both flows work, and both will be locked by tests before any refactor.

## 5. Proposed order (details in Phase 2)

1. **Today, Track A, no visual change:** H1 delete the debug log · H5 security headers · M3 cache headers · M6 noindex `.txt` · M1 sitemap · L3 llms note · H2 server-side hardening (rate limit, generic errors, fallback log, origin check) · C2 move the token outside the web root after you rotate it.
2. **You, in hPanel/GHL:** rotate the GHL token (C2) · fix `www` SSL (H3) · confirm the real business data (C1) · decide on analytics (H4) · provide or approve an OG image (M2).
3. **Track B, once I have the source:** performance (H6, M5), a11y labels (M4), honeypot, analytics wiring, structure cleanup (M7), tests.

**Stopping here for your approval.**
