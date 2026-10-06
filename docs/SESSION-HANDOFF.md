# Session handoff

**Written 6 Oct 2026**, at the end of the working session that took the site from
v1.1.4 to v1.4.4. For the next session: read [../CLAUDE.md](../CLAUDE.md) first
(the rules), then this. Update this file at the end of each session.

## Where things stand

- **Production: v1.4.4** on docsscale.com (deployed 6 Oct 2026). `main` is at
  the `v1.4.4` tag plus this docs PR. No open pull requests besides it.
- **Staging** (staging.docsscale.com) holds an older test build; redeploy before
  using it for a review.
- **SEO pause lifted** by the owner on 6 Oct 2026. Phase 5C can start.
- All CI checks are green on `main`.

## What shipped this session

| Version | Date | What |
|---|---|---|
| v1.1.4 – v1.2.4 | 30 Sep – 2 Oct | Repeat leads fill only empty CRM fields; Services and Industries menus and `/industries/` pages with 301s; lead saved before the CRM call; daily failure email; form accessibility; real-user Web Vitals in GA4 |
| v1.3.0 | 5 Oct | Phone required with country picker (E.164); clinic website field; more GA4 events; UTM and landing page into the CRM; Clarity after consent; new Book a Call copy |
| v1.4.0 – v1.4.1 | 5 Oct | Homepage hero: animated patient-journey graphic (five example patients) replaces the photo placeholder |
| v1.4.2 | 6 Oct | Homepage "Ad preview" card: stock photo (Freepik Premium) replaces the placeholder |
| v1.4.3 | 6 Oct | Old `/services/<industry>/` files redirected; prune report in the deploy script; Free System stat numbers in the HTML; status tracker |
| v1.4.4 | 6 Oct | Homepage platforms strip cut to four platforms, no longer scrolling |

Server clean-up on 6 Oct, with the owner's approval: 30 old page files, 138 old
build files and five empty folders deleted. Four build files from v1.4.2 were
kept on purpose.

## Open items

**Waiting on the owner**
- GA4 admin setup: key events, custom dimensions, Internal Traffic filter
  (HANDOVER to-do 3).
- About page team photos (still initials); sizes in `incoming/README.md`.
- Delete the QA contact "QA v130 5 Oct" (`info+qa-v130@docsscale.com`) and any
  earlier QA contacts in the CRM.
- "Request indexing" in Search Console for `/privacy/` and `/terms/` (the other
  nine unindexed pages were requested on 6 Oct).
- Gmail header test for email authentication: the owner will say when the test
  email has been sent; then read the headers of that one message only.
- If the daily failure email lands in spam, tell the developer (switch to the
  info@ mailbox's SMTP).

**Completion plan ([COMPLETION-PLAN.md](COMPLETION-PLAN.md))**
- Proposed 6 Oct 2026: CMS for editors, automatic content publishing, the rest
  of the agency review, handover documents. **Waiting for the owner's approval
  and the nine decisions in its section 9. Nothing is built.**

**Agency review ([AGENCY-REVIEW.md](AGENCY-REVIEW.md)), still open**
- 4: slow hero on phones (FE-1). Decide at the 15 Oct Web Vitals review.
- 8: landmarks, skip link, `autocomplete` (QA-2, QA-3).
- 9: back up rate-limited submissions (BE-3).
- 10: WebKit in CI and an iPhone spot check (engine download approved, not yet
  installed).
- PM-4 and PM-6: "historical" banners on old docs; client guide for v1.2.

**Phase 5 ([PHASE5-PLAN.md](PHASE5-PLAN.md) tracker)**
- 5A leftovers: brand-rule CI check, link checker, SSL-expiry monitors, DMARC
  tightening.
- 5B leftovers: real service pages; seven-vs-eight services wording.
- 5C (SEO), 5D (lead magnets app), 5E (blog), 5F (newsletter), 5G: not started.

**Backlog ([BACKLOG.md](BACKLOG.md))**: homepage clinic-type chips linking to
industry pages, long page titles, development-tooling dependency update, "Mobile
number" in two decorative form illustrations.

**Things noticed, not yet decided**
- Live Lighthouse (desktop, 5 Oct) showed a layout shift of 0.010 on the hero in
  two of three runs: the headline wraps differently before the web font loads.
  Well inside the "good" limit; check the real-user numbers on 15 Oct.
- Search Console reported several sitemap pages as "URL is unknown to Google"
  on 6 Oct although the sitemap was read on 3 Oct. Nothing on the site blocks
  them. Recheck after the owner's indexing requests.

## Scheduled reminders (desktop app scheduled tasks)

| Date | Task | What |
|---|---|---|
| 7 Oct 2026 | `docsscale-bing-data-check` | Read-only check of Bing Webmaster data and sitemap status |
| 15 Oct 2026 | `docsscale-web-vitals-review` | Real-user LCP, INP and CLS for the homepage and `/free-system/`; decide on FE-1 |
| 20 Oct 2026 | `docsscale-dmarc-review` | Review three weeks of DMARC reports; plan the move to `p=quarantine` |

## End-of-project reminders for the owner

- Delete the session logs in `~/.claude/projects/-Users-abdulsamad-Downloads-docsscale/`:
  they contain the CRM token, the Bing API key and the UptimeRobot API key.
- Then generate a fresh Bing API key and reset the UptimeRobot API key, and
  update the files in `~/DocsScale-Secure/`.

## Useful facts that are easy to lose

- Hostinger account user `u145389112`, domain `docsscale.com`. Upload
  credentials come from the Hostinger connector's "generate upload URL"
  operation and expire within hours (an expired one gives 403). Clear the
  website cache after every production deploy.
- The daily failure email runs from a Hostinger cron job at 13:00 UTC
  ([SERVER.md](SERVER.md)).
- Monitoring: four UptimeRobot monitors, alerts to info@docsscale.com
  ([HANDOVER.md](HANDOVER.md)).
- Opportunities in the CRM are created by the owner's own workflows there, not
  by the site.
- The visual baseline must be re-recorded on the branch whenever an approved
  visible change lands, or CI's pixel check fails.
- `/services/<industry>/…` must keep redirecting to `/industries/<industry>/`.
