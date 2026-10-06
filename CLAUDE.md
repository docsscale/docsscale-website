# DocsScale website: rules for every session

docsscale.com is the marketing site of DocsScale, a marketing agency for healthcare
clinics (Houston, founded 2023). Owner: Abdul Samad. This file is the standing
brief. Read it fully before doing anything, then read
[docs/SESSION-HANDOFF.md](docs/SESSION-HANDOFF.md) for where things stand.

If a rule here and a new instruction from the owner disagree, ask which applies.
If you are unsure whether something needs the owner's sign-off, stop and ask.

## 1. Approval rules (no exceptions)

- **Every change goes on a branch and through a pull request**, docs-only changes
  included. Never push to `main`.
- **Never merge to `main` without the owner's go-ahead for that PR.** An earlier
  approval does not carry over to the next PR.
- **Never deploy to production without the owner's go-ahead** for that release.
- **Anything visible gets a before/after first** (desktop 1440, tablet 768,
  mobile 375), and the owner approves it before it is merged. A recording too if
  it moves. Invisible changes still need the PR and the go-ahead, but no
  before/after.
- **Every visible copy change needs the owner's approval.** Don't reword
  owner-supplied copy.
- **Deleting files needs the owner's approval every time**, on the server and in
  the repo. Never delete anything unless it is proven unused.
- To cut interruptions: build and test several items, open their PRs, then ask
  once with a short summary of each.
- No new paid service, account or infrastructure without asking. Don't create
  accounts or enter passwords; the owner does that.
- **DNS:** show the exact change first; never change a record unasked.
- **Messaging is email only.** No SMS features.
- Don't rewrite `main`'s history.

## 2. Brand rules

- **Nothing public may suggest the site was built with AI.** No AI wording, tool
  or vendor names, generator tags or tool comments in any public file (pages,
  alt text, captions, file names, `llms.txt`). `robots.txt` is the only
  exception. No AI-generated or AI-edited images.
- **The CRM platform:** never name it, show its interface or use its branding on
  the main site, in graphics, alt text, captions or file names. The one recorded
  exception is the Free System funnel (`/free-system/`), where the product *is*
  a system set up in the buyer's account on that platform: there it is named
  only in details a buyer needs (owner's decision, 27–28 Sep 2026). Don't add
  new mentions; ask first.
- **No invented data.** No made-up statistics, results, testimonials, client
  names, reviews or logos. Example content must be labelled as an example and
  use neutral first names that are not clients or team members (team: Abdul
  Samad, Ahmed Mustafa, Mohsin, Omar, Owais, Ali). If a fact is not known, write
  "Unknown" (in docs) or ask; never guess.
- Never describe DocsScale as new, a startup or recently launched.
- Platforms strip on the homepage: plain names, no official logos, only
  platforms we work on for clients (currently Google Business Profile, Meta Ads,
  Google Ads, Instagram). Ask before adding one.
- Third-party images: record source and licence in `incoming/README.md` before
  they go live.
- Plain language in copy: no automation jargon.

**Content quality rules for all new pages** (owner, 6 Oct 2026; how each is
checked is in [docs/COMPLETION-PLAN.md](docs/COMPLETION-PLAN.md), section 3):

- **No scaled or templated pages.** Never create pages where only a city, a
  specialty or a keyword changes. Every page needs unique, substantive content.
- **Service + industry combination pages** only where we have real experience
  or a case study for that combination.
- **City pages** only where we have real clients or results.
- **Every page must include something only DocsScale could say** (a real client
  example, real numbers, or our own process) before it is published.
- **Steady publishing pace** (about two to three strong pages or posts a week),
  not a burst.
- **Flag any page that may be too similar to an existing one** before asking
  for approval.

## 3. Secrets

- **Never in the repo, never printed** in output, logs, commit messages or PRs.
- Local secrets live in `~/DocsScale-Secure/`: staging login
  (`staging-login.txt`), Bing API key, UptimeRobot API key, DNS backups.
- The CRM API token lives only on the server, in
  `/home/u145389112/domains/docsscale.com/private/config.php`. Never read it out.
- Deploy upload credentials are short-lived: generate fresh ones each time
  (docs/RELEASE.md), keep them in environment variables or the session's scratch
  folder, never in the repo.
- Never touch `.env` values or production data. Lead backups on the server are
  personal data.
- Gmail: read nothing unless the owner names the exact message.

## 4. Staging first, then production

Full steps: [docs/RELEASE.md](docs/RELEASE.md). Short form:

1. Feature branch → PR → CI green (lint/types/build, PHP lead-handler tests,
   dependency audit, pixel + behaviour parity).
2. Visible change: `node scripts/deploy.mjs --target staging --yes`, owner
   reviews https://staging.docsscale.com (password-protected, test mode, never
   reaches the CRM).
3. After approval of a visible change, re-record the visual baseline on the
   branch (`npm run visual:approve`, commit `reference/approved/`).
4. Owner's go-ahead → squash-merge → changelog `## [Unreleased]` becomes the
   version and date → wait for `main` CI → `git tag -a vX.Y.Z` → push the tag.
5. `node scripts/deploy.mjs --target production --yes` (only works on `main`,
   clean, pushed, CI green) → clear the Hostinger cache → verify on the live
   site → run `bash tests/server/redirects.sh`.
6. If a form or the lead handler changed: send one QA lead and give the owner
   the QA contact to delete.
7. If the Privacy Policy changed: its "Last updated" is the production deploy
   date.
8. Update the status tracker in `docs/PHASE5-PLAN.md` in the release PR.

Versions: major = redesign or URL change, minor = new pages or features, patch =
fixes and copy edits.

**Rollback** (docs/RELEASE.md, "Rolling back"): check out the previous tag and
deploy it; or `--rollback-original` for the pre-v1.0 site. A rollback is a
production deploy and needs the owner's go-ahead unless the site is down.

**Deploys never delete.** A removed page must be redirected in
`server/public_html/.htaccess` in the same release. `--prune` lists leftovers
(read-only); `--delete-listed <file> --yes` removes an owner-approved list.

## 5. Where things live

| What | Where |
|---|---|
| Site source (Next.js static export) | `web/` |
| **All page copy** | `web/src/content/*.ts` (`home.ts`, `hero-journey.ts`, `site.ts` for menus, `about.ts`, `book-a-call.ts`, `funnel.ts`, `legal.ts`, `lead-form.ts`, `industries.ts`) |
| **Specialty lists** | `web/src/content/specialties.ts` (the four with pages: dental, chiropractic, physical therapy, med spa) and `served-specialties.ts` (the nine we work with) |
| Design tokens | `web/src/styles/tokens.ts` (`T`, `STAGE_COLORS`) |
| Images and their sizes | `web/public/`, `web/src/content/images.ts`, `scripts/optimise-images.sh`; originals and licences in `incoming/` (not committed, except its README) |
| Lead handler (PHP) and server rules | `server/public_html/_server/`, `server/public_html/.htaccess` |
| Deploy script | `scripts/deploy.mjs` |
| Tests | `tests/visual/*.mjs` (`npm run test:e2e`), `tests/server/*.sh` |
| Approved visual baseline | `reference/approved/` |

Docs (`docs/`):

| File | What it is |
|---|---|
| `SESSION-HANDOFF.md` | Where everything stands right now |
| `HANDOVER.md` | Accounts, access, email authentication, monitoring, owner to-dos |
| `../CHANGELOG.md` | Every release, in plain language |
| `PHASE5-PLAN.md` | The growth plan, with the **status tracker** at the top (update it in every release PR) |
| `TRACKING.md` | GA4 events, consent, UTM standard, Clarity, attribution |
| `SERVER.md` | Lead handler, CRM fields, backups, failure email, cron |
| `BACKLOG.md` | Deferred items |
| `RELEASE.md` | Release, rollback, pruning |
| `AGENCY-REVIEW.md` | The 30 Sep review and its top-10 list |
| `ARCHITECTURE.md`, `CONTRIBUTING.md`, `QA-CHECKLIST.md`, `CLIENT-GUIDE.md`, `SEO-STRATEGY.md` | As named |
| `AUDIT.md`, `REPORT.md`, `PHASE2-PLAN.md`, `CONTENT-CHANGES.md` | Historical; don't treat as current |

## 6. How to work in this repo

- Run `npm ci` in `web/` after switching branches.
- Match the surrounding code: inline styles with tokens, copy in content files,
  comments that say why.
- Tests use Chromium only. Temporary Playwright scripts must sit in
  `tests/visual/` to resolve imports; delete them before committing.
- The local `ffmpeg` is broken; use Playwright's bundled one for recordings
  (WebM).
- Analytics rules that must not regress: GA4 and Clarity load only after
  "Accept"; Clarity only on docsscale.com, never for team browsers, with every
  form masked (permanent CI check, `tests/visual/clarity.mjs`). UTM and landing
  page are kept in the browser tab only and sent with a form submission.
- Report results as they are: if a test fails or a step was skipped, say so.
- Write for a reader who was not in the session: full sentences, plain words,
  the conclusion first.

## 7. Current state

Kept in [docs/SESSION-HANDOFF.md](docs/SESSION-HANDOFF.md) and the status tracker
in [docs/PHASE5-PLAN.md](docs/PHASE5-PLAN.md), so this file doesn't go stale.
