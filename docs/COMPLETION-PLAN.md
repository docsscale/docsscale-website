# Project completion plan

Status: **approved by the owner on 6 Oct 2026; order of work changed by the
owner the same day (revision 5: the system first, then content through the
CMS).** This is the working plan. The tracker below is updated in every release
PR. Sections 1–9 describe what is built; **section 10 is the order it is built
in and replaces every "stage" number mentioned elsewhere in this file.**

## Status tracker

**Last updated: 6 Oct 2026.**

| Stage | What | Status |
|---|---|---|
| Done | CMS trial | **Done, 6 Oct 2026. Keystatic passed all six questions**; results in section 6. The trial site `cms-trial.docsscale.com` and the branches `trial/keystatic` and `trial/content` are kept on the owner's instruction: the site until `cms.docsscale.com` exists, the branches as the build reference. Removing any of them still needs the owner's approval. |
| Done | Keyword map | **Approved 6 Oct 2026** ([seo/keywords/keyword-map.md](seo/keywords/keyword-map.md)). Open until the owner's extra export: keywords for the websites, lead follow-up and reviews pages, and the city-page decision. The cost page is on hold until the owner provides real price ranges. |
| **A** | Foundations: service-page layout, checks, generators, performance budget, dependency update PRs | **In progress** (started 6 Oct). First: the service-page layout, for the owner's before/after approval. |
| **B** | The system: blog templates and the full CMS at `cms.docsscale.com` | Not started |
| **C** | First content, published through the CMS | Waiting for B. The owner's team is gathering material for the local SEO page and the "Google Business Profile for dentists" post. |
| **D** | Handover package, remaining review items, Safari in CI, WCAG pass | Not started |
| **E** | Weekly SEO review; proposals for the interactive tools and the data page | Starts 28 days after the first content is live. If the SEO command center is approved, the weekly review moves into it. |
| **Proposed** | SEO command center inside the admin ([SEO-DASHBOARD-PLAN.md](SEO-DASHBOARD-PLAN.md)) | **Proposal, waiting for the owner's approval and five decisions.** Not counted in the totals below until approved. It would add about 42–51 build days and does not delay the first content. |

## The short version

- **Priority: organic search, through a finished system.** The owner changed
  the order on 6 Oct 2026: build the whole system first, so the team then works
  on SEO in the CMS. Order: foundations, the full CMS, the first content
  published through it, then handover and the rest.
- **First new pages live in about week 10–11**, not week 3 as in the earlier
  order. That is the cost of this order. In return, every page and post from
  the first one is written, previewed, approved and published in the CMS, with
  no developer in the loop. After that, a steady two to three a week.
- **CMS: Keystatic**, starting with a one-day trial on a throwaway branch.
  Posts and case studies written before the CMS exists are saved as files in
  exactly the format Keystatic uses, so it takes them over without rework.
- **Running cost: USD 0 a month.** Section 11 shows where each zero comes from.
- **Publishing:** every edit can be previewed before it goes live, including
  edits to pages that are already published. New blog posts and case studies
  wait for your one-click approval; SEO fields, FAQs and team updates go live
  automatically after the checks. One switch in the CMS turns the approval step
  off later, with no code change.
- **Effort:** about 74–87 working days of build, roughly 16–19 calendar weeks.
  Two days were added so that service pages are also edited and published in
  the CMS (section 10).
- **From you:** the material listed in section 13. The keyword map and the
  first posts cannot be good without it. No decisions are open.

Still outside this plan: the lead magnets app at get.docsscale.com (5D), the
newsletter (5F) and off-page work (directories, reviews, backlinks). They stay
in [PHASE5-PLAN.md](PHASE5-PLAN.md) and [SEO-STRATEGY.md](SEO-STRATEGY.md).

## Decisions recorded (owner, 6 Oct 2026)

First round:

| Topic | Decision |
|---|---|
| CMS | Keystatic, starting with the one-day trial on a throwaway branch. |
| Cost | Target USD 0. Stay inside Keystatic Cloud's free tier (up to 3 users). Free hosting for the editing screen if Hostinger can't run it. If more than 3 editors are ever needed, the free GitHub-login option comes before any paid plan. |
| Editors at the start | The owner as admin plus one editor. The owner confirms the editor's name before any account is set up. |
| Preview | Before going live for every edit, including edits to published pages. |
| Existing pages | Body copy stays in code for now. Editors get the SEO fields only. |
| Approval of content | For the first months, new blog posts and case studies need the owner's one-click approval ("Ready for review" → the owner publishes). SEO field edits, FAQs and team updates go live automatically after the checks. This is a setting the owner can switch to fully automatic without code. |
| Priority | SEO content first; order in section 10. |
| Geography | US-wide with a Texas layer (as in [SEO-STRATEGY.md](SEO-STRATEGY.md)). |
| Keyword sources | Free only: Search Console, Google Keyword Planner exports supplied by the owner, and Google's "People also ask". Unverified volumes are written "Unknown". |
| Content quality | The rules in section 3; also added to [CLAUDE.md](../CLAUDE.md). |

Second round (approval of the plan):

| Topic | Decision |
|---|---|
| Trial | First, before anything else. |
| Leads per post | No new CRM field now; the landing page already reaches the CRM. Revisit in January 2027. |
| Second GitHub owner | Ahmed Mustafa (co-founder). The owner adds him; steps provided. |
| Practice software on industry pages | Only software we have actually worked with for a client in that specialty, as plain text, no logos. |
| First posts | The team supplies raw material, the developer drafts, the named author corrects, the owner approves. |
| Notifications | The person who saved, plus info@docsscale.com. |
| `/results/` case studies | All four are real client results with permission on file (owner, 6 Oct 2026): dental, Dallas; med spa, Las Vegas; physical therapy, Denver; chiropractic, Tampa. They may be reused on the matching industry pages with quotes and numbers unchanged. |
| Texas cities with real clients | Houston, Dallas, San Antonio. Only these qualify for a city page under the rules in section 3. Whether any gets a page stays open until the owner's extra Texas keyword export. |
| Trial outcome | Keystatic confirmed. The owner's approval lives inside the CMS. Branch and pull-request controls are hidden from editors. |
| Keystatic Cloud | Team `docsscale`, project `docsscale-website`, connected to this repository only. The account owner is the owner's personal Gmail. Seats, all three free ones: the owner (admin), "Team DS" (the future SEO person, non-admin) and one editor (non-admin, name to be confirmed). |
| Search Console | The developer may read it through the connector, read-only. |
| SEO features | The six in section 5 are built; interactive tools and the data page get a proposal first; "cost" and "how to choose an agency" pages go in the keyword map. |
| Weekly SEO review | Section 8, based on [seo/SEO-OS-V1.md](seo/SEO-OS-V1.md). Nothing from its long-term "Autonomous Search Growth OS" section is built. |

**Checked on 6 Oct 2026 (read-only, through the Hostinger connector):** the
hosting plan is **Business**. Hostinger offers Node.js apps on its Business and
Cloud plans, so the editing screen should be able to run on our own hosting at
`cms.docsscale.com` with no new account. This is proven for certain only by
running it there, which is part of the trial.

---

## 1. Keyword map (stage 1)

**Output:** `docs/seo/keywords/keyword-map.md` (the location
[seo/SEO-OS-V1.md](seo/SEO-OS-V1.md) already names), one row per page, existing
and planned. Raw exports go in `docs/seo/keywords/exports/`.

| Column | What it holds |
|---|---|
| Page | URL, existing or proposed |
| Primary keyword | Exactly one. No two pages share one. |
| Secondary keywords | Close variants and long-tail terms the same page can answer |
| Intent | What the searcher wants: hire an agency, learn how, compare, find a price |
| Layer | US-wide, or Texas |
| Monthly searches | From your Keyword Planner export. If it isn't in an export: **"Unknown"**. Never an estimate presented as a fact. |
| Competition | What ranks today: big directories, national agencies, small specialists, thin pages. From looking at the results page, with the date checked. |
| Early win? | Marked when the term is specific, the current results are weak, and we have something real to say |
| Questions | From Google's "People also ask" for that term; they feed the page's FAQ and direct answer |
| What only we can say | The real example, number or process that page will carry (section 3). Empty means the page isn't ready to write. |
| Current position | From Search Console, where there is data |

**How it's built**

1. Seed terms from the seven services, the four industry pages and the nine
   specialties we work with, plus the words your prospects actually use
   (section 13).
2. You run those seeds through Keyword Planner and send me the exports; the
   click-by-click steps are in section 13.
3. I read Search Console for what the site already appears for. The site was
   indexed recently, so expect little data at first; that column fills in over
   the following months.
4. I look at the live results for each candidate term and collect the "People
   also ask" questions.
5. Long-tail terms get priority for early wins: specialty plus service plus
   problem ("how to reactivate lapsed chiropractic patients"), not head terms
   ("dental marketing") where national agencies and directories hold page one.
   Head terms are still mapped, as the long-term target of the main pages.
6. The Texas layer: Texas wording on pages where it is true and natural, the
   Google Business Profile, and city pages only for Houston, Dallas and San
   Antonio, where there are real clients. Each still needs its own real
   content (section 3); the map says which of the three is worth a page.
7. **"Cost" and "how to choose an agency" pages** are mapped too: for example
   what clinic marketing costs, and how to choose a marketing agency for a
   clinic. People searching these are close to hiring. A cost page is only
   written with real price information you are willing to publish.

**What the map decides:** the final URLs and titles of the service pages, which
long titles get shortened (backlog item), the order pages are written in, and
the first blog topics. I'll bring it to you as one document to approve before
any page is written from it.

**Honest limits:** Keyword Planner gives ranges, not exact numbers, for accounts
that aren't running ads, and it rounds small terms to zero. Low or missing
numbers don't mean nobody searches; three months of Search Console data will be
the real measure. No keyword tool or ranking can be promised.

---

## 2. Money pages (stage 2)

### A page for each service

Today the services are sections of `/services`. Each of the seven confirmed
services gets its own page; `/services` becomes the overview that links to
them, and the Services menu links to the pages instead of the sections.

| Stage | Service | Proposed URL (final after the keyword map) |
|---|---|---|
| Attract | Paid ads (Meta & Google) | `/services/paid-ads/` |
| Attract | Local SEO & Google Business Profile | `/services/local-seo/` |
| Attract | Social media management | `/services/social-media-management/` |
| Capture | Websites & landing pages | `/services/websites-and-landing-pages/` |
| Convert | Lead follow-up & booking | `/services/lead-follow-up-and-booking/` |
| Retain | Reviews & reputation | `/services/reviews-and-reputation/` |
| Retain | Reactivation & recall | `/services/patient-reactivation/` |

Each service page has: a direct answer of 40–60 words at the top, what we
actually do and in what order (our own process), a real client example with
numbers where we have permission, who it suits and who it doesn't, 4–6 real
questions with answers, links to the industries and related services, and
Service, FAQPage and BreadcrumbList schema.

This also settles the **seven-versus-eight services** wording on `/services`,
the homepage grid and the industry pages (backlog item): everything will say
seven. Those are visible changes and come as before/after.

### Deeper industry pages

The four industry pages (dental, chiropractic, physical therapy, med spa) are
built from one shared layout today. Each gets content only that specialty could
have:

- a real case study from that specialty, with permission;
- the questions that specialty's owners actually ask, answered;
- the treatments and service lines we build campaigns around for it;
- the practice software that specialty uses and how our work fits beside it
  (only what we have worked with for a client there);
- anything regulated or sensitive in marketing that specialty.

The four cases on `/results/` are real, with permission on file (owner, 6 Oct
2026), one per industry page. Each is reused on its matching page with quotes
and numbers exactly as they are on `/results/` today. Practice software is
named only where we have worked with it for a client in that specialty, as
plain text; where there is none, that part is left out.

### How these pages get approved and released

- **Layout once:** the service-page layout is shown as before/after (desktop,
  tablet, mobile) and approved once.
- **Copy every time:** each page's copy comes to you as a draft, with the
  keyword it targets, the "only DocsScale could say this" element marked, and a
  similarity note against existing pages. Nothing visible is merged without
  your approval.
- **Pace:** two to three pages a week, in the order the keyword map sets.
- Old section links (`/services#attract` and so on) keep working; no URL is
  removed, so no redirects are needed for this stage.

### Built with these pages (needed for any of it to be safe)

- Sitemap generated at build time, with real last-changed dates (also fixes
  review item SEO-2).
- Schema generated from the page content and validated on every push.
- Brand-rule check and link checker in CI (both Phase 5A leftovers).
- A **similarity check** in CI: every page's text is compared with every other
  page's, and pairs above a threshold are listed for review.
- The **target keyword** field and its duplicate check, **IndexNow**, and the
  **AI-assistant channel** in GA4 (section 5, features 4–6).
- Case studies and FAQs saved as content files in Keystatic's format, so the
  CMS takes them over later.

---

## 3. Content quality rules (all new pages)

These apply to me, to editors and to every page type. They are also in
[CLAUDE.md](../CLAUDE.md), section 2.

1. **No scaled or templated pages.** Never create pages where only a city, a
   specialty or a keyword changes. Every page needs unique, substantive
   content.
2. **Service + industry combination pages** only where we have real experience
   or a case study for that combination.
3. **City pages** only where we have real clients or results.
4. **Every page must include something only DocsScale could say** before it is
   published: a real client example, real numbers, or our own process.
5. **Steady pace:** two to three strong pages or posts a week, not a burst.
6. **Similar pages are flagged.** Any page that may be too close to an existing
   one is pointed out before it is approved.

**How each is enforced**

| Rule | By a check | By a person |
|---|---|---|
| 1, 6 | The similarity check lists near-duplicates on every push and every publish. It warns; it doesn't decide. | The owner sees the similarity note with each draft |
| 2, 3 | The CMS has no "city page" or "combination page" type at all. Creating one needs the developer, and so the owner's approval. | The keyword map marks which combinations and cities qualify, with the client or case study named |
| 4 | Posts, case studies and service pages have a required field, "What only DocsScale could say here", shown to the approver, never on the site | The owner's approval; the editor guide explains it with examples |
| 5 | The publish workflow counts new URLs in the last 7 days and warns the owner above the agreed number. It warns; it doesn't block. | The content calendar |

No check can tell whether a page is good. These catch the mechanical failures;
the approval step is what protects quality, which is a reason to keep it on for
posts and case studies longer than feels necessary.

---

## 4. Blog design and first posts (stage 3)

### Built before the CMS, in the CMS's format

- Posts are files in the repo: one folder per post, text in Markdoc (Markdown
  with a few extras) with its fields in a header block. This is the format
  Keystatic reads and writes. The site reads them with Keystatic's own reader
  from the first day, so there is nothing to convert when the CMS is switched
  on.
- Until the CMS exists, posts go live the way everything does today: branch,
  pull request, your approval, release.
- If the trial sends us to TinaCMS instead, the format changes to its close
  cousin (MDX). The trial runs first for exactly this reason: so the format is
  settled before the first post is written.

### Pages

| Page | Contents |
|---|---|
| Blog index `/blog/` | Featured post, category filter, pages of ten |
| Post `/blog/<slug>/` | Readable column, table of contents from the headings, author box, related posts, call-to-action to book a call |
| Category `/blog/category/<name>/` | Only created when a category has at least three posts, so there are no thin pages |
| Author `/blog/author/<name>/` | Real bio and photo; only for people with a published post |
| RSS | `/blog/rss.xml` |

The design follows the existing site (type scale, hairlines, stage colours) and
is shown for approval at the three widths before build-out. It is built to WCAG
2.2 AA from the start rather than fixed afterwards.

### Automatic for every post

- BlogPosting, Person, BreadcrumbList schema, and FAQPage when the post has a
  visible FAQ.
- Social image generated at build time from a branded template with the post
  title; a custom one can replace it.
- Images: one upload becomes AVIF and WebP at several widths, with location and
  camera data stripped and sizes written into the page so nothing jumps. Every
  image carries its source and licence.
- Sitemap and `llms.txt` updated.
- **GA4:** blog pages are grouped as "Blog" and carry the post's slug, category
  and author.
- **Leads per post:** the browser tab already remembers the landing page and
  UTMs. It will also remember the first and the most recent post read, and send
  both with `generate_lead` and `book_call`. Same consent rules as today. The
  landing page already reaches the CRM with every lead, so the post that
  *brought* a visitor is visible there without any new field.
- You add three custom dimensions in GA4 admin (post, category, author);
  steps provided.

### First posts

- The blog launches with **three posts**, so the index isn't a single item, and
  then follows the weekly pace.
- Topics come from the keyword map's early-win rows. I propose six with a
  one-paragraph brief each; you pick.
- Each post needs its "only DocsScale could say" material from you or the team
  before it is drafted (section 13). A post without it isn't written.
- Each post has a real, named author from the team, who reads and corrects it
  before it comes to you.

---

## 5. SEO features added on 6 Oct 2026

Six are built, in the stage shown. Effort is extra to the first estimate and is
included in section 10.

| # | Feature | What is built | Stage | Extra days |
|---|---|---|---|---|
| 1 | **Trust signals** | Author profiles with name, photo, role, experience, LinkedIn link, and Person schema with `sameAs`, linked from every post. A visible "Last updated" date on posts. A "Last reviewed" date and reviewer field, shown as "Reviewed by" when filled. An editorial standards page; its copy needs your approval. | 3 | 1.5 |
| 2 | **Answer-first format** | A required summary at the top of every post: two or three sentences that answer the post's main question, shown above the body. FAQ blocks inside posts with FAQPage schema. Question-style headings explained in the editor guide. | 3 (guide in 5) | 0.5 |
| 3 | **Topic clusters** | A required "parent service page" on every post. The post links to its service page; each service page lists its posts automatically; related posts are chosen by shared parent and category. The list on service pages is a visible change and comes as before/after. | 3 | 1 |
| 4 | **Target keyword** | A field on every page and post, filled from the keyword map. Never shown on the site. A check on every push and publish flags two pages with the same or near-same keyword. | 2 (in the CMS in 4) | 0.5 |
| 5 | **IndexNow** | When a page is published or updated, its address is sent automatically to IndexNow, which Bing and the other participating search engines read. Free. | 2 for releases, 4 for CMS publishes | 0.5 |
| 6 | **AI-assistant traffic** | A custom channel group in GA4, "AI assistants", for visits arriving from ChatGPT, Perplexity, Gemini, Copilot and Claude. Leads are then reported by that channel like any other. | 2 | 0.25 |

Things to know about three of them:

- **IndexNow does not include Google.** Google finds changes through the
  sitemap, which is regenerated on every publish. IndexNow needs one small key
  file on the site; it is public by design and is not a secret.
- **AI-assistant tracking is set up in GA4's admin, not in the site's code.**
  Putting those product names in the site's public files would break the brand
  rule in CLAUDE.md, and GA4 can do the grouping from the referring address
  alone. I give you the exact rule to paste; it takes about ten minutes.
  **Honest limit:** many visits from assistants' apps arrive with no referring
  address and are counted as "Direct", so this channel undercounts. It shows
  the trend, not the total.
- **"Last reviewed" must be true.** The field records a real person rereading
  the post on that date. It is never filled automatically.

### Added on 6 Oct 2026, second round

| # | Item | What is built | Stage | Extra days |
|---|---|---|---|---|
| 7 | **CMS and preview hidden from search engines** | `cms.docsscale.com` requires sign-in and shows nothing else. The preview site requires a password, like staging. Both send `noindex` on every response, and the preview's pages keep pointing to docsscale.com as the original. A check in CI requests both and fails if either answers without sign-in or without `noindex`. The trial site already sends `noindex` and holds no copies of pages. | 4 | 0.5 |
| 8 | **Call-to-action blocks in posts** | Two ready-made blocks an editor inserts from the editor's menu: "Book a strategy call" and "Get the Free System". The wording and design are fixed in code and approved by you once; the editor only chooses which, and the one that fits the post's parent service is suggested. Clicks are counted as `cta_click` with the post. | 3 (design and display), 4 (in the editor) | 1.5 |
| 9 | **Content checks before publishing** | One list, below, of what blocks and what warns, with messages in plain words. | 2 (checks), 4 (shown to editors) | 1 |
| 10 | **Structured data validation on every change** | Every page's schema is parsed and checked for the fields each type requires. A bad CMS field stops the publish; it cannot produce invalid schema on the live site. | 2 | 0.5 |
| 11 | **Performance budget** | An automatic lab test on every push and publish, of the changed pages and the key pages. It fails a page that is too slow or too heavy. Posts cannot embed outside content directly; a video is a still image that loads the player on click. | 3 (then part of publishing in 4) | 1.5 |
| 12 | **Automatic social images** | Already in stage 3: made from the post title in the brand style when no image is uploaded. | 3 | 0 (already counted) |
| 13 | **Honest "Last updated" dates** | The date changes only when the editor ticks "This is a meaningful update" and says in a few words what changed. The workflow warns when the box is ticked but almost nothing changed, and when a large change was saved without it. Typo fixes leave the date alone. | 3, 4 | 0.5 |
| 14 | **Weekly dependency update PRs** | GitHub's built-in updater opens one grouped pull request a week for the site, the test tools, the editing app and the CI actions, and a separate one straight away for a security fix. CI tests each like any other change; merging still needs your go-ahead. | 2 | 0.25 |
| 15 | **Uptime monitoring for `cms.docsscale.com`** | A fifth monitor in the existing UptimeRobot account (the free plan allows 50), alerting info@docsscale.com. | 4 | 0.1 |
| — | **Branch and pull-request controls hidden from editors** | See "Trial results" in section 6. | 4 | 0.5 |

**Content checks (item 9)**

| Check | Result |
|---|---|
| Two pages with the same title or the same meta description | Blocks |
| An image without alt text that isn't marked decorative | Blocks |
| Banned wording: AI wording and tool names, the CRM platform's name anywhere outside the Free System funnel, "new", "startup" or "recently launched" about DocsScale | Blocks |
| Missing required field, permission box unticked, invalid schema, broken link, bad redirect | Blocks |
| Two pages with the same target keyword | Warns, and is shown to the approver |
| A very short page (a post under about 400 words; the number is set once we have real posts) | Warns |
| A page too similar to an existing one | Warns, and is shown to the approver |
| More new pages in a week than the agreed pace | Warns the owner |

A warning never stops an automatic publish of FAQs or SEO fields; for posts
and case studies the approver sees the warnings beside the preview link.

**Performance budget (item 11), honestly.** The numbers are lab tests on a
simulated phone, not real visitors. New templates (blog, service pages) must
meet the target: a mobile performance score of at least 90, the main content
painted within 2.5 seconds, no layout shift, and a limit on page and image
weight set from the first real posts. Existing pages are held to "no worse than
today", because the homepage and `/free-system/` measured 81–82 in the 30 Sep
review and would fail a flat target; they move to the target if the 15 Oct
review leads to the hero fix (FE-1).

**Dependency updates (item 14), honestly.** This would not have prevented
today's failure, where a newly published advisory turned the audit check red on
every branch at once. It shortens it: the fix arrives as a ready, tested pull
request within hours instead of being found by accident.

### Planned for stage 6, proposal before any build

| # | Item | What the proposal will cover | Rough build if approved |
|---|---|---|---|
| 7 | **Free interactive tools**: a missed-calls cost calculator and a cost-per-booked-appointment calculator | Inputs, the formula in plain words, the result screen, where each leads (the Free System or a strategy call), tracking, and the design. They run in the browser with no server. Every result comes from the visitor's own numbers; any default or benchmark shown must be a real figure you supply, or there is none. | About 4 days for the first, 2 for the second |
| 8 | **Original data page template** | A layout for our own anonymised findings: method, sample size, period, charts, plain-language takeaways, and Dataset schema. Used only with real numbers you provide; no page exists until there is a first real dataset. | About 2–3 days |
| 9 | "Cost" and "how to choose an agency" pages | In the keyword map (section 1); written at the normal pace once mapped | Within stages 2–3 |

---

## 6. CMS (stage 0 trial, stage 4 build)

### Why Keystatic, and the one condition

Unchanged from the first version of this plan, in brief:

| | **Keystatic** (chosen) | **TinaCMS** (fallback) |
|---|---|---|
| Content storage | Files in our repo only | Files in our repo, plus a copy in Tina's cloud database that its editor depends on |
| Editing | Forms with a rich-text editor | Forms plus on-page visual editing |
| Where the editing screen runs | Needs a small server program, so it runs at its own address, apart from the public site | Plain files next to the site |
| Login without GitHub | Yes, through Keystatic Cloud (email and password); free up to 3 users | Yes; free for 2 users, paid beyond |
| Change to our pages' code | Small: pages read content files at build time | Larger: editable pages are wrapped in Tina's editing code |
| Trace on the public site | None | Editor files under `/admin/` |
| Maturity | Version 0.6 (0.6.9, updated August 2026), not yet 1.0, made by an established agency | Version 2+, frequent releases |

**The condition:** Keystatic's editing screen cannot be part of a static site.
It runs at `cms.docsscale.com`. The public site keeps no server and no
database; visitors never touch the editing address; if it is down, the only
effect is that editors can't edit until it is back.

### The one-day trial (first task of the whole plan)

On a throwaway branch, never deployed to production. It must prove:

1. An editor signs in with an email address and no GitHub account, and a save
   arrives in our repo.
2. The editing screen runs on our Hostinger Business plan at a test address.
   If it can't, the same test on a free host (Cloudflare's free plan allows
   commercial use; that would be a new account, created by you).
3. The SEO fields can show live length warnings while typing.
4. An uploaded image lands in the repo and comes out optimised.
5. **The repo records which person made each save.** The approval step and the
   automatic switch both depend on this (below).
6. The editing screen can be fixed to the working copy (below), so an editor
   can't save straight to the live copy by accident.

If 1–4 fail, we use TinaCMS; about 3 extra days. If only 5 or 6 fail,
Keystatic still works, but your approval click would happen in GitHub's phone
app or website instead of inside the CMS; I'd show you that before going on.

### Trial results (6 Oct 2026, Keystatic 0.6.9)

**Keystatic passed. TinaCMS is not needed.**

| # | Question | Result |
|---|---|---|
| 1 | Sign-in with email, no GitHub account; a save arrives in the repo | **Yes.** The owner and a second invited address both signed in with email and saved; both saves arrived on the working branch within seconds. |
| 2 | The editing screen runs on our Hostinger Business plan | **Yes.** It runs as a Node.js site at `cms-trial.docsscale.com`, in its own folder apart from the main site. No new account and no cost. |
| 3 | Live length warnings in the SEO fields | **Yes.** A custom field counts while typing, turns amber outside the recommended range and red over the limit, and refuses to save over the limit. |
| 4 | An uploaded image lands in the repo and comes out optimised | **Yes.** |
| 5 | The repo records who made each save | **Yes.** Every save is made by Keystatic Cloud's own identity, signed by GitHub, and carries a line naming the signed-in person and their email. That line is added by Keystatic Cloud's server, not by the browser. |
| 6 | The editing screen can be kept on the working copy | **Yes, with our own guard.** Keystatic always lists the repository's main branch in its branch menu and has no setting to hide it. Our app sends the screen straight back to the working branch (confirmed by the owner), and hides the branch menu, "New branch…" and "Create pull request". |

**So the owner's one-click approval can live inside the CMS.** The publish
workflow reads who saved the change that set a post or case study to Published
and compares it with the approver list kept in the repository's settings.

Things to know:

- **How strong the "who saved" record is.** It is reliable against mistakes and
  against an editor simply pressing Publish. It rests on Keystatic Cloud's
  sign-in, so it is exactly as strong as each person's password and two-factor
  sign-in there. It is a record kept by a vendor, not something GitHub itself
  verifies per person.
- **The approver is identified by the email used in Keystatic Cloud.** For the
  owner that is a personal Gmail address; it appears in the private repo's
  history with each save.
- **Hiding controls is ours to maintain.** A Keystatic update could rename a
  control and bring it back. A test in CI fails if any of them is visible, and
  even then nothing an editor clicks there can reach the live site: only the
  publish workflow copies content to the live copy, it only reads the working
  branch, and it refuses anything that is not content. "Create pull request"
  opens GitHub, where an editor has no account.
- **Roles.** Editors are invited with the non-admin role. An admin in Keystatic
  Cloud can invite people and change the project; that stays with the owner.

### What editors can change

All through forms with fixed fields; no page builder.

| Item | Fields | Goes live |
|---|---|---|
| **Blog posts** | Title, slug, summary, body, category, author, date, optional social image, optional FAQ, SEO block, "What only DocsScale could say here" | After the owner's approval (while the setting is on) |
| **Case studies** | Clinic name or an anonymous description, specialty, services, problem, what we did, results as label-and-number pairs with their period, optional quote, images, SEO block, **permission confirmed** (who, when) | After the owner's approval (while the setting is on) |
| **Testimonials** | Quote, name and role, clinic, specialty, optional photo, **permission confirmed** | Automatically after the checks; refused without the permission box |
| **Categories** | Name, slug, description, SEO block | Automatically |
| **Team members** (also blog authors) | Name, role, short and long bio, photo, profile links, "writes for the blog", order | Automatically |
| **FAQs** | Question, answer, which pages it appears on, order | Automatically |
| **Free resources** | Title, description, who it's for, what's inside, image, link | Automatically; the `/resources/` page itself is a new design needing approval |
| **Site settings** | Contact email, announcement bar (on/off, text, link, end date), footer link groups, publishing settings | Automatically |
| **SEO block for every existing page** | Title, description, social image, hide from search engines | Automatically |
| **Redirects** | Old URL, new URL, note | Automatically, after the validation in section 7 |

**SEO block, on every page and entry**

| Field | While typing | Before publishing |
|---|---|---|
| Page title | Counter; amber over 55 characters, red over 60 | Required; unique across the site |
| Meta description | Counter; amber under 120 or over 150, red over 160 | Required; unique |
| URL slug | Lower-case letters, numbers, hyphens | Unique; changing a live slug creates its redirect automatically |
| Social image | Size shown | 1200 × 630 minimum, or the automatic one is used |
| Image alt text | Counter | Required unless the image is marked decorative |
| FAQ (optional) | Question and answer pairs | Shown on the page and added as schema; never schema without the visible FAQ |
| Hide from search engines | Tick box with a warning | Leaves the sitemap; adds `noindex` |

**Not in the CMS:** body copy and layout of the existing pages, forms and their
fields, tracking and consent, the CRM connection, the lead handler, the menus'
structure, hosting, DNS, deploy settings. Also not in the CMS, on purpose: any
way to create a city page or a service-and-industry page (section 3).

### How publishing works

**Two copies of the content.** The CMS always saves to a *working copy*. The
live site is built only from the *live copy*. Nothing an editor saves can reach
the live site until it is published, and that is equally true for a brand-new
post and for a one-word change to a page that has been live for a year.

For an editor:

1. Sign in at `cms.docsscale.com`.
2. Create or change something and press **Save**. It is now in the working
   copy.
3. Press **Preview**. Within a few minutes the private preview site
   (password-protected, hidden from search engines) shows the whole site as it
   would look with every saved change.
4. Set the entry's status:
   - **SEO fields, FAQs, team, testimonials, settings, redirects:** choose
     **Publish**. The checks run and it goes live in about ten minutes.
   - **Blog posts and case studies:** choose **Ready for review**. The owner
     gets an email with the preview link.
5. The owner opens the entry, reads the preview, and chooses **Publish** (one
   click and Save), or sends it back to Draft with a note.
6. If a check fails, nothing changes on the live site, and the editor and the
   owner get an email naming the entry and the problem in plain words.

**The approval setting.** Site settings → Publishing has one switch: "Blog
posts and case studies need the owner's approval". On: only the owner's
**Publish** counts for those two types; an editor's is refused with a message.
Off: editors publish them like everything else. Only a change to that switch
made by the owner is honoured, so an editor can't turn it off. No code change
and no developer are needed to flip it. The list of who counts as an approver
is kept outside the CMS, in the repository's settings, for the same reason.

**Behind the scenes**

1. A save is a commit to the working-copy branch, recorded under the person who
   made it.
2. A workflow rebuilds the preview site from the working copy.
3. When an entry's status is Publish, the workflow checks, in this order:
   - **only content files changed.** Anything else stops everything; a CMS
     login can never ship code, even a stolen one;
   - **who published**, against the approval setting;
   - build, content rules (required fields, permission boxes, unique titles
     and slugs), redirect validation, brand-rule check, link checker, schema
     check, accessibility check on the changed pages, image limits, similarity
     check, behaviour tests.
4. Green: that entry is copied to the live copy, production is deployed, the
   Hostinger cache is cleared, the live pages are checked, and the visual
   baseline is re-recorded.
5. Red: nothing is copied or deployed, and the email goes out.

Notes:

- The screenshot comparison is not run against content changes; it exists to
  catch unintended visual changes from code. The baseline is re-recorded after
  a content publish.
- While an approved code release is merged but not yet deployed, content
  publishing waits, so a content publish never carries undeployed code.
- Preview builds skip the long test suite to stay fast and inside the free
  Actions minutes; the full suite runs at publish.

**Rollback:** every publish is a commit in the live copy. The owner or
developer runs a "Roll back content" action in GitHub and picks the publish to
undo; it is reverted with a new commit (history is never rewritten) and the
site is republished. Whole-site rollback stays as in [RELEASE.md](RELEASE.md).

**What this needs:** a permanent Hostinger API token as a GitHub secret
(decided 27–28 Sep 2026; you create it, I never see it), and two subdomains on
the existing hosting, `cms.` and `preview.`, with DNS changes shown to you
first.

### The rule change in CLAUDE.md

Goes in with the stage 4 PR that switches publishing on, not before. Proposed
wording:

> **Content published from the CMS** is the one exception to the rules above.
> A change made in the CMS that touches only the content folder and uploaded
> images goes live once every CI check passes, with no pull request or
> before/after. New blog posts and case studies also need the owner's Publish
> in the CMS while the approval setting is on. Everything else, including any
> change to what the CMS can edit, to the checks, or to the publish workflow
> itself, follows the rules above without exception. The developer never uses
> the CMS route to ship code or copy.

### How the brand rules are kept when editors publish

| Rule | Enforcement |
|---|---|
| No AI wording, tool names or generator tags | Brand-rule check blocks the publish |
| The CRM platform never named outside the Free System funnel | Same check |
| Never "new", "startup", "recently launched" | Same check |
| No invented data; examples labelled | Permission boxes, the owner's approval, the editor guide. Not machine-checkable. |
| No AI-generated or AI-edited images; third-party images recorded | Required "Source" and "Licence" on every upload; whether an image is AI-made can't be detected reliably, so that is a rule in the guide |
| Content quality rules | Section 3 |

---

## 7. Redirects that can't break the site

An editor fills in "Old URL" and "New URL" and never writes a server rule.

**Checked on save and before publishing**

- Both are valid paths on docsscale.com (or a full `https://` target); no
  spaces; no query string or `#` in the old URL.
- The old URL is not a page that exists.
- The old URL is not protected: the homepage, `/send-lead.php`, `/_server/`,
  anything under `/free-system/` (live ads point there), the sitemap, robots,
  and the existing `/services/<industry>/` rules.
- No loops. No chains: A → B → C is rewritten as A → C and B → C, and the
  editor is told.
- No duplicates; the target is a real page or an allowed outside address.

**Then**

- The rules are generated into a marked block of `.htaccess`, with every
  character an editor typed escaped so it can't be read as a rule.
- The complete file is loaded into a real Apache server inside CI and every
  redirect, old and new, is requested: one hop, right target, query string
  kept. If the file doesn't load or any check fails, nothing is deployed.
- After deploying, `tests/server/redirects.sh` runs against the live site.

---

## 8. Weekly SEO review (stage 6)

Based on your [seo/SEO-OS-V1.md](seo/SEO-OS-V1.md), copied into the repo
unchanged on 6 Oct 2026. Its rules stand: never fabricate data, evidence for
every recommendation, "Insufficient data" when data is thin, every
recommendation and its outcome recorded, no paid data by default, and "do
nothing" is a valid answer.

**When it starts:** once the blog and the first money pages have been live for
28 days. Before that there is too little data, and a review would mostly say
"Insufficient data". A baseline snapshot is taken earlier, at the end of
stage 2.

**Data, read-only everywhere**

| Source | How | State |
|---|---|---|
| Search Console | Connector | Connected; permission given 6 Oct 2026 |
| GA4 | Connector | Connected |
| Bing Webmaster | The key in `~/DocsScale-Secure/`, read methods only | Working since 30 Sep |
| Clarity | Its free data export, if it gives enough | **Unknown until tested.** It needs a token you create, and the free export is limited to a few requests a day covering the last few days. If it isn't enough, Clarity is reported as "Not measured" and read by hand. |

**What changes from the original document, because of the CMS**

| SEO-OS V1 says | Adapted |
|---|---|
| Every approved change is implemented by the developer on a branch | Changes an editor can make (titles, descriptions, FAQs, a post's text, internal links in a post, redirects) are written as steps to follow in the CMS, naming the entry and the field. Only changes to code or to existing pages' body copy go to the developer. |
| Content suggestions are briefs and drafts on a branch | A suggested new post is created as a **draft in the CMS**, with its brief, target keyword and parent service page filled in. It is never published automatically; a person writes it, and posts still need your approval. |
| Keyword map at `docs/seo/keywords/keyword-map.md` | Same file; the target-keyword fields in the CMS are checked against it |
| Nothing reaches production without approval | Still true for everything the review itself does. It only reads data and writes files and drafts. |
| You run the review by hand each Monday | Unchanged. No scheduler and no background service. |
| Long-term "Autonomous Search Growth OS" | **Not built.** Nothing from that section, as you instructed. |

**Outputs**, as in the document: a weekly report, one file per recommendation
with its evidence and status, an index of them, and outcome checks 28 days
after a change (60 for a new page). At most five recommendations a week.

**Effort:** 3–4 days to set up the folders, the five commands and the baseline,
each command shown to you first as the document requires.

---

## 9. Handover, review leftovers, Safari and accessibility (stage 5)

### Handover package

| Document | Contents |
|---|---|
| **`docs/EDITOR-GUIDE.md`** | For someone who has never used a CMS or done SEO. Signing in; a post from blank page to live; images and alt text; the SEO block field by field with good and bad examples; preview, Ready for review, Publish; what each error email means; case studies and permission; team, FAQs, resources, settings; redirects; the content quality rules and "what never to publish" in plain words; who to ask. Real screenshots of our CMS, captured automatically so they can be refreshed. Ends with a **one-page per-post SEO checklist**. |
| **`docs/ACCESS.md`** | CMS, GitHub, Hostinger, Search Console, GA4, Bing Webmaster, Clarity, UptimeRobot, the CRM: who owns each, who else has access and at what level, how to add and remove a person, what to do the day someone leaves. Names only. Anything I can't verify is written "Unknown". |
| **`docs/SECURITY-CLEANUP.md`** | Your tick list, in order: rotate the CRM token on the server; new Bing API key; reset the UptimeRobot key; update `~/DocsScale-Secure/`; delete the session logs in `~/.claude/projects/-Users-abdulsamad-Downloads-docsscale/` **but keep the `memory` folder inside it**; two-factor sign-in on GitHub (required for the whole organisation), Hostinger, Google, Microsoft, the CRM, UptimeRobot and Keystatic Cloud; a second owner on the GitHub organisation; check for old copies of `lead-debug-log.txt`. Rotate first, delete second, so any leaked copy is already useless. These are your accounts; I can't do them for you. |
| **`docs/MAINTENANCE.md`** | About an hour a month. Editor/SEO: Search Console coverage and queries, keyword-map positions, broken-link and similarity reports, refresh one older post. Owner: uptime and failure emails, DMARC reports, who has access, a lead-backup download, whether to switch the approval setting. Developer, quarterly: dependency and CMS updates, token and certificate expiry, a restore test. |

### Agency review, still open

| Item | What | Visible | Note |
|---|---|---|---|
| 4 (FE-1) | Slow hero on phones | Yes, subtle | Decided at the 15 Oct Web Vitals review, as agreed; this matters more now, because page speed on phones affects search |
| 8 (QA-2, QA-3) | Header and footer landmarks, skip link, `autocomplete` | Skip link on keyboard focus | Small; can ride along with stage 2 since the header is touched there |
| 9 (BE-3) | Back up rate-limited submissions | No | Lead-handler change: PHP tests and one QA lead |
| 10 (QA-5) | Safari engine in CI, iPhone check | No | Below |
| PM-4, PM-6 | "Historical" banners on old docs; client guide | No | The client guide is replaced by the editor guide |
| 5A leftovers | Brand-rule check, link checker | No | Moved forward into stage 2 |
| 5A leftovers | SSL-expiry check, DMARC tightening | No | SSL: a free weekly scheduled check that emails under 21 days. DMARC: after the 20 Oct review. |

The review's lower-priority findings (UX-3 visible form labels, UX-4, UX-5,
UX-7, FE-2, BE-4, BE-5, BE-6, QA-4, AR-2, AR-4, AR-5, AR-6, SEO-3) were never
scheduled. **Unknown: which have since been fixed in passing.** First task of
this stage: check each against the code and give you a short list with a
recommendation to fix or to close as accepted.

### Safari and iPhone

- **CI:** Playwright's WebKit engine (download already approved) runs the
  behaviour tests at iPhone and desktop Safari sizes on every push. Screenshot
  comparison stays on one browser.
- **Limit:** that is Safari's engine, not Safari on a real iPhone. It catches
  most Safari-only bugs, not all.
- **Real iPhone:** a ten-minute checklist per code release on your phone, added
  to [QA-CHECKLIST.md](QA-CHECKLIST.md). Paid device testing is not needed and
  not in this plan.

### WCAG 2.2 AA pass

1. axe-core on every page at phone and desktop width, as a permanent CI check.
2. By hand: keyboard-only through every page and form, VoiceOver on Mac and
   iPhone, 200% and 400% zoom, reduced motion, contrast with animations
   settled.
3. Invisible fixes go to a PR; visible ones (visible form labels are the likely
   large one) come as before/after first.
4. Editors can't break it: required alt text, heading levels enforced in the
   post editor, vague link text flagged.
5. Written up in `docs/ACCESSIBILITY.md`: what was tested, what passed, known
   exceptions. It will not say "fully compliant"; only an independent audit can
   certify that.

---

## 10. Order of work and effort

**Changed by the owner on 6 Oct 2026: the system first.** The stage letters
here replace the stage numbers used in sections 1–9.

Code PRs follow today's rules throughout: CI green, before/after for anything
visible, your approval of every visible copy change, your go-ahead to merge and
to deploy.

| Stage | What | Build days | Needs from you |
|---|---|---|---|
| Done | CMS trial (1) and keyword map (3) | 4 | — |
| **A. Foundations** (no material needed) | Service-page layout and the `/services` overview, shown as before/after (3). Sitemap and schema generated at build, brand-rule check, link checker, similarity check (3). Content checks (1). Structured-data validation (0.5). Performance budget (1.5). Weekly dependency update PRs (0.25). | 9–10 | Approve the layout |
| **B. The system** | **Blog templates:** index, post, category, author, RSS, automatic social images (7–9); author profiles, "Last updated" and "Last reviewed", editorial standards page (1.5); required summary and FAQ blocks (0.5); parent service page links and related posts (1); call-to-action blocks (1.5); honest "Last updated" dates (0.5). **CMS:** `cms.docsscale.com` on Hostinger, working copy, preview site, publish workflow with your approval for posts, case studies and service pages, rollback (8–10); SEO block, settings, team, FAQs, redirects (5–6); case studies, testimonials, resources page (4–5); **service pages as CMS entries (2, new)**; target keyword and duplicate check (0.5); IndexNow (0.5); AI-assistant channel (0.25); sign-in and noindex on CMS and preview, with a check (0.5); branch and pull-request controls hidden, with a test (0.5); uptime monitor (0.1). | 34–39 | Approve the blog design and the wording of the call-to-action blocks and editorial standards page; Hostinger API token as a GitHub secret; `cms.` and `preview.` subdomains; GA4 settings; the editor's name |
| **C. First content, through the CMS** | Local SEO page and "Google Business Profile for dentists"; paid ads and "Facebook ads for chiropractors"; reactivation and "dental recall messages" (6–7). Then the other four service pages (4) and the four deeper industry pages (4–5). | 14–16 | The material for each piece; approval of each in the CMS |
| **D. Handover and review** | Review leftovers, Safari in CI, WCAG pass (5–7); handover package and a walkthrough with the editors (4–6) | 9–13 | Approvals; the security checklist; iPhone check |
| **E. Weekly SEO review** | Set-up (3–4); proposals for the interactive tools and the data page template (1) | 4–5 | — |
| | **Total** | **74–87** | |

**Proposed addition: the SEO command center.** On 6 Oct 2026 the owner asked
for an SEO dashboard inside the admin at `cms.docsscale.com`. Its plan,
architecture, tab list and a mockup are in
[SEO-DASHBOARD-PLAN.md](SEO-DASHBOARD-PLAN.md) and
[seo/dashboard-mockup.html](seo/dashboard-mockup.html). If approved as written:

- Stage B is built in this order: blog templates and the publishing core
  first; **the first content goes out as soon as the owner's material arrives
  (about week 7–8)**; then the remaining CMS forms and dashboard phase 1.
- Dashboard phase 1 adds 28–34 build days (or about 15 for the lighter first
  cut); phase 2 adds 14–17, about four weeks after the first content.
- Stage E's weekly review is replaced by the dashboard's weekly run, Overview,
  Fix queue and plan.
- Total becomes about 116–138 build days, roughly 24–27 weeks. Running cost
  stays USD 0 until a paid tool is bought.

**What is new in this order**

- **Service pages become CMS entries.** The earlier plan kept service pages in
  code. To publish the local SEO page "through the finished CMS", each of the
  seven services gets a form with fixed fields: direct answer, our process in
  steps, the real client example, who it suits and who it doesn't, questions
  and answers, the SEO block and the target keyword. The layout stays in code.
  They need your Publish, like posts and case studies. Only the seven confirmed
  services exist; an editor cannot create an eighth, so the rule against
  templated pages holds.
- **The four industry pages stay in code**, as you decided for existing pages.
  Deepening them in stage C is developer work with before/after.
- **Blog templates are part of the system**, because the CMS has nothing to
  publish posts into without them.

**Timing**

| Weeks | Work | Goes live |
|---|---|---|
| 1–2 | A: layout for your approval, checks, generators, performance budget, dependency PRs | Nothing visible, except real dates in the sitemap |
| 3–5 | B: blog templates (design for your approval in week 3), then the publishing core | Nothing visible |
| 6–9 | B: `cms.docsscale.com`, preview site, approval, all the forms, service pages as entries | The empty blog and `/resources/` are not linked or listed until they have content |
| 10–11 | C: first pair, written and approved in the CMS | Local SEO page; first post |
| 12–14 | C: paid ads and reactivation with their posts; then the remaining pages at two to three a week | 2–3 pages or posts a week |
| 15–19 | D, then E once there are 28 days of search data | Handover complete |

- **The honest cost of this order:** the first new page reaches Google about
  seven weeks later than in the earlier order (week 10–11 instead of week 3),
  and search results take months to build after that.
- **How I reduce it without changing your order:** inside stage B, the parts
  needed to publish a service page and a post are built first (blog templates,
  publishing core, approval, service-page and post forms). If your material is
  ready before the rest of B is done (case studies, testimonials, resources,
  redirects, settings forms), the first pair can go out through the CMS as
  early as week 7–8 while I finish those. That is your call at the time.
- The weeks hold only if approvals and account steps (token, subdomains) come
  when they are needed.
- These are build-effort estimates, not a quote. Nothing here promises a
  ranking.

---

## 11. Running cost: USD 0 a month

| Item | Monthly | Why it is zero |
|---|---|---|
| Keystatic Cloud | USD 0 | Free up to 3 users; we start with 2 (owner and one editor). The developer works through git and needs no seat. |
| Hosting for the editing screen and the preview site | USD 0 | Subdomains on the Hostinger Business plan you already pay for. If the trial shows Hostinger can't run the editing screen: a free plan elsewhere, never a paid one. |
| GitHub | USD 0 | Free organisation plan, as today. GitHub Team is not needed. |
| GitHub Actions | USD 0 | 2,000 free minutes a month for private repos. GitHub's default spending limit is USD 0, so going over can't create a bill: runs would pause until the next month. I'll report usage in the first month of publishing and trim the workflows if it passes half. |
| Keyword research | USD 0 | Search Console, your Keyword Planner exports, "People also ask" |
| Safari testing | USD 0 | Playwright's WebKit in CI, your iPhone for the spot check |
| **Total new running cost** | **USD 0** | |

- **More than 3 editors later:** switch the CMS login to Keystatic's
  GitHub-login mode, which is free with no user limit. Each editor then needs a
  free GitHub account with access to the repository; they still only ever use
  the CMS screen. Because that access would let a technical person change files
  outside the CMS, the content-only guard matters more in that mode; it stays
  in force. Paid Keystatic seats (USD 10 a month plus USD 5 per user above
  three) would only be raised with you after that.
- **Caveat:** free tiers are the vendors' to change. Prices and limits are from
  their own pages on 6 Oct 2026 and are checked again at sign-up; if any stops
  being free I stop and ask, as the standing rule on paid services requires.

---

## 12. Decisions

None are open. Every answer is in "Decisions recorded" at the top.

Working assumptions, unless you say otherwise: blog addresses are
`/blog/<slug>/`; the service URLs in section 2 stand until the keyword map
suggests better; the homepage and `/services` say seven services; case studies
appear inside industry, service and results pages first and get their own pages
in stage 4.

---

## 13. What I need from you

### For the keyword map

1. **Keyword Planner exports.** A Google Ads account is free and needs no
   running campaign. Steps: Google Ads → Tools → Keyword Planner → "Discover
   new keywords" → paste the seed list I'll send (about ten at a time) →
   location United States → download the CSV. Then the same again with location
   Texas. About 30–40 minutes in total. Put the files in
   `docs/seo/keywords/exports/` or send them. The seed list is in the
   developer's message of 6 Oct and will be saved beside the map.
2. ~~Your OK to read Search Console~~ Given 6 Oct 2026.
3. **The words your prospects use.** Ten minutes of notes: what clinic owners
   say they need on a first call, the questions they ask most, what they
   searched before finding you, and what they call each service.
4. **Priorities:** which of the seven services you most want more of, and which
   specialties and Texas cities you have real clients in.
5. Any competitors or agencies you see prospects comparing you with.

### For the money pages

6. ~~Which `/results/` cases are real~~ Answered 6 Oct 2026: all four, with
   permission on file.
7. **Per service:** one real client example (numbers, period, and whether the
   clinic may be named or must be anonymous), and how you actually deliver it,
   step by step, in your own words. A voice note is fine.
8. **Per industry:** a real case study, the questions those owners ask, the
   treatments you build campaigns around, and the practice software you've
   worked with for a client in that specialty.

### For the first posts

9. Pick three of the six topics I'll propose from the map.
10. For each: 15 minutes of raw material from whoever knows it best: what you
    did for a real clinic, what happened, the numbers, what you'd tell an owner
    to do differently. Bullet points or a voice note.
11. **The author** of each post: a real team member, with a bio (two sentences
    and a longer paragraph) and a photo. The About photos are already an open
    to-do; one set covers both.
12. Permission, in writing from the client, for anything that names or could
    identify a clinic.

### Accounts and setup (your logins; steps given at the time)

| Item | Stage | Your time |
|---|---|---|
| Keystatic Cloud account | 0 | 10 min |
| Google Ads account for Keyword Planner | 1 | 10 min, plus the exports |
| GA4: the "AI assistants" channel group | 2 | 10 min |
| Three GA4 custom dimensions | 3 | 10 min |
| Add Ahmed Mustafa as a second GitHub owner | Now | 5 min |
| Clarity data-export token, if the weekly review uses it | 6 | 5 min |
| Hostinger API token → GitHub secret | 4 | 10 min |
| `cms.` and `preview.` subdomains, with SSL | 0 (test), 4 | 15 min |
| The editor's name; invite them | 4 | 5 min |
| Security checklist | 5 | About 1 hour |
| iPhone check per code release | 2 onward | 10 min each |

---

## 14. Risks

| Risk | How it's handled |
|---|---|
| Real material arrives slowly, so pages stall | The map's "what only we can say" column shows which pages are ready; pages are written in the order material exists, not held in a queue behind a missing one |
| Pages that read alike (seven services, four industries) | Section 3: the similarity check, the note with every draft, and no page without its own real example or process |
| Search results are slow or don't come | Long-tail early wins first; monthly Search Console review; no ranking is promised |
| Keystatic is not yet 1.0 | The trial; content is plain files, so changing CMS later means rebuilding forms, not migrating content; version pinned and reviewed quarterly |
| A free tier ends | Content is unaffected; GitHub-login mode is the free fallback for logins; I stop and ask before any cost |
| An editor publishes something a machine can't catch (an invented number, an AI-made image) | The owner's approval on posts and case studies, permission records, the editor guide, the monthly review, rollback. Switching the approval setting off accepts more of this risk; that is your call to make later. |
| A stolen editor login | Two-factor sign-in; the content-only guard; posts and case studies still need the owner |
| Automatic deploys go wrong | Nothing deploys unless every check passes; live pages are checked after each deploy; rollback is one action; uptime monitors already email |
| The permanent Hostinger token leaks | Stored only as a GitHub secret, never printed; scoped as narrowly as Hostinger allows; rotation steps in the maintenance doc |
| Existing pages shift when their SEO fields move into content files | The screenshot comparison must show zero change |

## Sources for the CMS comparison

Checked 6 Oct 2026: [Keystatic Cloud](https://keystatic.com/docs/cloud),
[Keystatic GitHub mode](https://keystatic.com/docs/github-mode),
[Keystatic and static sites (maintainers' discussion)](https://github.com/Thinkmill/keystatic/discussions/826),
[TinaCMS pricing](https://tina.io/pricing).
