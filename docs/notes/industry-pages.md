# Industry pages: findings and proposed approach

**Written 7 Oct 2026** for the session that takes over this work. Nothing has
been built; this is a handover note. Everything here was checked against the
live site (production v1.4.6) and `main` on that date.

## Status (9 Oct 2026)

- **All four pages** show their `/results/` case, quoted exactly (PR #89,
  merged 8 Oct; `caseStudy` in `web/src/content/specialties.ts`).
- **Questions section:** each specialty can carry a `faqs` list. The page shows
  "What <specialty> owners ask us." and FAQPage schema built from the same
  list, and shows nothing while the list is empty.
- **Dental questions:** the owner had no list of his own and asked Claude to
  research them (8 Oct). Seven questions were drafted from that research. Every
  answer about DocsScale reuses claims already on the live site (How it works,
  Services, homepage, Results), and the Dallas case is quoted exactly. Left out
  on purpose: practice software names, treatments as our experience beyond
  those the page already names, new Dallas details, and spend benchmarks.
- **Chiropractic, physical therapy and med spa questions** (9 Oct): the owner
  asked for the same on the other pages. Six questions each, researched per
  specialty (not dental questions with the name swapped). Each quotes its own
  Results case exactly and reuses only claims already on the site. Left out on
  purpose: unsourced percentages, exact dollar limits, Meta's current
  before-and-after rule, and anything about texting.
  Draft and sources: `reviews/dental-faq/` in the project files.
- **Next:** physical therapy, chiropractic and med spa get their own questions,
  one page at a time. Don't copy the dental questions with the specialty
  swapped.

## Why this came up

The owner received a prompt asking for two fixes, "then deploy to production":

1. add `<lastmod>` to the sitemap, and
2. expand the four industry pages to 1,200–1,500 words each.

**Item 1 is already done.** The sitemap is generated at build time
(`web/scripts/generate-sitemap.mjs`, PR #51) and is live in v1.4.6 with a real
date on all 15 URLs. The prompt's claim that the sitemap had no `<lastmod>` was
wrong even before that: the dates existed but most were stale.

Item 2 is the open work, and the prompt as written conflicts with the project
rules (below).

## The four pages today

Word counts are the visible text inside `<main>` on the live page, 7 Oct 2026.
The prompt said "about 600 words" for dental; the measured figure is lower.

| Page | Words today | Primary keyword (approved keyword map) | Searches / month (US) | Matching `/results/` case study |
|---|---|---|---|---|
| `/industries/dental/` | 391 | dental marketing agency | 100–1K | Dental, Dallas, TX. Jan–Jun 2026: "184 new patients booked in six months. 91% showed." Service line: implants. |
| `/industries/chiropractic/` | 352 | chiropractor marketing agency | 100–1K | Chiropractic, Tampa, FL. Aug 2026: "31 dormant patients rebooked in the first month. Zero ad spend." Service line: reactivation. |
| `/industries/physical-therapy/` | 380 | physical therapy marketing | 100–1K | Physical therapy, Denver, CO. Feb–Jul 2026: "2.4× more post-op evaluations on the same ad budget." Service line: post-op rehab. |
| `/industries/med-spa/` | 363 | med spa marketing agency | 100–1K | Med spa, Las Vegas, NV. Q1 2026: "62 booked consults from one injectables campaign." Service line: injectables. |

- Keywords, secondary keywords and who ranks today:
  [docs/seo/keywords/keyword-map.md](../seo/keywords/keyword-map.md), "Existing
  pages". Chiropractic also carries "chiropractic marketing" as a secondary term
  by the owner's decision.
- The four case studies are real, with permission on file (owner, 6 Oct 2026;
  [COMPLETION-PLAN.md](../COMPLETION-PLAN.md)). Quote them exactly as they
  appear on `/results/` (`web/src/features/results/ResultsCases.tsx`); don't
  round, restate or extend the numbers.
- The keyword map marks the rest of each page's "only we can say" material as
  *needed* from the owner: practice software we have actually worked with in
  that specialty, and the treatments we build campaigns around.
- All four pages share one layout and one content file today
  (`web/src/content/industries.ts`, route
  `web/src/app/(site)/industries/[specialty]/page.tsx`).

## Where the prompt conflicts with CLAUDE.md

| The prompt says | The rules say |
|---|---|
| "Deploy to production, not staging." | Anything visible gets a before/after and the owner's approval before merge; staging first; the owner's go-ahead for every production deploy (CLAUDE.md sections 1 and 4). |
| Expand all four pages in one go. | "Steady publishing pace (about two to three strong pages or posts a week), not a burst" (section 2, content quality rules). |
| "Where real proof would go, leave a clear placeholder like [ADD CLIENT RESULT]." | "Every page must include something only DocsScale could say before it is published." A placeholder on a live page would also be visible to visitors. It isn't needed: each page has a real case study. |
| Add "the specific problems that specialty faces" and "how the service works", for each of four pages. | "No scaled or templated pages": four pages written to one outline, with the specialty swapped, is the pattern the rule forbids. "Flag any page that may be too similar to an existing one before asking for approval." |
| New H1, H2s, meta title and description. | "Every visible copy change needs the owner's approval." The completion plan adds: each page's copy comes as a draft with its keyword, the "only DocsScale" element marked, and a similarity note. |
| "Don't make up stats, client names or results." | Agrees with the rules. Also: unverified facts are written "Unknown", never guessed. |

Two smaller points:

- The prompt asks that the FAQ schema "passes Google's Rich Results Test".
  `web/scripts/site-checks.mjs` already checks in CI that FAQ schema only covers
  questions visible on the page. Google's own test is a website tool; staging is
  password-protected, so test the page's code there (paste the HTML), or test
  the live URL after release.
- Internal links to `/services/`, `/how-it-works/`, `/results/` and
  `/book-a-call/` are fine and wanted. Once the real service pages exist (draft
  PR #45), link to the specific service, not only the `/services/` hub.

## Proposed approach

Follow [COMPLETION-PLAN.md](../COMPLETION-PLAN.md), "Deeper industry pages" and
"How these pages get approved and released", not the prompt.

1. **Dental first, alone.** It has the fullest case study (situation, what we
   built, results) and the page the prompt named.
2. **Ask the owner for the missing real material before drafting:** which
   dental practice software we have worked with for a client (or none), which
   treatments we build campaigns around besides implants, and the five or six
   questions dental owners actually ask on calls. Anything not supplied is left
   out, not invented.
3. **Draft the copy** in `web/src/content/industries.ts` (or a per-specialty
   content file if the pages stop sharing a shape), around:
   - an H1 and H2s using the primary and secondary keywords where they read
     naturally;
   - the Dallas case study, quoted exactly as on `/results/`;
   - how the four stages apply to a dental practice, in our own process words;
   - 5–6 FAQs with visible answers, plus FAQPage schema for exactly those;
   - a meta title under 60 characters and a description under 155;
   - links to `/services/`, `/how-it-works/`, `/results/`, `/book-a-call/`.
   Length follows the content. 1,200–1,500 words is a guide, not a target to
   pad towards.
4. **Send the owner the draft** with: the keyword, the "only DocsScale" element
   marked, and a similarity note against the other three industry pages and
   `/services/`.
5. **Staging**, with before/after at desktop, tablet and mobile. Any new
   section type (FAQ block, case-study block) is a layout change: show it once
   and reuse it.
6. After approval: re-record the visual baseline, merge with the owner's
   go-ahead, release, clear the cache, check the sitemap's `lastmod` for the
   page moved, and ask the owner to request indexing.
7. **Then the next page**, at the plan's pace. Suggested order after dental:
   physical therapy and chiropractic (the keyword map marks both as possible
   early wins), then med spa. Each one needs its own material from step 2; if a
   page would end up as the dental page with words swapped, stop and flag it.

## Open questions for the owner

- Practice software and treatments per specialty (step 2).
- Whether the industry pages wait for the service-page layout in draft PR #45,
  so both use the same FAQ and case-study blocks.
- Whether one session owns all four pages. Two sessions writing the same pages
  will collide.
