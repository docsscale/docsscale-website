# Visible content changes — waiting on the source code

Nothing in this list has been changed on the live site. Every item is a visible or
machine-readable content change. They will be made in the Next.js source (not the
exported HTML) and shown to you before deploy.

## A. Approved by you: contact details

Only real contact: **info@docsscale.com** · Location: **Houston, Texas, US** · no phone, no street address.

| # | Where | Currently | Change to |
|---|---|---|---|
| A1 | Footer "Contact" block — all 13 main pages + 404 | `2100 S Lamar Blvd, Suite 210 / Austin, TX 78704 / (512) 555-0148 / hello@docsscale.com` | `Houston, Texas, US` · `info@docsscale.com` |
| A2 | Homepage CTA form, under the button | `Or call (512) 555-0148 · replies within one business day` | `Or email info@docsscale.com · replies within one business day` |
| A3 | /book-a-call/ form, under the button | same as A2 | same as A2 |
| A4 | Form error, homepage + /book-a-call/ (JS) | `Something went wrong. Please call us instead.` | `Something went wrong. Please email info@docsscale.com instead.` |
| A5 | Form network error, homepage + /book-a-call/ (JS) | `Couldn't reach the server. Please call us instead.` | `Couldn't reach the server. Please email info@docsscale.com instead.` |
| A6 | /about/ "Where" block | `2100 S Lamar Blvd, Suite 210 / Austin, TX 78704 / (512) 555-0148 · hello@docsscale.com` | `Houston, Texas, US · info@docsscale.com` |
| A7 | Homepage FAQ intro | `Something missing? Email hello@docsscale.com and a person answers.` | `… Email info@docsscale.com …` |
| A8 | /privacy/ contact paragraph | `…can be sent to hello@docsscale.com.` | `info@docsscale.com` |
| A9 | /terms/ contact paragraph | `…can be sent to hello@docsscale.com.` | `info@docsscale.com` |
| A10 | JSON-LD on every indexable page (13) | `@type: ["MarketingAgency","LocalBusiness"]`, street address, phone, `hello@` | see below |
| A11 | llms.txt | phone, street, hello@, placeholder note | **done in Track A** (server file) |

**A10 schema.** `MarketingAgency` is not a schema.org type (Google ignores it), and
`LocalBusiness` expects a public street address. For a business without a public
address, use `Organization`, with a partial `PostalAddress` and `areaServed`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://docsscale.com/#organization",
  "name": "DocsScale",
  "url": "https://docsscale.com/",
  "logo": "https://docsscale.com/favicon.png",
  "email": "info@docsscale.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Houston",
    "addressRegion": "TX",
    "addressCountry": "US"
  },
  "areaServed": { "@type": "Country", "name": "United States" },
  "knowsAbout": ["Healthcare marketing", "Patient acquisition"]
}
```
No `telephone`, no `streetAddress`, no `postalCode`. The `Service` blocks then point at
`{"@id": "https://docsscale.com/#organization"}` as `provider`.
Question for you: `sameAs` currently lists `https://doctorsscalepartners.com`. Keep it only if you own it.

## B. Needs your decision: placeholders still visible on the live site

Found during the inventory. These are **visible to visitors today**:

| # | Page | Visible text | Question |
|---|---|---|---|
| B1 | /results/ (under the stats row) | "Sample figures. Replace with verified numbers before launch." | You said the case studies are real. Should this line be removed, and are the stats above it (reply time 2 min, show-up 91%, 100%) verified? |
| B2 | /about/ | "Founder photo, real, in the office" (image placeholder) | Supply the photo, or remove the slot? |
| B3 | /about/ team | "Team photo · [Name] · Paid media and funnels" and "Team photo · [Name] · Front-desk follow-up and scripts" | Real names/photos, or remove the two cards? |
| B4 | /about/ facts | "Founded 2024 · Austin, Texas" | Change to Houston, Texas? And is 2024 correct? |
| B5 | Homepage hero | "Clinic photo: real team, real rooms" (image placeholder) | Supply a photo, or keep the illustrated slot? |
| B6 | /free-system/thank-you/ | "DELIVERY GRAPHIC — 800×500" placeholder | **Resolved in the rebuild.** The live HTML had been hand-edited to show the hero mockup, but visitors arriving from the form (client-side navigation) still saw the placeholder. The rebuild shows the image in both cases. |

Client-clinic locations inside case studies ("Dental · Austin, TX", "Dr. Anita Patel … Austin, TX",
"Dr. Marcus Reid, Chiropractic · Austin, TX") are the clients' own locations. Per your note that
case studies are real, these stay unchanged.

## Your answers (2026-09-25)

- **B1 Results figures:** keep the current figures; you'll update them yourself. The
  "Sample figures. Replace with verified numbers before launch." line will be proposed for
  removal with a before/after screenshot.
- **B2, B3, B5, B6 photo slots:** stay as they are; you'll upload the photos yourself
  (the rebuild keeps each slot as a clearly named image in `web/public/images/`).
- **B4 About facts:** "Founded 2025 · Houston, Texas".
- **A10 schema:** `Organization`, Houston, TX, US, no street address.
