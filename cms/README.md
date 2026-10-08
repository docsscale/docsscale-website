# The editing screen (cms.docsscale.com)

A small app with a server, apart from the public site: `web/` stays a static
export and contains nothing from here. It is Keystatic; editors sign in with an
email address through Keystatic Cloud and need no GitHub account.
[docs/COMPLETION-PLAN.md](../docs/COMPLETION-PLAN.md), section 6, has the design
and the trial results.

- **What editors can change** is the content model in `content-schema.ts`. That
  file is a byte-for-byte copy of `web/src/content/content-schema.ts` (the two
  packages can't import from each other); CI fails if they differ.
- **Where saves go:** always to the branch `content/working`, never to `main`.
  `app/keystatic/keystatic.tsx` sends the screen back to that branch and hides
  the branch and pull-request controls, which Keystatic has no setting for.
- **Never indexed:** every response carries `X-Robots-Tag: noindex`
  (`next.config.ts`); CI checks the live address (`tests/server/hidden-sites.sh`).
- **SEO fields** count characters while typing (`fields/`).

Run locally: `npm ci && npm run dev` in `cms/`, then open
`http://localhost:3100/keystatic`. Locally it edits the files in `/content`
directly, with no sign-in.

Deploying: it runs as a Node.js site on the existing hosting plan, Node.js 24.
Steps are in [docs/HANDOVER.md](../docs/HANDOVER.md).

## The SEO dashboard (`/seo`)

Phase 1 of [docs/SEO-DASHBOARD-PLAN.md](../docs/SEO-DASHBOARD-PLAN.md), in the
same app: Overview, Google, Bing, Analytics and leads, Content history, Edit
log, Technical health (site checks, page linter, PageSpeed), Data sources and
Access log. Code in `lib/seo/` and `app/seo/`.

- **Sign-in:** a one-time email link (owner's decision, 6 Oct 2026), sent with
  the server's `sendmail` from info@docsscale.com. Sessions last 30 days. Every
  sign-in and page seen goes to the Access log, with shortened IP addresses.
- **Store:** one SQLite file (`node:sqlite`, Node.js 24) in `SEO_DATA_DIR`, a
  private folder outside every served folder. Never in the repository.
- **Collectors:** `POST /api/seo/run?job=daily` (our site and linter, Search
  Console, GA4, Bing, content history) and `?job=weekly` (PageSpeed), with
  `Authorization: Bearer $SEO_CRON_TOKEN`, from Hostinger's cron. Each source
  is tried on its own; the Data sources tab shows what each returned.
- **Settings on the server** (environment, never in the repository):
  `SEO_DATA_DIR`, `SEO_ADMIN_EMAILS`, `SEO_CRON_TOKEN`,
  `GOOGLE_SERVICE_ACCOUNT_FILE` (path to the read-only key, inside the private
  folder), `BING_API_KEY`, `PAGESPEED_API_KEY`, and `SEO_GITHUB_TOKEN` (a
  read-only token, needed once the repository is private again). Optional:
  `SEO_SITE_URL`, `SEO_PUBLIC_URL`, `GSC_SITE`, `GA4_PROPERTY`, `BING_SITE_URL`.
- **Locally:** `SEO_MAIL_MODE=console SEO_ADMIN_EMAILS=you@example.com
  SEO_PUBLIC_URL=http://localhost:3100 npm run dev`, then open `/seo`; the
  sign-in link is printed in the terminal. The store goes to `cms/.seo-data/`.
