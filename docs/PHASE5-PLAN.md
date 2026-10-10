# Phase 5: Growth — plan

Status: **in progress.** Approved in principle on 27 Sep 2026; v1.0 went live on 28 Sep 2026. Where each part stands is in the tracker below. The rest of this document is the plan as approved; it is not rewritten as things ship.

## Status tracker

**Last updated: 10 Oct 2026 (production is v1.8.1).** Update this table in every release PR. Details of each release are in [CHANGELOG.md](../CHANGELOG.md). Dates are production dates. Owner = who has to act next.

Hours and budget are not tracked in this repository (owner, 6 Oct 2026: that's fine); the only estimates are the build-effort figures in "Phase order" below.

### Phases

| Phase | Status | Done | Open | Owner |
|---|---|---|---|---|
| **5A** Measurement and safety | **Mostly done** | See the 5A table below | Brand-rule CI check, link checker, SSL-expiry monitors, DMARC tightening, GA4 admin setup | Developer; owner for GA4 admin |
| **5B** Site structure | **Partly done** | Services and Industries menus, `/industries/` hub and four industry pages, 301s from `/services/<industry>/` (v1.2.0, 30 Sep) | Real service pages (`/services/<service>/`); seven-vs-eight services wording ([BACKLOG.md](BACKLOG.md)) | Waits for the 5C keyword map |
| **5C** SEO / AEO / GEO | **Not started** (pause lifted 6 Oct 2026) | Search Console and Bing set up; sitemaps submitted; indexing requested by the owner for 9 of the 11 unindexed pages (6 Oct; `/privacy/` and `/terms/` can wait) | Keyword map, on-page, schema, FAQs, `llms.txt` rewrite, long page titles | Developer; owner approves copy |
| **5D** Lead magnets app | Not started | — | All | — |
| **5E** Blog | **Live** (v1.5.0, 8 Oct) | Blog templates, editing screen at `cms.docsscale.com`, private preview site, checks, feed, topic pages; first post published 8 Oct; "From the blog" on the home page, Blog in the footer, IndexNow, Publish from the editing screen switched on (v1.6.0, 9 Oct) | More posts at the agreed pace (the owner writes them); automatic social images | Owner for material and approvals; developer |
| **5F** Newsletter | Not started | — | All | — |
| **5G** Content plan | Not started | — | All | — |

### 5A item by item

| # | Item | Status | When |
|---|---|---|---|
| 1 | GA4 with consent banner | Done | v1.0–v1.1 (28 Sep) |
| 2 | UTM naming standard ([TRACKING.md](TRACKING.md)) | Done | 27–28 Sep |
| 2 | GA4 events `generate_lead`, `view_lead_magnet`, `book_call` | Done | v1.1 |
| 2 | More events: `cta_click`, `form_error`, email and phone link clicks | Done | v1.3.0 (5 Oct) |
| 2 | UTMs and landing page sent to the CRM with each lead | Done | v1.3.0 (5 Oct) |
| 2 | Real-user Web Vitals in GA4 | Done (not in the original plan) | v1.2.4 (2 Oct); first review 15 Oct |
| 2 | GA4 admin: key events, custom dimensions, Internal Traffic filter | **Open** | Owner ([HANDOVER.md](HANDOVER.md) to-do 3) |
| 3 | Google Search Console, sitemaps submitted | Done | 29–30 Sep |
| 4 | Bing Webmaster Tools, sitemap submitted | Done | 30 Sep; data check 7 Oct |
| 5 | Microsoft Clarity after consent, forms masked | Done | v1.3.0 (5 Oct) |
| 6 | Uptime monitoring: home, Free System funnel, booking calendar, lead endpoint | Done | 30 Sep |
| 6 | SSL-expiry monitors | **Open** | Not set up on the free plan |
| 7 | DMARC reports to dmarc@docsscale.com (`p=none`) | Done | 29 Sep |
| 7 | DMARC to `quarantine`, then `reject` | **Open** | Review 20 Oct |
| 8 | Brand-rule CI check | Done | v1.4.6 (7 Oct), part of the site checks |
| 8 | Link checker in CI | Done | v1.4.6 (7 Oct), part of the site checks |
| — | Daily email when a lead fails to reach the CRM | Done (not in the original plan) | v1.2.2 (1 Oct) |

### Agency review, top 10 ([AGENCY-REVIEW.md](AGENCY-REVIEW.md))

| # | Item | Status |
|---|---|---|
| 1 | BE-1: save the lead before calling the CRM; time budget | Done, v1.2.1 (30 Sep) |
| 2 | BE-2 / AR-3: failure email and uptime monitoring | Done, v1.2.2 (1 Oct) and 30 Sep |
| 3 | QA-1: form messages reach screen readers | Done, v1.2.3 (1 Oct) |
| 4 | FE-1 / FE-4: slow hero on phones; real-user Web Vitals | Measuring since v1.2.4; decision at the 15 Oct review |
| 5 | UX-1: homepage placeholders | Hero done (v1.4.0–v1.4.1, 5 Oct); ad preview done (v1.4.2, 6 Oct); About team photos still initials |
| 6 | PM-1 / PM-2: this tracker | Done, 6 Oct |
| 7 | AR-1 / SEO-1: old industry-page files still served | Done, v1.4.3 (6 Oct): redirected; the 30 old page files, 138 old build files and five empty folders deleted with the owner's approval |
| 8 | QA-2 / QA-3: landmarks, skip link, autocomplete | Open |
| 9 | BE-3: back up rate-limited submissions | Open |
| 10 | WebKit in CI and an iPhone spot check | Open (engine download approved) |
| — | PM-4, PM-6: out-of-date docs, client guide for v1.2 | Open |

### Decisions from section 0 ("Needs your decision")

| Question | Answer |
|---|---|
| "GoHighLevel" in the funnel's name and copy | **Answered (27–28 Sep):** the funnel is the "Click-to-Chair System"; GoHighLevel is named only in details a buyer needs. |
| Analytics tags in the page source | **Answered in practice:** GA4 (v1.0) and Clarity (v1.3.0) were approved and are live. |
| Integrations strip on the homepage | **Answered (owner, 6 Oct 2026):** keep it, as plain platform names with no official logos, listing only platforms we actually work on for clients. The list is Google Business Profile, Meta Ads, Google Ads and Instagram, matching the confirmed services (paid ads on Meta and Google, local SEO and Google Business Profile, social media management); TikTok is removed. |
| CMS images | No decision needed until 5E. |

## Decisions recorded (27–28 Sep 2026)

| Topic | Decision |
|---|---|
| Services | **Confirmed:** the seven services below (5B), grouped by Attract, Capture, Convert, Retain. |
| Industries | We work with 9 specialties (dental, chiropractic, physical therapy, med spa, weight loss, dermatology, primary care, optometry, mental health), listed consistently site-wide. Dedicated industry pages only where we have real clients and results. |
| Region | Based in Houston. Website stays US-wide (industry and service pages any US clinic can find). Local layer: Google Business Profile, one Houston page, Texas mentions where natural. **No thin city pages**, only when there are real clients or case studies. |
| Regional campaigns | Ads, cold email and lead-magnet campaigns. Phase 1: Texas (Houston, DFW, San Antonio, Austin). Phase 2: Florida, Arizona, Georgia, North Carolina. Not California or New York for now. UTM region codes per campaign; compare after 90 days ([TRACKING.md](TRACKING.md#region-codes-regional-campaigns)). |
| Free system name | "Click-to-Chair System" (shipped in v1.1). GoHighLevel mentioned only in details buyers need. |
| Blog publishing | Hostinger API token stored as a GitHub secret (steps given at 5E). |
| Founding year | 2023. Never describe DocsScale as new, a startup or recently launched. |

Starts after v1.0 is live on docsscale.com (v1.0 is waiting on the round-5 approvals and the final go-ahead).

Same working rules as before:
- one branch and one commit per step;
- staging first;
- before/after for anything visible;
- approval for every visible copy change;
- no new paid service or infrastructure without asking.

---

## 0. Brand rule: what "no AI traces" means in practice

**The rule:**
- nothing public suggests the site is AI-built or that we rely on AI;
- AI crawlers stay allowed in robots.txt, for GEO citations.

**Already done (September 2026):**
- Audited every public file in the v1.0 build.
- The only leak was a tracing-tool comment inside `icon.svg` and the brand SVGs. It's removed (commit `92ed79d`).
- robots.txt names AI crawlers only to *allow* them, as you asked.
- No generator meta tag is emitted.

**How it's enforced from now on:** a CI check (Phase 5A) fails the build if any public file contains:
- AI wording (such as "AI", "artificial intelligence" or "generated") in copy;
- a generator meta tag or tool comment;
- known AI-vendor or tool names.

robots.txt is the only exception.

**Needs your decision:**

| Item | Where | Question |
|---|---|---|
| "GoHighLevel" in the funnel's title, description and copy | /free-system/ | The product *is* a GoHighLevel system, and the name has search value ("GoHighLevel snapshot for dentists"). It's a vendor name, though. **Keep it, or rename to "Free Patient-Getting System for Clinics"?** |
| Integrations strip (Google Ads, Meta Ads, Dentrix, Jane…) | Home hero | These are platforms clinics use, not tools we build with. I read the rule as covering AI and site-building tools, so I'd keep it. **Confirm.** |
| Analytics tags (GA4, Clarity) | Page source | Any analytics tag has to load from its provider's own domain; that can't be hidden. It doesn't suggest AI. **Confirm that's acceptable.** |
| CMS images (blog) | Page source | Solved by design: blog images are downloaded at build time and served from docsscale.com, so no CMS vendor URL appears in public HTML. |

---

## Phase order (by business impact and risk)

| Phase | What | Impact | Risk | Effort (build) | Your time |
|---|---|---|---|---|---|
| **5A** | Measurement and safety: GA4 + Consent Mode, Search Console, Bing, Clarity, uptime, email authentication, lead-source tracking | Enables every later decision | Low | 2–3 days | ~1 h of logins |
| **5B** | Site structure: service pages, /industries/, 301s, new header and mobile menu | High: organic leads per service and industry | Medium (URL moves) | 5–7 days | Copy approvals |
| **5C** | SEO / AEO / GEO: keyword map, on-page, schema, FAQs, llms.txt | High, compounding | Low | 4–6 days | Copy approvals |
| **5D** | Lead magnets app at get.docsscale.com, Free Resources page, redirects | Medium: cleaner funnel, repeatable magnets | **Medium-high: live ads point at /free-system/** | 4–5 days | ~30 min in hPanel |
| **5E** | Blog: CMS, templates, auto-publish pipeline | High long-term, slow to pay off | Medium (automated deploys) | 7–10 days | CMS signup, bios |
| **5F** | Newsletter: signups to GoHighLevel with double opt-in | Medium (needs blog content to feed it) | Low | 2 days | GHL workflow, ~20 min |
| **5G** | Ongoing: 90-day content plan, off-page, reviews | High, ongoing | Low | Plan: 2 days; then weekly | Writing and approvals |

**Why this order:**
- **5A first:** without measurement we can't tell whether 5B–5D help or hurt.
- **5B before 5C:** the keyword map needs the final URLs, so the structure change comes first.
- **5D after 5A:** the funnel carries paid traffic, so it moves only once tracking can show the redirect loses nothing.
- **5F after 5E:** a newsletter needs something to send.

Total build time is roughly **5–7 working weeks**, depending on review turnaround.

---

## 5A. Measurement and safety (2–3 days)

1. **GA4 with Google Consent Mode v2** (item 9 of v1.0, if the ID hasn't arrived by then)
   - a minimal consent banner in the site's style;
   - before/after shown for approval.
2. **Lead-source tracking** (the foundation for item 2's per-magnet reporting)
   - **UTM naming standard**, documented in `docs/TRACKING.md`. Values are generic words, never tool names:

     | Traffic | utm_source | utm_medium | utm_campaign |
     |---|---|---|---|
     | Meta ads | facebook / instagram | paid-social | `<magnet>-<yyyymm>` |
     | Google ads | google | cpc | `<magnet>-<yyyymm>` |
     | Cold email | outreach | email | `<magnet>-<list>-<yyyymm>` |
     | Newsletter | newsletter | email | `<issue-date>` |
     | Organic | *(no tags; GA4 classifies it)* | | |

   - **GA4 events:**
     - `generate_lead` with parameters `lead_magnet` (e.g. `free-system`), `form` and `page`;
     - `view_lead_magnet` on each landing page;
     - `book_call` on the booking confirmation.
   - A **custom dimension** `lead_magnet` gives the report "leads per magnet × source/medium".
   - **Cross-domain:** docsscale.com and get.docsscale.com share one GA4 property and one stream. GA4 handles subdomains of the same domain automatically, so a visitor stays one user.
   - **UTMs into the CRM:** the lead handler forwards `utm_*` and the landing page to GoHighLevel custom fields. Each contact then shows where they came from, not just GA4.
3. **Google Search Console**
   - A `google-site-verification` record already exists in DNS, so a property may already be set up. I'll check with you.
   - Add the Domain property (covers www, get. and every subdomain) and submit both sitemaps.
4. **Bing Webmaster Tools:** import from Search Console (one click), sitemaps included.
5. **Microsoft Clarity:** heatmaps and recordings, loaded only after analytics consent, with form fields masked (no personal data recorded).
6. **Uptime monitoring:** UptimeRobot free plan (50 monitors, 5-minute checks, email alerts) covering:
   - home;
   - /free-system/ (later get.docsscale.com);
   - the lead handler's health check;
   - booking.docsscale.com;
   - SSL expiry for all hosts.
7. **Email authentication.** Current DNS, checked 26 Sep 2026:
   - **SPF:** `v=spf1 include:_spf.mail.hostinger.com ~all`. OK for Hostinger mail only. If GoHighLevel sends email *as* @docsscale.com (confirmations, newsletter), its sending service must be added or it fails SPF.
   - **DKIM:** Hostinger keys present (`hostingermail-a/b/c`). GoHighLevel's sending domain needs its own DKIM records.
   - **DMARC:** `v=DMARC1; p=none` with **no reporting address**, so nobody sees failures. Plan:
     1. add `rua=` reports to a mailbox and watch for 2–4 weeks;
     2. move to `p=quarantine`;
     3. later move to `p=reject`.
   - **Best practice:** send newsletter and CRM mail from a subdomain such as `mail.docsscale.com`. Its reputation is then separate from info@ person-to-person mail.
8. **Brand-rule CI check** (section 0) and a **link checker** (no broken internal links, no redirect chains).

---

## 5B. Site structure and navigation (5–7 days)

### Services vs Industries
- **Services** = what we do. **Industries** = who we serve.
- Today's `/services/dental/` and the other three are industry pages.

**Our services (confirmed 28 Sep 2026): seven, grouped by the four stages.** Only services we deliver today.

| # | Stage | Service | One line | URL |
|---|---|---|---|---|
| 1 | Attract | Paid ads (Meta & Google) | Campaigns around one service line at a time, reported in booked appointments. | /services/paid-ads/ |
| 2 | Attract | Local SEO & Google Business Profile | Rank for the treatments you want more of, in the areas you serve. | /services/local-seo/ |
| 3 | Attract | Social media management | A month of posts planned in your voice, approved in ten minutes. | /services/social-media-management/ |
| 4 | Capture | Websites & landing pages | Fast, mobile-first pages built to turn a click into a booked request. | /services/websites-and-landing-pages/ |
| 5 | Convert | Lead follow-up & booking | Every inquiry answered in minutes (missed-call text-back, reminders) and moved onto the schedule. | /services/lead-follow-up-and-booking/ |
| 6 | Retain | Reviews & reputation | Review requests after every visit, replies handled. | /services/reviews-and-reputation/ |
| 7 | Retain | Reactivation & recall | Past patients invited back at the right time, in your name, without discounts. | /services/patient-reactivation/ |

Website design and funnel design are merged into one service (#4). URLs are proposals and follow the keyword map (5C).

**Industries:** the four with pages today (dental, chiropractic, physical therapy, med spa). Others only when there are real clients there.

### Full structure

```
/                              Home
/services/                     Services overview (existing page, reworked as a hub)
/services/<service>/           8 service pages (new)
/industries/                   Industries overview (new)
/industries/<industry>/        4 existing pages moved (+ any new ones)
/how-it-works/  /results/  /about/  /book-a-call/
/resources/                    Free Resources (5D)
/blog/  /blog/<slug>/  /blog/category/<cat>/  /blog/author/<name>/  /blog/rss.xml   (5E)
/privacy/  /terms/
```

### Migration (no lost rankings)
- `301` redirects in .htaccess from each `/services/<industry>/` to `/industries/<industry>/`, with and without trailing slash.
  - Tested with a script against every old URL: one hop, correct target, query strings kept.
- Update all of these:
  - sitemap (new URLs only);
  - canonicals;
  - every internal link (nav, footer, cards, llms.txt);
  - schema `@id`s and BreadcrumbList.
- Search Console: resubmit the sitemap and watch the coverage report for 4 weeks.
- Old URLs stay redirected permanently.

### New header
- **"Services"** dropdown: the 8 service pages, grouped by stage, plus "All services →".
- **"Industries"** dropdown: the industry pages, plus "All industries →".
- The existing design language throughout: pill bar, hairline borders, stage colours.

**The hover bug, and the fix:**
- **Hover gap:** the panel opens 8 px below the trigger, so moving the mouse down crosses a gap and closes it. That's the flicker.
- **Touch:** a tap fires both mouse-enter (open) and click (toggle), so it opens and instantly closes.
- **Keyboard:** only the arrow button toggles it. There's no Escape, focus doesn't move into the panel, and the menu doesn't close when focus leaves.

The fix follows the standard accessible disclosure pattern:
- the trigger is a real button with `aria-expanded` and `aria-controls`;
- click or tap toggles, and hover opens only on devices that support hover, with a short close delay and no gap;
- Escape closes the menu and returns focus;
- Tab moves through the links, and the menu closes when focus leaves or on an outside click;
- only one dropdown is open at a time.

**Mobile menu:**
- full-height panel with accordions for Services and Industries;
- page scroll locked while open, focus trapped, closes on navigation;
- 44 px tap targets.

**Before/after** screenshots at desktop, tablet and mobile, plus the keyboard and touch behaviour, all shown for approval.

---

## 5C. SEO / AEO / GEO (4–6 days)

1. **Keyword research** (web search + SERP review) for each service, each industry, and Houston/Texas local intent.
   - **Question:** do you want to rank **nationally** (US clinics) or **Houston/Texas first**? The site says US-wide but the business is in Houston. This decides every page's primary keyword.
2. **Keyword map** (`docs/KEYWORD-MAP.md`): one primary keyword per page, plus secondaries, search intent and the current ranking page.
   - No two pages target the same term.
   - Every keyword is marked **"estimate — validate"** until real volumes come from Google Keyword Planner (free with a Google Ads account) or 3 months of Search Console data.
   - Illustrative starting points, not final: "dental marketing agency", "chiropractic marketing", "med spa marketing agency", "patient reactivation campaign", "healthcare marketing agency Houston".
3. **On-page, every page:**
   - title, meta description, one H1, logical H2s;
   - internal links (service ↔ industry ↔ case study);
   - descriptive image alt text.
   - **Every visible copy change comes to you as before/after first.**
4. **Schema:**
   - Organization with a single `@id`, consistent name/area/email;
   - Service (per service page, `areaServed`, `provider`);
   - FAQPage (only where the FAQ is visible on the page);
   - BreadcrumbList everywhere;
   - Article/BlogPosting + Person (5E).
   - Everything validated with Google's Rich Results Test.
5. **AEO/GEO:**
   - a 40–60-word **direct answer** at the top of each service and industry page ("What does a dental marketing agency do?");
   - 4–6 real FAQs per page;
   - `llms.txt` rewritten for the new structure;
   - the same business facts everywhere: site, schema, llms.txt, Google Business Profile, directories.
6. **Off-page plan** in `docs/SEO-STRATEGY.md`:
   - **Google Business Profile:** service-area business, address hidden, Houston + chosen areas, services and categories, weekly posts.
   - **Directories:** Clutch, UpCity, DesignRush, GoodFirms, plus healthcare-marketing lists. Consistent name, email and URL everywhere.
   - **Backlinks:** case studies co-published with clients, dental/chiro association sponsorships, podcast guesting, data-led posts others cite. No paid link schemes.
   - **Reviews:** ask each client at the 90-day mark (Google first, then Clutch), with a template and a reply policy.

---

## 5D. Lead magnets app — get.docsscale.com (4–5 days)

### Structure
- A **second Next.js app in the same repo**: `apps/lead-magnets/` (or `get/`). Its own layout, **no main-site nav**, its own stylesheet (the funnel already is separate).
- **Template:** each lead magnet is one content file (`magnets/<slug>.ts`: headline, bullets, form, thank-you, booking step) plus optional images. A new magnet is a content file plus a review, not new code. Documented in `docs/LEAD-MAGNETS.md`.
- **URLs:**
  - `get.docsscale.com/free-system/`, `/free-system/thank-you/`, `/free-system/book-a-call/`;
  - future magnets at `get.docsscale.com/<slug>/`.

### Redirects (existing ads and links keep working)
- `docsscale.com/free-system/*` → `get.docsscale.com/free-system/*` as a **301, keeping the query string**, so UTM and ad click IDs survive.
- Tested per URL before launch.
- **Recommendation:** after launch, update the ad URLs to the new address anyway. It saves a redirect hop (faster on mobile), and ad platforms prefer final URLs.

### Hosting on Hostinger (click-by-click steps given when we get there)
1. hPanel → Domains → **Subdomains** → create `get`. Hostinger makes the folder and DNS record.
2. hPanel → Security → **SSL** → install the free certificate for `get.docsscale.com`, then force HTTPS.
3. The subdomain folder sits inside the main site's folder, so the main `.htaccess` blocks `docsscale.com/get/…` (no duplicate copy of the funnel).
4. The deploy script gains a `get` target (and `get-staging` behind a password). Production deploys can never overwrite the other app.
5. **Lead handler:** the subdomain gets its own `send-lead.php`, sharing the same server code and the same private config outside the web root. The GHL token isn't copied, and each host's same-origin check stays strict.
6. **Search:** add get.docsscale.com to the Search Console domain property, with its own sitemap. Landing pages stay indexable (as /free-system/ is today), each with a self-canonical.

### Free Resources page (main site)
- `/resources/`: a card per lead magnet (what it is, who it's for, what's inside, a CTA to the landing page), indexable, with ItemList schema.
- A newsletter signup on the page.
- Linked from the header or footer. Placement shown for approval.

---

## 5E. Blog (7–10 days)

### CMS comparison
Requirements: a non-technical person can publish, it works with our static export on Hostinger, and publishing rebuilds the site automatically.

| | **Sanity** (recommended) | **Decap CMS** | **TinaCMS** |
|---|---|---|---|
| Editing | Polished editor; drafts, preview, scheduling, image cropping | Simple form editor | Visual editing on the page |
| Where content lives | Sanity's cloud | Markdown files in our GitHub repo | Markdown in the repo, with Tina Cloud for login |
| Editor login | Email/Google account | **Needs a GitHub account** per editor | Tina Cloud account |
| Cost | **Free**: up to 20 users, 10,000 documents. Paid only for extras: $15/seat/month | Free (open source) | Free for small teams; paid team plans (price to verify) |
| Setup effort | Medium | Medium (needs a small login service we'd host) | Medium |
| Risk | Vendor-hosted content (exportable any time) | Editors touch the repo | Younger product |

**Recommendation: Sanity (free plan).**
- It's the easiest for a non-technical writer: no GitHub, proper drafts and scheduling, image handling.
- The free tier comfortably covers a small team blog.
- Its images are downloaded at build time and served from docsscale.com (AVIF/WebP, responsive), so nothing public points at Sanity (section 0).

### Auto-publish pipeline
1. The editor clicks **Publish** in Sanity.
2. A Sanity webhook (filtered to published posts) triggers a GitHub Actions workflow.
3. The workflow runs lint, types and build, a link check, the brand-rule check and a smoke test of key pages.
4. It deploys to Hostinger. **If any check fails, the live site is untouched** and you get an email.
5. A nightly rebuild publishes scheduled posts.

**Needs your decision:** automatic deploys need a permanent way for GitHub to upload to Hostinger. The upload links I use today expire after about 6 hours. Two options:
- **(a)** a Hostinger API token stored as a GitHub secret (recommended: scoped, revocable);
- **(b)** SSH access with a deploy key (if your plan includes SSH).

Either one is new infrastructure access, so I'm asking. You create it; I never see the value. Click-by-click steps will follow.

### Blog design (matching the site; before/after for approval)
- **Index:** featured post, category filter, pagination.
- **Category pages.**
- **Post template:** readable measure, table of contents (auto from H2s, sticky on desktop), author box, **related posts** (same category/industry), CTA to the call and a newsletter signup.
- **Author pages** with **real bios and photos**. I'll need these from Abdul, Ahmed and anyone else who writes.
- **Schema:** BlogPosting + Person (author) + BreadcrumbList.
- **RSS** at `/blog/rss.xml`.
- **Social image per post:**
  - by default, generated at build time from a branded template (post title on the site's colours and fonts, logo);
  - an editor can upload a custom one;
  - no generic stock or AI-style imagery.

---

## 5F. Newsletter (2 days)

- **Signup forms:** in blog posts (end + inline), the footer, and /resources/.
  - Email only (plus optional first name), using **the existing lead handler**.
  - A new form type with the same spam protection: honeypot, rate limit, same-origin check, validation.
- **GoHighLevel:** contacts are created or updated with a `newsletter-pending` tag.
- **Double opt-in:** GoHighLevel has no built-in double opt-in for API contacts, but it's a standard workflow. I'll write the setup steps; you click through them in GHL once:
  1. the workflow triggers on the tag `newsletter-pending`;
  2. it sends a confirmation email containing a **trigger link**;
  3. a click swaps the tag to **`newsletter`**, and only `newsletter`-tagged contacts receive issues.
- Unsubscribe via GHL's standard link, as the Privacy Policy now promises.
- The Privacy Policy gets one sentence about the newsletter (approval needed).

---

## 5G. Content plan and ongoing work (plan: 2 days)

- **90-day content plan:** 12–16 topics, each with:
  - a target keyword (from the keyword map, no overlap with service pages);
  - search intent;
  - the service and industry it supports;
  - its internal links and CTA.
  - Example shapes (final list after research): "How much should a dental practice spend on Google Ads?", "Chiropractic patient reactivation: a 30-day script", "Med spa reviews: getting to 100 without discounts".
- **Cadence:** 1–2 posts a week, written in your voice by your team. I can draft outlines and SEO briefs.
- **Monthly:** Search Console review, content refreshes, new directory listings, review requests.

---

## 6. Setup items that need your login (click-by-click when we reach them)

| Item | Phase | Your time |
|---|---|---|
| GA4 Measurement ID | 5A | 5 min |
| Search Console domain property (DNS record, which I can add for you if you approve) | 5A | 10 min |
| Bing Webmaster Tools (import from Search Console) | 5A | 5 min |
| Microsoft Clarity project | 5A | 5 min |
| UptimeRobot account and alert email | 5A | 10 min |
| DMARC reports mailbox; later the policy change | 5A | 5 min |
| GoHighLevel sending domain + DKIM (if GHL emails as @docsscale.com) | 5A/5F | 15 min |
| get.docsscale.com subdomain + SSL in hPanel | 5D | 10 min |
| Sanity account (free) and inviting editors | 5E | 10 min |
| Hostinger API token (or SSH key) as a GitHub secret | 5E | 10 min |
| GHL double opt-in workflow | 5F | 20 min |

### Cold email: protect docsscale.com
- **Never send cold email from docsscale.com.** Complaints and blocklists would hit your real inbox, the booking confirmations and the newsletter.
- Buy 2–3 **look-alike domains** for outreach only (e.g. `trydocsscale.com`, `docsscalehq.com`) with 2–3 inboxes each.
  - Give each one SPF, DKIM and DMARC.
  - Point its homepage at docsscale.com with a 301.
- **Warm up** each inbox for 3–4 weeks before sending, then stay at about 30–50 sends per inbox per day.
- Use `utm_source=outreach` on links so replies and leads are tracked (5A).
- Keep suppression lists synced with GoHighLevel so no one who unsubscribed is emailed again.
- Budget: domains about $10–15 each per year, plus inbox costs. **Your decision; not built by us.**

---

## Decisions I need before building

1. Approve this plan and the phase order.
2. **Services list** (8 services, URLs above): confirm, merge or add.
3. **Industries:** keep 4, or add dermatology / primary care / optometry / mental health?
4. **Geography:** national, or Houston/Texas first?
5. **"GoHighLevel" in the funnel copy:** keep or rename? And confirm the integrations strip and analytics tags are acceptable (section 0).
6. **CMS:** Sanity (recommended), Decap or Tina.
7. **Automatic deploys:** Hostinger API token (recommended) or SSH key.
8. **Search Console:** is the existing verification record yours (is a property already set up)?
9. Which email address should receive uptime alerts and DMARC reports?
