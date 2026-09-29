# Handover

Every account and service the website depends on, where each credential is kept (**never the credentials themselves**), and what's still open.

## Accounts and services

| Service | What it's for | Account / identifier | Where the credential lives |
|---|---|---|---|
| **Hostinger** | Hosting, CDN, DNS, email for docsscale.com | hPanel account; hosting user `u145389112` | Owner's password manager |
| **Domain DNS** | docsscale.com records | Hostinger nameservers (`*.dns-parking.com`) | hPanel → Domains → DNS |
| **Email** | info@docsscale.com (Hostinger Mail; SPF, DKIM and DMARC `p=none` in DNS) | hPanel → Emails | Owner's password manager |
| **GoHighLevel** | CRM receiving every lead; booking calendar at booking.docsscale.com (CNAME to GHL) | The DocsScale sub-account (location) | Lead handler token (contacts.write only): **only** in `/home/u145389112/domains/docsscale.com/private/config.php` on the server |
| **GitHub** | Source code and CI | Organization `docsscale`, private repo `docsscale-website` (free plan) | Owner's GitHub login; `gh` CLI on the owner's Mac |
| **Staging** | staging.docsscale.com password gate | user `docsscale` | `~/DocsScale-Secure/staging-login.txt` (owner's Mac) |
| **Google Analytics 4** | Analytics (on from v1.1, consent-based) | Measurement ID `G-804589LNJW` in `web/src/content/analytics.ts` | Google account of the owner |
| **Google Search Console** | Search performance | Domain property `sc-domain:docsscale.com` (verified; owner: Abdul). **Sitemap `https://docsscale.com/sitemap.xml` submitted on 29 Sep 2026** (14 URLs, all returning 200) | Owner's Google account |

- **Backups and originals:** `~/DocsScale-Secure/` on the owner's Mac: the full hPanel backup (25 Sep 2026) and every original server file replaced during hardening. It isn't synced and isn't in git. **It contains the GoHighLevel token; treat it as secret.**
- **Rotating the GoHighLevel token:** see [SERVER.md](SERVER.md#rotating-the-ghl-token).

## Owner to-dos (in priority order)

1. **Delete the Claude Code session logs** in `~/.claude/projects/-Users-abdulsamad-Downloads-docsscale/` once the project is finished. They contain the GoHighLevel token from the early audit.
2. **Check for old copies of `lead-debug-log.txt`.** The original site's debug log is no longer reachable (it returns 404, checked 27 Sep 2026). If a copy remains anywhere in hPanel → File Manager, delete it: it predates the hardening and may contain lead data.
3. **GA4 admin setup:** mark the key events `generate_lead` and `book_call`, create the custom dimensions, and switch on the Internal Traffic filter after the team has opened `docsscale.com/?team=on` ([TRACKING.md](TRACKING.md)).
4. **Screenshots and photos:** the funnel images, the three homepage/About placeholders and the team photos, in the sizes listed in [incoming/README.md](../incoming/README.md).
5. **Ask the logo designer for the original vector file** (for print; [brand/README.md](../brand/README.md)).

## When the team grows

- **GitHub plan:** the `docsscale` organization is on the free plan. Private repos on the free plan can't enforce branch protection, so "all CI checks must pass" is enforced by `scripts/deploy.mjs` at deploy time instead of by GitHub at merge time.
  - **When other developers join:** upgrade the organization to GitHub Team and enable branch protection on `main`. Required checks: the four CI jobs, no force-push, no deletion, at least one review.
- **Access:** give each person their own logins (Hostinger team access, GoHighLevel user, GitHub member), never shared ones. Remove access when someone leaves.

## Where to read next

- [README.md](../README.md): the repository layout and commands.
- [CLIENT-GUIDE.md](CLIENT-GUIDE.md): the non-technical guide.
- [RELEASE.md](RELEASE.md): deploying and rolling back.
- [PHASE5-PLAN.md](PHASE5-PLAN.md): the approved growth plan, starting after v1.0 is live.
