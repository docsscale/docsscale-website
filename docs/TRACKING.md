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
- **Only the live site sends data.** On staging and local builds the banner works, but GA is never loaded, so test visits don't reach your reports. (Automated tests opt in with `window.dsAnalyticsTest = true`, with every hit intercepted.)
- **Advertising signals are always denied.** The site uses no advertising cookies; the Privacy Policy says so.
- **Where the choice is kept:** in `localStorage` (`ds-consent`), in that browser only. A returning visitor's choice is applied before GA starts.
- **Global Privacy Control:** browsers that send it are treated as "Decline", with no banner.
- **Changing your mind:** "Cookie settings" in the footer reopens the banner.
- **Code:** `web/src/features/analytics/`. Banner text: `web/src/content/analytics.ts`.

## Excluding DocsScale team visits

**For each team member, once per browser** (desktop and phone, every browser they use):
1. Open **https://docsscale.com/?team=on**.
2. A message confirms: "This browser is now marked as DocsScale team traffic…". The `?team=on` disappears from the address bar.
3. From then on, that browser's visits are sent with `traffic_type=internal`, which GA4 excludes once the filter below is active.

To undo it, open **https://docsscale.com/?team=off**. The mark lives in that browser's storage, so it doesn't survive private windows or clearing site data; reopen the link if that happens. Nothing is sent to Google before "Accept" either way.

**One-time GA4 setup (owner):**
1. analytics.google.com → **Admin** (gear, bottom left) → **Data collection and modification** → **Data filters**.
2. If a filter called **Internal Traffic** is listed, click it. If not, click **Create filter** → **Internal traffic**, name it `Internal Traffic`.
3. Check it reads: Filter operation **Exclude**, parameter value **internal** (`traffic_type` equals `internal`). You don't need an IP rule under "Define internal traffic"; the site sets the parameter itself.
4. Leave **Filter state: Testing** for a day after the team has marked their browsers. In Testing, GA4 only labels the data; nothing is excluded yet.
5. Then set **Filter state: Active** and **Save**. From then on, team visits are left out of all reports.
   - Active filters are permanent for new data: excluded visits can't be recovered later.

## Events

| Event | When | Parameters |
|---|---|---|
| `page_view` | Every page, including in-site navigation (GA4 enhanced measurement, history changes) | automatic |
| `generate_lead` | A form submitted successfully | `form`: `home`, `book-a-call` or `free-system`; `lead_magnet`: `free-system` for the funnel; `page`: path |
| `view_lead_magnet` | A lead-magnet landing page opened | `lead_magnet`: `free-system` |
| `book_call` | The funnel's booking confirmation shown (GoHighLevel returned with `?booked=1`) | `source`: `free-system` |

- **Useful report:** Explore → Free form. Rows: `lead_magnet` × Session source / medium. Values: event count of `generate_lead`.
- **What's never sent to GA:** personal data (names, emails, phone numbers).

## GoHighLevel tags (workflow triggers)

Website leads reach GoHighLevel through its API, so GHL never records a "form submission", and workflows using the **Form Submitted** trigger never fire for them. Instead, the lead handler tags every contact it creates or updates:

| Form | Page | GHL tag | GHL source (unchanged) |
|---|---|---|---|
| Free system funnel | `/free-system/` | **`free-system-lead`** | `Funnel - Free System` |
| Homepage form | `/` | **`website-lead`** | `Website form` |
| Book a Call form | `/book-a-call/` | **`website-lead`** | `Website form` |

- **In GHL workflows,** use the trigger **Contact Tag → Tag Added → `free-system-lead`** (or `website-lead`) instead of Form Submitted.
- **Existing tags are kept.** The tag is added with GHL's Add Tags API after the contact is saved. Upsert's own `tags` field would replace all existing tags, so it isn't used.
- **The tag is added on every submission,** including repeat submissions by an existing contact. If a contact already has the tag, GHL doesn't fire "Tag Added" again. For repeat leads to re-trigger, the workflow (or a team member) must remove the tag at the end.
- **If tagging ever fails,** the visitor still sees success, since the contact is saved. The failure is logged in `private/logs/errors.log`, and the lead backup records `"ghl_tagged": false`, so the tag can be added by hand.
- **Code:** `server/public_html/_server/forms.php` (`tag`) and `lead-handler.php` (`lead_add_tag`).

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
