# Keystatic trial (throwaway branch, never deployed)

Stage 0 of [docs/COMPLETION-PLAN.md](../docs/COMPLETION-PLAN.md). This folder is
the editing screen as a separate small app with a server. The public site in
`web/` stays a static export and contains nothing from here.

Run locally: `npm ci && npm run dev` in `cms/`, then open
`http://localhost:3100/keystatic`. Content is saved to `content/` and uploaded
images to `web/public/uploads/` at the repo root.

## Results so far (6 Oct 2026, Keystatic 0.6.9, local mode)

| # | Question | Result |
|---|---|---|
| 3 | Live length warnings in the SEO fields | **Works.** `fields/counted-text.tsx` is a custom field: the count updates while typing, amber outside the recommended range, red over the limit, and saving is refused over the limit. |
| 4 | An uploaded image lands in the repo and comes out optimised | **Works.** A 1600 × 900 upload was saved under `web/public/uploads/posts/<slug>/`; a build-side script made AVIF and WebP versions at two widths. |
| — | File format | A post is `content/posts/<slug>/index.mdoc`: a YAML header and a Markdoc body. Keystatic's reader reads it at build time with no server. |
| — | The editing app builds for production | Yes (`next build`). |

## Still to prove (need the owner)

| # | Question | Needs |
|---|---|---|
| 1 | Sign-in with email and no GitHub account; a save arrives in the repo | Keystatic Cloud account and project |
| 2 | The editing screen runs on the Hostinger Business plan | A test subdomain (owner's OK for the exact change) |
| 5 | The repo records which person made each save | 1 |
| 6 | The editing screen can be fixed to the working copy | 1 |
