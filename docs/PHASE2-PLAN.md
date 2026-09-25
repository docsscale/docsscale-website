# Phase 2 plan: work waiting on the source code

Status 2026-09-25: the Next.js source is **not on this Mac** (full search of `~`, see §1).
Everything here starts once a source project exists and has been verified against the live site.

## 1. Getting the source

**Search result.**
- No folder under `~` contains a `next.config.*` or a `package.json` depending on `next`, except `~/Downloads/creatifi-clone` (an unrelated project).
- `~/Downloads/Docs Scale Claude Design/` holds only **built exports**:
  - `docsscale-hostinger-v8.zip` and `docsscale-hostinger-v10.zip` are older main-site builds (build ID `docsscale-build`). The live build is `Xyw_CXGer8Ajzqs3iZpkt`, so the live site was rebuilt after v10.
  - `funnel-hostinger.zip` is the funnel build (`docsscale-funnel-build`). It is identical to live except `thank-you/index.html`.
- The only Claude Code session logs on this Mac are this session and a 17 Sep design-import session. Neither built the site, so it was most likely built in a **cloud session (claude.ai/code) or another machine**.

**Before rebuilding, please check:**
1. claude.ai/code → your sessions from about 14–18 Sep. A cloud session keeps its repo on GitHub, so look for a `docsscale` repo on your GitHub account.
2. The Claude Design project `6a84743a-…` (funnel) and the main-site design project. These are designs, not the Next.js app, but they're the best source for a rebuild.

**If it isn't found, rebuild from the live build (option R).**
1. New Next.js project pinned to the **same Next 15.5.x** as live, with two apps: main site and `/free-system` (`basePath`), each `output: 'export'`, `trailingSlash: true`.
2. Rebuild each page from three inputs:
   - the live HTML, which is the exact rendered markup
   - the `index.txt` RSC payloads, which give the component tree, client-component boundaries and props
   - the live CSS and the Claude Design files, which give the design intent and naming
3. Pin **pixel-identical output** with automated checks, per page, at 375 / 768 / 1440 px:
   - Playwright screenshots of live vs rebuilt: 0 changed pixels, or differences only from sub-pixel anti-aliasing, reviewed by hand
   - normalized DOM text diff: no differences
   - interaction checks: nav burger, specialty switcher, FAQ, forms (payloads compared with `tests/lead-handler.sh` fixtures), funnel → thank-you redirect
4. Deploy only after every page passes. The old build stays in `Backup/` for instant rollback.

Estimate: 17 routes across 2 apps, about 1–2 focused days including the verification harness.

## 2. Folder structure

**Before.** Unknown until the source is found. Routes from the build:
```
main:   / · /services/ · /services/[specialty]/ (dental, chiropractic, physical-therapy, med-spa)
        /how-it-works/ · /results/ · /about/ · /book-a-call/ · /privacy/ · /terms/ · 404
        sitemap.xml, robots.txt (route handlers)
funnel: /free-system/ · /free-system/book-a-call/ · /free-system/thank-you/ · 404
```

**After (proposed).** One repo, feature-based, keeping the two deployables for now:
```
docsscale/
├── apps/
│   ├── site/                      # main site (basePath "")
│   │   ├── app/                   # routes only: page.tsx files stay thin
│   │   │   ├── (marketing)/page.tsx, services/[specialty]/page.tsx, …
│   │   │   ├── sitemap.ts, robots.ts
│   │   │   └── layout.tsx         # fonts, metadata base, JSON-LD Organization
│   │   ├── features/
│   │   │   ├── lead-form/         # form UI + submit client + types + tests
│   │   │   ├── specialties/       # data per specialty + switcher
│   │   │   ├── case-studies/      # results data (single source for home + /results)
│   │   │   ├── faq/               # FAQ data → UI + FAQPage JSON-LD from one list
│   │   │   └── seo/               # metadata helpers, JSON-LD builders
│   │   ├── components/            # shared UI: Nav, Footer, Button, Section
│   │   ├── content/               # site facts: email, location, nav links
│   │   └── public/                # .htaccess, send-lead.php, _server/, llms.txt, favicon
│   └── funnel/                    # /free-system (same internal layout)
├── packages/
│   ├── ui/                        # design tokens + primitives shared by both apps
│   └── lead-client/               # typed fetch to send-lead.php, shared error copy
├── server/                        # canonical copy of _server/ + tests (synced into public/)
├── tests/
│   ├── e2e/                       # Playwright: pixel + DOM + funnel flows
│   └── lead-handler.sh
└── docs/                          # AUDIT, SERVER, CONTENT-CHANGES, REPORT, SEO-STRATEGY
```
Key points:
- Site facts (email, location, no phone) live in one `content/site.ts`. The footer, forms, error messages and JSON-LD all read from it, so A1–A10 in `CONTENT-CHANGES.md` become a single change.
- Server files ship inside `public/`, so a deploy can no longer wipe the security setup.
- Merging the funnel into the main app as a route group removes the duplicate React/framework download (M7). That is a later, separate step, because it changes the build.

## 3. Implementation order

Highest impact and lowest risk first. Each step: one commit, then build, lint, typecheck, tests and the pixel/DOM harness, then your review, then deploy, then a live check.

| # | Step | Findings | Visible? |
|---|---|---|---|
| 0 | Source found or rebuilt and verified pixel-identical; CI script (`build + lint + tsc + tests + e2e`) | — | No |
| 1 | Lock current behaviour: Playwright snapshots of all 17 routes × 3 widths; form payload and funnel-flow tests | — | No |
| 2 | Move server files into `public/`; sitemap/robots/llms from `app/` match the Track A versions | M1, deploy safety | No |
| 3 | Contact details and schema from one `content/site.ts` (A1–A10); `Organization` JSON-LD | C1 | **Yes, approved list** |
| 4 | Placeholders B1–B5 as you decide | C1 | **Yes, needs your decision** |
| 5 | Accessibility without visual change: `aria-label` on inputs and selects, `<main>` landmark, visually hidden labels | M4 | No |
| 6 | Honeypot `website` field (visually hidden, `tabindex=-1`, `autocomplete=off`) | H2 | No |
| 7 | Performance: investigate the ~4 s LCP render delay; server components for static sections; lazy-load below-the-fold client parts; `browserslist` for modern targets (removes ~43 KB legacy JS) | H6 | No (verified by pixel harness) |
| 8 | Funnel images: AVIF/WebP + `srcset`, `fetchpriority="high"` on the hero, explicit width/height | M5 | No |
| 9 | GA4 (your Measurement ID): loaded after idle, events `generate_lead` (both forms), `view_funnel`, `thank_you`, `book_call_view`; then resource-level CSP including GTM/GA and `booking.docsscale.com` | H4, H5 | No |
| 10 | SEO metadata: `og:image` 1200×630 (image from you), 404 titles, funnel `<h1>`, funnel meta descriptions ≤ 160 chars | M2, L1, L2 | Shares/SERP only, **needs approval** |
| 11 | Contrast fixes | M4 | **Yes, proposal with before/after** |
| 12 | Merge funnel into the main app (route group), one shared bundle | M7 | No |
| 13 | REPORT.md (before/after Lighthouse, bundle, CWV) + SEO-STRATEGY.md | — | — |

Correction to AUDIT L5: `19.2.0-canary` is the React build that Next.js vendors for the App
Router. That's normal for Next 15, not a separate risk. `npm audit` still runs in step 0.
