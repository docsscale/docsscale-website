# Tracking: GA4, consent and UTM naming

## Switching GA4 on

GA4 is on from v1.1: Measurement ID **`G-804589LNJW`** in `web/src/content/analytics.ts`. To change property, replace that one value, deploy to staging, run the "When GA4 is switched on" checks in [QA-CHECKLIST.md](QA-CHECKLIST.md), then release.

One-time GA4 setup (owner, in the GA4 admin):
1. In GA4 → Admin → Custom definitions, create **event-scoped custom dimensions** for `form`, `lead_magnet` and `source`, so they show up in reports.
2. In GA4 → Admin → Events, mark `generate_lead` and `book_call` as **key events** (conversions).

When the ID is empty, the site renders no analytics code and no banner.

## Consent (Google Consent Mode v2, basic mode)

| | Before a choice | After "Accept" | After "Decline" |
|---|---|---|---|
| Google's analytics script | **not downloaded** | loaded | not downloaded |
| Requests to Google, cookies | **none** | page views and events; `_ga` cookies | none |
| `analytics_storage` | denied | granted | denied |
| `ad_storage`, `ad_user_data`, `ad_personalization` | denied | denied | denied |

- **Before a choice, nothing is loaded from Google** (verified 28 Sep 2026: zero requests, zero cookies). The page only keeps a local queue; if the visitor accepts, the queued page view is sent with consent.
- **Withdrawing** ("Cookie settings" → Decline after accepting) stops storage and deletes the `_ga` cookies.
- **Advertising signals are always denied.** The site uses no advertising cookies; the Privacy Policy says so.
- **Where the choice is kept:** in `localStorage` (`ds-consent`), in that browser only. A returning visitor's choice is applied before GA starts.
- **Global Privacy Control:** browsers that send it are treated as "Decline", with no banner.
- **Changing your mind:** "Cookie settings" in the footer reopens the banner.
- **Code:** `web/src/features/analytics/`. Banner text: `web/src/content/analytics.ts`.

## Events

| Event | When | Parameters |
|---|---|---|
| `page_view` | Every page, including in-site navigation (GA4 enhanced measurement, history changes) | automatic |
| `generate_lead` | A form submitted successfully | `form`: `home`, `book-a-call` or `free-system`; `lead_magnet`: `free-system` for the funnel; `page`: path |
| `view_lead_magnet` | A lead-magnet landing page opened | `lead_magnet`: `free-system` |
| `book_call` | The funnel's booking confirmation shown (GoHighLevel returned with `?booked=1`) | `source`: `free-system` |

- **Useful report:** Explore → Free form. Rows: `lead_magnet` × Session source / medium. Values: event count of `generate_lead`.
- **What's never sent to GA:** personal data (names, emails, phone numbers).

## UTM naming standard

Every link we control in ads, emails and posts carries UTM tags. Use lowercase words and hyphens only, and never a tool or vendor name.

| Traffic | `utm_source` | `utm_medium` | `utm_campaign` |
|---|---|---|---|
| Meta ads | `facebook` or `instagram` | `paid-social` | `<magnet>-<region>-<yyyymm>`, e.g. `free-system-tx-hou-202610` |
| Google ads | `google` | `cpc` | `<magnet>-<region>-<yyyymm>` |
| Cold email | `outreach` | `email` | `<magnet>-<region>-<list>-<yyyymm>` |
| Newsletter | `newsletter` | `email` | `<issue-date>`, e.g. `2026-10-15` |
| Social posts (organic) | `linkedin`, `facebook` … | `social` | `<topic>` |
| Organic search / direct | no tags (GA4 classifies them) | | |

Optional: `utm_content` for the ad or email variant (e.g. `video-a`).

### Region codes (regional campaigns)

Regional targeting applies to **ads, cold email and lead-magnet campaigns**, not to the website's pages. Every regional campaign carries its region code in `utm_campaign`, so leads can be compared by region after 90 days (GA4 Explore: `generate_lead` by Session campaign; in the CRM, by the stored UTM tags).

| Phase | Region | Code |
|---|---|---|
| 1 (now) | Houston | `tx-hou` |
| 1 | Dallas–Fort Worth | `tx-dfw` |
| 1 | San Antonio | `tx-sat` |
| 1 | Austin | `tx-aus` |
| 1 | Texas, statewide | `tx` |
| 2 (later) | Florida | `fl` |
| 2 | Arizona | `az` |
| 2 | Georgia | `ga` |
| 2 | North Carolina | `nc` |
| — | Nationwide / not regional | `us` |

Not targeted for now: California and New York.

Example: `https://docsscale.com/free-system/?utm_source=facebook&utm_medium=paid-social&utm_campaign=free-system-tx-dfw-202610`

Planned (Phase 5A): the lead handler also stores the UTM tags and landing page on the GoHighLevel contact, so the CRM shows each lead's source.
