# The editing screen (cms.docsscale.com)

A small app with a server, apart from the public site: `web/` stays a static
export and contains nothing from here. It is Keystatic; editors sign in with an
email address through Keystatic Cloud and need no GitHub account.
[docs/COMPLETION-PLAN.md](../docs/COMPLETION-PLAN.md), section 6, has the design
and the trial results.

- **What editors can change** is the content model in `content-schema.ts`. That
  file is a byte-for-byte copy of `web/src/content/content-schema.ts` (the two
  packages can't import from each other); CI fails if they differ.
- **Where saves go:** always to the branch `content/working`, never to `main`.
  `app/keystatic/keystatic.tsx` sends the screen back to that branch and hides
  the branch and pull-request controls, which Keystatic has no setting for.
- **Never indexed:** every response carries `X-Robots-Tag: noindex`
  (`next.config.ts`); CI checks the live address (`tests/server/hidden-sites.sh`).
- **SEO fields** count characters while typing (`fields/`).

Run locally: `npm ci && npm run dev` in `cms/`, then open
`http://localhost:3100/keystatic`. Locally it edits the files in `/content`
directly, with no sign-in.

Deploying: it runs as a Node.js site on the existing hosting plan, Node.js 24.
Steps are in [docs/HANDOVER.md](../docs/HANDOVER.md).
