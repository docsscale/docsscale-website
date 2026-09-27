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
```

**Deterministic captures:** composited layers (from `will-change`, which GSAP leaves on revealed elements) can anti-alias an edge 1/255 differently between runs on the CI runner. The capture tools neutralise `will-change` before every screenshot; keep that when writing new capture code.

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
