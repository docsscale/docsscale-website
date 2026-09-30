#!/usr/bin/env bash
# Tests for server/public_html/_server/lead-digest.php (the daily failure email).
# Builds a private dir with a known errors.log and lead backup, runs the digest
# with LEAD_DIGEST_OUTBOX (writes the email to a file instead of sending it).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP="$(mktemp -d)"
trap 'kill ${SITE_PID:-} 2>/dev/null || true; rm -rf "$TMP"' EXIT
PRIV="$TMP/private"; mkdir -p "$PRIV/logs" "$PRIV/leads"
OUTBOX="$TMP/outbox.txt"
cat > "$PRIV/config.php" <<'PHP'
<?php return ['ghl_token' => 'pit-test', 'ghl_location_id' => 'LOC123', 'digest_to' => 'owner@example.com'];
PHP

pass=0; fail=0
expect() { if [[ "$2" == "$3" ]]; then pass=$((pass+1)); else fail=$((fail+1)); echo "FAIL $1: got [$2] want [$3]"; fi; }
digest() { LEAD_PRIVATE_DIR="$PRIV" LEAD_DIGEST_OUTBOX="$OUTBOX" php "$ROOT/server/public_html/_server/lead-digest.php" "$@"; }
mails() { if [[ -f "$OUTBOX" ]]; then grep -c '^Subject:' "$OUTBOX" || true; else echo 0; fi; }

printf '%s main: GHL HTTP 500 internal\n%s free-system: GHL add tag failed\n' 2026-09-30T10:00:00+00:00 2026-09-30T10:01:00+00:00 > "$PRIV/logs/errors.log"

# Lead backup: received lines (1 h ago unless noted) and outcomes.
python3 - "$PRIV/leads" <<'PY'
import json, sys, time, datetime
d = sys.argv[1]
def t(sec_ago): return datetime.datetime.fromtimestamp(time.time() - sec_ago, datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S+00:00')
rows = []
def lead(i, email, form='main', ago=3600, outcome=None):
    rows.append({'time': t(ago), 'id': i, 'form': form, 'status': 'received', 'ip_hash': 'x', 'fields': {'email': email}})
    if outcome is not None:
        rows.append({'time': t(ago - 2), 'id': i, 'form': form, 'status': 'outcome', **outcome})
ok = {'sent_to_ghl': True, 'ghl_http': 201, 'ghl_tagged': True, 'ghl_existing': False, 'ghl_noted': None}
lead('A', 'fine@x.co', outcome=ok)
lead('B', 'notsent@x.co', outcome={**ok, 'sent_to_ghl': False, 'ghl_http': 502, 'ghl_tagged': None})
lead('C', 'untagged@x.co', form='free-system', outcome={**ok, 'ghl_tagged': False})
lead('D', 'cutoff@x.co')                               # no outcome, 1 h old
lead('E', 'inflight@x.co', ago=120)                    # no outcome yet, 2 min old
lead('F', 'nonote@x.co', outcome={**ok, 'ghl_existing': True, 'ghl_noted': False})
lead('G', 'staging@x.co', outcome={'sent_to_ghl': False, 'ghl_http': 0, 'test_mode': True})
rows.insert(0, {'time': t(3600), 'form': 'main', 'sent_to_ghl': False, 'ghl_http': 0, 'fields': {'email': 'oldformat@x.co'}})
month = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m')
with open(f'{d}/{month}.jsonl', 'w') as f:
    for r in rows: f.write(json.dumps(r) + '\n')
PY

# --- dry run: prints, sends nothing, keeps no state
out=$(digest --dry-run)
expect "dry run: prints the email" "$(grep -c '^Subject: DocsScale website: 4 leads to check, 2 errors logged' <<<"$out")" 1
expect "dry run: nothing sent" "$(mails)" 0
expect "dry run: no state" "$([ -f "$PRIV/digest-state.json" ] && echo yes || echo no)" no

# --- first run: one email with the four problem leads and both errors
expect "first run: reports" "$(digest)" "lead-digest: emailed owner@example.com (4 lead problem(s), 2 log line(s))"
expect "first run: one email" "$(mails)" 1
expect "recipient from config" "$(grep -c '^To: owner@example.com' "$OUTBOX")" 1
for e in notsent@x.co untagged@x.co cutoff@x.co nonote@x.co; do expect "reported: $e" "$(grep -c "$e" "$OUTBOX")" 1; done
for e in fine@x.co inflight@x.co staging@x.co oldformat@x.co; do expect "not reported: $e" "$(grep -c "$e" "$OUTBOX" || true)" 0; done
expect "untagged: names the funnel tag" "$(grep -c 'add the free-system-lead tag by hand' "$OUTBOX")" 1
expect "not sent: says enter by hand" "$(grep -c 'did not reach GoHighLevel (HTTP 502)' "$OUTBOX")" 1
expect "cut off: explained" "$(grep -c 'no GHL outcome recorded' "$OUTBOX")" 1
expect "errors listed" "$(grep -c 'main: GHL HTTP 500 internal' "$OUTBOX")" 1
expect "state saved" "$([ -f "$PRIV/digest-state.json" ] && echo yes || echo no)" yes
expect "state perms" "$(php -r 'printf("%o", fileperms($argv[1]) & 0777);' "$PRIV/digest-state.json")" 600

# --- second run: nothing new → no email
expect "second run: nothing to report" "$(digest)" "lead-digest: nothing to report"
expect "second run: no new email" "$(mails)" 1

# --- a new error line → an email with only that line
echo "2026-09-30T12:00:00+00:00 main: GHL contact lookup failed: HTTP 401" >> "$PRIV/logs/errors.log"
expect "new error: reported" "$(digest)" "lead-digest: emailed owner@example.com (0 lead problem(s), 1 log line(s))"
expect "new error: second email" "$(mails)" 2
expect "new error: old lines not repeated" "$(grep -c 'main: GHL HTTP 500 internal' "$OUTBOX")" 1

# --- log rotated (smaller than the saved position): read from the start
echo "2026-09-30T13:00:00+00:00 main: after rotation" > "$PRIV/logs/errors.log"
expect "rotated log: new line reported" "$(digest)" "lead-digest: emailed owner@example.com (0 lead problem(s), 1 log line(s))"

# --- --mark-seen: no email, everything so far counts as reported
echo "2026-09-30T14:00:00+00:00 main: seen before go-live" >> "$PRIV/logs/errors.log"
expect "mark-seen: says what it skipped" "$(digest --mark-seen)" "lead-digest: marked as seen without emailing: 0 lead problem(s), 1 log line(s)"
expect "mark-seen: no email" "$(mails)" 3
expect "mark-seen: next run quiet" "$(digest)" "lead-digest: nothing to report"

# --- never runs over HTTP
LEAD_PRIVATE_DIR="$PRIV" php -S 127.0.0.1:8785 -t "$ROOT/server/public_html" >/dev/null 2>&1 & SITE_PID=$!
for _ in $(seq 1 50); do curl -s -o /dev/null http://127.0.0.1:8785/ && break; sleep 0.1; done
expect "HTTP request: 404" "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8785/_server/lead-digest.php)" 404
expect "HTTP request: nothing sent" "$(mails)" 3

echo "passed: $pass  failed: $fail"
[[ $fail -eq 0 ]]
