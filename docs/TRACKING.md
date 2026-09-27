# Tracking: GA4, consent and UTM naming

## Switching GA4 on

1. GA4 → Admin → Data streams → Web → copy the **Measurement ID** (`G-XXXXXXXXXX`).
2. Paste it in `web/src/content/analytics.ts`:
   ```ts
   export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
   ```
3. Deploy to staging, run the "When GA4 is switched on" checks in [QA-CHECKLIST.md](QA-CHECKLIST.md), then release.
4. In GA4 → Admin → Custom definitions, create **event-scoped custom dimensions** for `form`, `lead_magnet` and `source`, so they show up in reports.
5. In GA4 → Admin → Events, mark `generate_lead` and `book_call` as **key events** (conversions).

When the ID is empty, the site renders no analytics code and no banner.

## Consent (Google Consent Mode v2)

| Signal | Before a choice | After "Accept" | After "Decline" |
|---|---|---|---|
| `analytics_storage` | denied | granted | denied |
| `ad_storage`, `ad_user_data`, `ad_personalization` | denied | denied | denied |

- **Before a choice:** GA sets no cookies and sends only cookieless pings, which Google uses for modelled data.
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
| Meta ads | `facebook` or `instagram` | `paid-social` | `<magnet>-<yyyymm>`, e.g. `free-system-202610` |
| Google ads | `google` | `cpc` | `<magnet>-<yyyymm>` |
| Cold email | `outreach` | `email` | `<magnet>-<list>-<yyyymm>` |
| Newsletter | `newsletter` | `email` | `<issue-date>`, e.g. `2026-10-15` |
| Social posts (organic) | `linkedin`, `facebook` … | `social` | `<topic>` |
| Organic search / direct | no tags (GA4 classifies them) | | |

Optional: `utm_content` for the ad or email variant (e.g. `video-a`).

Example: `https://docsscale.com/free-system/?utm_source=facebook&utm_medium=paid-social&utm_campaign=free-system-202610`

Planned (Phase 5A): the lead handler also stores the UTM tags and landing page on the GoHighLevel contact, so the CRM shows each lead's source.
