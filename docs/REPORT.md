# Rebuild report: docsscale.com v1.0

What changed between the original site (live until v1.0) and v1.0, measured the same way on both, with the trade-offs.
As of 27 September 2026.

## Summary

- **Looks the same,** except the approved changes. Every route at 3 widths is pixel-identical to the approved build, and 19 interaction scenarios behave identically, form payloads included.
- **Secure:**
  - no API token in the web root or git history;
  - the debug log that exposed leads is gone;
  - security headers;
  - forms protected by same-origin checks, rate limits and a spam trap;
  - leads backed up even when the CRM is down.
- **Maintainable:** full source in git, CI on every push, staging, a gated deploy, and a one-command rollback.
- **Performance:**
  - the funnel pages got much lighter;
  - main-site pages score 93–99 on Lighthouse mobile (target ≥ 90 met);
  - lab scores are a few points below the original, for known reasons (below).
- **Accessibility:** 91–95 → 95–96 on every page. **Best practices:** 100 everywhere except the booking page (third-party calendar).

## Lighthouse (mobile, simulated throttling)

Medians of 3 runs per page (2 for the funnel pages after the final image fix), Lighthouse 12. Both builds were served locally by the same gzip server, so the only difference is the site itself.
These numbers are higher than the audit's first baseline (82–85), which was taken without compression.

| Page | Performance | Accessibility | Best practices | SEO | LCP (lab) | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|---|---|
| `/` | 99 → **98** | 91 → **96** | 100 → **100** | 100 → **100** | 2.3 → 2.5 s | 26 → 5 ms | 0 → 0 | 227 → 293 KB |
| `/services/` | 98 → **93** | 95 → **95** | 100 → **100** | 100 → **100** | 2.5 → 3.2 s | 20 → 6 ms | 0 → 0 | 244 → 299 KB |
| `/services/dental/` | 98 → **93** | 95 → **95** | 100 → **100** | 100 → **100** | 2.3 → 3.3 s | 12 → 6 ms | 0 → 0 | 254 → 309 KB |
| `/how-it-works/` | 98 → **96** | 95 → **95** | 100 → **100** | 100 → **100** | 2.3 → 2.7 s | 10 → 5 ms | 0 → 0 | 229 → 285 KB |
| `/results/` | 98 → **95** | 95 → **96** | 100 → **100** | 100 → **100** | 2.3 → 2.9 s | 12 → 6 ms | 0 → 0 | 229 → 284 KB |
| `/about/` | 98 → **95** | 95 → **96** | 100 → **100** | 100 → **100** | 2.3 → 2.9 s | 11 → 7 ms | 0 → 0 | 226 → 282 KB |
| `/book-a-call/` | 98 → **95** | 91 → **96** | 100 → **100** | 100 → **100** | 2.3 → 3.0 s | 11 → 5 ms | 0 → 0 | 227 → 295 KB |
| `/privacy/` | 99 → **99** | 95 → **95** | 100 → **100** | 100 → **100** | 2.0 → 2.2 s | 0 → 3 ms | 0 → 0 | 224 → 239 KB |
| `/free-system/` | 97 → **94** | 91 → **96** | 96 → **100** | 100 → **100** | 2.7 → 3.1 s | 1 → 4 ms | 0 → 0 | **909 → 394 KB** |
| `/free-system/thank-you/` | 99 → **97** | 95 → **95** | 96 → **100** | 69 → 69 | 2.1 → 2.6 s | 0 → 2 ms | 0 → 0 | **563 → 321 KB** |
| `/free-system/book-a-call/` | 93 → **97** | 95 → **95** | 75 → **79** | 100 → **100** | 2.3 → 2.5 s | 0 → 4 ms | 0.14 → **0.05** | 2231 → 2341 KB |

**Reading the numbers honestly:**
- **Lab LCP is higher on animated pages. That's the headline entrance animation, kept by decision.**
  - Lighthouse's simulation counts the words fading in as late paint.
  - In a real browser with the same throttling, the homepage's largest paint measured 1.34 s (original) vs 1.43 s (v1.0).
  - A static headline would bring lab LCP down to about 2.3 s; the owner chose to keep the animation.
- **Page weight on main-site pages is about 55–65 KB higher.** It comes from three things:
  - the real logo image (12 KB, replacing a CSS-drawn mark);
  - the favicon files;
  - larger server-rendered HTML: the page structure travels in the HTML instead of in JavaScript, about +10 KB compressed.

  Total blocking time went *down* on every main-site page (JavaScript runs later and less). Moving the inline styles into CSS classes would cut the HTML again; it's noted as a later improvement.
- **The funnel pages are 40–57% lighter:** the photos are now AVIF/WebP at the right size for each screen, and the correct image is preloaded.
- **The thank-you page's SEO score of 69 is intentional:** it's `noindex`, so it doesn't compete with the landing page in search.
- **The booking page's best-practices score (79)** comes from the GoHighLevel calendar iframe (third-party cookies and console messages), outside our control. Its layout shift improved from 0.14 to 0.05.

## Audit findings: status

| # | Finding (from [AUDIT.md](AUDIT.md)) | Status |
|---|---|---|
| C1 | Placeholder business data live (fake phone, address, names) | **Fixed.** Real contact details everywhere; placeholder schema removed. Three photo placeholders remain until photos arrive. |
| C2 | GoHighLevel token in the web root | **Fixed.** Moved outside the web root, removed from git history. Owner chose to keep the token rather than rotate it. |
| H1 | `lead-debug-log.txt` publicly downloadable | **Fixed** (returns 404). |
| H2 | Lead endpoints unprotected, leads could be lost | **Fixed.** Shared handler: validation, same-origin check, rate limits, honeypot, local backup of every lead; 36 automated tests. |
| H3 | www.docsscale.com invalid certificate | **Open:** owner action in hPanel ([HANDOVER.md](HANDOVER.md)). |
| H4 | No analytics | **Ready:** GA4 with Consent Mode, banner and events, switched on by adding the Measurement ID. |
| H5 | Security headers missing | **Fixed:** HSTS, nosniff, frame options, referrer policy, permissions policy, baseline CSP. |
| H6 | Mobile LCP 4.4–5.5 s (uncompressed baseline) | **Improved:** see the table; with compression and the rebuild, 2.2–3.3 s lab, about 1.4 s measured. |
| M1 | Sitemap disagreed with canonicals | **Fixed.** |
| M2 | No social image | **Fixed:** 1200×630 image on every page. |
| M3 | Caching | **Fixed:** a year of caching for hashed assets; HTML always fresh. |
| M4 | Accessibility | **Mostly fixed:** landmarks, field names, keyboard lightbox. Contrast of small grey labels is **pending owner decision** (branch `proposal/contrast`). |
| M5 | Funnel images heavy | **Fixed:** AVIF/WebP responsive versions. Separately, the images show garbled generated text; replacing them is recommended. |
| M6 | RSC payload files crawlable | **Fixed:** `X-Robots-Tag: noindex`. |
| M7 | Code duplication | **Fixed:** one codebase, shared components, content separated from layout. |

## What the owner approved as visible changes

See [CHANGELOG.md](../CHANGELOG.md) → 1.0.0 → Visible changes. Each was shown as before/after and approved before release.

## Recommended next

1. The contrast proposal (WCAG AA for small grey labels).
2. Real photos for the three placeholders and the team cards.
3. Replace the funnel images.
4. GA4 ID.
5. Phase 5 ([PHASE5-PLAN.md](PHASE5-PLAN.md)).
