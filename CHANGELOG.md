# Changelog

All notable changes to docsscale.com. Versions follow [Semantic Versioning](https://semver.org/):
major = a redesign or URL-structure change, minor = new pages or features, patch = fixes and copy edits.

## [1.1.0] — unreleased (on staging; deploy pending owner go-ahead)

### Visible changes (approved)
- **Free system renamed** to the **Click-to-Chair System**: funnel headline, supporting line, thank-you page, titles, meta and social text, structured data, `llms.txt`. GoHighLevel is named only where buyers need it ("Runs in your GoHighLevel account").
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

## [1.0.0] — 2026-09-27 (release candidate; deploy pending owner go-ahead)

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
