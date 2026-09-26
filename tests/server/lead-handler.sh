#!/usr/bin/env bash
# Behaviour tests for server/public_html/_server/lead-handler.php.
# Runs both endpoints on PHP's built-in server against a fake GHL API and
# checks responses, the exact GHL payloads, lead backups and rate limiting.
# Requires: php 8.1+ (local only), curl, python3.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP="$(mktemp -d)"
trap 'kill $SITE_PID $GHL_PID 2>/dev/null || true; rm -rf "$TMP"' EXIT

PRIV="$TMP/private"; mkdir -p "$PRIV"
cat > "$PRIV/config.php" <<'PHP'
<?php return [
  'ghl_token' => 'pit-test', 'ghl_location_id' => 'LOC123',
  'allowed_origins' => ['http://127.0.0.1:8781'],
  'ghl_api_url' => 'http://127.0.0.1:8782/contacts/upsert',
];
PHP

# Fake GHL: records each request body; replies 201, or 400 when email starts with "fail".
mkdir -p "$TMP/ghl"
cat > "$TMP/ghl/index.php" <<'PHP'
<?php
$body = file_get_contents('php://input');
file_put_contents(__DIR__ . '/last.json', $body);
file_put_contents(__DIR__ . '/auth.txt', $_SERVER['HTTP_AUTHORIZATION'] ?? '');
$email = json_decode($body, true)['email'] ?? '';
if (str_starts_with($email, 'fail')) { http_response_code(400); echo '{"message":"internal GHL detail"}'; exit; }
http_response_code(201); echo '{"new":true}';
PHP

LEAD_PRIVATE_DIR="$PRIV" php -S 127.0.0.1:8781 -t "$ROOT/server/public_html" >/dev/null 2>&1 & SITE_PID=$!
php -S 127.0.0.1:8782 -t "$TMP/ghl" "$TMP/ghl/index.php" >/dev/null 2>&1 & GHL_PID=$!
# Wait until both servers answer (a fixed sleep flakes on a busy machine).
wait_for() { for _ in $(seq 1 50); do curl -s -o /dev/null "http://127.0.0.1:$1/" && return 0; sleep 0.1; done; echo "server on :$1 did not start"; exit 1; }
wait_for 8781; wait_for 8782

pass=0; fail=0
post() { # endpoint json [origin]
  curl -s -o "$TMP/resp" -w '%{http_code}' -X POST "http://127.0.0.1:8781/$1" \
    -H 'Content-Type: application/json' -H "Origin: ${3-http://127.0.0.1:8781}" --data "$2"
}
expect() { # name got want
  if [[ "$2" == "$3" ]]; then pass=$((pass+1)); else fail=$((fail+1)); echo "FAIL $1: got [$2] want [$3]"; fi
}
body() { cat "$TMP/resp"; }
ghl() { python3 -c "import json,sys;print(json.dumps(json.load(open('$TMP/ghl/last.json')),sort_keys=True,ensure_ascii=False))"; }

# --- method / origin / input validation
expect "GET 405" "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8781/send-lead.php)" 405
expect "cross-origin" "$(post send-lead.php '{}' https://evil.example)" 403
expect "bad json" "$(post send-lead.php 'not json')" 400
expect "bad json body" "$(body)" '{"ok":false,"error":"Invalid submission."}'
expect "missing required" "$(post send-lead.php '{"email":"a@b.co"}')" 400
expect "missing required body" "$(body)" '{"ok":false,"error":"Please fill in the required fields."}'
expect "bad email" "$(post send-lead.php '{"clinicName":"C","email":"nope","specialty":"Dental"}')" 400
expect "bad email body" "$(body)" '{"ok":false,"error":"Please enter a valid email address."}'
expect "too long" "$(post send-lead.php "{\"clinicName\":\"$(printf 'x%.0s' {1..151})\",\"email\":\"a@b.co\",\"specialty\":\"Dental\"}")" 400
expect "honeypot" "$(post send-lead.php '{"clinicName":"C","email":"a@b.co","specialty":"Dental","website":"spam"}')" 200

# --- main form: exact GHL payload, same as the original send-lead.php
expect "main ok" "$(post send-lead.php '{"name":"Jane Q Doe","clinicName":"Bright Dental","email":"jane@bright.co","phone":"+1 713 555 0100","specialty":"Dental","locations":"3–5","message":"Recall"}')" 200
expect "main ok body" "$(body)" '{"ok":true}'
expect "main payload" "$(ghl)" '{"companyName": "Bright Dental", "customFields": [{"field_value": "Recall", "key": "biggest_gap"}, {"field_value": "3–5", "key": "locations"}, {"field_value": "Dental", "key": "specialty"}], "email": "jane@bright.co", "firstName": "Jane", "lastName": "Q Doe", "locationId": "LOC123", "name": "Jane Q Doe", "phone": "+1 713 555 0100", "source": "Website form"}'
expect "auth header" "$(cat "$TMP/ghl/auth.txt")" "Bearer pit-test"

expect "main no name" "$(post send-lead.php '{"clinicName":"C","email":"c@c.co","specialty":"Med spa"}')" 200
expect "main no-name payload" "$(ghl)" '{"companyName": "C", "customFields": [{"field_value": "Med spa", "key": "specialty"}], "email": "c@c.co", "locationId": "LOC123", "source": "Website form"}'

# --- funnel form: exact payload, source pinned server-side
expect "funnel ok" "$(post free-system/send-lead.php '{"name":"Sam","email":"sam@x.co","phone":"","clinicName":"","clinicType":"Chiropractic","source":"hacked"}')" 200
expect "funnel payload" "$(ghl)" '{"customFields": [{"field_value": "Chiropractic", "key": "clinic_type"}], "email": "sam@x.co", "firstName": "Sam", "lastName": "", "locationId": "LOC123", "name": "Sam", "source": "Funnel - Free System"}'
expect "funnel requires name" "$(post free-system/send-lead.php '{"email":"sam@x.co"}')" 400

# --- GHL failure: generic message, no upstream detail, lead still backed up
expect "ghl fail" "$(post free-system/send-lead.php '{"name":"F","email":"fail@x.co"}')" 502
expect "ghl fail body" "$(body)" '{"ok":false,"error":"Something went wrong. Please try again, or email info@docsscale.com."}'
expect "failed lead backed up" "$(grep -c '"fail@x.co"' "$PRIV"/leads/*.jsonl)" 1
expect "ghl detail logged" "$(grep -c 'internal GHL detail' "$PRIV/logs/errors.log")" 1
expect "backup count (4 real leads)" "$(cat "$PRIV"/leads/*.jsonl | wc -l | tr -d ' ')" 4
expect "backup perms" "$(php -r 'printf("%o", fileperms($argv[1]) & 0777);' "$PRIV"/leads/*.jsonl)" 600

# --- rate limit: 5 sends per IP per 10 min (4 used above)
expect "5th send ok" "$(post send-lead.php '{"clinicName":"C","email":"r@r.co","specialty":"Dental"}')" 200
expect "6th send limited" "$(post send-lead.php '{"clinicName":"C","email":"r@r.co","specialty":"Dental"}')" 429

# --- missing config: lead still validated and backed up, GHL skipped
rm -rf "$PRIV/ratelimit"; mv "$PRIV/config.php" "$PRIV/config.off"
expect "no config: origin still enforced" "$(post send-lead.php '{}' https://evil.example)" 403
expect "no config: validation still runs" "$(post send-lead.php '{"email":"a@b.co"}' https://docsscale.com)" 400
expect "no config: 502 generic" "$(post send-lead.php '{"clinicName":"C","email":"noconf@x.co","specialty":"Dental"}' https://docsscale.com)" 502
expect "no config: lead backed up" "$(grep -c '"noconf@x.co"' "$PRIV"/leads/*.jsonl)" 1
mv "$PRIV/config.off" "$PRIV/config.php"

# --- staging: environment.php points at another private dir; test mode never calls GHL
STAGE_PRIV="$TMP/private-staging"; mkdir -p "$STAGE_PRIV"
cat > "$STAGE_PRIV/config.php" <<'PHP'
<?php return ['test_mode' => true, 'allowed_origins' => ['http://127.0.0.1:8783']];
PHP
cp -R "$ROOT/server/public_html" "$TMP/staging_html"
printf '<?php return ["private_dir" => "%s"];\n' "$STAGE_PRIV" > "$TMP/staging_html/_server/environment.php"
php -S 127.0.0.1:8783 -t "$TMP/staging_html" >/dev/null 2>&1 & STAGE_PID=$!
wait_for 8783
rm -f "$TMP/ghl/last.json"
stage_post() { curl -s -o "$TMP/resp" -w '%{http_code}' -X POST "http://127.0.0.1:8783/$1" -H 'Content-Type: application/json' -H 'Origin: http://127.0.0.1:8783' --data "$2"; }
expect "staging: test mode ok" "$(stage_post send-lead.php '{"clinicName":"C","email":"stage@x.co","specialty":"Dental"}')" 200
expect "staging: GHL not called" "$([ -f "$TMP/ghl/last.json" ] && echo called || echo not-called)" not-called
expect "staging: lead in staging dir" "$(grep -c '"stage@x.co"' "$STAGE_PRIV"/leads/*.jsonl)" 1
expect "staging: nothing in prod dir" "$(grep -c '"stage@x.co"' "$PRIV"/leads/*.jsonl)" 0
expect "staging: validation still runs" "$(stage_post send-lead.php '{"email":"a@b.co"}')" 400
kill $STAGE_PID 2>/dev/null || true

echo "passed: $pass  failed: $fail"
[[ $fail -eq 0 ]]
