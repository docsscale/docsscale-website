# DocsScale website

The source for **docsscale.com**, the marketing site of a healthcare-clinic marketing agency, and for its free lead magnet at **/free-system/**.

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, exported as static HTML (`web/out/`).
- **Backend:** one small PHP lead handler that forwards form submissions to GoHighLevel (`server/`).
- **Hosting:** Hostinger (Apache + CDN). Staging at https://staging.docsscale.com (password-protected).

## Repository layout

```
web/                 Next.js app (the whole site + funnel)
  src/app/           routes: (site) = main site, (funnel) = /free-system/, not-found
  src/content/       all copy and data (edit text here, not in components)
  src/features/      page sections and site chrome, one folder per area
  src/components/ui/ shared building blocks
  src/styles/        design tokens, global CSS, motion
  public/            static files (images, favicons, robots.txt, sitemap.xml, llms.txt)
server/
  public_html/       .htaccess + lead endpoints (_server/ holds the shared PHP)
  private/           config template (the real config lives only on the server)
  staging/           staging-only additions (password, noindex, test mode)
brand/               official logo, icon and social image (see brand/README.md)
reference/           frozen builds: live-2026-09-25 (original site), approved (visual baseline)
tests/visual/        pixel and behaviour tests (Playwright)
tests/server/        lead-handler tests (PHP)
scripts/             deploy, visual approval, image optimisation
docs/                everything else: architecture, runbooks, guides, reports
```

## Quick start

```bash
cd web && npm ci && npm run dev          # http://localhost:3000
```

| Command | Where | What |
|---|---|---|
| `npm run build` | `web/` | Static export to `web/out/` |
| `npm run lint` / `typecheck` / `format:check` | `web/` | Code checks (all run in CI) |
| `npm run test:server` | root | Lead-handler tests (needs PHP 8.1+) |
| `npm run test:e2e` | root | 19 interaction scenarios vs the approved build, incl. exact form payloads |
| `npm run visual:candidate` then `visual:compare` | root | Full-page pixel comparison of every route at 3 widths |
| `npm run visual:approve` | root | Freeze the current build as the new approved baseline (after owner approval) |
| `bash scripts/optimise-images.sh` | root | Regenerate AVIF/WebP versions of content images |
| `node scripts/deploy.mjs --target staging` | root | Build and upload to staging |

Root commands need `npm ci` at the root once (Playwright and friends).

## Documentation

| Doc | For |
|---|---|
| [docs/CLIENT-GUIDE.md](docs/CLIENT-GUIDE.md) | Non-technical: how to change text, photos, analytics |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the site is built and why |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Branches, commits, checks, the "zero visible change" rule |
| [docs/QA-CHECKLIST.md](docs/QA-CHECKLIST.md) | What to check before every release |
| [docs/RELEASE.md](docs/RELEASE.md) | Releasing, deploying and rolling back |
| [docs/SERVER.md](docs/SERVER.md) | Server layout, lead handler, token rotation, backups |
| [docs/TRACKING.md](docs/TRACKING.md) | GA4, consent, events, UTM naming |
| [docs/SEO-STRATEGY.md](docs/SEO-STRATEGY.md) | SEO/AEO/GEO state and plan |
| [docs/REPORT.md](docs/REPORT.md) | Before/after results of the rebuild |
| [docs/HANDOVER.md](docs/HANDOVER.md) | Accounts, where credentials live, open items |
| [CHANGELOG.md](CHANGELOG.md) | What changed in each release |
