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

`private/leads/2026-09.jsonl` etc. One JSON object per line:
`time, form, sent_to_ghl, ghl_http, ghl_tagged, ghl_existing, ghl_noted, ip_hash, fields`.
If `sent_to_ghl` is `false`, the lead did not reach GHL; re-enter it by hand. `ghl_existing`
is `true` when the contact already existed (then only its empty fields were filled, and
`ghl_noted` says whether the submission note was added). `false`/`null` in `ghl_tagged` or
`ghl_noted` means the tag or note was not added: add it by hand. `private/cache/custom-fields.json`
holds GHL's custom field ids (refreshed daily); deleting it is harmless. Contains personal data: download only when needed,
and delete months you no longer need (suggested retention: 12 months).

## Limits (lead-handler.php constants)

| Setting | Value |
|---|---|
| Sends per IP | 5 per 10 minutes |
| Sends overall | 60 per 10 minutes |
| Request body | 16 KB |
| GHL timeout | 5 s connect, 15 s total |

## Tests

`tests/server/lead-handler.sh` (`npm run test:server`) runs both endpoints locally against a fake GHL and checks
responses, exact GHL payloads, backups and rate limiting. Needs PHP 8.1+ locally.

## Where the originals and backups are

`~/DocsScale-Secure/` (on the owner's Mac, not synced, not in git):
the full hPanel backup from 25 Sep 2026, every original server file replaced during
hardening (for rollback), and older deploy zips. All of these contain the GHL token.
