# SEO command center: plan

Status: **approved by the owner on 6 Oct 2026, with the lighter first cut**
(decisions in section 12). **Phase 1 started on 8 Oct 2026** on the owner's
updated plan of action ("we need to work on it"), which also brings the site
checks, the page linter, PageSpeed and the edit log into phase 1. The code is
in `cms/` (see its README); the paid tools and the fix queue stay in later
phases. A clickable mockup of the main tabs is in
[seo/dashboard-mockup.html](seo/dashboard-mockup.html); every number in it is
example data and is labelled so.

## The short version

- **One private admin at `cms.docsscale.com`** with a tab bar: **Content**
  (Keystatic) and the SEO tabs. The public site stays fully static and contains
  nothing from it.
- **Free sources now, paid tools later as switches.** Every data source is a
  "connector" with the same shape. Buying a tool later means pasting its key in
  Settings; its tab then appears. Nothing is rebuilt.
- **Running cost: USD 0** until you buy a tool. It runs on the Hostinger plan
  you have and uses only free APIs.
- **Approved size: phase 1 as the lighter first cut, about 15 build days**,
  then phase 2 (14–17). The crawler, full Technical health, PageSpeed, Clarity
  and the disabled paid connectors (phase 1b, about 13–19 days) wait until the
  SEO person asks for them. The whole project becomes roughly 103–119 build
  days with phases 1 and 2.
- **It does not delay the first two content pieces.** The publishing part of
  the CMS is built first; the local SEO page and its post go out as soon as
  your material arrives, and the dashboard is built behind them.
- **Three things work differently from your brief or the reference**, each for
  a reason given below: the weekly written summary is produced by a weekly run
  rather than by the server on its own (section 6); there is no automatic "fix
  runner" (section 7); and one technical point about sign-in is not settled
  until a half-day test (section 3).
- **The five decisions are answered** in section 12, and the half-day test is
  done (section 2).

## 1. What I took from your reference, and what I didn't

The attached reference (a 46-page capture of another site's stats admin) is one
long page: an access log, a fix queue with Approve / Save for later / a note
box, resolved items that need a reason to reopen, then a long run history and
an IndexNow log.

| From the reference | In this plan |
|---|---|
| Access log: who, when, how long, device | Yes, as its own tab (section 8) |
| Fix queue with Approve, Save for later, instruction note | Yes, the same three actions |
| Resolved items, dated, reopen needs a reason | Yes, in History and outcomes |
| Each item says who acts ("You" / "Me, with your ok") and the effort | Yes |
| IndexNow submission log | Yes |
| One very long page | No: tabs, so each view loads fast and reads on a phone |
| An hourly "fix runner" that edits live pages after Approve | **No.** Approved items become CMS drafts or pull requests; nothing publishes itself (your rule, and CLAUDE.md) |
| Batches of edits to many posts at once, tracked by keyword density | **No.** That is the scaled, templated pattern your content rules forbid; keyword density is not a measure this dashboard uses |
| Full IP addresses in the access log | Shortened by default (decision 4) |

## 2. Architecture

```
 Visitors ──► docsscale.com            static files on Hostinger, as today
                                        (no server, no database, no keys)

 Team ──────► cms.docsscale.com         one small Node.js app on the same
              │                          Hostinger plan; sign-in; noindex
              ├─ Content tab            Keystatic → saves to the GitHub repo
              ├─ SEO tabs               read from the private store
              ├─ Connectors             fetch from Google, Bing, etc. on a
              │                          schedule, read-only
              ├─ Crawler                reads the live public site
              └─ Private store          one SQLite file outside the web
                                         folder, on the admin server only

 GitHub ────► builds the public site; after each publish sends the admin a
              content inventory (one private file, authenticated)

 Weekly run ► reads the store through a private API; writes the Overview,
              the Fix queue and the plan; turns approved items into CMS
              drafts or pull requests
```

**Rules kept**

| Your rule | How |
|---|---|
| Public site stays static | The dashboard is a separate app at a separate address. The public build has no dependency on it and no reference to it. |
| Behind sign-in, noindex everywhere | Every page and every API route needs a signed-in session. `noindex` is sent as a header on every response and as a tag in every page. A CI check requests the address without a session and fails if anything but the sign-in page answers. |
| Private data store on the admin server only | One SQLite file in a private folder outside the served folder, with a nightly copy kept for 14 days. It never enters the repo or the public build. |
| Keys as server secrets, never in the repo, never printed | A key typed into Settings is encrypted with a master key that lives only in the server's environment, and is never shown again: Settings shows "set on 6 Oct 2026", not the value. Keys never appear in logs or error messages. |
| Read-only access to every source | Each connector asks for the narrowest read permission its provider offers (section 5). The two that can write by design (IndexNow, and Bing's key) are restricted in our code to the calls listed. |
| Roles | Section 3 |
| A second website later | Every table carries a site id. There is one site row, docsscale.com. Nothing else is built for a second site. |

**Three things about Hostinger that a half-day test must confirm before the
build** (on the existing `cms-trial.docsscale.com`, with your OK):

1. The app can keep a file in a private folder that survives a redeploy.
   Deploys replace the app's own folder, so the store must live outside it.
2. A scheduled job (Hostinger's cron, already used for the daily failure
   email) can wake the app and run the connectors.
3. The built-in SQLite of the current Node.js version works there, so no
   compiled add-on is needed.

If the first fails, the fallback is plain JSON files in the same private
folder: slower for history, but it works. If the second fails, the schedule
runs from a free GitHub scheduled workflow that calls the admin.

**Test results (6 Oct 2026, on `cms-trial.docsscale.com`)**

| Question | Result |
|---|---|
| A private file outside the app folder that survives a redeploy | **Yes.** A file written in a private folder in the hosting account's home, outside every served folder, kept its first entry through three redeploys. |
| A scheduled job can wake the app | **Yes.** A Hostinger cron job called the app every five minutes for several hours; all 45 calls arrived. The test job has been removed; the lead-digest job was not touched. |
| Built-in SQLite, no compiled add-on | **Yes, on Node.js 24.** It is not in Node.js 20, which Hostinger picks by default, so the admin app states Node.js 24 in its package file. The editing screen runs normally on 24. |
| The server can verify a Keystatic Cloud sign-in | **No.** Keystatic Cloud keeps the sign-in in the browser only and never sends it to our server. The SEO tabs therefore use the email-link sign-in (decision 2). |

So the store is SQLite as planned, the schedule is Hostinger's own cron, and
there are two sign-ins on a new device: Keystatic Cloud for Content, an email
link for the SEO tabs.

## 3. Sign-in and roles

| Role | Sees |
|---|---|
| **Admin** (the owner) | Every tab, Settings and connections, Access log, user roles |
| **SEO** (Team DS) | Content and every SEO tab, including Fix queue (can add notes and "save for later"; cannot Approve), Imports. Not Settings, not keys, not the Access log. |
| **Editor** | Content, Overview, Content inventory, Keywords, Questions and content gaps. Not Settings, keys, Access log or Imports. |

Approve stays with the admin, like Publish for posts. Say if the SEO person
should be able to approve too (decision 3).

**The unsettled point.** Keystatic Cloud signs people in for the Content tab,
inside the browser. The dashboard needs to know on the *server* who is asking,
to hide Settings and keys from editors. Whether the server can verify a
Keystatic Cloud sign-in is undocumented.

- **If the test shows it can:** one sign-in for everything.
- **If not (my expectation):** the dashboard has its own sign-in by **email
  link**: you type your address, a one-time link arrives from
  info@docsscale.com, and the session lasts 30 days. No passwords to store or
  leak. Editors would then sign in twice on a new device: once for Content,
  once for the SEO tabs. Email is sent through the Hostinger mailbox you
  already have, so it stays free.

Roles are a list of email addresses and their role, kept in the private store
and changed only by the admin. The first admin address comes from the server's
environment, so nobody can make themselves admin from the screen.

## 4. Connector framework

Every data source, free or paid, is the same five things:

| Part | What it is |
|---|---|
| **Settings entry** | On/off, the key (write-only), the schedule, and for pay-per-use tools a monthly spending cap |
| **Health** | OK / Warning / Failing, with the last error in plain words and the last successful run |
| **"Last updated"** | Shown on every number that comes from it |
| **Safety** | A rate limit that respects the provider's quota; for paid tools a hard cap: when the month's cap is reached the connector stops and says so, and never spends past it |
| **Its own tab** | Appears only while the connector is enabled and has a key |

A connector also declares which shared tabs it feeds (for example "daily
positions" into Keywords and rankings). A shared tab shows which connector each
number came from.

**Adding a paid tool later:** its connector already exists in the code,
switched off, with its settings form. You paste the key and set a cap. The
first real run against a paid API needs 1.5–3 days of developer work per tool
to check the mapping against live data, because I cannot test a paid API
without a key. "No rebuilding" is true for the framework and the tabs; it is
not zero work.

## 5. Connectors

### Free, in phase 1

| Connector | Data | Access needed (you create it, I never see it) | Limits to know |
|---|---|---|---|
| **Google Search Console** | Queries, pages, clicks, impressions, average position; index status per URL | A Google "service account", added to the property as a read-only user | Data arrives 2–3 days late. URL inspection: 2,000 a day, far more than we need. Google hides rare queries. |
| **GA4** | Channels, landing pages, key events (`generate_lead`, `book_call`), blog groupings; visits from AI assistants | The same service account as a Viewer | Only visitors who press "Accept" are counted, so GA4 undercounts; the CRM stays the lead count of record. AI-assistant visits are grouped on the admin server from the referring address, and visits from assistants' apps often have none. |
| **Bing Webmaster** | Queries, pages, crawl stats and issues, inbound link counts | The existing API key, moved from your Mac's secure folder into Settings | The key can also submit URLs; our code only calls the read methods. Bing's AI citations report has no API yet (see Imports). |
| **PageSpeed Insights** | Lab speed and scores per page | A free API key | Lab tests on a simulated phone |
| **Chrome UX Report (CrUX)** | Real-visitor speed | The same key | **Expect "Insufficient data"**: Google only publishes this for pages with enough Chrome visitors, and docsscale.com is far below that today. Our own Web Vitals in GA4 fill the gap. |
| **Microsoft Clarity** | Sessions, scroll depth, rage and dead clicks per page | A data-export token from Clarity | The free export allows 10 requests a day and only the last 1–3 days. The connector takes one snapshot a day and builds history itself. Recordings and heatmaps stay in Clarity. |
| **IndexNow log** | Every address submitted on publish, with the response | None (the site's own key) | Bing and partners only; not Google |

### Built from our own site, no outside tool

| Analysis | How | Tab |
|---|---|---|
| **Crawler and technical audit** | Requests every page in the sitemap and every internal link it finds: status codes, redirects, titles, descriptions, canonicals, headings, `noindex` conflicts, broken links, schema validity, sitemap versus live pages | Technical health |
| **Content inventory** | From the CMS files at each publish: word count, last updated, last reviewed, target keyword, parent service page, author, status | Content inventory |
| **Internal link map** | From the crawl: which pages link to which; pages with no links in | Links and authority |
| **Keyword map coverage** | Keyword map versus pages: mapped keywords with no page, pages with no keyword | Keywords and rankings |
| **Cannibalization** | Two pages with the same target keyword (from the CMS); later, two pages appearing for the same query (from Search Console) | Keywords and rankings |
| **Question coverage** | Questions people searched (Search Console, Bing) versus our headings and FAQs | Questions and content gaps |
| **Content freshness** | Age since last meaningful update, against a threshold you set | Content inventory |

The crawler only reads public pages of docsscale.com, slowly, a few times a
week and on demand. It never crawls other sites.

### Prepared, disabled until you buy

Prices are from public pages and reviews on 6 Oct 2026 and must be checked at
purchase. "API" is what the dashboard needs; a tool's own website is separate.

| Tool | What it would add here | Cost to use it through the dashboard | Note |
|---|---|---|---|
| **DataForSEO** | Daily position tracking for the keyword map; search volumes; competitor keyword gap; backlinks; mentions in AI assistants' answers | Pay per use. USD 50 minimum top-up, no subscription. A results page costs about USD 0.0006, so tracking 100 keywords daily is roughly USD 2 a month. | The only one where a spending cap is natural. Raw data, no website of its own to click around in. |
| **SE Ranking** | Daily positions, site audit, backlink monitoring, competitor tracking, AI search visibility | About USD 52–95 a month for the tool; API access is on the top plan or a paid add-on (about USD 149 a month extra) | Good value as a tool for a person. Expensive as a data feed. |
| **Ahrefs** | The strongest backlink data; competitor keywords and estimates | From about USD 129 a month, with a monthly allowance of API units | Worth it once link building is active |
| **Semrush** | Positions, backlinks and toxicity, competitor gap, AI visibility | API only on the Business plan, about USD 500 a month | Not sensible at this size |
| **Moz** | Domain and page authority, link counts | A small API plan from about USD 20 a month (price to confirm with Moz) | Adds one authority number; low priority |

**Recommendation, for a small budget:**

1. **Buy nothing for the first two to three months.** Until pages rank, a rank
   tracker has nothing to track, and Search Console already gives positions
   for free.
2. **First purchase: DataForSEO, about USD 50 once.** At our volume that
   top-up lasts many months and covers daily positions, real search volumes
   (replacing Keyword Planner's bands), and a competitor gap check.
3. **Second, only if your SEO person wants a tool to work in every day:** SE
   Ranking's lower plan as a website, with its exports brought in through
   Imports rather than paying for its API.
4. **Ahrefs** when you start earning links and need to see them properly.
5. **Not Semrush** through the dashboard; its API price is out of proportion.

## 6. The weekly run, the Overview and the plan

Your brief asks for a plain-language executive summary: what moved, what
matters most, what to ignore, the risks. Numbers and rule-based findings can be
produced by the server on its own. **A written judgement cannot, at zero
cost**: it needs either a person or a paid language-model API.

So there are two layers:

| Layer | Runs | Produces | Cost |
|---|---|---|---|
| **Automatic** | On the server, on schedule | All data tabs; every rule-based finding (a broken link, a missing title, two pages on one keyword, a page that lost clicks beyond the threshold), added to the Fix queue as "Detected" with its evidence | USD 0 |
| **Weekly run** | Once a week, started by you (one command or a scheduled task in the desktop app, as your existing reminders are) with your developer | The Overview text, the ranking of the queue, the 30/60/90-day plan, "what to ignore", and the outcome checks; turns Approved items into CMS drafts or pull requests | USD 0 extra; it uses the subscription you already have |

- This **replaces the separate weekly review** in the completion plan, as you
  asked. The rules of your [seo/SEO-OS-V1.md](seo/SEO-OS-V1.md) carry over
  unchanged; its files (`weekly/`, `recommendations/`, `outcomes/`) become
  records in the store, shown in the tabs, with a monthly export to the repo so
  the history is also in git.
- **If a week is skipped,** the data tabs and the automatic findings are still
  current. The Overview shows the date it was written and says plainly when it
  is more than eight days old.
- A fully unattended written summary is possible later through a paid API,
  which would be one more disabled connector with a spending cap. Not built
  now.

## 7. Fix queue

| Field | Content |
|---|---|
| What | One sentence: the change proposed |
| Evidence | Source, date range, the actual numbers, the page or query, the reasoning, and what is uncertain |
| Impact | High / Medium / Low, with the reason in words. No scores (SEO-OS rule 11). |
| Effort | Small (under 2 hours) / Medium (half a day) / Large (a day or more) |
| Who acts | Editor in the CMS / Developer, with your OK / You |
| Status | Detected → Recommended → Approved, Saved for later or Rejected → In progress → Done → Outcome measured |

**Your three actions:** Approve, Save for later, and an instruction note that
is kept with the item and followed when it is carried out.

**What Approve does**

| Kind of item | Becomes | Goes live when |
|---|---|---|
| Content an editor can change (a title, a description, an FAQ, a post's text, a redirect) | A task for the editor, with the entry and field named; or a CMS draft for a new piece, with its brief, target keyword and parent page filled in | The editor publishes it; posts, case studies and service pages still need your Publish |
| Code, or body copy of the existing pages | A pull request, following CLAUDE.md: CI, before/after for anything visible | You approve the merge and the deploy, as today |

**Nothing publishes automatically, and nothing in the dashboard can.** The
admin server holds no permission to write to the repository. Drafts and pull
requests are created by the weekly run. So "Approve" on a Tuesday is acted on
at the next run unless you start one sooner; the item shows "Approved, waiting
for the next run".

**History and outcomes:** every Done item gets a check date (28 days after the
change, 60 for a new page). The run then records before and after over equal
periods and one of: worked / no effect / hurt / too early. Reopening a Done
item needs a written reason, kept with it.

## 8. Tabs

| # | Tab | What it shows | Phase | Role |
|---|---|---|---|---|
| 1 | **Content** | Keystatic | With the CMS | All |
| 2 | **Overview** | The weekly summary in plain language: what moved, what matters most, top three priorities, what to ignore, risks; the date it was written | 2 | All |
| 3 | **Google Search** | Clicks, impressions, average position; top queries and pages; movers; index status of every page | 1 | SEO, Admin |
| 4 | **Bing** | Queries, pages, crawl stats and issues | 1 | SEO, Admin |
| 5 | **Analytics and leads** | Visits by channel, including AI assistants; landing pages; leads and booked calls by channel and by post; the reminder that the CRM is the count of record | 1 | SEO, Admin |
| 6 | **Technical health** | Crawl results by severity; lab speed per page; real-visitor speed where there is data; sitemap versus live | 1 | SEO, Admin |
| 7 | **Content inventory** | Every page and post: words, last updated, last reviewed, target keyword, parent, status, freshness | 1 | All |
| 8 | **Keywords and rankings** | The keyword map with each page's current average position (Search Console); coverage; cannibalization. Daily positions when a paid connector is on. | 1 (map, coverage), 2 (cannibalization from queries) | All |
| 9 | **Links and authority** | Internal link map and orphan pages; Bing's inbound link counts; imported link exports. Backlink detail when a paid connector is on. | 2 | SEO, Admin |
| 10 | **Questions and content gaps** | Questions people searched versus our headings; keyword-map rows with no page | 2 | All |
| 11 | **AI visibility** | Visits and leads from AI assistants (GA4); Bing's AI citations from an imported export; a simple log of manual checks ("asked this question in this assistant on this date: cited or not"). Automated tracking when a paid connector is on. | 2 | SEO, Admin |
| 12 | **Fix queue** | Section 7 | 2 | SEO (notes), Admin (approve) |
| 13 | **30/60/90-day plan** | Approved and planned work by horizon, with the content pace | 2 | All |
| 14 | **History and outcomes** | Done items, their before and after, what was learned | 2 | All |
| 15 | **Access log** | Who signed in, when, for how long, on what device | 1 | Admin |
| 16 | **Imports** | Upload a CSV (Keyword Planner, Search Console links, Bing AI citations, any tool's export); each import stamped with source, date and who uploaded it | 1 | SEO, Admin |
| 17 | **Settings and connections** | Connectors, keys, schedules, caps, health; users and roles; thresholds | 1 | Admin |

Sixteen SEO tabs is a lot for a narrow screen. The bar groups them under four
headings (Search, Site, Actions, Admin), with Overview first; the mockup shows
this.

## 9. Data rules

Your rules, and how the screen enforces them:

| Rule | On screen |
|---|---|
| Never fabricate | The dashboard only shows what a connector, the crawler, the CMS files or an import returned. There is no field where a number is typed by hand except the manual AI-check log, which is labelled as manual. |
| Every number shows its source and date | A small line under each figure and table: "Search Console · 8 Sep – 5 Oct 2026 · fetched 6 Oct 09:00" |
| "Unknown" and "Insufficient data" | Shown in place of a number, never a zero or a blank. The reason is next to it: "Insufficient data: 42 impressions; a trend needs 100 in both periods". |
| Thresholds | The ones in SEO-OS section 6 (ignore the last 3 days of Search Console, compare equal 28-day periods, 100 impressions for a trend, 28 or 60 days before measuring an outcome). Editable by the admin in Settings; each change is logged with its reason. |
| "What to ignore" | A list on the Overview, kept between weeks: known noise, with why it is noise |
| Averages said honestly | Search Console "position" is always labelled "average position" |

For the first weeks most trend cells will read "Insufficient data". That is
correct, not a fault.

## 10. Security

This adds something the project has not had: a server on the internet holding
keys. The public site remains as safe as it is today, because it is separate.

- Every route needs a session; sessions are HTTP-only cookies; sign-in
  attempts are rate-limited.
- Keys are encrypted at rest and write-only on screen. All of them are
  read-only at the provider, so a stolen key exposes analytics data, not the
  ability to change the site, the CRM or DNS.
- The server has no credential for the repository, the hosting account or the
  CRM. The CRM is not a connector and no lead's personal data enters the
  store: only counts.
- Uploads accept CSV only, with a size limit, and are never served back as
  pages.
- The access log is itself personal data about your team; they should be told
  it exists. It is kept for 12 months.
- Dependencies are covered by the weekly update pull requests.

## 11. Phases, effort and timing

| Phase | Contents | Build days | When |
|---|---|---|---|
| **Test** | The three Hostinger points and the sign-in point, on the trial site | Done | 6 Oct 2026 |
| **1. Lighter first cut (approved)** | Admin shell with the tab bar, email-link sign-in and roles (3–4); store, schedule and connector framework with encrypted settings, health and limits (4); Search Console, GA4 and Bing connectors with their tabs (5); Settings (1.5); Imports (1.5); Access log (1); Content inventory (2) | about 15–18 | After the publishing core and the first two content pieces |
| **1b. Later, on request** | Crawler and Technical health (4); PageSpeed and CrUX (1); Clarity (1); IndexNow log tab (0.5); the five disabled paid connectors with their forms (1.5); Technical-health part of the security review and tests (1); plus tab work | 13–19 | When the SEO person asks |
| **1 as first proposed (not chosen)** | Admin shell with the tab bar, sign-in and roles (3–4); store, schedule and connector framework with encrypted settings, health, limits and caps (4–5); the seven free connectors (7); Settings (1.5); Imports (2); Access log (1); crawler and Technical health (4); Content inventory (2); Google Search, Bing, Analytics and Keywords tabs (3); the five disabled paid connectors with their forms (1.5); tests and a security review (2) | 28–34 | After the publishing core; alongside the first content |
| **2. Once search data exists** | Overview (2); Fix queue with the three actions and the hand-off to drafts and pull requests (4); plan (1.5); question coverage (2); internal link map and Links tab (2.5); cannibalization from queries and coverage (1.5); AI visibility (1); History and outcomes (2.5); the weekly run's commands (already counted in the completion plan's stage E) | 14–17 | About 4 weeks after the first content is live |
| **3. When you buy a tool** | Switch on its connector and check it against live data | 1.5–3 per tool | Your decision |

**Timing against the completion plan** (weeks from now):

| Weeks | Work | Live |
|---|---|---|
| 1–2 | Stage A (foundations) | — |
| 3–7 | Stage B, first half: blog templates and the publishing core of the CMS | `cms.docsscale.com` with Content |
| 7–8 | **First content, as soon as your material is in:** local SEO page and its post | First two pieces |
| 8–14 | Rest of the CMS forms, and dashboard phase 1, in turn; content continues at two to three a week | SEO tabs appear as each is finished |
| 12–16 | Dashboard phase 2, once there are four weeks of search data | Overview, Fix queue, plan |
| 16–27 | Handover, review items, WCAG pass | — |

- The first content is not held behind the dashboard: it needs only the
  publishing core, which is built first either way.
- **With the lighter first cut** the project is about 21–24 weeks instead of
  16–19. Technical health in the tab list stays empty, with a note, until
  phase 1b.

**Running cost: USD 0.** Hostinger (existing plan), Google and Bing APIs (free
within quotas we will not approach), Clarity export (free), GitHub Actions
(free minutes), email links (existing mailbox). The first cost is whatever tool
you choose to buy.

## 12. Decisions (owner, 6 Oct 2026)

| # | Question | Decision |
|---|---|---|
| 1 | Full phase 1 or the lighter first cut | **The lighter first cut, about 15 days:** shell, roles, connector framework, Search Console, GA4, Bing, Settings, Access log, Imports, Content inventory. The crawler and full Technical health wait until the SEO person asks for them. |
| 2 | Sign-in for the SEO tabs | **Email link**, since one sign-in cannot cover both parts (section 3 and the test results) |
| 3 | Who can Approve in the Fix queue | **Only the owner at first.** A setting in Settings lets the owner extend it to the SEO role later, without code. Only a change made by the admin counts. |
| 4 | Access log | **Shortened IP addresses** |
| 5 | The half-day test | Done; results in section 2 |
| — | Buying a tool | Nothing for two to three months; then confirm DataForSEO's current price before any purchase |
| — | Priority | The publishing core and the first two content pieces come before any dashboard work |

## 13. Automations added 9 Oct 2026 (owner: "yeah all 5")

After the redesign the owner asked for anything left and more automation. Five
items, all free, all built in one pull request:

| # | What | Where it lives |
|---|---|---|
| 1 | **Approved wording fixes become pull requests on their own.** The Monday and Thursday run drafts the new title, description or heading for each Approved item that changes words, opens a pull request with a before/after, and notes the link on the item. The owner still approves anything visible before it is merged. | The routine's prompt (cloud thread "SEO dashboard"); nothing in code |
| 2 | **Monthly report**, once the first Monday of the month has come: 28 days against the 28 before, index count, visitors and leads (GA4 and the CRM), site health, what was marked done and what it changed, the top open items. Kept on History and outcomes; emailed unless switched off on Settings. | `cms/lib/seo/report.ts`, called after the daily run |
| 3 | **SEO checks in the post editor.** Posts have a "Focus keyword" field under Search engines (SEO). The dashboard runs the live-page checks on every post that is not live yet, from the working copy, and lists what to fix on the Content inventory tab ("Before you publish"); "Check my drafts now" reads the editor's latest saves. A live post's keyword also feeds the live-page linter. | `cms/lib/seo/post-lint.ts`, `sources/content.ts`, the content schema (both copies) |
| 4 | **"Still not indexed" nudge.** A page the queue has shown out of Google's index for 14 days, and still out on this run, gets one email naming it with the Search Console link and "Request indexing"; again every 28 days while it stays out. Logged on the item. | `nudgeNotIndexed` in `cms/lib/seo/run.ts` |
| 5 | **Leads matched with the CRM.** A read-only CRM token and account id on Settings; the daily run counts leads added in the last 56 days by source, channel (from the UTM tags the lead handler saves), landing page and campaign, and shows each landing page with the phrases Search Console shows it for. Counts only: no name, email or phone is copied. New tab "Leads and sources". | `cms/lib/seo/sources/crm.ts`, `app/seo/(dash)/leads` |

Data rules kept: equal 28-day periods, "not enough data" under 100
impressions, nothing invented. The CRM is named only as "the CRM" on screen.

## 14. Automatic indexing, 9 Oct 2026 (owner: "live pages and published blogs should auto index in Bing and Search Console and update the dashboard")

The dashboard now tells the search engines about new and changed pages on
its own, and shows what each engine makes of every page.

- **Watch.** Every two hours (checked with the ten-minute schedule) the app
  reads `https://docsscale.com/sitemap.xml` and keeps one row per page with
  its sitemap date. A page that is new, or whose date moved, is announced.
  The very first watch only records what exists and sends nothing.
- **Bing and the other IndexNow engines** (Yandex, Seznam, Naver) get the
  changed addresses at once through IndexNow, with the key the site already
  publishes at `/569a0945ac9445c41f98e5e73eb6ff3c.txt`.
- **Google** is told by resubmitting the sitemap through the Search Console
  API, the only route Google offers for ordinary pages (its Indexing API is
  for job postings and live events only). That call needs the dashboard's
  Google account to be a **Full** user of the property; a Restricted one is
  refused with 403, and the Technical health tab then shows what to change.
- **What the engines show** comes back with the daily run: Google's verdict,
  coverage and last crawl from the URL inspection already in the Search
  Console snapshot; Bing's last crawl from its UrlInfo call, one per page.
- **Where to see it.** Technical health, "Indexing": page, sitemap date, when
  Bing and Google were told (and whether they accepted), Google's state and
  last crawl, Bing's last crawl, and a log of what was sent and why. Two
  buttons: "Look at the sitemap now" (any signed-in user) and "Send every
  page now" (admin), which announces the whole sitemap.
- **Read API:** `GET /api/seo/read?what=indexing` returns the rows and log;
  `POST` with `{"action":"send-pages"}` announces every page, as the button
  does (owner, 9 Oct 2026: "do what you recommend only").

Code: `cms/lib/seo/indexing.ts` (watch, announce, state refresh), tables
`indexing` and `indexing_log` in `cms/lib/seo/store.ts`, the hooks in
`cms/lib/seo/run.ts`. The release workflow's own IndexNow ping and the post
publish workflow's ping stay as they are; the watch catches anything they
miss.

## Sources for prices and limits

Checked 6 Oct 2026:
[DataForSEO pricing update](https://dataforseo.com/update/pricing-update-in-dataforseo-apis),
[DataForSEO SERP API pricing (review)](https://www.costbench.com/software/ai-search-apis/dataforseo-serp-api/),
[SE Ranking pricing (review)](https://costbench.com/software/ai-seo-tools/se-ranking/),
[Ahrefs API pricing (review)](https://ryandoser.com/ahrefs-api-pricing/),
[Semrush plans (review)](https://www.costbench.com/software/seo-tools/semrush/),
[Moz pricing (review)](https://aionx.co/ai-comparisons/moz-pro-pricing-guide/),
[Clarity Data Export API](https://learn.microsoft.com/en-za/clarity/clarity-data-export-api),
[Bing AI Performance report](https://searchengineland.com/bing-webmaster-tools-testing-new-ai-performance-report-468039).
Most price figures come from third-party reviews, not the vendors' own pages,
and are to be confirmed before any purchase.
