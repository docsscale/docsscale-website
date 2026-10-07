# Contributing

## The one rule

**No visible change reaches the live site without the owner's approval.** That covers copy, layout, colour, spacing and images.

The workflow for a visible change:
1. Make it on a branch.
2. Show a before/after (`tests/visual/before-after.mjs`, or `diff-crops.mjs` for changes spread across many spots).
3. Get approval.
4. After approval, run `npm run visual:approve` and commit `reference/approved/`.

Invisible changes (code quality, performance, accessibility attributes, metadata) must keep the pixel and behaviour tests green against the approved build.

## Branches and commits

- `main` is what's live (or about to be). Only merge into `main` when CI is green.
  - The GitHub free plan can't enforce this on a private repo, so `scripts/deploy.mjs` refuses to deploy a commit whose CI isn't green.
  - When more developers join, move to GitHub Team and turn on branch protection (see [HANDOVER.md](HANDOVER.md)).
- Work on `feature/<short-name>` or `fix/<short-name>` branches. Proposals awaiting a decision go on `proposal/<name>`.
- **One logical change per commit.** Subject line in the imperative, under ~72 characters, with a body explaining *why* when it isn't obvious.
- **Never commit secrets** (`private/config.php`, tokens, passwords, `.env` files), live-server backups, or lead data. `.gitignore` covers the usual paths; check `git status` anyway.

## Before you push

```bash
cd web && npm run lint && npm run typecheck && npm run format:check && npm run build
cd .. && npm run test:e2e             # behaviour + payloads vs approved build
npm run test:server                   # if you touched server/ (needs PHP 8.1+)
npm run visual:candidate && npm run visual:compare   # full pixel check
npm run test:performance              # performance budget (a laptop is faster than CI; CI decides)
```

**Deterministic captures:** the capture tools neutralise `will-change` before every screenshot. Even so, the CI runner's renderer occasionally anti-aliases an unchanged edge 1/255 differently between two captures, so the interaction tests ignore pixels whose colour moved by at most 2/255 (and say so in their output). Real changes move colours by tens or hundreds; never raise that limit to make a real change pass.

## Performance budget

`tests/performance/budget.mjs` runs a lab test (Lighthouse, simulated phone) on every built page in CI, three runs each, and judges the best run (noise only makes a run slower; a real slowdown shifts every run). Limits are in `tests/performance/budget.json`.

- **A page listed under `baseline`** is held to "no worse than today": its recorded numbers plus the `allowance`. The allowance covers what the same build varies by between CI runs (measured 7 Oct 2026: up to 5 points and about 10% in paint time). If the job fails on a change that can't have affected speed, rerun it once before looking further.
- **Any other page is new** and must meet `target`. Don't add a new page to the record to make it pass.
- **Only this build is measured.** Outside hosts are blocked, so the booking calendar embedded in `/free-system/book-a-call/` is not counted.
- **Re-recording** (after an approved change that makes a page heavier, or to lock in an improvement): download `performance-results` from the branch's CI run, run `node tests/performance/budget.mjs --record <path>/results.json`, and commit `budget.json` with the reason. Never record from a laptop; the numbers depend on the machine.

## Code conventions

- **Copy goes in `web/src/content/`**, never hard-coded in components.
- **Colours come from `T` / `STAGE_COLORS`** (`src/styles/tokens.ts`) or the matching CSS variables. Don't introduce new hex values without a reason.
- **Server Components by default.** Add `'use client'` only to the smallest leaf that needs state or browser APIs.
- **Images:** add the original to `web/public/…`, add its widths to `src/content/images.ts`, run `bash scripts/optimise-images.sh`, and render it with `ResponsiveImage`.
- **Forms:** use `useLeadSubmit(formName)` and include `<Honeypot />`. Add the form's fields to `server/public_html/_server/forms.php` and a test in `tests/server/lead-handler.sh`.
- **Accessibility:**
  - every interactive element is a real button or link, or has a role, `tabIndex` and a keyboard handler;
  - form fields have accessible names;
  - motion respects `prefers-reduced-motion`.
- **Brand rule:** no AI wording in copy, no generator tags or tool names in public files, no generic AI-style imagery. AI crawlers stay allowed in `robots.txt`.
- **Formatting:** Prettier (`web/.prettierrc`: single quotes, trailing commas, 110 columns). Tests and scripts follow the same style.

## Dependencies

Ask the owner before adding a dependency or a paid service. Pin exact versions. `npm audit` runs in CI and fails on high-severity issues.
