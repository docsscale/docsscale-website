# Project completion plan

Status: **proposal, waiting for the owner's approval.** Written 6 Oct 2026 against
production v1.4.4. Nothing in this plan has been built. When it is approved, this
file becomes the working plan and gets a status tracker at the top, updated in
every release PR like the one in [PHASE5-PLAN.md](PHASE5-PLAN.md).

## The short version

- **Goal:** writers and an SEO person publish and maintain content themselves,
  in a browser, with no code and no GitHub knowledge. The developer is only
  needed for real development.
- **CMS: Keystatic, as you prefer, with one condition.** Its editing screen
  cannot run on a purely static host, so it gets its own small address
  (`cms.docsscale.com`). The public site stays exactly as static as it is today.
  A one-day trial proves the open points before anything else is built; TinaCMS
  is the fallback. Details in section 1.
- **Publishing:** an editor saves, sees the change on a private preview site,
  marks it "Published", and it is live in about ten minutes if every check
  passes. If a check fails the live site is untouched and the editor gets an
  email saying what to fix. Every publish is a git commit, so any of them can be
  undone.
- **Effort:** about 31–40 working days of build, in seven phases. Editors can
  publish blog posts at the end of phase 3 (about day 17).
- **Cost:** USD 0–20 a month, depending on how many editors there are. No other
  new paid service is required.
- **From you:** nine decisions (section 9), about three hours of account setup
  spread over the project, and content only you have (bios, photos, case-study
  permissions).

What this plan does **not** cover, because you didn't ask for it here: the
lead magnets app at get.docsscale.com (5D), the newsletter (5F), keyword
research and the rewriting of page copy (the content half of 5C), and the
90-day content plan (5G). They stay in [PHASE5-PLAN.md](PHASE5-PLAN.md). This
plan builds the tools those phases will use.

---

## 1. CMS: Keystatic or TinaCMS

### What each one is

Both keep content as files in our GitHub repository and both are open source.
Neither puts a database behind docsscale.com. They differ in where the editing
screen runs and who looks after logins.

| | **Keystatic** | **TinaCMS** |
|---|---|---|
| Content storage | Files in our repo (Markdown, YAML, JSON). Nothing else holds a copy. | Files in our repo. Tina's cloud service also keeps a searchable copy in its own database to run the editor. |
| Editing screen | Forms with a rich-text editor. No on-page editing. | Forms, plus editing on a live copy of the page ("visual editing"). |
| Where the editing screen runs | **Needs a small server program.** It cannot be part of our static site. It would run at its own address, separate from docsscale.com. | Plain files that can sit on Hostinger next to the site. No extra hosting. |
| Editor login without GitHub | Yes, through Keystatic Cloud (email and password). | Yes, through Tina's cloud service. |
| Running it with no vendor service at all | Possible, but then every editor needs a GitHub account. | Possible, but it then needs a database and a server, which you've ruled out. |
| Cost | Free for up to 3 users. Above that USD 10 a month plus USD 5 for each user beyond three. | Free for 2 users. USD 24 a month for 3 users; USD 41 a month for 5 users with drafts and review. |
| Preview before publishing | A "Preview" button that opens the page on our private preview site (we build this). | Live on-page preview while typing, plus branch previews on the USD 41 plan. |
| Change to our site's code | Small: pages read content files at build time, as they read `web/src/content/*.ts` today. | Larger: every editable page is wrapped in Tina's editing code and reads through Tina's generated data layer. More risk to the pixel-identical pages. |
| Trace on the public site | None. The public build contains nothing from the CMS. | The editor's files sit under `/admin/` on docsscale.com and name the product. |
| Maturity | Version 0.5, not yet 1.0. Made by Thinkmill, an established agency. Releases are infrequent. | Version 2+, a funded company, frequent releases. |

Prices and limits are from the vendors' own pages on 6 Oct 2026 and must be
checked again at sign-up.

### Recommendation: Keystatic

Reasons, in order of weight:

1. **Our content stays only in our repo.** If Keystatic Cloud disappeared
   tomorrow, the site would still build and deploy, and we could switch the
   login method or the CMS without migrating anything. With Tina, the editor
   stops working without its cloud database.
2. **It leaves the site's code almost alone.** The pages were rebuilt
   pixel-for-pixel and are covered by 54 screenshot checks. Keystatic only adds
   content files; Tina reaches into the pages.
3. **Structured fields only** is how Keystatic works by default, which is what
   you asked for. There is no page builder to switch off.
4. **Cheaper** at every team size we're likely to have.
5. **Nothing about the CMS appears on the public site.**

What you give up: Tina's on-page visual editing. For blog posts, team members,
FAQs and SEO fields, a form with a preview button is enough; visual editing
matters most for free-form landing pages, which you've excluded.

### The condition, stated plainly

Keystatic's editing screen needs a small server program to talk to GitHub. Our
Hostinger site is static files plus one PHP script, so the editing screen has to
live somewhere else. Two ways to do that, both free:

- **(a) On Hostinger, as a small Node.js app** at `cms.docsscale.com`, if your
  hosting plan includes Node.js apps. No new account. **Unknown: whether your
  plan includes this.** I will check through the Hostinger connector during the
  trial, with your OK.
- **(b) On a free static-and-functions host** (Cloudflare's free plan allows
  commercial use). This is a new account, which you would create.

Either way: the public site has no server and no database, visitors never touch
`cms.docsscale.com`, and if it goes down the only effect is that editors can't
edit until it is back.

### One-day trial before committing (phase 0)

On a throwaway branch, never deployed to production, I will prove four things:

1. An editor signs in with an email address and no GitHub account, and a save
   arrives in our repo as a commit.
2. The editing screen runs at a separate address (option a or b).
3. The SEO fields can show live length warnings as you type (this needs a
   custom field, which Keystatic supports but documents thinly).
4. An uploaded image lands in the repo and comes out optimised in the build.

If any of the four fails, I come back with the evidence and we use TinaCMS
instead; the rest of this plan stays the same apart from about 3 extra days for
Tina's deeper integration. A third option worth knowing about if both
disappoint: Pages CMS, also open source, with email invitations and no hosting
on our side, but a plainer editor.

---

## 2. What editors can change

All of it through forms with fixed fields. Each item below is a "collection"
(many entries) or a "single" (one settings form).

### Blog

| Item | Fields | What the site does with it |
|---|---|---|
| **Posts** | Title, URL slug, summary, body (headings, lists, links, images with required alt text, quotes, tables), category, author, publish date, status (Draft / Published), optional custom social image, optional FAQ, SEO block | Post page with table of contents, author box, related posts and call-to-action; listed on the blog index, its category page and its author page |
| **Categories** | Name, slug, short description, SEO block | A page per category |
| **Authors** | Taken from Team members (below) | A page per author who has at least one published post |
| Related posts | Automatic (same category, newest first); an editor can pin up to three by hand | |
| Social image | Made automatically at build time from a branded template with the post title; a custom upload replaces it | |
| Schema | BlogPosting, Person, BreadcrumbList, and FAQPage when the post has an FAQ | Automatic |
| RSS | `/blog/rss.xml` | Automatic |

### SEO block (on every post, category, case study, resource, and every existing page)

| Field | Check while typing | Check before publishing |
|---|---|---|
| Page title | Counter; amber over 55 characters, red over 60 | Required; unique across the site |
| Meta description | Counter; amber under 120 or over 150, red over 160 | Required; unique |
| URL slug | Lower-case letters, numbers and hyphens only | Unique; changing a published slug requires a redirect, which is created automatically |
| Social image | Size shown | 1200 × 630 minimum, or the automatic one is used |
| Image alt text | Counter | Required for every image that isn't marked decorative |
| FAQ (optional) | Question and answer pairs | Shown on the page and added as FAQPage schema; never schema without the visible FAQ |
| Hide from search engines | A tick box, with a warning | Removes the page from the sitemap and adds `noindex` |

For the **existing pages** (home, services, industries, how it works, results,
about, book a call, legal pages, funnel), the SEO block becomes editable. Their
body copy and layout stay in code, as you asked ("page layouts out of the
CMS"). See decision 4 in section 9 if you want specific sections of existing
pages opened up later.

### Case studies and testimonials

- **Case studies:** clinic name (or "Anonymous dental clinic, Texas"),
  specialty, services used, the problem, what we did, results as
  label-and-number pairs with the period they cover, optional quote, images,
  SEO block.
- **Testimonials:** quote, person's name and role, clinic, specialty, optional
  photo.
- **Both have a "Permission confirmed" box**, with who gave permission and the
  date. The form won't let an entry be set to Published without it, and the
  build checks it again, so an entry can't go live by any route with the box
  unticked.
- The "no invented data" rule can't be checked by a machine. It goes in the
  editor guide as a rule, and the permission record is the audit trail.

### Everything else

| Item | Fields | Used on |
|---|---|---|
| **Team members** | Name, role, short and long bio, photo, optional profile links, "writes for the blog" tick box, display order | About page, author boxes, author pages, Person schema |
| **FAQs** | Question, answer, which page or pages it appears on, order | The chosen pages, with FAQPage schema |
| **Free resources** | Title, description, who it's for, what's inside, image, link, status | A `/resources/` page (new; design needs your approval) |
| **Site settings** | Contact email, announcement bar (on/off, text, link, end date), footer link groups | Header, footer, schema |
| **Redirects** | Old URL, new URL, note | Section 5 |

### Deliberately not in the CMS

Forms and their fields, tracking and consent, the CRM connection, the lead
handler, page layouts and design, the navigation menus' structure, hosting, DNS
and deploy settings. These stay with the developer and the approval rules in
[CLAUDE.md](../CLAUDE.md).

### How the brand rules are kept when editors publish

| Rule | How it is enforced |
|---|---|
| No AI wording, tool names or generator tags in public files | The brand-rule check (a Phase 5A leftover) is built in phase 1 and blocks the publish |
| The CRM platform is never named outside the Free System funnel | Same check |
| Never "new", "startup", "recently launched" | Same check, on phrases about DocsScale |
| No invented data; examples labelled as examples | Editor guide and the permission box; not machine-checkable |
| No AI-generated or AI-edited images; third-party images have a recorded source and licence | Every uploaded image has required "Source" and "Licence" fields; the build writes them to the image record. Whether an image is AI-made can't be detected reliably, so that part is a rule in the guide |
| Plain language | Editor guide |

---

## 3. How publishing works

### For an editor

1. Sign in at `cms.docsscale.com` with email and password.
2. Create or edit an entry and press **Save**. Status is "Draft" by default.
3. Press **Preview**. A few minutes after saving, the page is on the private
   preview site (password-protected, hidden from search engines), drafts
   included.
4. Change the status to **Published** and save.
5. About ten minutes later it is live. If a check fails, nothing changes on the
   live site and the editor and the owner get an email naming the entry and the
   problem in plain words ("The meta description of 'X' is missing").

**Honest limit:** a draft can be previewed before it is published. An edit to
something that is *already* published goes live after the checks, without a
separate preview step, unless the editor first sets it back to Draft (which
takes the page offline) or uses "Duplicate". If you want preview-then-approve
for edits to live pages too, that is possible with a slightly more involved
"working copy" flow; it is decision 5 in section 9.

### Behind the scenes

1. A save in the CMS is a commit to the repo by the CMS's own identity.
2. A GitHub workflow looks at what changed.
   - **Only content files** (the content folder and uploaded images): continue.
   - **Anything else**: stop. Nothing is deployed automatically. This is the
     guard that keeps "code needs the owner's approval" true even if an editor's
     login were stolen: a CMS login can only ever publish content.
3. The workflow runs the checks: build, content rules (required fields,
   permission box, unique titles and slugs), redirect validation, brand-rule
   check, link checker, structured-data check, accessibility check on the
   changed pages, image size limits, and the behaviour tests.
4. Green: it deploys the preview site (with drafts) and production (without),
   clears the Hostinger cache, checks the live pages answer, and records the
   new visual baseline.
5. Red: no deploy. The failing commit is reverted automatically by a new commit
   (history is never rewritten), and the email goes out.

Two details you should know:

- **The screenshot comparison is not run against content changes.** It exists to
  catch unintended visual changes from code. A content edit such as the
  announcement bar changes pages on purpose, so for content-only publishes the
  baseline is re-recorded automatically after the other checks pass.
- **While an approved code release is merged but not yet deployed**, content
  publishing waits, so that a content publish can never carry undeployed code to
  production. In practice that window is minutes.

### Rollback

- **One entry:** the CMS doesn't have an "undo publish" button, so the workflow
  gets one: a "Roll back content" action in GitHub that the owner or developer
  runs, choosing a publish from a list. It reverts that commit and republishes.
- **Everything:** deploy an earlier tag, as in [RELEASE.md](RELEASE.md).
- Editors who are unsure can ask the developer; the editor guide says so.

### What this needs

- **A permanent Hostinger API token stored as a GitHub secret**, so GitHub can
  upload. You decided this on 27–28 Sep 2026 (PHASE5-PLAN, "Blog publishing").
  You create it and paste it into GitHub; I never see it.
- **A `preview.docsscale.com` subdomain** with a password, so content previews
  don't collide with staging, which stays for reviewing code changes.
- **GitHub Actions minutes.** The free plan includes 2,000 a month for private
  repos; a publish takes roughly 10, so about 200 publishes a month before any
  cost. To verify in phase 1.

### The rule change in CLAUDE.md

Section 1 of [CLAUDE.md](../CLAUDE.md) gets a new, clearly bounded exception.
Proposed wording, to go in with the phase 1 PR once you approve this plan:

> **Content published from the CMS** is the one exception to the rules above.
> A change made in the CMS that touches only `content/` and
> `web/public/uploads/` goes live automatically once every CI check passes, with
> no pull request, before/after or go-ahead. Everything else, including any
> change to what the CMS can edit, to the checks, or to the publish workflow
> itself, follows the rules above without exception. The developer never uses
> the CMS route to ship code or copy.

The brand rules (section 2 of CLAUDE.md) are not relaxed; they are enforced by
the checks and the editor guide.

---

## 4. Automatic SEO

| What | How |
|---|---|
| **Sitemap** | Generated at build time from the real pages instead of the hand-kept file. New posts, categories, authors, case studies and resources appear automatically; "hide from search engines" and drafts are left out; `lastmod` comes from each page's last change (this also fixes review item SEO-2). |
| **Schema** | Generated from the content: BlogPosting, Person, FAQPage, BreadcrumbList, ItemList for resources, and the existing Organization and Service. A check validates the JSON-LD of every page on each publish. |
| **Images** | An editor uploads one file (up to a set size, for example 5 MB). The build makes AVIF and WebP versions at several widths, strips location and camera data, and writes width and height into the page so nothing jumps. Oversized or wrongly shaped uploads are refused with a plain message. |
| **GA4 grouping** | Blog pages are sent with content group "Blog" and with the post's slug, category and author, so GA4 can report by post, category and author. |
| **Leads per post** | The browser tab already remembers the landing page and UTMs. It will also remember the first and the most recent blog post read, and send both with `generate_lead` and `book_call`. GA4 then shows which post brought each lead. Same consent rules as today: nothing is sent before "Accept". |
| **Leads per post in the CRM** (optional) | The lead handler can forward the post to a new CRM field. That needs you to create the field, and is a lead-handler change with the usual QA lead. Decision 7. |
| `robots.txt`, `llms.txt` | `llms.txt` gains a generated list of published posts; no other change. |

You will need to add three custom dimensions in GA4 admin (post, category,
author); click-by-click steps come with that phase. This sits alongside the
GA4 admin to-do that is already open.

---

## 5. Redirects that can't break the site

An editor fills in "Old URL" and "New URL". They never write server rules.

**Checked on save and again before publishing:**

- Both are valid paths on docsscale.com (or a full `https://` address for the
  target); no spaces, no query strings or `#` in the old URL.
- The old URL is not a page that currently exists.
- The old URL is not protected: the homepage, `/send-lead.php`, `/_server/`,
  anything under `/free-system/` (live ads point there), the sitemap, robots
  and the existing `/services/<industry>/` rules.
- No loops (A → B → A) and no chains (A → B → C is rewritten as A → C and
  B → C, and the editor is told).
- No duplicates, and the new URL is a real page or an allowed outside address.

**Then:**

- The server rules are generated into a marked block of `.htaccess`. Every
  character an editor typed is escaped, so nothing they enter can be read as a
  rule.
- The complete `.htaccess` is started in a real Apache server inside CI and
  every redirect, old and new, is requested and checked: one hop, right target,
  query string kept. If the file doesn't load or any check fails, nothing is
  deployed.
- Changing the slug of a published page creates its redirect automatically.
- After deploying, the existing `tests/server/redirects.sh` runs against the
  live site.

---

## 6. Finishing the agency review, Safari testing and accessibility

### Review items still open

| Item | What | Visible | Note |
|---|---|---|---|
| 4 (FE-1) | Slow hero on phones | Yes, subtle | Decide at the 15 Oct Web Vitals review, as already agreed. Build only if real-user numbers confirm it. |
| 8 (QA-2, QA-3) | `<header>`/`<footer>` landmarks, skip link, `autocomplete` on form fields | Skip link on keyboard focus only | Before/after for the skip link |
| 9 (BE-3) | Back up rate-limited submissions | No | Lead-handler change: PHP tests and one QA lead |
| 10 (QA-5) | Safari engine in CI, iPhone check | No | Below |
| PM-4, PM-6 | "Historical" banners on three old docs; client guide brought up to date | No | The client guide is replaced by the editor guide (section 7) |
| 5A leftovers | Brand-rule check, link checker | No | Built in phase 1 because publishing depends on them |
| 5A leftovers | SSL-expiry monitors, DMARC tightening | No | SSL: a weekly scheduled check in GitHub that emails if a certificate has under 21 days left (free). DMARC: follows the 20 Oct review. |

The review also listed lower-priority findings that were never scheduled
(among them UX-3 visible form labels, UX-4, UX-5, UX-7, FE-2, BE-4, BE-5, BE-6,
QA-4, AR-2, AR-4, AR-5, AR-6, SEO-3). **Unknown: which of these have since been
fixed in passing.** The first task of phase 5 is to check each against the
current code and give you a short list of what is left, with my recommendation
to fix or to close as "accepted". FE-3 (large components, inline styles) I
recommend closing as accepted, with the existing rule "tidy a page when it next
changes".

### Safari and iPhone

- **In CI:** install Playwright's WebKit engine (you approved the download) and
  run the behaviour tests (forms, menus, consent, tracking, hero) on it at
  iPhone and desktop Safari sizes, on every push. Screenshot comparison stays
  Chromium-only, to keep one baseline.
- **Honest limit:** Playwright's WebKit is the same engine as Safari but not
  Safari on a real iPhone. It catches most Safari-only bugs, not all.
- **Real iPhone:** a ten-minute checklist per code release, done on your phone,
  added to [QA-CHECKLIST.md](QA-CHECKLIST.md). A paid device-testing service
  (roughly USD 30–40 a month) would automate this; I don't recommend it at this
  size.

### WCAG pass

Target: **WCAG 2.2 level AA** on every page, including the new blog and
resource templates.

1. Automated: axe-core on every page at phone and desktop width, added to CI as
   a permanent check (today it was a one-off for the review).
2. By hand: keyboard-only walk through every page and form, VoiceOver on Mac
   and iPhone, 200% and 400% zoom, reduced motion, colour contrast with
   animations settled.
3. Fixes: invisible ones go straight to a PR; visible ones (visible form labels
   are the likely big one) come to you as before/after first.
4. Editors can't break it: required alt text, heading levels enforced in the
   post editor (no skipped levels, one H1 from the title), link text check
   ("click here" is flagged).
5. Result written up in `docs/ACCESSIBILITY.md`: what was tested, what passed,
   any known exceptions. I will not write "fully compliant"; automated and
   manual checks reduce risk but only an independent audit can certify.

---

## 7. Handover package

| Document | Contents |
|---|---|
| **`docs/EDITOR-GUIDE.md`** | For someone who has never used a CMS or done SEO. Signing in; writing a post start to finish; images and alt text; categories and authors; the SEO block field by field, with what a good title and description look like; preview and publish; what the error emails mean; case studies and the permission box; team members, FAQs, resources, site settings; redirects; "what never to publish" (the brand rules in plain words); who to ask. Real screenshots of our CMS at each step, taken automatically so they can be refreshed when the screens change. Ends with a **one-page per-post SEO checklist**. |
| **`docs/ACCESS.md`** | One table: CMS, GitHub, Hostinger, Search Console, GA4, Bing Webmaster, Clarity, UptimeRobot, the CRM. For each: who owns it, who else has access and at what level, how to add a person, how to remove one, and what to do the day someone leaves. Names only, never credentials. I will need the current list of people from you; anything I can't verify is written as "Unknown". |
| **`docs/SECURITY-CLEANUP.md`** | A tick list for you, in order: (1) rotate the CRM token on the server ([SERVER.md](SERVER.md) has the steps); (2) new Bing API key; (3) reset the UptimeRobot key; (4) update the files in `~/DocsScale-Secure/`; (5) delete the session logs in `~/.claude/projects/-Users-abdulsamad-Downloads-docsscale/`, **keeping the `memory` folder inside it**; (6) two-factor sign-in on GitHub (required for the whole organisation), Hostinger, Google, Microsoft, the CRM, UptimeRobot and the CMS; (7) a second owner on the GitHub organisation; (8) check for old copies of `lead-debug-log.txt` (HANDOVER to-do 2). Rotating before deleting means a leaked copy is already useless. I can't do these for you: they are your accounts and passwords. |
| **`docs/MAINTENANCE.md`** | A monthly routine of about an hour, split by role. Editor/SEO: Search Console coverage and queries, broken-link report, top and falling posts, refresh one old post. Owner: uptime and failure emails, DMARC reports, who has access, a lead-backup download. Developer (quarterly): dependency updates, CMS version, certificate and token expiry, restore test from a backup. |

Also updated: CLAUDE.md (the publishing rule, where content lives),
ARCHITECTURE.md, RELEASE.md, TRACKING.md, HANDOVER.md, SESSION-HANDOFF.md.

---

## 8. Order of work, effort and cost

Each phase is one or more PRs. Code PRs follow today's rules: CI green,
before/after for anything visible, your go-ahead to merge and to deploy.

| Phase | What | Build days | Visible on the live site | Needs from you |
|---|---|---|---|---|
| **0** | CMS trial (section 1). Nothing deployed to production. | 1 | No | Keystatic Cloud account; OK to check the Hostinger plan |
| **1** | Foundations: content folder and its rules; brand-rule check; link checker; sitemap and schema generated at build; image pipeline; publish workflow with the content-only guard, preview site, auto-revert and emails; CLAUDE.md rule | 5–6 | No (sitemap dates only) | Hostinger API token as a GitHub secret; `preview.` subdomain; approve the rule wording |
| **2** | CMS live for what already exists: SEO block for every existing page, site settings, team members, FAQs, redirects with validation | 5–6 | Announcement bar and anything else new gets a before/after; existing pages must come out pixel-identical | Team bios and photos; approve before/after |
| **3** | Blog: index, post, category and author pages, related posts, social images, RSS, schema, GA4 grouping and lead attribution | 7–9 | **Yes: new pages.** Design shown for approval before build-out. | Approve the design; three GA4 custom dimensions; one real first post |
| **4** | Case studies, testimonials (permission box), free resources page | 4–5 | **Yes** | Approve the design; real case studies with permission, or the pages launch empty and unlisted |
| **5** | Agency review leftovers, Safari in CI, WCAG pass | 5–7 | Skip link; possibly form labels | Approvals; one QA lead to delete after BE-3; iPhone check |
| **6** | Handover: editor guide with screenshots, access list, security checklist, maintenance routine; a one-hour walkthrough with the first editor, and fixes from what confuses them | 4–6 | No | People list for the access doc; do the security checklist |
| | **Total** | **31–40** | | |

- **Calendar time:** about 7–9 weeks, driven mostly by how quickly approvals
  and content (bios, photos, case studies) arrive, as in earlier phases.
- **Why this order:** the trial first, so a wrong CMS choice costs one day.
  Foundations before the CMS, because automatic publishing is only safe once
  the checks exist. Existing content before the blog, so the pipeline is proven
  on pages that already work. Phase 5 is independent and can move earlier if
  you'd rather have the accessibility work first; item 4 (FE-1) follows the
  15 Oct review regardless.
- These are build-effort estimates like the ones in PHASE5-PLAN, not a quote.
  Hours and budget are not tracked in this repository.

### Running cost

| Item | Monthly | Note |
|---|---|---|
| Keystatic Cloud | USD 0 for up to 3 users; USD 10 + USD 5 per user above three (for example 5 users: USD 20) | Verify at sign-up |
| Hosting for the editing screen | USD 0 | On your Hostinger plan if it runs Node.js apps, otherwise a free plan elsewhere |
| GitHub Actions | USD 0 expected | Within the free 2,000 minutes at up to about 200 publishes a month |
| GitHub Team (optional) | USD 4 per GitHub user | Lets GitHub itself enforce "checks must pass" on `main`. Recommended once a second developer joins, as HANDOVER already says. Editors don't count: they have no GitHub accounts. |
| Real-device Safari testing (optional) | About USD 30–40 | Not recommended now |

---

## 9. What I need from you

### Decisions

1. **Approve this plan and the order**, or say what to change.
2. **CMS:** Keystatic with the separate editing address and the one-day trial
   (recommended), or go straight to TinaCMS.
3. **Where the editing screen runs:** Hostinger if your plan allows it
   (preferred), otherwise a new free account that you create. May I check your
   plan through the Hostinger connector? Read-only.
4. **Existing pages:** SEO fields only (this plan), or should some body copy
   also become editable? Each page opened up is roughly 1–2 extra days, because
   its copy has to move out of the large components first.
5. **Edits to pages that are already live:** publish straight after the checks
   (this plan), or preview-and-confirm every time (about 2 extra days, one more
   step for editors)?
6. **How many editors at the start, and who?** This sets the Keystatic cost and
   the access list.
7. **Leads per post in the CRM** as well as in GA4? Needs a new CRM field
   created by you.
8. **Who is the second GitHub owner?**
9. **Who gets the "publish failed" emails** besides the editor: info@, you, or
   both?

### Accounts and setup (your logins; click-by-click steps when we get there)

| Item | Phase | Your time |
|---|---|---|
| Keystatic Cloud account; invite editors | 0, 2 | 15 min |
| Hostinger API token → GitHub secret | 1 | 10 min |
| `preview.docsscale.com` and (if on Hostinger) `cms.docsscale.com`, with SSL. DNS changes shown to you first | 1 | 15 min |
| Three GA4 custom dimensions | 3 | 10 min |
| Optional CRM field for the post | 3 | 5 min |
| Security checklist | 6 | About 1 hour |
| iPhone check per code release | 5 onward | 10 min each |

### Content only you have

- Team bios and photos (the About photos are still an open to-do).
- Case studies and testimonials with the client's permission.
- The first real blog post, to launch the blog with. I can prepare outlines and
  SEO briefs; the writing is your team's.

---

## 10. Risks

| Risk | How it's handled |
|---|---|
| Keystatic is not yet version 1.0 and is updated infrequently | The trial; content is plain files, so changing CMS later means rebuilding forms, not migrating content; version pinned and reviewed quarterly |
| Keystatic Cloud changes its price or closes | Fallback login through GitHub accounts exists; content is unaffected |
| An editor publishes something off-brand that a machine can't catch (invented numbers, an AI-made image) | Editor guide, permission records, the monthly review, one-click rollback. This is a real trade-off of removing your approval from content, and no check removes it entirely |
| A stolen editor login | Two-factor sign-in; the content-only guard means it can change words and images but not code, forms, tracking or redirects into protected paths |
| Automatic deploys go wrong | Nothing deploys unless every check passes; live pages are checked after each deploy; rollback is one action; the uptime monitors already email on failure |
| The permanent Hostinger token leaks | Stored only as a GitHub secret, never printed; scoped as narrowly as Hostinger allows; rotation steps in the maintenance doc |
| Existing pages shift when their SEO fields move into content files | The screenshot comparison must show zero change in phase 2 |

## Sources for the CMS comparison

Checked 6 Oct 2026: [Keystatic Cloud](https://keystatic.com/docs/cloud),
[Keystatic GitHub mode](https://keystatic.com/docs/github-mode),
[Keystatic and static sites (maintainers' discussion)](https://github.com/Thinkmill/keystatic/discussions/826),
[TinaCMS pricing](https://tina.io/pricing),
[Pages CMS collaborators](https://pagescms.org/docs/configuration/collaborators/).
