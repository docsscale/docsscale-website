# Changelog

All notable changes to docsscale.com. Versions follow [Semantic Versioning](https://semver.org/):
major = a redesign or URL-structure change, minor = new pages or features, patch = fixes and copy edits.

## [Unreleased]

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
