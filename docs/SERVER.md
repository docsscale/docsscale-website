# docsscale.com — server layout and runbook

## Layout on Hostinger

```
/home/u145389112/domains/docsscale.com/
├── public_html/                 ← web root (Next.js static export + the files below)
│   ├── .htaccess                ← headers, caching, file blocking
│   ├── send-lead.php            ← 2-line shim → _server, form "main"
│   ├── free-system/send-lead.php← 2-line shim → _server, form "free-system"
│   └── _server/                 ← shared lead code, denied over HTTP
│       ├── .htaccess            (Require all denied)
│       ├── lead-handler.php
│       └── forms.php            ← per-form fields, required, GHL mapping
└── private/                     ← OUTSIDE the web root, never served
    ├── config.php               ← GHL token + location ID (created by hand)
    ├── leads/YYYY-MM.jsonl      ← every submission + GHL outcome (0600)
    ├── logs/errors.log          ← GHL failures, config problems
    ├── logs/rejected.log        ← cross-origin, honeypot, rate-limited
    └── ratelimit/               ← per-IP counters (safe to delete any time)
```

In this repo, `server/public_html/` holds the server files (the static site comes from
`web/out/`), and `server/private/config.example.php` is the template for
`private/config.php`. Staging uses `public_html/staging_html/` and a separate
`private-staging/` folder (test mode; nothing is sent to GoHighLevel).

## Deploys

`scripts/deploy.mjs` uploads the static export and these server files together (see
[RELEASE.md](RELEASE.md)); nothing needs re-uploading by hand. Don't use hPanel's
"deploy archive": it replaces `public_html` and would remove the lead endpoints and
the staging folder. The `private/` folder is never touched by deploys.

## Rotating the GHL token

1. GHL → Settings → Private Integrations → create a token with only these scopes: **contacts.write** (save contacts, tags, notes), **contacts.readonly** (find an existing contact) and **locations/customFields.readonly** (custom field ids).
2. hPanel → File Manager → `domains/docsscale.com/private/config.php` → edit `ghl_token`.
3. Submit one test lead (or check `private/logs/errors.log` after the next real one).
4. Delete the old token in GHL.

## Lead backups

`private/leads/2026-09.jsonl` etc. Two lines per submission, sharing an `id`:
- **`"status":"received"`**: `time, id, form, ip_hash, fields`. It's written as soon as the form passes validation, **before any GoHighLevel call**, so a lead is kept even if the request is cut off.
- **`"status":"outcome"`**: `sent_to_ghl, ghl_http, ghl_tagged, ghl_existing, ghl_noted` (or `test_mode` on staging).
  - If `sent_to_ghl` is `false`, the lead did not reach GHL; re-enter it by hand.
  - `ghl_existing` is `true` when the contact already existed: only its empty fields were filled, and `ghl_noted` says whether the submission note was added.
  - `false` in `ghl_tagged` or `ghl_noted` means the tag or note was not added: add it by hand.
- **A received line with no outcome line** means the request stopped partway. Check GHL for the contact and add it, its tag and note by hand if missing.

`private/cache/custom-fields.json` holds GHL's custom field ids (refreshed daily). Deleting it is harmless; delete it after adding or renaming a custom field in GHL. The backup contains personal data: download it only when needed, and delete months you no longer need (suggested retention: 12 months).

**Reply timing.** Where the server supports it (PHP-FPM or LiteSpeed), the visitor gets their success reply as soon as the contact is saved; the tag and note are added after that. The script keeps running if the visitor closes the page.

## Daily failure email

`_server/lead-digest.php` runs once a day from a Hostinger cron job and emails **info@docsscale.com** only when something needs attention since the last run:
- new lines in `private/logs/errors.log`;
- leads whose outcome says they didn't reach GHL, weren't tagged, or didn't get their note;
- leads received more than 15 minutes earlier with no outcome line (the request was cut off).

With nothing to report, no email is sent. Each problem is reported once: the last run and the position in `errors.log` are kept in `private/digest-state.json`. Deleting that file makes the next run report the last 24 hours of leads and the whole `errors.log` again. The email lists each lead's time, form, email address and the manual step needed in GHL.

- **Cron job** (hPanel → Advanced → Cron Jobs): daily at 13:00 UTC (08:00 in Houston in summer, 07:00 in winter), command `/usr/bin/php /home/u145389112/domains/docsscale.com/public_html/_server/lead-digest.php`.
- **Recipient:** `digest_to` in `private/config.php` (default info@docsscale.com).
- **Preview without sending:** add `--dry-run` to the command.
- It never runs over the web: `_server/` is denied, and the script refuses anything but the command line.
- Sent with PHP `mail()` from info@docsscale.com. If the emails land in spam, switch to sending through the info@ mailbox over SMTP (needs its password in `private/config.php`).

## Limits (lead-handler.php constants)

| Setting | Value |
|---|---|
| Sends per IP | 5 per 10 minutes |
| Sends overall | 60 per 10 minutes |
| Request body | 16 KB |
| GHL time budget | 20 s for all calls of one submission; per call: lookup 5 s, field list 5 s, save 8 s (at least 3 s), tag 4 s, note 4 s; 3 s connect |

## Tests

`tests/server/lead-handler.sh` (`npm run test:server`) runs both endpoints locally against a fake GHL and checks
responses, exact GHL payloads, backups and rate limiting. Needs PHP 8.1+ locally.

## Where the originals and backups are

`~/DocsScale-Secure/` (on the owner's Mac, not synced, not in git):
the full hPanel backup from 25 Sep 2026, every original server file replaced during
hardening (for rollback), and older deploy zips. All of these contain the GHL token.
