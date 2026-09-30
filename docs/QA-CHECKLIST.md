# QA checklist

Run this on **staging** before every production release, and on **production** right after deploying (the "after deploy" section). Tick every box or write down why not.

## Automated (must all be green)

- [ ] CI on the release commit: lint/types/format/build, PHP lead-handler tests, dependency audit, pixel + behaviour parity.
- [ ] `npm run test:e2e` locally: 19/19 PASS, form payloads identical; nav behaviour all passed.
- [ ] `npm run visual:compare`: every route identical to `reference/approved/`, or every difference approved.

## Pages (desktop ~1440px and a real phone)

- [ ] Every page loads without console errors:
  - Home, Services, Industries and the 4 industry pages, How it works, Results, About, Book a call, Privacy, Terms;
  - the funnel landing, thank-you and booking pages;
  - a made-up URL, which should show the 404.
- [ ] Header:
  - the logo links home;
  - the Services and Industries dropdowns open on hover and on click/tap, stay open while the mouse moves into them, close on Escape, on a click elsewhere and when Tab leaves them, and their links work;
  - the phone menu opens full height, its Services and Industries sections expand, the page behind doesn't scroll, and it closes on Escape or after tapping a link.
- [ ] Footer: every link works; "Back to top" works; "Cookie settings" reopens the banner (only when GA4 is on).
- [ ] Headline entrance animation plays once. With "reduce motion" turned on (macOS: Accessibility → Display), every headline is complete and static.
- [ ] The homepage specialty picker changes the page text; the service filter tabs work.
- [ ] Funnel gallery:
  - thumbnails open the enlarged view (click, and Enter from the keyboard);
  - Escape, a click, or the × closes it.
- [ ] Images are sharp on a retina screen, and the funnel photos load as AVIF (DevTools → Network → type).

## Forms (on staging: test mode, nothing reaches GoHighLevel)

- [ ] **Homepage form:**
  - required fields enforced;
  - a successful submit shows the success message;
  - the network tab shows a `200 {"ok":true}` from `/send-lead.php`.
- [ ] **Book a call form:** same checks. The phone field is optional.
- [ ] **Funnel form:** a submit goes to `/free-system/thank-you/`.
- [ ] **Error path:** block `send-lead.php` in DevTools and submit. The friendly error with the email fallback appears.
- [ ] **Staging backups:** `private-staging/leads/` holds the test submissions.

## After deploying to production

- [ ] `https://docsscale.com/version.txt` shows the new version.
- [ ] `npm run test:redirects`: the old `/services/<industry>/` URLs 301 in one hop to `/industries/<industry>/`. (On staging: `bash tests/server/redirects.sh https://staging.docsscale.com user:password`.)
- [ ] Purge the CDN cache (hPanel → Websites → docsscale.com → Performance → CDN → Purge all), then hard-reload.
- [ ] Submit **one real test lead** from the homepage with a recognisable name (e.g. "QA Test <date>"). Confirm it appears in GoHighLevel, then delete the contact there.
- [ ] Book-a-call funnel page: the GoHighLevel calendar loads in the iframe.
- [ ] Spot-check 3 pages on a phone.
- [ ] Share preview: paste https://docsscale.com into https://www.opengraph.xyz (or a WhatsApp chat to yourself). The 1200×630 image shows.
- [ ] Search Console: no new errors in Pages or Enhancements within a week.

## When GA4 is switched on

- [ ] The banner appears on a first visit (use a private window), and Accept/Decline hide it.
- [ ] GA4 → Admin → DebugView (or Realtime): `page_view` after Accept; `generate_lead` after a test form submit.
- [ ] After Decline: no `_ga` cookie (DevTools → Application → Cookies).
