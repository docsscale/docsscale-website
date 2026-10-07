# Releasing, deploying and rolling back

## Versions

- Tags `vMAJOR.MINOR.PATCH` on `main`: major = redesign or URL-structure change, minor = new pages or features, patch = fixes and copy.
- Every release gets a [CHANGELOG.md](../CHANGELOG.md) entry.
- `version.txt` on the server shows what's live (`https://docsscale.com/version.txt`).

## Release steps

1. **Staging first:** `node scripts/deploy.mjs --target staging` (upload credentials: see "Upload credentials" below). Run the staging part of [QA-CHECKLIST.md](QA-CHECKLIST.md).
2. **Merge to `main`** (via a pull request or a fast-forward merge). Push, and wait for CI to go green on that exact commit.
3. **Tag:** `git tag -a vX.Y.Z -m "…" && git push origin vX.Y.Z`.
4. **Owner go-ahead:** production is never deployed without the owner's explicit approval for that release.
4b. **Privacy Policy date:** if this release changes the Privacy Policy, set `updated` in `web/src/content/legal.ts` to the **actual production deploy date** (through the release PR) before tagging. If the deploy slips to another day, change it again.
5. **Deploy:** `node scripts/deploy.mjs --target production --yes`. The script refuses if the tree is dirty, the branch isn't `main`, `main` isn't pushed, or CI isn't green.
6. **Purge the CDN cache** (hPanel → Websites → docsscale.com → Performance → CDN → Purge all).
7. Run the "After deploying to production" part of the QA checklist.

## The preview site

`node scripts/deploy.mjs --target preview` builds the site with drafts included and uploads it to `preview.docsscale.com` (its own folder on the server, the staging login, `noindex`). It carries no lead handler, so its forms send nothing. The upload credentials must be generated for the domain `preview.docsscale.com`, not `docsscale.com`. It is not a release: no tag, no changelog, no approval needed, because nothing public changes.

## Upload credentials

- The deploy script uploads through Hostinger's file-upload API. It needs `HOSTINGER_UPLOAD_URL`, `HOSTINGER_AUTH` and `HOSTINGER_REST` in the environment, generated per session (they expire after about 6 hours) from Hostinger's "generate upload URL" endpoint for account `u145389112`, domain `docsscale.com`.
- **Never commit them or paste them into tickets.**
- Phase 5 replaces this with a Hostinger API token stored as a GitHub secret, for automatic deploys.

## Rolling back

Deploys only add or overwrite files; they never delete. Earlier HTML, and the hashed `/_next/` files it references, keep working when put back.

### Back to the original site (the version before v1.0)

For emergencies, when v1.0 misbehaves in a way that can't be fixed quickly:

```bash
node scripts/deploy.mjs --target production --rollback-original --yes
```

- **What it restores:** the exact pre-v1.0 site. That's the static export frozen in `reference/live-2026-09-25/` (byte-identical to what was live, checked 27 Sep 2026) plus the server code at tag `pre-v1.0-live` (commit `0567a4e`, which matches the live `.htaccess` and lead handler).
- **It skips** the build and the CI gate, so it works even if `main` is broken. Then purge the CDN cache.
- **What stays behind:** files that only v1.0 added (the favicon set, `brand/`, `og-image.jpg`, new `/_next/` chunks) stay on the server but are unused by the old pages.
- **What's unaffected:** `private/` (GHL config, lead backups) isn't touched by any deploy.
- `--dry-run` shows the file list without uploading.

### Back to an earlier v1.x release

1. On `main`: `git revert` the release's merge commit (or the offending commits) and push.
2. Wait for CI to go green, tag a patch version, and deploy as usual.

This keeps history honest and passes the same gates as any release.

### Last resort

- **Hostinger backups:** hPanel → Websites → docsscale.com → Files → Backups (daily or weekly, depending on plan). Restoring there replaces all of `public_html/`, including `staging_html/`.
- **Full hPanel backup** from 25 Sep 2026, plus every original server file: `~/DocsScale-Secure/` on the owner's Mac.

## Pruning old files

Deploys only add and overwrite. Files from older releases stay on the server:
old hashed `/_next/static/` files, and the files of pages that no longer exist.

1. **Report (changes nothing, safe to run any time):**
   `node scripts/deploy.mjs --target production --prune`
   It builds the current release, lists the server, and prints every server file
   that is not in the release. The full list is saved to
   `release/production-prune.txt`. It never looks inside `staging_html/`,
   `.well-known/`, `cgi-bin/` or at dotfiles.
2. **The owner reads the list and approves it** (every time; an old approval
   doesn't carry over). Remove any line that should stay.
3. **Delete exactly that list:**
   `node scripts/deploy.mjs --target production --delete-listed release/production-prune.txt --yes`
   On production this needs the same gates as a deploy (on `main`, clean, CI
   green). The whole list is refused if any line is in the current release, is
   protected, or isn't a plain file path. Nothing is uploaded.

A removed page must not wait for a prune: add a redirect for it in
`server/public_html/.htaccess` in the same release that removes it, and a check
in `tests/server/redirects.sh`.

