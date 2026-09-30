# docsscale.com — Agency review

Date: 2026-09-30 · Site reviewed: **v1.2.0 as live on production** (commit `d78216b`) · Scope: review only. Nothing was changed on the site, the server, GoHighLevel or DNS.

Each role audits what exists against what a professional team would deliver. This is a soundness pass, not a redesign or rebuild brief. **Any visible change proposed here needs a before/after and the owner's approval before it's built.** Creative / Motion was skipped as agreed. It comes up once below (FE-1) because the measurements point at the hero entrance.

## 0. How it was reviewed

| Area | How | Evidence |
|---|---|---|
| Every page (18) at 320, 375, 768, 1024, 1440 px | Playwright on the production build: horizontal overflow, headings, alt text, duplicate ids, landmarks, tap targets, text size, console errors, metadata, JSON-LD, all internal links | 90 page views |
| WCAG 2.2 AA | axe-core 4 (wcag2a/aa, 21a/aa, 22aa, best-practice) at 375 and 1440 px, then a colour-contrast re-run with animations settled | 36 page views |
| Performance | Lighthouse 12.8, mobile (simulated throttling), **against the live site**, one run per page, from outside the US | 8 key pages |
| Server, CDN, DNS, TLS | `curl` headers and redirect chains, `dig`, certificate | live hosts |
| Lead handler / GHL | Source review of `server/public_html/_server/` and the browser submit code; the 83 PHP tests | repo |
| Analytics / search | GA4 Data API (events, last 7 days), Search Console sitemap status, Bing feed status | live accounts |
| Docs | PHASE5-PLAN, HANDOVER, CHANGELOG, REPORT, ARCHITECTURE, CLIENT-GUIDE, CONTENT-CHANGES, QA-CHECKLIST | repo |

**Not covered:**
- **Safari/WebKit and Firefox.** Only Chromium is installed; see QA-5.
- **Real-user Core Web Vitals.** Nothing collects them yet; see FE-4.
- **The server's `private/logs/`** was not read, because it is production data.
- **PHP's execution-time limit on the host** wasn't checked; see BE-1.
- **`docs/seo/SEO-OS-V1.md`** doesn't exist. It was removed on 29 Sep at the owner's request (PM-5).

**Severity** (same scale as [AUDIT.md](AUDIT.md)):
- **Critical:** live harm now.
- **High:** meaningful risk or cost, fix soon.
- **Medium:** real gap, schedule it.
- **Low:** polish or hygiene.

**Visible** means a visitor would see the change, so it needs a before/after and approval.

**Headline:** there are **no critical findings**. The site is secure, consistent, fully linked, valid for search engines and clean on the brand rule. The main gaps:
- Leads can still be lost in two edge cases (BE-1, BE-3), and nobody is told when anything fails (BE-2).
- Form messages aren't announced to screen readers (QA-1).
- The homepage and paid-ads landing page load their main content slowly on phones (FE-1).
- Placeholders are still visible on the homepage (UX-1).
- The project has no single "where are we" tracker (PM-1).

---

## 1. Project Manager & Client Lead

| # | Sev | Finding | Evidence | Recommendation | Visible |
|---|---|---|---|---|---|
| PM-1 | **High** | **No single status tracker; the plan's status line is wrong.** Progress lives only in the CHANGELOG and chat. There are no dated milestones and no budget tracking; the plan only has effort estimates in days. | `PHASE5-PLAN.md:3` says "Nothing here has been built yet". In fact 5A is partly done, and most of 5B shipped as v1.2.0. No doc has dates beyond "5–7 working weeks" or any cost or time budget. | Add a short status table to `PHASE5-PLAN.md`: each item with done / in progress / not started, date and owner, plus the hours or budget used if you track them. Update it with every release. | No |
| PM-2 | Medium | **Five Phase 5A items are open but not listed as open anywhere.** | Not built: <br>• UTMs and landing page forwarded to GHL (5A.2; `TRACKING.md:112` "Planned") <br>• Microsoft Clarity (5A.5) <br>• uptime monitoring (5A.6) <br>• brand-rule CI check (5A.8, section 0) <br>• link checker (5A.8) <br>Done: GA4 + consent, UTM standard, events, Search Console, Bing, email authentication. | Put these in the tracker (PM-1). UTM forwarding and uptime monitoring are the valuable ones (see BE-2, SEO-6). | No |
| PM-3 | Medium | **Open decisions in the plan were never closed.** | The `PHASE5-PLAN.md` §0 "Needs your decision" table has three questions: "GoHighLevel" in the funnel's name, the integrations strip, analytics tags in the page source. None has a recorded answer. | Record the answers, or say they're still open. | No |
| PM-4 | Medium | **Some docs are out of date but read as current.** | • `CONTENT-CHANGES.md` opens with "waiting on the source code"; the source has existed since v1.0. <br>• `PHASE2-PLAN.md` (25 Sep) says the source "is not on this Mac". <br>• `REPORT.md` is the v1.0 snapshot (27 Sep), and its Lighthouse table is lab-local (see FE-1). | Add a one-line "Historical, superseded by …" banner to these three. Don't rewrite them. | No |
| PM-5 | Low | **SEO-OS-V1 can't be reviewed.** | `docs/seo/` doesn't exist. It was removed on 29 Sep at the owner's request, and SEO is paused. | When SEO resumes (5C), decide whether that document comes back. The plan for 5C is currently only `PHASE5-PLAN.md` §5C and `SEO-STRATEGY.md`. | No |
| PM-6 | Low | **The client guide doesn't cover v1.2.** | `CLIENT-GUIDE.md` never mentions Industries or the menus. `ARCHITECTURE.md:88` still says "19 scenarios" without the nav behaviour tests. | Add "Adding an industry page" and "Changing the menus" to the guide, and update the ARCHITECTURE test table. | No |
| PM-7 | Low | **There was no backlog for deferred items.** | The homepage "Built for your kind of clinic" note, the seven vs eight services wording, and the service pages all lived only in chat. | Done in this review: [BACKLOG.md](BACKLOG.md). | No |

**Works well:**
- Every release since v1.0 is in the CHANGELOG, with approvals noted.
- HANDOVER lists every account and where each credential is kept, the email-authentication state and the DMARC schedule.
- The change process (branch + PR, approval per merge and deploy) is written down and followed since the one slip it logs.

---

## 2. UI/UX & Web Designer

| # | Sev | Finding | Evidence | Recommendation | Visible |
|---|---|---|---|---|---|
| UX-1 | **High** | **Placeholder boxes are live on the homepage.** Visitors see dashed boxes labelled "Clinic photo: real team, real rooms" (hero) and "Ad creative: your team, your rooms" (System section). About shows initials instead of team photos. | `features/home/Hero.tsx:174` and `System.tsx:155` (`<Placeholder>`). These are on production today. The owner to-do is `HANDOVER.md` #4. | Best: supply the photos (sizes in `incoming/README.md`). Until then, two options for a before/after: <br>• a styled brand tile, with no "photo goes here" text; <br>• hide the tile and let the text span the width. | **Yes** |
| UX-2 | Medium | **The number of services differs by page.** | • Nav, footer and schema: the seven confirmed services. <br>• `/services` headline "Eight services…", its meta description, and the "Jump to a stage" counts (Capture "2 services"). <br>• The homepage grid shows eight. <br>• Industry pages link "See all 8 services →". | Owner decision: align with the SEO work (5C). Tracked in [BACKLOG.md](BACKLOG.md). | Yes (later) |
| UX-3 | Medium | **Forms have no visible labels, only placeholders.** The field name vanishes once typing starts, which is hard for people checking their entries. | Home, Book a Call and funnel forms use `placeholder` plus `aria-label` (`HomeLeadForm.tsx:64–79`). There is 1 `<label>` in the whole codebase. | Small visible labels above the fields, or floating labels in the current field style. See also QA-3. | **Yes** |
| UX-4 | Low | **The dropdown arrow is barely visible.** At 10 px the ▾ glyph renders as a dot next to "Services" and "Industries". | Screenshots in the v1.2 review. It was the same glyph and size before. | A 10–12 px SVG chevron in the ink colour. | Yes |
| UX-5 | Low | **Specialty names switch case.** | "Physical Therapy", "Med Spa" in the nav, footer, cards and chips. "Physical therapy", "Med spa" in form dropdowns, the served-specialties list, `llms.txt` and GHL options. | Pick one: sentence case matches the rest of the site's UI. GHL options would need the same change. | Yes |
| UX-6 | Low | **Colours outside the design tokens.** | • Error red `#B4432F` (`FunnelForm.tsx:104`, `FunnelProblem.tsx:58`) and five funnel border tints (`FunnelEligibility.tsx`) aren't tokens. <br>• About 120 more hex literals repeat token values instead of using `T`. | Add `danger` and the tint borders to `styles/tokens.ts`, and replace the literals as components are next touched. | No |
| UX-7 | Low | **Text below 12 px.** | 10 px funnel stat labels ("Pre-built funnels included", "Free to keep forever"…) and 11 px homepage mockup labels ("After hours", "No-shows"). | 12 px minimum; the mockup labels can stay as illustration. | Yes |

**Works well:**
- No horizontal scrolling on any page at 320–1440 px.
- One clear H1 per page, and a consistent type scale, radius, hairlines and stage colours.
- The new menus follow the existing pill language.
- The funnel matches the main site's tokens.

---

## 3. Lead Frontend Engineer

| # | Sev | Finding | Evidence | Recommendation | Visible |
|---|---|---|---|---|---|
| FE-1 | **High** | **The main content appears late on phones: homepage, dental page and the paid-ads landing page.** The biggest element is ready in about 0.8 s but painted about 3 s later, because the hero entrance starts at zero opacity with staggered delays. | Live Lighthouse, mobile, one run each: <br>• `/`: Performance 81, LCP 4.3 s, render delay 3.4 s <br>• `/free-system/`: 82, LCP 4.3 s, render delay 3.1 s <br>• `/industries/dental/`: 86, LCP 3.7 s <br>Target is ≥ 90 (`REPORT.md`). `REPORT.md`'s 93–99 were measured on a local server. Cause: `styles/motion.css:32–71`, `tile-rise` 0.9 s, delays up to 0.77 s, `backwards` fill. <br>Other pages: `/services/` 93, `/industries/` 94, `/results/` 94, `/book-a-call/` 94. | 1. Collect real-user Web Vitals first (FE-4), to confirm the problem outside the lab. <br>2. If confirmed, the lightest fix keeps the motion but starts from visible: animate position only, or opacity from about 0.6, with shorter delays. That changes the approved animation, so a before/after comes first. | Yes (subtle) |
| FE-2 | Medium | **The funnel booking page is heavy** because of the GoHighLevel calendar. | `/free-system/book-a-call/`: Performance 64, Best Practices 79, TBT 320 ms, 2.2 MB. Almost all of it is the third-party calendar iframe. | Load the calendar when it scrolls into view, with a same-size placeholder so nothing jumps. Or accept it as a third-party cost. | Slightly |
| FE-3 | Medium | **The code is hard to maintain.** | • 1,190 inline `style={{…}}` objects against 210 `className` uses. <br>• Components of 1,130 lines (`ResultsCases.tsx`), 888 (`HowItWorksSteps.tsx`), 825 (`FunnelAutomations.tsx`), 777 (`home/System.tsx`). <br>• Responsive rules rely on `#id` selectors with `!important` in `globals.css`. <br>• Copy is hard-coded in the large components (none of the four imports `@/content`), against the "edit copy in `content/`" rule, so copy edits there need a developer. <br>This came from the pixel-identical rebuild. It works and is fully tested. | Don't rewrite. When a page next changes, move its copy into `content/` and repeated styles into small components or classes. | No |
| FE-4 | Low | **No real-user performance data and no performance budget in CI.** | GA4 receives no Web Vitals. The ≥ 90 target in `REPORT.md` isn't checked on any push. | Send Web Vitals (LCP, INP, CLS) to GA4 after consent, using the small `web-vitals` library. Optionally add a Lighthouse check to CI that warns below 90. | No |
| FE-5 | Low | **Dependencies are current, with nothing urgent.** | `npm audit --omit=dev`: 0 vulnerabilities. Next 16.3.6 → 16.3.7 patch available. TypeScript 7 and ESLint 10 are major versions, not needed. | Take the Next patch with the next release. | No |

**Works well:**
- Page weight is 294–399 KB on the main pages.
- CLS is 0 everywhere, and total blocking time is 20–60 ms.
- No render-blocking scripts.
- CI runs lint, types, format, build, audit, pixel parity (54 shots), 19 interaction scenarios and 30 nav behaviour checks on every push.

---

## 4. Backend & CMS Engineer (lead handler and GoHighLevel)

| # | Sev | Finding | Evidence | Recommendation | Visible |
|---|---|---|---|---|---|
| BE-1 | **High** | **The lead backup is written last, so a slow GoHighLevel can still lose a lead.** Since the fill-only change, one submission makes up to five GHL calls in sequence: lookup, custom-field list, upsert, note, tag. The backup (`lead_store`) runs only after all of them. If PHP hits its time limit or fails in between, there's no backup and the visitor sees an error. | `lead-handler.php`: `lead_find_contact` (10 s timeout), `lead_custom_field_ids` (10 s; cached a day), upsert (15 s), `lead_add_note` (15 s), `lead_add_tag` (15 s). That's up to about 65 s in the worst case. `lead_store` is called after all of them. The host's `max_execution_time` wasn't checked (commonly 30–60 s). | Write the backup **first**, then record the GHL outcome in a second line or a `-result` entry. Also add `ignore_user_abort(true)`, a total time budget of about 20 s with shorter per-call timeouts, and skip the note and tag if the budget is spent (logged). | No |
| BE-2 | **High** | **Nobody is told when something fails.** GHL errors, missing config, untagged or un-noted contacts, and rate-limit hits go only to `private/logs/*.log`, which nobody reads. | `lead_log()` writes to files only. There's no email, no digest and no uptime check (PM-2). | A daily digest, via a Hostinger cron job, emailed to info@ when `errors.log` has new lines or the backup has `sent_to_ghl:false`, `ghl_tagged:false` or `ghl_noted:false`. Plus uptime monitoring (AR-3). | No |
| BE-3 | Medium | **Rate-limited submissions are refused and not backed up.** The overall cap (60 per 10 min) is shared, and the per-visitor limit trusts the `X-Forwarded-For` header, which a bot can fake. A burst of bot traffic could block real leads for 10 minutes, and those leads would leave no trace. | `handle_lead_request`: the rate check calls `lead_respond(429)` before `lead_store`. `lead_client_ip()` notes the spoofing risk. | Back up rate-limited submissions too, marked `rate_limited`, so none are lost. Keep the 429 response. | No |
| BE-4 | Medium | **The browser waits indefinitely.** `fetch()` has no timeout, so on a slow GHL the "Sending…" state can last as long as the server takes. | `useLeadSubmit.ts`, `FunnelForm.tsx`: no `AbortController`. | A timeout of about 25 s, then a clear message. With BE-1 in place, the lead is already saved by then. | Yes (message) |
| BE-5 | Medium | **Server files grow forever.** | `errors.log` and `rejected.log` are never rotated. There's one rate-limit file per visitor that's never deleted. The monthly lead files are kept until someone deletes them (`SERVER.md` suggests 12 months). | A small cleanup inside the handler, about 1 in 100 requests: delete rate-limit files older than a day, rotate logs over 1 MB. Lead retention stays a manual owner decision. | No |
| BE-6 | Low | **Some edge cases are recorded ambiguously.** | • `ghl_existing:false` means either "not found" or "lookup failed", and only the log tells them apart. <br>• The custom-field id cache (24 h) isn't cleared if a field is renamed in GHL. <br>• Phone matching relies on GHL's own normalisation. | Record `ghl_existing:null` when the lookup failed. Add one line to `SERVER.md`: delete `private/cache/custom-fields.json` after adding or renaming a custom field in GHL. | No |
| BE-7 | Low | **The GHL paths are only exercised in production.** Staging is in test mode, so lookup, fill-only, note and tag only run for real leads. Each release needs a live QA lead. | `private-staging/config.php` has `test_mode`. The v1.1.3 and v1.1.4 QA leads were run on production. | Optional: a free or cheap GHL test sub-account for staging. That's a new service, so it's your decision. | No |

**Works well:**
- Secrets are outside the web root.
- Same-origin check, size limits, honeypot, and generic error messages (nothing leaks).
- A missing config still backs leads up.
- 83 PHP tests cover every branch, including failures.
- Fill-only is verified on production: the name and source were kept, the note and tag were added, and Locations was saved as "3-5".

---

## 5. QA & Cross-Device Specialist (including the first formal WCAG 2.2 AA pass)

| # | Sev | Finding | Evidence | Recommendation | Visible |
|---|---|---|---|---|---|
| QA-1 | **High** | **Form messages aren't announced to screen readers** (WCAG 4.1.3 Status Messages, AA). "Sending…", the errors and the success message change on screen, but assistive technology isn't told. On success the form is replaced and focus is lost. | No `aria-live`, `role="status"` or `role="alert"` anywhere in `web/src`. | Put the message area in `role="status"` (errors in `role="alert"`), and move focus to the success heading. | No |
| QA-2 | Medium | **No skip link, and the header and footer aren't landmarks** (2.4.1 Bypass Blocks; axe `region`). | axe `region` fires on every page: 237 nodes over 36 page views. The header and footer are `<div>`s. There's no skip link. | Make the header `<header>` and the footer `<footer>`, and add a "Skip to content" link that only appears when focused. | Only on keyboard focus |
| QA-3 | Medium | **No `autocomplete` on name, email, phone or organisation** (1.3.5 Identify Input Purpose, AA). Browsers and assistive tools can't autofill. Placeholder-only labels too (UX-3). | No `autoComplete` on any lead field; the only one is on the honeypot. | Add `autocomplete="name"`, `"email"`, `"tel"` and `"organization"`. | No |
| QA-4 | Low | **Decorative numbers fail contrast.** The large "01"–"04" on `/free-system/` measure 1.1:1. They're decoration, but screen readers read them. | axe `color-contrast` at 1440 px, with animations settled. | `aria-hidden="true"` on the four numbers. | No |
| QA-5 | Medium | **Only Chromium is tested.** Safari on iPhone is likely the main browser for clinic owners. | Playwright has only Chromium installed. CI installs `chromium` only (`ci.yml:58`). | Install the WebKit and Firefox engines (a download, needs your OK), run the interaction and nav tests on WebKit in CI, and spot-check a real iPhone each release. | No |
| QA-6 | Low | **Footer links are about 21 px tall on phones.** They pass WCAG 2.5.8 through the spacing exception, since there's 10 px between them. | Target-size scan at 375 px. | No action needed. Worth keeping the spacing if the footer changes. | No |
| QA-7 | Low | **No automatic link checker** (PM-2). | Manual check today: 311 internal links and anchors, 0 broken. | Add the link check used for this review to CI. | No |

**Works well:**
- **axe:** with animations settled, the only contrast issue is QA-4. There are no failures for missing names, labels, alt text or ARIA.
- **Page structure:** one `<h1>` and one `<main>` per page, no skipped heading levels, no duplicate ids.
- **Menus:** keyboard, touch, Escape, focus-out and scroll lock are tested automatically.
- **Forms:** double submission is blocked. The server validates required fields, email, lengths and origin. The funnel booking calendar loads with no console errors.

---

## 6. Technical Solutions Architect (Hostinger hosting, CDN, DNS, caching)

**Verdict:** the setup is sound, and there's no reason to change the stack or architecture. A static Next.js export with a small PHP lead relay on Hostinger fits a marketing site of this size.
- The CDN serves Brotli and HTTP/3.
- Hashed assets are cached for a year as `immutable`.
- Security headers include HSTS, CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy` and `Permissions-Policy`.
- The Let's Encrypt certificate covers both names and renews before 27 Dec 2026.
- Staging is password-protected, uses separate private data and makes no GHL calls.

| # | Sev | Finding | Evidence | Recommendation | Visible |
|---|---|---|---|---|---|
| AR-1 | Medium | **Removed pages are still served.** Deploys never delete files, so the old industry pages' HTML still answers. | `https://docsscale.com/services/dental/index.html` → **200**, the old page with the old menu. The same goes for `index.txt` and the other three. The redirect only matches the folder URL. `ARCHITECTURE.md:105` says old files "stay harmlessly", which is true for hashed assets but not for HTML. | 1. Extend the redirect to `services/<industry>/(index\.(html\|txt))?`. <br>2. Give the deploy a *prune* step that lists server files not in the release. Dry run first, and deleting needs your approval each time. | No |
| AR-2 | Medium | **Deploys aren't atomic.** About 225 files go up one by one over 1–2 minutes. A visitor mid-deploy can get new HTML that points at scripts not uploaded yet. | `scripts/deploy.mjs`: `.htaccess` first, then everything in alphabetical order. | Upload `_next/` assets first and HTML last, a small ordering change. With today's traffic the risk is small. | No |
| AR-3 | Medium | **No uptime monitoring** (5A.6). Nobody would know if the site, the lead endpoint, the booking subdomain or the certificate failed. | No monitor configured. | Free UptimeRobot (planned in 5A): homepage, `/free-system/`, the lead endpoint (a GET returning 405 counts as up), `booking.docsscale.com`, and certificate expiry. It's a new account, so your OK is needed. | No |
| AR-4 | Low | **HTML isn't cached at the CDN.** Every page view goes to the origin server. | `x-hcdn-cache-status: DYNAMIC`, and no `Cache-Control` on HTML. TTFB is fine today (120–240 ms at the origin). | Optional: a short CDN cache for HTML (`s-maxage=300`). The deploy already purges the cache. | No |
| AR-5 | Low | **Small hardening gaps.** | • `http://www` → `https://www` → the bare domain is 2 hops. <br>• HSTS has no `includeSubDomains`. <br>• No CAA record. <br>• No DNSSEC. | Add a CAA record for Let's Encrypt and Hostinger's CA: a DNS change, shown to you first. Leave the others as they are. | No |
| AR-6 | Low | **The lead backups aren't backed up anywhere else.** | `private/leads/*.jsonl` depends only on Hostinger's backups, which weren't verified in this review. | A monthly download to `~/DocsScale-Secure/`, or check that Hostinger's daily backup includes `private/`. | No |

---

## 7. Technical SEO & Analytics Specialist

| # | Sev | Finding | Evidence | Recommendation | Visible |
|---|---|---|---|---|---|
| SEO-1 | Medium | **Duplicate copies of the old industry pages are still reachable** (AR-1). | `/services/<industry>/index.html` returns 200. Its canonical points at the old folder address, which redirects. | Fixed by AR-1. | No |
| SEO-2 | Medium | **The sitemap's `lastmod` dates are stale.** | 11 of 15 URLs still say 2026-09-17, although every page's header and footer changed in v1.2.0 and the privacy page changed on 29 Sep. | Generate `lastmod` at build time from each page's last git change. | No |
| SEO-3 | Low | **Three page titles get cut off in search results.** | `/industries/` 80 characters, `/services/` 68, `/free-system/` 61. The limit is about 60. | Shorten them with the keyword map (5C). They're copy changes, so they need your approval. | Search results only |
| SEO-4 | Low | **Structured data and the page disagree on the service count.** | The `/services` schema now lists the seven confirmed services, while the page and its meta description say eight (UX-2). | Resolved with UX-2. | No |
| SEO-5 | Medium | **GA4 will count fewer leads than GHL, and the reason isn't written down.** With basic consent mode, GA4 only sees visitors who click Accept. The UTM source doesn't reach the CRM (PM-2). | GA4, last 7 days: `generate_lead` 4, `view_lead_magnet` 4, `form_start` 3, `page_view` 28. No `book_call` yet. The GA4 admin to-dos (key events, custom dimensions, Internal Traffic filter) are still open (`HANDOVER.md` #3; a reminder is scheduled for today). | Write in `TRACKING.md` that GHL tags are the lead count of record and GA4 shows trends. Add UTM forwarding to GHL (5A.2) so every contact shows its source. | No |
| SEO-6 | Low | **The moved URLs need watching in Search Console.** | The sitemap was last downloaded 29 Sep, before the move (14 URLs, valid). The 30 Sep resubmission is pending. Bing is pending as well. | A check in about 2 weeks: Pages report, the four old URLs showing as "Page with redirect", the new ones indexed. The Bing check is already scheduled for 7 Oct. | No |

**Works well:**
- Canonical tags are correct on all 16 indexable pages. `noindex` is on both 404 pages and the funnel thank-you page.
- JSON-LD parses on every page: Organization with one `@id`, BreadcrumbList, Service, FAQPage.
- The redirects are one hop each, including www (16 of 16 on production).
- The sitemap is valid, with 15 URLs, all returning 200.
- `llms.txt` is current. AI crawlers are allowed. The brand-rule scan of the public build is clean.

---

## 8. Top 10 priorities across all roles

| # | Finding | Sev | Why first | Effort | Visible |
|---|---|---|---|---|---|
| 1 | **BE-1** Back up each lead before calling GHL; add a time budget | High | The one remaining way to lose a lead outright | ½ day | No |
| 2 | **BE-2 + AR-3** Failure digest email + uptime monitoring | High | Failures are currently silent | ½ day + account | No |
| 3 | **QA-1** Announce form messages to screen readers; move focus on success | High | WCAG AA failure on every form | 2 h | No |
| 4 | **FE-1** (after FE-4) Hero content shows late on the homepage and paid-ads landing page | High | Paid traffic lands there; lab LCP 4.3 s | Measure 1 h, then ½ day | Yes |
| 5 | **UX-1** Replace the homepage placeholders (photos, or an interim tile) | High | Visible "photo goes here" boxes hurt trust | Owner photos, or 2 h | Yes |
| 6 | **PM-1 + PM-2** One status tracker with the open 5A items | High | Scope and timeline can't be followed today | 1 h | No |
| 7 | **AR-1 / SEO-1** Redirect or prune the old `/services/<industry>/index.*` files | Medium | Old pages still served with old content | 1 h + prune | No |
| 8 | **QA-2 + QA-3** Header/footer landmarks, skip link, `autocomplete` | Medium | Completes the WCAG AA basics | 2 h | Keyboard only |
| 9 | **BE-3** Back up rate-limited submissions | Medium | Bot bursts could block real leads silently | 1 h | No |
| 10 | **QA-5** WebKit (Safari) in CI + a real-iPhone spot check | Medium | Owners mostly browse on iPhones | ½ day | No |

**Next:** once you've read this, pick the items to schedule. Each goes on its own branch. Invisible fixes get tests and a PR. Visible ones (FE-1, UX-1, UX-3 and the others marked Yes) get a before/after for your approval first.
