# Handover

**Written 7 Oct 2026** for whoever picks this project up next, person or
session. Part 1 is the state of the project. Part 2 is every account and
service the website depends on and where each credential is kept (**never the
credentials themselves**).

Read [../CLAUDE.md](../CLAUDE.md) first: it holds the rules. Then this file.

# Part 1: where the project stands

## What is live

- **Production: v1.4.6** on https://docsscale.com, deployed 7 Oct 2026.
  `https://docsscale.com/version.txt` shows it. All CI checks pass on `main`.
- Released on 7 Oct: **v1.4.5** (the `/services` Local SEO card no longer
  promises "a page per treatment and neighborhood"; build-tool security
  updates) and **v1.4.6** (sitemap generated from the built pages with true
  last-changed dates; automatic site checks in CI; routine dependency updates).
  Every release is in [../CHANGELOG.md](../CHANGELOG.md).
- **Staging** (staging.docsscale.com) holds an older build; redeploy before
  using it for a review.
- **Trial editing site:** https://cms-trial.docsscale.com (sign-in only,
  `noindex`). It is the Keystatic trial, kept on purpose; see "Parked" below.

## Open pull requests

| PR | What | State |
|---|---|---|
| [#45](https://github.com/docsscale/docsscale-website/pull/45) | Service pages: layout and route, with a Local SEO sample | **Draft, on purpose.** The owner approved the structure on 6 Oct. It holds filler text and must not be merged until real, approved copy replaces it. See "Parked". |

No other pull request is open. GitHub's updater opens new ones on Mondays
(weekly dependency updates); they are routine work under the rule below.

## The plan, and where it is

The working plan is [COMPLETION-PLAN.md](COMPLETION-PLAN.md) (approved 6 Oct
2026; its tracker and section 10 give the order). Its SEO command center part
is [SEO-DASHBOARD-PLAN.md](SEO-DASHBOARD-PLAN.md). The keyword map is
[seo/keywords/keyword-map.md](seo/keywords/keyword-map.md). Notes on the four
industry pages are in [notes/industry-pages.md](notes/industry-pages.md).

**Order (owner, 6 Oct): build the system first, then publish content through
it.**

| Stage | What | State |
|---|---|---|
| Done | CMS trial | Keystatic passed all six questions (plan, section 6) |
| Done | Keyword map | Approved 6 Oct. Open until the owner's extra export: keywords for the websites, lead follow-up and reviews pages; the city-page decision |
| **A** | Foundations | **Done 7 Oct 2026.** Service-page layout (draft #45), weekly dependency update PRs, generated sitemap, site checks in CI, performance budget in CI (plan, section 5, item 11, with what the first runs showed). |
| **B** | The system: blog templates and the CMS at `cms.docsscale.com` | **In progress since 7 Oct 2026.** Posts as files and the blog templates are built; the editing app is in the repository and waits to be installed. See "The very next steps", item 4. |
| **C** | First content, through the CMS | Waiting for B and for the owner's material. First pair: the local SEO page and the "Google Business Profile for dentists" post; then paid ads with "Facebook ads for chiropractors"; then reactivation with "dental recall messages". Publish the first pair as soon as the material and the publishing core both exist. |
| **F** | SEO command center | Approved as the lighter first cut (about 15–18 build days). **Not started; it comes after the publishing core and the first two content pieces.** Half-day test done (dashboard plan, section 2). |
| **D** | Handover package, remaining agency-review items, Safari in CI, WCAG pass | Not started |
| **E** | Weekly SEO review | Replaced by the dashboard's weekly run; starts about four weeks after the first content |

**The very next steps, in order**

1. ~~Performance budget in CI~~ Done 7 Oct 2026.
2. ~~Create `cms.docsscale.com` and `preview.docsscale.com`, and close them~~
   Done 7 Oct 2026 (see "The two new addresses" below). The Hostinger API
   token as a GitHub secret is asked for when the publish workflow is ready,
   not before.
3. Blog design, as before/after for the owner's approval.
4. Publishing core, then the first two content pieces. **Started 7 Oct 2026.**
   - Done: posts, categories and team members are files in `/content`; the
     site reads and renders them (`web/src/features/blog/`). The live build
     has a blog only when a post is published; the preview build
     (`CONTENT_PREVIEW=1 npm run build`) shows drafts, all `noindex`.
   - Done: the editing app is in `cms/` (README there). Its content model is
     `content-schema.ts`, the same file in `web/src/content/` and `cms/`; CI
     fails if the two differ. The working copy is the branch
     `content/working` (created from `main` on 7 Oct).
   - **Waiting for the owner's yes (asked 7 Oct):** installing the app at
     `cms.docsscale.com`. Installing overwrites the two files there
     (Hostinger's default page and `server/cms/.htaccess`). How: zip `cms/`
     without `node_modules` and `.next`, upload it with that site's upload
     credentials, then Hostinger's "start Node.js build" for the site with
     Node.js 24, framework Next.js, build script `build`, output `.next`.
     Then run `bash tests/server/hidden-sites.sh`, and have the owner sign in.
     Keystatic Cloud may need the new address allowed in its project settings
     (the owner's step).
   - Done 7 Oct: `node scripts/deploy.mjs --target preview` builds with
     drafts and uploads to `preview.docsscale.com` (RELEASE.md, "The preview
     site"). First upload made the same day from `main`: the draft sample
     post is at `/blog/sample-post/` behind the staging login. Not checked
     signed in (the developer does not enter passwords); the owner was asked
     to look.
   - Next, in order: the preview workflow (builds the working copy to
     `preview.docsscale.com`; needs the Hostinger API token as a GitHub
     secret, created by the owner); the publish workflow with the owner's
     approval; post images, schema, RSS, social images; the remaining forms.
   - Known: `npm audit` reports one advisory with no fixed version yet
     (`braces`, reached through the CMS library and, in `web/`, through the
     lint tools). Neither is sent to visitors; the weekly updater will bring
     the fix.

**Blog design (step 3): approved 7 Oct 2026.** The owner rejected the first
version (too plain, no images), then two versions on a design canvas (one too
dark and busy, one too simple and without the brand colours), and approved the
fourth ("it's good"): teal-tint title band, overlapping cover photo, one
reading column, coloured blocks, and a right-hand panel with DocsScale's own
offers (never outside ads; the owner asked for "ads of our offers"). The
canvas is the owner's private design artifact; the built version is in
`web/src/features/blog/` and on the preview site. Offers are entries in
`content/offers/` so the owner can add more "like the Free System" himself.
Not built yet: image resizing to AVIF/WebP (uploads are used as they are),
the category filter, RSS, post schema, social images. The index heading,
introduction and search wording (`web/src/content/blog.ts`), the two
call-to-action texts inside posts, and the three offers' wording need the
owner's approval before anything is public.

**Open question for the blog design (step 3):** in the lab test the lightest
existing page already paints its main content at 2.4–2.5 seconds, right at the
2.5-second target for new templates. The blog template needs a lighter shared
part, or the target needs the owner's decision (plan, section 5, item 11).

**The two new addresses (created 7 Oct 2026, owner's approval the same day)**

| Address | Folder on the server | State |
|---|---|---|
| `cms.docsscale.com` | `/home/u145389112/domains/cms.docsscale.com/public_html` | **Closed:** every request gets 403 and `noindex` (`server/cms/.htaccess`). Becomes the Node.js editing app (Node.js 24), whose own sign-in replaces that file. |
| `preview.docsscale.com` | `/home/u145389112/domains/preview.docsscale.com/public_html` | **Password-protected** with the staging login (the same `.htpasswd` file) and `noindex` (`server/preview/.htaccess`). Holds the preview build (drafts included) since 7 Oct 2026. |

Both are separate sites on the existing Business plan (no cost), each in its
own folder, apart from the live site. Hostinger pointed both names at its CDN
and issued the certificates itself; no record was added to the DNS zone we
manage, and none was changed (the zone was read before and after: identical).
CI asks both addresses on every push (`tests/server/hidden-sites.sh`) and
fails if either answers with content or without `noindex`; when the editing
app goes in, its sign-in redirect is already an accepted answer. The two
`.htaccess` files were uploaded by hand through Hostinger's upload API
(credentials for that site's own domain); `scripts/deploy.mjs` does not know
these sites yet. Hostinger's own "Default page" file is still in each folder,
unreachable behind the rules; removing it needs the owner's approval.

**The repository is public since 7 Oct 2026 (owner's decision), until about 1 Nov**

The organisation used up October's 2,000 free GitHub Actions minutes on 7 Oct
(200 runs in seven days; every push to a pull request was also tested twice,
fixed the same day). Public repositories have unlimited free minutes, so the
owner made the repository public and plans to make it private again in
November, when the allowance resets.

- **While it is public,** everything in the repository and its history can be
  read and copied by anyone: never commit anything that is not fit to be
  read by a stranger, and remember that pull requests can now come from
  outside (never merge one without reading it; CI jobs have read-only access
  and the repository has no secrets).
- **Told to the owner before the switch (7 Oct):** no keys or passwords were
  found in the history; commit `84f5fb3` holds the original site's
  `lead-debug-log.txt` with four email addresses; the history and these notes
  show how the site is built (CLAUDE.md, section 2); public copies cannot be
  taken back.
- **Before making it private again:** check the month's usage
  (`gh api orgs/docsscale/settings/billing/usage`). A full CI run costs about
  20 minutes on a private repository; CI runs once per change (pull requests
  and pushes to `main`).
- **7 Oct, for a few hours,** checks ran on a runner program on the owner's
  Mac. The owner did not want it; it is completely removed (service,
  registration, folder, logs, repository variable, workflow support). **Do
  not install anything on the owner's Mac for CI again.**

## Rules and decisions the owner has approved

The rules themselves are in [../CLAUDE.md](../CLAUDE.md). The ones added or
changed on 6–7 Oct 2026:

- **Routine invisible work may be merged and deployed without asking** when
  every CI check passes, it is already in an approved plan, and nothing a
  visitor sees changes. Still stop for: anything visible, anything that costs
  money, anything not in an approved plan, file deletions, production releases
  with visible changes, new accounts or infrastructure, DNS changes.
- **Content quality rules for all new pages:** no scaled or templated pages;
  service-and-industry pages only with real experience or a case study; city
  pages only with real clients or results; every page says something only
  DocsScale could say; a steady pace of two to three pages or posts a week;
  flag pages that are too similar.
- **The CRM platform may be named** in the Free System funnel, the Privacy
  Policy, the Terms, and the one `llms.txt` line about the Free System. Nowhere
  else. The site checks enforce exactly this.
- The homepage and `llms.txt` lines about ranking "in the neighborhoods you
  serve" stay as they are.
- `/free-system/book-a-call/` is short on purpose; the checks don't warn on it.

Decisions (full list at the top of [COMPLETION-PLAN.md](COMPLETION-PLAN.md) and
in section 12 of [SEO-DASHBOARD-PLAN.md](SEO-DASHBOARD-PLAN.md)):

| Topic | Decision |
|---|---|
| CMS | Keystatic with Keystatic Cloud sign-in; team `docsscale`, project `docsscale-website`; account owner is the owner's personal Gmail. Three free seats: the owner (admin), "Team DS" (the future SEO person, non-admin), one editor (name to come). |
| Cost | USD 0 a month. Nothing is bought for two to three months; then confirm DataForSEO's current price first. |
| Publishing | Preview before every edit. New posts, case studies and service pages need the owner's Publish in the CMS; SEO fields, FAQs and team updates go live after the checks. One setting switches the approval off later. |
| Existing pages | Body copy stays in code; editors get SEO fields only. Service pages become CMS entries (the seven confirmed services only). |
| Keywords | Primary keywords accepted as in the map. Chiropractic: "chiropractor marketing agency". "Missed call text back" is never a page's keyword. The cost page is on hold until the owner gives real price ranges. |
| Geography | US-wide with a Texas layer. Real clients in Houston, Dallas and San Antonio; no city page is decided. |
| Case studies | The four on `/results/` are real, with permission on file; reuse them unchanged on the matching industry pages. |
| Practice software | Named only where we worked with it for a client in that specialty; plain text, no logos. |
| First posts | The team supplies raw material, the developer drafts, the named author corrects, the owner approves. |
| Dashboard | Lighter first cut; email-link sign-in for the SEO tabs; only the owner approves in the Fix queue at first (a setting can extend it to the SEO role); shortened IP addresses in the access log. |
| Second GitHub owner | Ahmed Mustafa; the owner adds him. |

## Waiting on the owner

1. **Material for the local SEO page and the "Google Business Profile for
   dentists" post** (lists in the keyword map's section 8 pairing and in the
   developer's messages of 6–7 Oct: a real clinic example with numbers and
   permission, the process step by step, what's included, who it suits, real
   questions, the post's author with bio and photo). Wanted by about week 5.
2. **One more Keyword Planner export:** websites, reviews, follow-up,
   reactivation, agency wording and the Texas terms (seeds in the keyword map,
   section 6).
3. **A look at https://cms-trial.docsscale.com** signed in: do "New branch…",
   "Create pull request" or the branch menu still show? They should be hidden.
4. **Add Ahmed Mustafa as a second owner** of the GitHub organisation.
5. **Confirm "Dependabot security updates" is switched on** in the repository
   settings (the owner said he was doing it on 7 Oct; not verified here).
6. **Industry pages:** the open questions at the end of
   [notes/industry-pages.md](notes/industry-pages.md).
7. Real price ranges, if the cost page is to be written.
8. Older items, unchanged: GA4 admin setup (key events, custom dimensions,
   Internal Traffic filter); About page team photos; deleting QA contacts in
   the CRM; "Request indexing" for `/privacy/` and `/terms/`; the Gmail header
   test; the security clean-up in "Owner to-dos" below.

## Parked, and how to resume

| What | Where | How to resume |
|---|---|---|
| **Service-page layout** | Branch `feat/service-pages-layout`, draft PR #45. `web/src/features/services/ServicePage.tsx`, sample entry in `web/src/content/service-pages.ts` (filler text, `noindex`). Screenshots in `review/service-layout/` on the owner's Mac. | Merge `main` into the branch (it predates the site checks). In stage B the entries move from that content file to CMS files; the layout stays. Never merge while any "Sample" text remains. |
| **Keystatic trial** | Branches `trial/keystatic` (the editing app in `cms/`, with the SEO field that counts characters, the working-branch guard and the code that hides branch controls) and `trial/content` (two test saves). Live at `cms-trial.docsscale.com` on Node.js 24. | Use `cms/` as the starting point for the real admin app. The trial site also has a test route, `/api/trial/store`, behind a key held only in the site's Hostinger environment (`TRIAL_KEY`); remove both when the real `cms.docsscale.com` exists. **Removing the trial site or either branch needs the owner's approval.** |
| **SEO command center** | Plan and mockup only: [SEO-DASHBOARD-PLAN.md](SEO-DASHBOARD-PLAN.md), [seo/dashboard-mockup.html](seo/dashboard-mockup.html) | After the publishing core and the first two content pieces |
| **Industry pages** | [notes/industry-pages.md](notes/industry-pages.md) | Dental first, alone, after the owner's material; follow the note, not the prompt it describes |
| **Wording and review items** | [BACKLOG.md](BACKLOG.md); agency review leftovers in the plan, section 9 | Stage D |

Nothing is half-done or uncommitted. One old local stash exists on the owner's
Mac (`git stash list`): it holds only build leftovers from the trial app and
can be dropped.

## Scheduled reminders (desktop app scheduled tasks)

| Date | Task | What |
|---|---|---|
| 7 Oct 2026 | `docsscale-bing-data-check` | Read-only check of Bing Webmaster data and sitemap status. **Unknown whether it ran.** |
| 15 Oct 2026 | `docsscale-web-vitals-review` | Real-user LCP, INP and CLS for the homepage and `/free-system/`; decide on the slow-hero fix (FE-1) |
| 20 Oct 2026 | `docsscale-dmarc-review` | Three weeks of DMARC reports; plan the move to `p=quarantine` |

## Facts that are easy to lose

- **Deploying:** [RELEASE.md](RELEASE.md). Upload credentials come from the
  Hostinger connector's "generate upload URL" operation for user `u145389112`,
  domain `docsscale.com`, and expire within hours. Clear the website cache
  after every production deploy, then run `bash tests/server/redirects.sh`.
- **After any visible change is approved,** re-record the visual baseline on
  the branch (`npm run visual:approve`) or CI's pixel check fails.
- **After a page's copy changes,** run `npm run build && npm run sitemap` in
  `web/` and commit `public/sitemap.xml` and `sitemap-state.json`, or CI's
  sitemap check fails and names the pages.
- **Performance budget:** CI job "Performance budget"; `npm run
  test:performance` locally (a laptop is faster than CI, so only CI decides).
  A page not listed in `tests/performance/budget.json` is treated as new and
  must meet the target. Re-record only from a CI run, with the reason, after
  an approved change (CONTRIBUTING.md).
- **Site checks:** `npm run check:site` in `web/` after a build. Current
  warnings, all known: three long titles (backlog), and two short pages
  (`/about/`, `/industries/`).
- **Node.js on Hostinger:** the admin app must state Node.js 24 in its package
  file; the default is 20, which has no built-in SQLite.
- **Search Console** had almost no data on 6 Oct (15 impressions in 90 days).
- `/services/<industry>/…` must keep redirecting to `/industries/<industry>/`.
- Opportunities in the CRM are created by the owner's own workflows there, not
  by the site.

# Part 2: accounts, access and monitoring

Every account and service the website depends on, where each credential is kept (**never the credentials themselves**), and what's still open.

## Accounts and services

| Service | What it's for | Account / identifier | Where the credential lives |
|---|---|---|---|
| **Hostinger** | Hosting, CDN, DNS, email for docsscale.com | hPanel account; hosting user `u145389112` | Owner's password manager |
| **Domain DNS** | docsscale.com records | Hostinger nameservers (`*.dns-parking.com`) | hPanel → Domains → DNS |
| **Email** | info@docsscale.com (Hostinger Mail); GoHighLevel sends from mail.docsscale.com and marketing.docsscale.com. See [Email authentication](#email-authentication-spf-dkim-dmarc) | hPanel → Emails | Owner's password manager |
| **GoHighLevel** | CRM receiving every lead, tagged `free-system-lead` (funnel) or `website-lead` (homepage and Book a Call) for workflow triggers (see [TRACKING.md](TRACKING.md#gohighlevel-tags-workflow-triggers)); booking calendar at booking.docsscale.com (CNAME to GHL) | The DocsScale sub-account (location) | Lead handler token (scopes: contacts.write, contacts.readonly, locations/customFields.readonly): **only** in `/home/u145389112/domains/docsscale.com/private/config.php` on the server |
| **GitHub** | Source code and CI | Organization `docsscale`, private repo `docsscale-website` (free plan) | Owner's GitHub login; `gh` CLI on the owner's Mac |
| **Staging** | staging.docsscale.com password gate | user `docsscale` | `~/DocsScale-Secure/staging-login.txt` (owner's Mac) |
| **Google Analytics 4** | Analytics (on from v1.1, consent-based) | Measurement ID `G-804589LNJW` in `web/src/content/analytics.ts` | Google account of the owner |
| **Google Search Console** | Search performance | Domain property `sc-domain:docsscale.com` (verified; owner: Abdul). **Sitemap `https://docsscale.com/sitemap.xml` submitted on 29 Sep 2026** (14 URLs, all returning 200) | Owner's Google account |
| **UptimeRobot** | Uptime monitoring and email alerts. See [Uptime monitoring](#uptime-monitoring) | Free plan, account info@docsscale.com (created 30 Sep 2026) | Owner's password manager; API key **only** in `~/DocsScale-Secure/uptimerobot-api-key.txt` (owner-only permissions) |
| **Microsoft Clarity** | Heatmaps and visit recordings (after consent, forms masked). See [TRACKING.md](TRACKING.md#microsoft-clarity-heatmaps-and-recordings) | Project ID `yr9lxbtgy0` (not a secret; in `web/src/content/analytics.ts`) | Owner's Microsoft account (clarity.microsoft.com) |
| **Keystatic Cloud** | Sign-in for the content editing screen (free plan, up to 3 users). See [COMPLETION-PLAN.md](COMPLETION-PLAN.md), section 6 | Team `docsscale`, project `docsscale-website`, connected to the `docsscale-website` repository only (set up 6 Oct 2026). Account owner: the owner's personal Gmail account | Owner's password manager |
| **Editing site and preview site** | `cms.docsscale.com` and `preview.docsscale.com`: two sites on the same Hostinger plan (created 7 Oct 2026), empty so far. See Part 1, "The two new addresses" | Hosting user `u145389112` | None yet |
| **Trial editing site** | `cms-trial.docsscale.com`: the CMS trial, a Node.js site on the same Hostinger plan (created 6 Oct 2026). Temporary; removing it needs the owner's approval | Hosting user `u145389112` | No credential of its own |
| **Bing Webmaster Tools** | Bing search data (read-only use). See [Bing Webmaster API](#bing-webmaster-api) | Site `https://docsscale.com/` (verified; imported from Search Console on 29 Sep 2026). **Sitemap `https://docsscale.com/sitemap.xml` submitted on 30 Sep 2026** | API key: **only** in `~/DocsScale-Secure/bing-webmaster-api-key.txt` (owner's Mac, owner-only permissions) |

- **Backups and originals:** `~/DocsScale-Secure/` on the owner's Mac: the full hPanel backup (25 Sep 2026) and every original server file replaced during hardening. It isn't synced and isn't in git. **It contains the GoHighLevel token; treat it as secret.**
- **Rotating the GoHighLevel token:** see [SERVER.md](SERVER.md#rotating-the-ghl-token).

## Bing Webmaster API

Set up on 30 Sep 2026 for **reading** Bing data about docsscale.com. It's account setup only, not SEO work.

- **Key:** a Bing Webmaster API key, kept in `~/DocsScale-Secure/bing-webmaster-api-key.txt` (permissions 600). It's never in the repository, the site or any committed file. It's tied to the owner's Bing Webmaster account.
- **Endpoint:** `https://ssl.bing.com/webmaster/api.svc/json/<Method>?siteUrl=https%3A%2F%2Fdocsscale.com%2F&apikey=<key>`. Bing only accepts the key as a query parameter, so never paste a full request URL into a ticket, chat or log.
- **Read-only methods used:** `GetUserSites`, `GetQueryStats`, `GetPageStats`, `GetCrawlStats`, `GetCrawlIssues`, `GetRankAndTrafficStats`, `GetUrlInfo`, `GetFeeds`. The one write so far: `SubmitFeed` for the sitemap (owner-approved, 30 Sep 2026). The key itself can also make changes (submit URLs or sitemaps); nothing does that without the owner's approval.
- **Check on 30 Sep 2026:**
  - `docsscale.com` is verified.
  - Bing first saw the homepage on 12 Aug 2026 and last crawled it on 28 Sep 2026.
  - Query, page, traffic and crawl stats are still empty. Bing fills them in a few days after a site is added, so check again in about a week.
  - Sitemap `https://docsscale.com/sitemap.xml` submitted to Bing on 30 Sep 2026 (basic setup, like Search Console); status "Pending" until Bing fetches it.
  - A read-only check of the data and sitemap status is scheduled for 7 Oct 2026.
- **Rotating the key:** Bing Webmaster Tools → gear icon (Settings) → **API access** → **API key** → generate a new key, then replace the one line in the file above. The old key stops working immediately.

## Uptime monitoring

UptimeRobot (free plan) checks four addresses every **5 minutes** from North America and emails **info@docsscale.com** when one goes down and when it recovers. Set up 30 Sep 2026; all four were UP on creation.

| Monitor | Address | Counts as up |
|---|---|---|
| docsscale.com | `https://docsscale.com` | 2xx/3xx |
| Free system funnel | `https://docsscale.com/free-system/` | 2xx/3xx |
| Lead endpoint (send-lead.php) | `https://docsscale.com/send-lead.php` | 2xx/3xx **or 405**: the endpoint only accepts form posts, so a plain check gets "405 Method not allowed" when PHP is working. Anything else (500, timeout) means the lead handler is broken. |
| Booking calendar (booking.docsscale.com) | `https://booking.docsscale.com/` | 2xx/3xx |

- **Dashboard:** uptimerobot.com, log in as info@docsscale.com.
- **API key:** in `~/DocsScale-Secure/uptimerobot-api-key.txt`. Never put it in the repo or a ticket. To replace it: Integrations & API → Main API key → reset, then update the file.
- **Planned deploys:** a deploy takes 1–2 minutes and doesn't take the site down, so no pause is needed.

## Email authentication (SPF, DKIM, DMARC)

State on 29 Sep 2026 (checked record by record; all SPF and DKIM pass basic validation):

| Domain | Sends | SPF | DKIM | DMARC |
|---|---|---|---|---|
| docsscale.com | Hostinger Mail (info@ and team mailboxes) | `include:_spf.mail.hostinger.com ~all` (3 of 10 lookups) | `hostingermail-a` (2048-bit); `-b`/`-c` are Hostinger's empty standby keys | `v=DMARC1; p=none; rua=mailto:dmarc@docsscale.com; fo=1` |
| mail.docsscale.com | GoHighLevel (Mailgun) | `include:spf.leadconnectorhq.com include:mailgun.org ~all` (6 of 10) | `mailo` (1024-bit) | own record, same as above |
| marketing.docsscale.com | GoHighLevel (Mailgun) | same as mail. | `mx` (1024-bit) | none of its own: inherits docsscale.com's policy |

- **DMARC reports** go to **dmarc@docsscale.com**, an alias delivering to the **info@docsscale.com** inbox (created 29 Sep 2026). They're zipped XML files from mailbox providers, usually a few a day. Collect them weekly and ask your developer for a pass/fail summary per sender.
- **Rollback:** the zone before this change is saved in `~/DocsScale-Secure/dns-docsscale.com-2026-09-29-before-dmarc.json`. In Hostinger, DNS snapshot **183232919** (25 Sep 2026) is the zone before the change; restoring it undoes it. Only the two `_dmarc` TXT records changed.
- **GoHighLevel's DKIM keys are 1024-bit.** They're accepted everywhere; moving to 2048-bit is optional and done inside GoHighLevel, not in DNS.

**DMARC tightening schedule.** Always change `_dmarc` and `_dmarc.mail` together; `marketing.` follows `_dmarc` automatically.

| When | Policy | Condition to move on |
|---|---|---|
| 29 Sep 2026 → ~20 Oct 2026 | `p=none` with reports | Reports show every legitimate sender passing DMARC: Hostinger Mail, GoHighLevel on mail. and marketing., and any other tool that sends as docsscale.com |
| after that, ~1 week | `p=quarantine; pct=25` | No legitimate mail failing in reports; no delivery complaints |
| then ~4 weeks | `p=quarantine` (100%) | Four clean weeks of reports |
| after that | `p=reject` | Full protection against anyone spoofing docsscale.com |

Record to set at each step (both names), for example: `v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@docsscale.com; fo=1`. If a legitimate sender fails, fix its SPF or DKIM first; never loosen the policy to hide it.

## Owner to-dos (in priority order)

1. **Delete the Claude Code session logs** in `~/.claude/projects/-Users-abdulsamad-Downloads-docsscale/` once the project is finished. They contain the GoHighLevel token from the early audit, the Bing API key and the UptimeRobot API key. At the same time, **generate a fresh Bing API key** and update `~/DocsScale-Secure/bing-webmaster-api-key.txt` ([how](#bing-webmaster-api)), and **reset the UptimeRobot API key** and update `~/DocsScale-Secure/uptimerobot-api-key.txt` ([how](#uptime-monitoring)).
2. **Check for old copies of `lead-debug-log.txt`.** The original site's debug log is no longer reachable (it returns 404, checked 27 Sep 2026). If a copy remains anywhere in hPanel → File Manager, delete it: it predates the hardening and may contain lead data.
3. **GA4 admin setup:** mark the key events `generate_lead` and `book_call`, create the custom dimensions, and switch on the Internal Traffic filter after the team has opened `docsscale.com/?team=on` ([TRACKING.md](TRACKING.md)).
4. **Screenshots and photos:** the funnel images, the three homepage/About placeholders and the team photos, in the sizes listed in [incoming/README.md](../incoming/README.md).
5. **Ask the logo designer for the original vector file** (for print; [brand/README.md](../brand/README.md)).

## When the team grows

- **GitHub plan:** the `docsscale` organization is on the free plan. Private repos on the free plan can't enforce branch protection, so "all CI checks must pass" is enforced by `scripts/deploy.mjs` at deploy time instead of by GitHub at merge time.
  - **When other developers join:** upgrade the organization to GitHub Team and enable branch protection on `main`. Required checks: the five CI jobs, no force-push, no deletion, at least one review.
- **Access:** give each person their own logins (Hostinger team access, GoHighLevel user, GitHub member), never shared ones. Remove access when someone leaves.

## Change process

- **Every push goes through a branch and a pull request,** docs-only changes included. Nothing visible is merged to `main` or deployed without the owner's explicit go-ahead. Since 7 Oct 2026, routine invisible work that is already in an approved plan may be merged and deployed once every CI check passes (CLAUDE.md, section 1).

**Process log**

| Date | What happened | Outcome |
|---|---|---|
| 30 Sep 2026 | One-off slip: the HANDOVER commit documenting the Bing Webmaster API (`9ae40fc`) was pushed straight to `main`, with no pull request or review. It was flagged by the developer right after. Docs only; nothing deployed; no secrets in it. | The owner reviewed it and kept it on `main` as is. The branch + pull request rule above was confirmed. |

## Where to read next

- [README.md](../README.md): the repository layout and commands.
- [CLIENT-GUIDE.md](CLIENT-GUIDE.md): the non-technical guide.
- [RELEASE.md](RELEASE.md): deploying and rolling back.
- [PHASE5-PLAN.md](PHASE5-PLAN.md): the approved growth plan, starting after v1.0 is live.
