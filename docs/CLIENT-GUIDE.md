# Client guide: running the DocsScale website

For the DocsScale team. No coding knowledge is needed to read this. For changes, ask your developer and point them to the right section.

## What you have

- **docsscale.com**: the main website.
- **docsscale.com/free-system/**: the free "patient-getting system" landing page, its thank-you page and its booking page.
- **staging.docsscale.com**: a private copy where every change is checked first. It asks for a username and password (kept in `~/DocsScale-Secure/staging-login.txt`). Forms on staging are test-only and never reach GoHighLevel.

## Where leads go

1. Every form submission goes to **GoHighLevel** as a contact, with its source set ("Website form" or "Funnel - Free System").
2. A copy is also saved on the server (`private/leads/`, one file per month). **If GoHighLevel is ever down, no lead is lost:** your developer can recover it from there.
3. Spam protection is built in:
   - a hidden trap field that bots fill in and people don't;
   - limits on how often one visitor can submit;
   - forms only accept submissions from the site itself.

## Common changes, and how long they take

| You want to… | What to send your developer | Effort |
|---|---|---|
| Change any text | Page, the current sentence, and the new sentence | Minutes |
| Add a team photo | A square photo (at least 800×800 px) and the person's name | Minutes: one line in `about.ts` |
| Replace a photo placeholder (homepage hero, homepage "Ad creative", About founder photo) | The photos (landscape, at least 1600 px wide) | Under an hour |
| Update contact details | The new details. They appear in the footer, forms, structured data and `llms.txt`; your developer changes them in one place | Minutes |
| Switch on Google Analytics | The GA4 Measurement ID (`G-…`) | Minutes: one line; see docs/TRACKING.md |
| Add a new page | The copy and any images | Hours to days |
| Change colours or layout | A description or mock-up | Needs a before/after for your approval |

**Every visible change is shown to you as a before/after and goes live only after you approve it.**

## Rules that keep the site healthy

- **Brand:** nothing on the site should suggest it's AI-built: no "AI" wording in copy, no AI-looking stock imagery.
- **Real information only:** no placeholder names, numbers, reviews or case studies. Results and testimonials must be real and permitted by the client (FTC rules on endorsements).
- **Privacy Policy:** email only. We don't send text messages. If that changes, the Privacy Policy must change first.
- **Keys and passwords:** never share the GoHighLevel token, Hostinger login or staging password by email or chat. See docs/HANDOVER.md for where each one is kept.

## If something looks wrong

1. Check https://docsscale.com/version.txt. It shows which version is live and when it was deployed.
2. Tell your developer what you saw, on which page and device, and when.
3. If it's serious (forms broken, site down), your developer can put back the previous version with one command (docs/RELEASE.md → Rolling back).

## Things we recommend soon

- **Photos:** real photos for the three placeholders (homepage hero, homepage "Ad creative", About founder photo) and for the team cards.
- **Funnel images:** the funnel's hero and gallery images contain garbled, made-up text typical of generated images. Replace them with real screenshots of the system (brand rule).
- **Logo vector file:** ask the logo designer for the original vector file, needed for print (brand/README.md).
- **Optional brand refresh:** align the site's button teal with the logo teal (brand/README.md).
