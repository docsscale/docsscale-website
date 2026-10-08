# Changelog

All notable changes to docsscale.com. Versions follow [Semantic Versioning](https://semver.org/):
major = a redesign or URL-structure change, minor = new pages or features, patch = fixes and copy edits.

## [Unreleased]

## [1.6.0] — 2026-10-08

The blog on the home page. Visible to visitors: the "From the blog" section on the home page, "Blog" in the footer, and the blog's new heading. IndexNow and the Publish step are behind the scenes.

- **"From the blog" on the home page, and Blog in the footer** (owner's decision, 8 Oct 2026; no link in the header). Between Results and the questions, on the brand teal, the home page shows the newest posts (up to three) on white cards, with the blog's heading and an "All posts" button; with no published post the section is not there. The footer's Company column gains "Blog". The blog's heading, on the blog page and in this section, becomes "Grow your practice: practical marketing guides" (was "How clinics get found, booked and re-booked"; owner, 8 Oct 2026: shorter and more general).
- **IndexNow: search engines hear about new posts straight away** (completion plan, section 3, item 5). `scripts/indexnow.mjs` sends a post's address, the blog list and the home page to IndexNow, which Bing and its partners read (Google does not take part; it reads the sitemap). The publish workflow runs it after every post it publishes; for releases it is a step in `docs/RELEASE.md`. It never fails a release. A key file is added at the site's root, public by design. Nothing a visitor sees changes.
- **Publishing from the editing screen** (`.github/workflows/publish.yml`, `scripts/publish-content.mjs`), switched on by the owner on 8 Oct 2026. A post the owner sets to "Published" in the editing screen is checked, copied to the live copy and released with no developer; anyone else's Publish, and anything that is not a post, is refused. The rule is in CLAUDE.md.

## [1.5.0] — 2026-10-08

The blog and the system behind it. Visible to visitors: the blog page and its first post. Everything else in this list is the publishing system (editing screen, preview site, checks), which visitors do not see.

- **Performance budget in CI** (completion plan, item 11; finishes stage A). A fifth CI job runs a lab test (Lighthouse, simulated phone) on every built page, three runs each, and judges the best run. The 16 existing pages are held to "no worse than today": at most 6 points below their recorded score, the main content painted at most 15% later, no new layout shift, at most 3% heavier. Any page not in the record is new and must meet the plan's target: score 90 or more, main content within 2.5 seconds, no layout shift. Today's record is the middle of three CI runs on 7 Oct 2026 (scores 93–98, main content at 2.4–3.2 seconds, 260–409 KB per page). The deploy script now requires this job too. Lighthouse 13.5.0 is added as a test tool; it is never sent to visitors. Nothing on the site changes, so there is nothing to deploy.
- **Two new private addresses, both closed** (completion plan, section 5, item 7; created with the owner's approval on 7 Oct 2026). `preview.docsscale.com` asks for the staging login; `cms.docsscale.com` answers nothing until the editing app is installed. Both send `noindex` on every response. Each is its own site in its own folder on the existing hosting plan, apart from the live site; no cost. A new CI check (`tests/server/hidden-sites.sh`) asks both addresses on every push and fails if either answers with content or without `noindex`. The rules are in `server/preview/.htaccess` and `server/cms/.htaccess`. Nothing on docsscale.com changes.
- **CI runs once per change.** October's free GitHub Actions minutes ran out on 7 Oct; the owner made the repository public the same day, which has no limit. Checks now run on pull requests and on pushes to `main` only (they ran twice for every push to a pull request). Nothing on the site changes.
- **Publishing core, first part: posts are files, and the site can build them** (completion plan, sections 4 and 6). Blog posts, categories and team members are files in `/content`, in the format the editing screen writes; the site reads them at build time with the CMS's own reader (`web/src/content/cms-schema.ts`, `web/src/features/blog/`). The live build includes the blog only when at least one post is published, so today's site is unchanged (every page pixel-identical, no `/blog/`). The preview build (`CONTENT_PREVIEW=1`) includes drafts and marks every page `noindex`; CI builds it on every change. One draft sample post exists for the layout and can never reach the live site as a draft. The blog's templates follow the design sent to the owner on 7 Oct 2026; nothing from them is public until real posts and the owner's approval. Two build-time tools added (`@keystatic/core` 0.6.9, `@markdoc/markdoc` 0.5.4), the ones chosen in the CMS trial; neither is sent to visitors.
- **The editing app is in the repository** (`cms/`; completion plan, section 6): the Keystatic app from the trial, without the trial's test route, reading the same content model as the site (`content-schema.ts`, kept identical in both packages by a CI check). It saves only to the working copy (`content/working`), hides the branch and pull-request controls, and sends `noindex` on every response. CI builds it on every change; the weekly update pull requests now cover it. Nothing on docsscale.com changes.
- **Preview site: a deploy target for it.** `node scripts/deploy.mjs --target preview` builds the site with drafts included and uploads it to `preview.docsscale.com` (password, `noindex`, no lead handler). First upload on 7 Oct 2026. Nothing on docsscale.com changes.
- **Blog templates in the approved design, with an offers panel** (owner's approval of the design canvas, 7 Oct 2026). Post page: title on the teal tint, a cover photo overlapping it, one reading column, coloured blocks for quotes and takeaways, and a panel beside the article with "On this page" and DocsScale's own offers. Blog list: the newest post large, the rest as cards with photos, the same panel. On phones the panel moves under the content. **Offers are content:** a new "Offers" list in the content model (title, label, optional big number, text, picture, button, link, colour, order, on/off), so new offers need no developer; three exist, worded from copy already on the site. Posts gain a cover photo with alt text and caption, and pictures inside the body. Still preview-only: the live site has no blog until a post is published.
- **The editing app is installed at `cms.docsscale.com`** (7 Oct 2026). Signed out, the address shows only the sign-in screen, sends `noindex` on every response and gives no content. Saves go to the working copy (`content/working`), never to the live site. Nothing on docsscale.com changes.
- **Blog posts: built for search engines and for long articles.** Every post now carries the data search engines read (article, author, dates, breadcrumbs, and its questions when it has a visible FAQ), made from the post itself, and shares as an article with its own photo. Long posts on phones get a closed "On this page" list at the top, since the side panel sits under the article there. Preview only until a post is published.
- **Uploaded pictures are made fast automatically.** Before every build, each picture uploaded through the editing screen is turned into AVIF and WebP versions at up to four widths, with location and camera data removed (`web/scripts/optimise-uploads.mjs`); the templates serve the one that fits and write the picture's size into the page so nothing jumps while it loads. Applies to cover photos, pictures inside posts and offer pictures. The weekly updater no longer proposes a newer Markdoc than the CMS library uses (it breaks the build).
- **Offers are managed in code, not in the editing screen** (owner's decision, 7 Oct 2026). The editing screen is for blog posts and SEO only: posts, categories, team members. The offers panel on the blog is unchanged and now reads `web/src/content/offers.ts`; a new offer or funnel is set up by the developer when the owner asks. The "Offers" list added earlier the same day is removed.
- **Preview updates by itself** (`.github/workflows/preview.yml`): every save in the editing screen, and every change to the site's code, rebuilds the private preview site with drafts included. It needs a Hostinger access key stored as a GitHub secret, which the owner adds; until then it does nothing.
- **Preview site: about a minute instead of six, and no manual refresh.** The preview upload now sends only the files that changed since the last one, several at a time (a first full upload took 26 seconds instead of over five minutes; an unchanged one 3 seconds). Preview pages carry a small bar that shows when the preview was built and reloads the page by itself when a newer one arrives. The bar exists only in preview builds, never on the live site.
- **Blog: a feed and topic pages.** `/blog/rss.xml` lists every published post for feed readers. A topic (category) gets its own page and a place in the filter row on the blog list once it has three posts, so there are no thin pages; a topic page without its own description stays out of search engines. Preview only until a post is published.
- **Blog page wording** (the owner's instruction, 8 Oct 2026: the developer chooses the search-optimised wording): heading "How clinics get found, booked and re-booked", a one-line introduction, and the title and description for search results. Not public until the first post is published.
- **Editing screen: call-to-action blocks.** A post containing a call-to-action block could not be opened in the editing screen ("Missing component definition for cta"). The block is now part of the content model: an editor can insert it from the editor's menu and choose "Book a strategy call" or "Get the Free System"; the wording and look stay fixed in code.
- **The blog goes live with its first post**: "Google Business Profile for dentists: what to fix first" (`/blog/google-business-profile-for-dentists/`), with the blog list at `/blog/` and the feed. The post's own example is the Dallas dental case study from the Results page, with the figures as published there. Author: Abdul Samad. The blog is not in the menu yet. Paragraph spacing inside posts corrected.

## [1.4.6] — 2026-10-07

- **The sitemap is generated from the built pages** (agency review SEO-2). Every indexable page is listed automatically, and each page's `lastmod` is the day its own copy last changed; a change to the header or footer moves no dates. 13 of the 15 dates were stale and are corrected from the change history. CI fails if the committed sitemap is out of date.
- **Automatic site checks in CI** (`npm run check:site` in `web/`): AI wording, tool names and generator tags; the CRM platform named outside its allowed places; "new/startup" wording; missing or duplicate titles and descriptions; canonicals; one h1 and no skipped heading levels; images without an alt attribute; broken internal links; incomplete structured data and FAQ schema for questions that aren't on the page; sitemap coverage. Warnings, which never fail: long titles, short pages, pages sharing half their wording. The current site has no errors.
- **Routine updates** from the first weekly update run: the site framework 16.3.6 → 16.3.8 and the CI actions. Every page is pixel-identical.

Nothing visible changes in this release.

## [1.4.5] — 2026-10-07

- **Services page, Local SEO card: no more "a page per treatment and neighborhood".** The "You get" line now reads "Google Business Profile management, pages for the treatments you want more of, review velocity, monthly rank report." The old wording promised a page per neighborhood, which the content quality rules (CLAUDE.md, 6 Oct 2026) forbid. Wording given and approved by the owner (before/after at 1440, 768 and 375). The homepage and `llms.txt` lines about ranking "in the neighborhoods you serve" stay as they are (owner's decision): they promise no pages.
- **Build tools updated** after two security advisories published on 6 Oct 2026 (`source-map-js`, `sharp`). Neither is sent to visitors; nothing visible changes.
- **Weekly dependency update pull requests** are switched on (GitHub's built-in updater), tested by CI like any other change.

## [1.4.4] — 2026-10-06

- **Homepage hero: the platforms strip lists four platforms** (owner's decision, 6 Oct 2026): Google Business Profile, Meta Ads, Google Ads and Instagram, the platforms we work on for clients. TikTok and the eight practice-software names (Zocdoc, Dentrix, Open Dental, Jane, ChiroTouch, WebPT, Zenoti, Weave) are removed. With four names the strip is a still, centred row instead of a scrolling one; on phones it wraps to three lines, which makes the homepage 100 px taller there. Plain names, no official logos.

## [1.4.3] — 2026-10-06

- **Old industry-page files are no longer served** (agency review AR-1 / SEO-1). `/services/<industry>/index.html`, `index.txt` and the other files of the pages that moved in v1.2 still answered with the old page, because deploys never delete. Everything under those four folders now redirects (301) to the matching `/industries/` page. `tests/server/redirects.sh` checks it (28 checks, was 16).
- **Deploy script: prune report.** `--prune` lists server files that are not in the current release and changes nothing; `--delete-listed <file> --yes` deletes exactly an owner-approved list and refuses anything in the current release or protected (`staging_html/`, `.well-known/`, dotfiles). Deleting needs the owner's approval every time (`docs/RELEASE.md`, "Pruning old files"). Nothing visible changes.
- **Free System page: the stat numbers are in the HTML.** The five cards under the hero (6, 17, $0, 24/7, 100%) were written into the page as 0, 0 and 0% and only became the real numbers when a script counted them up, so anything that reads the page without running scripts saw zeros. The HTML now carries the real numbers; the count-up still plays when the cards scroll into view. Visitors who prefer reduced motion now get the numbers without the count-up. Nothing looks different (every page pixel-identical). New CI check `tests/visual/funnel-stats.mjs` (7 checks).

## [1.4.2] — 2026-10-06

- **Homepage "Attract" ad preview: a photo replaces the placeholder** (agency review UX-1, System part). The "Sponsored · Your Clinic" card showed a dashed box reading "Ad creative: your team, your rooms"; it now shows a stock photo of a dentist and a patient, still under the "Ad preview" label, with alt text that calls it an example ad photo. The crop is anchored between the two faces (not the centre of the photo), and the photo's box is at least 55% as tall as it is wide, so both faces stay fully in view at every width checked (320–1920 px, all specialties). Served as AVIF/WebP at four widths (11–48 KB as AVIF) and lazy-loaded. Source and licence are recorded in `incoming/README.md`.

## [1.4.1] — 2026-10-05

- **Hero graphic: the first example now plays too.** After a reload the first example (Maya) sat complete for about two seconds and then switched to the second one, so it never animated (owner's report, 5 Oct). The page still paints the complete first example, then, about 1.4 seconds after load, plays it through step by step before moving on. Reduced-motion visitors still get the static version.

## [1.4.0] — 2026-10-05

- **Homepage hero: an animated "patient journey" graphic replaces the photo placeholder** (agency review UX-1, hero part). Five example patients rotate, four steps each, every step tagged with its stage in the stage colours: a new lead after hours, a missed call, someone who didn't book right away, a no-show, and a past patient. Automated replies show a short "Sending…" first. Labelled "Example", with the caption "Every step runs on its own. Times vary by clinic."; no statistics, and nothing names the software behind it. The complete first example is in the page's HTML (first paint, no script needed); motion starts after the page has loaded, pauses off-screen and in background tabs, and never starts for visitors who prefer reduced motion. On phones the graphic now sits right under the headline card (it was at the bottom of the hero). Wording lives in `web/src/content/hero-journey.ts`. Lighthouse before/after (5 runs each): no change in score, LCP, CLS or blocking time; the page is 3.6 KB heavier. New CI check `tests/visual/hero-journey.mjs` (28 checks). The System-section placeholder and the About initials are unchanged.

## [1.3.0] — 2026-10-05

- **Phone required on all three forms, with a country picker** (default United States, never guessed from the visitor's location). The number is checked for the chosen country and sent to GoHighLevel as E.164 (`+17135550100`), so GHL no longer prefixes +1 to numbers typed without a country code. The server refuses numbers it can't place in a country and still accepts old-format US numbers from cached pages. On the homepage form, email and phone now each get a full-width row. Approved by the owner (before/after).
- **Optional "Clinic website" field** on the homepage and Book a Call forms (not the Free System form), under name and clinic. Saved to GoHighLevel's standard Website field (`https://` added; text that isn't an address stays in the backup and repeat-lead note only). Approved by the owner (before/after).
- **More tracking:** GA4 events `cta_click` (with the button's page section), `form_error` (with the field), `email_link_click` and `phone_link_click`, behind the cookie choice like every GA4 event. Each lead also carries its UTM source/medium/campaign and landing page into the GoHighLevel "Tracking" fields: read from the URL on page load, kept only in the browser tab (no cookie) and sent only when a form is submitted, whatever the cookie choice. The **Privacy Policy** says so ("Where you came from"), and its description of what the forms ask for is corrected (phone is required; the clinic website is new). Wording approved by the owner.
- **Microsoft Clarity** (heatmaps and recordings): loaded only after "Accept", on docsscale.com only, never for team browsers; every form masked. **Privacy Policy** updated (Microsoft added to service providers, a Clarity paragraph under "Cookies and analytics", "Last updated" is the production deploy date, 5 October 2026). Policy wording approved by the owner.
- **Book a Call page copy** (owner-supplied): new subheadline and a "What we'll cover" section with six numbered cards (3×2 grid, same tinted card style) plus the line "Free. No pitch deck. No pressure. You keep the plan whether we work together or not." The headline card sits beside the form (stacked above it on tablets), so on phones the form comes right after the headline. The "What the call is not" band is removed (it duplicated the reassurance line). The phone field is labelled "Phone" on the homepage and the Free System form too (it said "Mobile" / "Mobile number"). Approved by the owner (before/after and staging review).

## [1.2.4] — 2026-10-02

- **Real-user Web Vitals in GA4** (agency review FE-4): LCP, INP and CLS are sent as GA4 events (`LCP`, `INP`, `CLS`) with a good / needs-improvement / poor rating, after analytics consent only, using Google's `web-vitals` library (about 2 KB). This shows whether the slow-hero finding (FE-1) affects real visitors before anything visible changes. Nothing visible changes.

## [1.2.3] — 2026-10-01

- **GoHighLevel calls survive a slow DNS lookup:** the first live failure email found a lookup that failed because the server took over 3 seconds to resolve GoHighLevel's address. The connect timeout is now 5 seconds, and the address is looked up once per submission and reused by every GHL call. Nothing visible changes.
- **Form messages reach screen readers** (agency review QA-1, WCAG 4.1.3): "Sending…" is announced, error messages are alerts, and after a successful send on the homepage and Book a Call forms focus moves to the confirmation. Nothing changes for sighted visitors (every page pixel-identical).

## [1.2.2] — 2026-10-01

- **Daily failure email** (agency review BE-2): a daily cron job emails info@docsscale.com when the lead handler logged errors, when a lead didn't reach GoHighLevel or wasn't tagged or noted, or when a request was cut off before its outcome was recorded. No email when there's nothing to report; each problem is reported once. Nothing visible changes on the site.

## [1.2.1] — 2026-09-30

- **Lead backup before GoHighLevel** (agency review BE-1): each lead is written to the backup as soon as it passes validation, before any GHL call, with the GHL outcome added as a second line. A slow or failing GHL can no longer lose a lead. All GHL calls of one submission share a 20-second budget with shorter per-call timeouts; the contact save always runs, and the tag and note are skipped (and logged) if time runs out. The visitor gets their reply as soon as the contact is saved. Nothing visible changes.

## [1.2.0] — 2026-09-30

### Visible changes (approved by the owner, before/after reviewed)
- **New header:** a **Services** dropdown with the seven confirmed services grouped by stage (each with a one-line description, linking to its stage on /services; footnote "One system: Attract → Capture → Convert → Retain"), and a new **Industries** dropdown with the four industry pages. Mobile menu: full height, with Services and Industries sections.
- **Industry pages moved** from `/services/<industry>/` to `/industries/<industry>/` (301 redirects, one hop, query strings kept), plus a new overview page at **/industries/**.
- **Footer:** the Services column shows the seven confirmed service names; a new Industries column.
- **Dropdown bug fixed:** no gap between the button and the menu (it no longer closes on the way down), a tap opens it once instead of open-then-close, Escape and Tab work, one menu at a time.

### Not visible
- Sitemap, canonical URLs, breadcrumbs (Home › Industries › …), service names in structured data and `llms.txt` updated to match.
- Behaviour tests for the header (`tests/visual/nav-behaviour.mjs`, in CI) and a redirect check (`npm run test:redirects`).

## [1.1.4] — 2026-09-30

- **Repeat leads no longer overwrite GoHighLevel contacts:** the lead handler looks each person up first. For an existing contact it never changes the name, source or email, fills only empty fields (clinic, phone, custom fields), adds a note with the whole submission, and adds the tag as before. New contacts are saved exactly as before. If the lookup fails, it falls back to the previous full upsert and logs it. Needs the token scopes `contacts.readonly` and `locations/customFields.readonly`.
- **Locations option "3–5" is now "3-5"** (plain hyphen) in the homepage and Book a Call forms, matching the GoHighLevel field's option, so the answer is saved on the contact. The lead handler also converts the old en dash from cached pages. Approved by the owner; the only visible change.

## [1.1.3] — 2026-09-29

- **GoHighLevel workflows can now trigger on website leads:** every contact the lead handler creates or updates gets a tag: `free-system-lead` (funnel) or `website-lead` (homepage and Book a Call). It's added through GHL's Add Tags API, so existing tags are kept. Source labels and all other fields are unchanged. Nothing visible changes on the site.

## [1.1.2] — 2026-09-29

- **Privacy Policy: new "Google Ads API access" section** (for Google OAuth verification), between "Service providers we share information with" and "How long we keep information". It links to Google's API Services User Data Policy and to the "Service providers" section. "Last updated" is now September 29, 2026. Legal pages can now contain links (`[text](url)` in `web/src/content/legal.ts`). Approved by the owner.

## [1.1.1] — 2026-09-29

- **Team visits can be excluded from GA4:** opening `docsscale.com/?team=on` once per browser marks that browser's visits as internal (`traffic_type=internal`), for GA4's Internal Traffic filter; `?team=off` undoes it. Nothing visible changes for visitors. Steps in [docs/TRACKING.md](docs/TRACKING.md#excluding-docsscale-team-visits).

## [1.1.0] — 2026-09-28

### Visible changes (approved)
- **Product name "Click-to-Chair System"** where a name helps: thank-you page, page titles, meta and social text, structured data, image alt text, `llms.txt`. The funnel keeps its original headline; its supporting line now says "set up in your GoHighLevel account".
- **Illustrations:** the mock search says Houston, the mock chat says "Dr. Hannah" (not a client's name).
- **Specialties, one consistent list of 9:** dental, chiropractic, physical therapy, med spa, weight loss, dermatology, primary care, optometry, mental health. The About count shows 9 (was 8), and the same list is in every form (the main forms add Weight loss; the funnel form adds the four it lacked plus "Other"), the funnel chips and "who it's for" line, the FAQ, structured data and `llms.txt`.
- **Testimonials and case studies** show the real clients' names, specialties and cities (each row confirmed). Quotes and figures are unchanged.
- **Founded 2023:** About page, Organization schema (`foundingDate`), `llms.txt`. v1.0 said 2025.
- **Homepage hero:** the "A DocsScale client clinic · Austin, TX" caption is removed from the photo placeholder.
- **Text contrast:** caption grey #8F8C85 → #6C6962, funnel footer text brighter, two faded homepage hints at full strength. Small text now meets WCAG AA.
- **Consent banner** and footer **"Cookie settings"** link, now that analytics is on.

### Analytics
- **GA4 on** (`G-804589LNJW`) in Consent Mode v2 **basic mode**: nothing is loaded from Google before "Accept". The first page view is sent with consent. Withdrawing deletes the GA cookies.
- **Events verified:** `page_view`, `generate_lead` (home, book-a-call, free-system), `view_lead_magnet`, `book_call`.

### Other
- Organization schema logo uses the 512 px icon (Google's minimum is 112 px).
- Image specs and a drop folder for the real screenshots and photos (`incoming/README.md`).
- UTM region codes for regional campaigns ([docs/TRACKING.md](docs/TRACKING.md)).

## [1.0.1] — 2026-09-28

- **www.docsscale.com works and redirects:** the certificate now covers www (reissued through the Hostinger API), and `www` sends a 301 to `https://docsscale.com`, keeping the path and query string.

## [1.0.0] — 2026-09-28 (deployed to docsscale.com)

The site rebuilt from its lost source, hardened and made maintainable, looking the same as before except for the changes listed under "Visible changes", each approved by the owner.

### Visible changes (all approved)
- **Real business information:**
  - contact details are Houston, Texas, US and info@docsscale.com (the placeholder address and 555 phone number are removed from pages, schema and forms);
  - "Founded 2025";
  - the About team shows the six real team members (initials until photos are added).
- **Brand:**
  - the official DocsScale logo in the header, footer and funnel;
  - a full favicon set (browser tab, Apple, Android) on every page including the funnel;
  - a 1200×630 link-preview image on every page.
- **Legal:**
  - a final Privacy Policy (email only, no text messages; how to unsubscribe; cookies and analytics);
  - final Terms of Service;
  - the "draft" banner removed.
- **Results page:** the "Sample figures" note is removed; the stats stay exactly where they were.
- **Book a call:** the phone field reads "Phone (optional)".
- **Reduced motion:** visitors who turn off animations now see complete headlines. Before, some headlines showed only their first word.

### Performance
- Hero headline entrance done in CSS; the animation library loads after the page is interactive.
- Funnel photos served as AVIF/WebP at the right size for each screen. The hero on a typical desktop went from 362 KB to 62 KB, and the main image is fetched first.
- Self-hosted fonts preloaded; long-lived caching for hashed assets.

### SEO
- One consistent Organization record (`@id`) in structured data across the site and funnel.
- Funnel meta descriptions shortened to fit search results; proper title on the 404 page.
- `llms.txt`, sitemap and robots.txt current; AI crawlers allowed.

### Accessibility
- A `<main>` landmark on every page.
- Every form field has an accessible name.
- The funnel gallery lightbox works with the keyboard (Enter/Space opens, Escape closes, focus returns).

### Security and reliability
- **Lead handler:**
  - one shared PHP lead handler for all forms, with its secrets outside the web root;
  - checks: same-origin, rate limits, size limits, validation;
  - a local backup of every lead, so none is lost if GoHighLevel is down.
- **Spam:** a hidden spam-trap field on all three forms.
- **Server:** security headers; sensitive file types blocked; the GoHighLevel token removed from git history.

### Analytics (ready, off until the Measurement ID is added)
- GA4 with Google Consent Mode v2 and a small consent banner.
- Lead and booking events.
- A "Cookie settings" link in the footer.

### Engineering
- **Source code:** full source in git.
- **CI:** lint, types, formatting, build, PHP tests, dependency audit, and pixel and behaviour parity against the approved build.
- **Environments:** password-protected staging environment; deploy script with production safety gates.
- **Rollback:** a one-command rollback to the original site (`--rollback-original`).

## [0.1.0] — 2026-09-25
- **Audit:** of the live site.
- **Server-side hardening, without the source:** `.htaccess` security and caching, and the shared lead handler.
- **Repository and CI:** repository created.
