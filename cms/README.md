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
The workflow `.github/workflows/cms-deploy.yml` zips this folder, uploads it
to cms.docsscale.com and starts Hostinger's build; it runs on every change to
`cms/` on `main` and can be started by hand. Server settings are set in hPanel
(or through Hostinger's API), never in the repository.

## The SEO dashboard (`/seo`)

Phases 1 and 2 of [docs/SEO-DASHBOARD-PLAN.md](../docs/SEO-DASHBOARD-PLAN.md),
in the same app. Tabs: Overview; Search: Google, Bing, Keywords and rankings,
Questions and gaps, AI visibility; Site: Analytics and leads, Content
inventory, Edit log, Technical health, Links; Actions: Fix queue, 30/60/90
plan, History and outcomes, Imports; Admin: Data sources, Settings, Access
log. Code in `lib/seo/` and `app/seo/`.

- **Fix queue** (`lib/seo/findings.ts`): after every daily run the rules in
  `detect()` turn the snapshots into findings (failing site checks and linter
  checks, pages not indexed, page-one phrases with no clicks, phrases at
  positions 11 to 20, two pages on one phrase, lost clicks, orphan pages,
  keyword-map pages not yet written, Bing crawl issues, stale posts), each
  with its evidence, impact, effort and who acts. Only the admin approves,
  saves for later or rejects, unless Settings extends it to the SEO role;
  the SEO role recommends, notes progress and writes the instruction note.
  Approve marks an item for the weekly run; nothing publishes from the app.
  Done items get a check date (28 days, 60 for a new page) and the next run
  records worked / no effect / hurt / too early from the Search Console
  snapshots on each side of the change. Thresholds are on the Settings tab,
  each change logged with its reason.
- **Overview**: the automatic part (what moved, the top open items, risks,
  what to ignore) comes from the data; the written summary is typed on the
  tab or sent by the weekly run (below) and is flagged when older than eight
  days.
- **Paid connectors** are listed on Settings as off; nothing is bought.

- **Sign-in:** a one-time email link (owner's decision, 6 Oct 2026), sent with
  the server's `sendmail` from info@docsscale.com. Sessions last 30 days. Every
  sign-in and page seen goes to the Access log, with shortened IP addresses.
- **Store:** one SQLite file (`node:sqlite`, Node.js 24) in the private
  folder `~/domains/cms.docsscale.com/private/seo` on the server (`lib/seo/config.ts`),
  outside every served folder. Never in the repository.
- **Collectors:** the daily sources (our site and linter, Search Console, GA4,
  Bing, content history) once a day from 10:00 UTC and PageSpeed once a week,
  on the app's own schedule (`runIfDue` in `lib/seo/run.ts`, checked every ten
  minutes from `instrumentation.ts`). Any call to `POST /api/seo/run`, such as
  Hostinger's cron, also starts a run that is due; with the right token
  (`?job=daily|weekly|all`, `Authorization: Bearer <token>`) it starts that
  job now. When the app starts it writes the token and `cron.mjs` into the
  private folder (`lib/seo/server-files.ts`), so a cron job of your own can
  run `node .../private/seo/cron.mjs daily` without typing a token in. Each
  source is tried on its own; the Data sources tab shows what each returned.
- **Setting up** (owner, 8 Oct 2026: nothing typed into hPanel):
  1. Install with the "Editing app" workflow, run by hand once with the
     admin address in its input (or set the repository variable
     `SEO_ADMIN_EMAILS`). The app keeps the admins in its store, so later
     automatic installs keep them.
  2. The admin signs in and uploads the Google key file on the **Settings**
     tab; Bing, PageSpeed and GitHub keys are pasted there. Keys go to
     `settings.json` in the private folder and are never shown again.
  3. Nothing else: the app runs its own schedule. The two existing cron jobs
     (daily 10:20 UTC, Mondays 10:40 UTC) only nudge it.
- **Read-only access for Claude** (owner, 8 Oct 2026): an admin makes a key
  on the Settings tab (shown once; the app keeps its hash) and puts it in the
  cloud environment's secrets as `SEO_READ_TOKEN`. `GET /api/seo/read?what=
  sources|all|<source>` with `Authorization: Bearer <key>` returns the latest
  data as JSON (`what=queue` and `what=overview` add the fix queue, the plan,
  the manual AI checks and the imports); every read is in the Access log.
  The one write the key allows is `POST /api/seo/read` with the weekly
  summary as plain text in the body, which appears on the Overview as
  written by "Claude (weekly run)". It cannot touch the queue, keys or people.
  The environment still wins when set: `SEO_DATA_DIR`, `SEO_ADMIN_EMAILS`,
  `SEO_CRON_TOKEN`, `GOOGLE_SERVICE_ACCOUNT_JSON` or
  `GOOGLE_SERVICE_ACCOUNT_FILE`, `BING_API_KEY`, `PAGESPEED_API_KEY`,
  `SEO_GITHUB_TOKEN`; optional `SEO_SITE_URL`, `SEO_PUBLIC_URL`, `GSC_SITE`,
  `GA4_PROPERTY`, `BING_SITE_URL`.
- **Locally:** `SEO_MAIL_MODE=console SEO_ADMIN_EMAILS=you@example.com
  SEO_PUBLIC_URL=http://localhost:3100 npm run dev`, then open `/seo`; the
  sign-in link is printed in the terminal. The store goes to `cms/.seo-data/`.
