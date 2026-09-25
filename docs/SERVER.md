# docsscale.com — server layout and runbook

## Layout on Hostinger

```
/home/u145389112/domains/docsscale.com/
├── public_html/                 ← web root (Next.js static export + the files below)
│   ├── .htaccess                ← headers, caching, file blocking (site/.htaccess)
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

In this repo, `site/` mirrors `public_html/` and `private/config.example.php` is the
template for `private/config.php`.

## After every site deploy

A hPanel "deploy archive" replaces `public_html`. Until the Next.js source ships these
files in its `public/` folder (Phase 2), re-upload after each deploy:
`.htaccess`, `send-lead.php`, `free-system/send-lead.php`, `_server/` (all three files),
`sitemap.xml`, `llms.txt`. The `private/` folder is not affected by deploys.

## Rotating the GHL token

1. GHL → Settings → Private Integrations → create a token with **contacts.write** only.
2. hPanel → File Manager → `domains/docsscale.com/private/config.php` → edit `ghl_token`.
3. Submit one test lead (or check `private/logs/errors.log` after the next real one).
4. Delete the old token in GHL.

## Lead backups

`private/leads/2026-09.jsonl` etc. One JSON object per line:
`time, form, sent_to_ghl, ghl_http, ip_hash, fields`. If `sent_to_ghl` is `false`, the lead
did not reach GHL; re-enter it by hand. Contains personal data: download only when needed,
and delete months you no longer need (suggested retention: 12 months).

## Limits (lead-handler.php constants)

| Setting | Value |
|---|---|
| Sends per IP | 5 per 10 minutes |
| Sends overall | 60 per 10 minutes |
| Request body | 16 KB |
| GHL timeout | 5 s connect, 15 s total |

## Tests

`tests/lead-handler.sh` runs both endpoints locally against a fake GHL and checks
responses, exact GHL payloads, backups and rate limiting. Needs PHP 8.1+ locally.

## Where the originals and backups are

`~/DocsScale-Secure/` (on the owner's Mac, not synced, not in git):
the full hPanel backup from 25 Sep 2026, every original server file replaced during
hardening (for rollback), and older deploy zips. All of these contain the GHL token.
