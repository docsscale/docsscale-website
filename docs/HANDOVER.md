# DocsScale — handover

(Draft; completed at the end of the project. Lists every account, service and where
each credential is kept. Never the credentials themselves.)

## Open decisions / to do when the team grows

- **GitHub plan.** The `docsscale` organization is on the free plan. Private repos on
  the free plan cannot enforce branch protection, so "all CI checks must pass" is
  enforced by `scripts/deploy.mjs` at deploy time instead of by GitHub at merge time.
  **When other developers join: upgrade the organization to GitHub Team and enable
  branch protection on `main`** (required checks: the four CI jobs, no force-push,
  no deletion, at least one review).
