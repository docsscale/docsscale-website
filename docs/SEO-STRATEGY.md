# SEO / AEO / GEO strategy

Where docsscale.com stands at v1.0, and what comes next. The detailed growth work (keyword map, new service and industry pages, blog, off-page) is planned in [PHASE5-PLAN.md](PHASE5-PLAN.md) (approved in principle).

## Positioning (decided September 2026)

- **Website positioning stays US-wide:** industry and service pages any US clinic owner can find, targeting specific, lower-competition keywords: long-tail, treatment- and specialty-specific, intent-rich.
- **Local layer: Houston/Texas.** Based in Houston:
  - a Google Business Profile;
  - one Houston page;
  - Texas mentions where they're natural.
- **No thin city pages.** A city page is added only when there are real clients or case studies there.
- **Regional targeting lives in campaigns, not pages:** ads, cold email and lead-magnet campaigns, with UTM region codes to compare results after 90 days ([TRACKING.md](TRACKING.md#region-codes-regional-campaigns)).
  - Phase 1: Texas (Houston, Dallas–Fort Worth, San Antonio, Austin).
  - Phase 2: Florida, Arizona, Georgia, North Carolina.
  - Not for now: California, New York.
- **Industries:** the current four (dental, chiropractic, physical therapy, med spa). Add others only when there are real clients in them.

## Technical SEO at v1.0

| Area | State |
|---|---|
| Indexing | `robots.txt` allows all, including AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended), for GEO citations. The funnel thank-you page is `noindex, nofollow`; the 404 is `noindex`; `index.txt` payloads send `X-Robots-Tag: noindex`. |
| Sitemap | `web/public/sitemap.xml` (14 URLs), referenced in robots.txt |
| Canonicals | Every page has a self-referencing absolute canonical (trailing slash) |
| Titles and descriptions | Unique per page; funnel descriptions under 160 characters |
| Structured data | One `Organization` (`@id` `https://docsscale.com/#organization`: Houston, TX, US; no street or phone) referenced by every Service record, site and funnel alike; FAQPage on the homepage and funnel, where the FAQ is visible |
| Social | Open Graph + Twitter card with a 1200×630 image on every page |
| Performance | See [REPORT.md](REPORT.md): Lighthouse mobile scores and real-browser measurements |
| Accessibility | `<main>` landmarks, named form fields, keyboard-accessible lightbox. Contrast proposal pending. |
| AI-readable summary | `web/public/llms.txt`: services, process, pages, contact |

**Consistency rule:** the business name, area (Houston, Texas, US), email (info@docsscale.com) and URL must be identical in the site, schema, `llms.txt`, Google Business Profile and every directory listing.

## On-page (Phase 5B/5C)

1. **Keyword research** per service, industry and local intent, plus a **keyword map**: one primary keyword per page, no overlaps. Every keyword is marked "estimate" until validated with Google Keyword Planner or 3 months of Search Console data.
2. **New structure:** a page per service (`/services/<service>/`), industry pages moved to `/industries/<industry>/` with 301 redirects, and a Houston local page.
3. **Per page:**
   - a 40–60-word direct answer near the top;
   - 4–6 real FAQs (FAQPage schema only where they're visible);
   - BreadcrumbList;
   - Service schema with `areaServed`;
   - internal links service ↔ industry ↔ results.
4. **Visible copy changes** are shown as before/after for approval.

## Off-page

- **Google Business Profile:**
  - service-area business with the address hidden, primary category "Marketing agency";
  - service areas: Houston and Texas, plus "United States" where allowed;
  - services listed to match the site;
  - a weekly post (a result, a tip, a new article);
  - photos of the real team;
  - replies to every review within 2 business days.
- **Agency directories:** Clutch, UpCity, DesignRush, GoodFirms, Sortlist, plus healthcare-marketing roundups. Same name, area, email and URL on each, with a description adapted from the About page. Clutch and UpCity rankings depend on verified client reviews, so start them early.
- **Backlinks** (earned, never bought):
  1. case studies co-published with clients (their site links to ours);
  2. state dental, chiropractic and PT associations: sponsor or speak;
  3. podcast and webinar guesting for practice-growth audiences;
  4. data-led posts (e.g. "median reply time vs show-up rate across N clinics") that others cite;
  5. vendor and integration partner directories where we genuinely qualify.
- **Reviews:**
  - ask every client at the 90-day mark: Google first, then Clutch;
  - a short template with direct links;
  - never incentivise reviews; reply to all of them;
  - collect permission to quote results on the site (FTC endorsement rules).

## Measurement

- **Search Console:** a Domain property covering all subdomains, with the sitemap submitted. Watch Pages, Enhancements and Performance by page and query.
- **Bing Webmaster Tools:** imported from Search Console.
- **GA4:** organic landing pages → `generate_lead` (see [TRACKING.md](TRACKING.md)).
- **Monthly review:**
  - rankings for the keyword map;
  - pages losing clicks, which get refreshed;
  - new directory listings and reviews;
  - AI-answer visibility: search the core questions in AI assistants and note whether DocsScale is cited.
