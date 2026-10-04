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

# Fake GHL:
#  POST /contacts/upsert  records the body in last.json; 400 when the email starts
#    with "fail"; otherwise 201 with a contact id (none when the email starts with
#    "noid"; id TAGFAIL when it starts with "tagfail").
#  POST /contacts/{id}/tags  records path + body in tag.txt/tag.json; 422 for TAGFAIL.
#  GET /contacts/search/duplicate  appends the query to dup.txt; returns one of the
#    existing contacts below (by email, else by number), 500 for "lookupfail…",
#    otherwise no contact.
#  GET /locations/LOC123/customFields  counts calls in cf.count; 500 while cf.fail exists.
#  POST /contacts/{id}/notes  records path + body in note.txt/note.json; 500 for NOTEFAIL.
# The upsert returns an existing contact's id when its email or phone matches one.
mkdir -p "$TMP/ghl"
cat > "$TMP/ghl/index.php" <<'PHP'
<?php
$body = file_get_contents('php://input');
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$existing = [
  // name, company, specialty set; phone, locations, biggest gap empty
  ['id' => 'C-OLD', 'email' => 'old@x.co', 'firstName' => 'Olga', 'companyName' => 'Old Clinic', 'source' => 'Website form',
   'customFields' => [['id' => 'ID-SPEC', 'value' => ['Dental']]]],
  // everything the main form can send is already set
  ['id' => 'C-FULL', 'email' => 'oldfull@x.co', 'firstName' => 'Fay', 'companyName' => 'Full Clinic', 'phone' => '+17135550102',
   'customFields' => [['id' => 'ID-SPEC', 'value' => ['Dental']], ['id' => 'ID-LOC', 'value' => '1'], ['id' => 'ID-GAP', 'value' => 'Old gap']]],
  // found by phone; has a different email
  ['id' => 'C-PH', 'email' => 'orig@x.co', 'phone' => '+17135550199', 'customFields' => []],
  // found by phone; no email yet
  ['id' => 'C-NOEMAIL', 'email' => '', 'phone' => '+17135550177'],
  ['id' => 'C-OLD2', 'email' => 'old2@x.co', 'firstName' => 'Otto'],
  ['id' => 'NOTEFAIL', 'email' => 'oldnotefail@x.co', 'firstName' => 'Nia'],
];
$match = static function (string $email, string $phone) use ($existing): ?array {
  foreach ($existing as $c) { if ($email !== '' && $c['email'] === $email) return $c; }
  foreach ($existing as $c) { if ($phone !== '' && ($c['phone'] ?? '') === $phone) return $c; }
  return null;
};
if ($path === '/contacts/search/duplicate') {
  file_put_contents(__DIR__ . '/dup.txt', $_SERVER['QUERY_STRING'] . "\n", FILE_APPEND);
  if (str_starts_with($_GET['email'] ?? '', 'lookupfail')) { http_response_code(500); echo '{"message":"lookup detail"}'; exit; }
  echo json_encode(['contact' => $match($_GET['email'] ?? '', $_GET['number'] ?? '')]); exit;
}
if ($path === '/locations/LOC123/customFields') {
  file_put_contents(__DIR__ . '/cf.count', (string) ((int) @file_get_contents(__DIR__ . '/cf.count') + 1));
  if (file_exists(__DIR__ . '/cf.fail')) { http_response_code(500); echo '{"message":"cf detail"}'; exit; }
  echo json_encode(['customFields' => [
    ['id' => 'ID-GAP', 'fieldKey' => 'contact.biggest_gap'], ['id' => 'ID-LOC', 'fieldKey' => 'contact.locations'],
    ['id' => 'ID-SPEC', 'fieldKey' => 'contact.specialty'], ['id' => 'ID-CT', 'fieldKey' => 'contact.clinic_type'],
  ]]); exit;
}
if (preg_match('#^/contacts/([^/]+)/notes$#', $path, $m)) {
  file_put_contents(__DIR__ . '/note.json', $body);
  file_put_contents(__DIR__ . '/note.txt', $path);
  if ($m[1] === 'NOTEFAIL') { http_response_code(500); echo '{"message":"note detail"}'; exit; }
  http_response_code(201); echo '{"note":{"id":"N1"}}'; exit;
}
if (preg_match('#^/contacts/([^/]+)/tags$#', $path, $m)) {
  file_put_contents(__DIR__ . '/tag.json', $body);
  file_put_contents(__DIR__ . '/tag.txt', $path . ' ' . ($_SERVER['HTTP_AUTHORIZATION'] ?? ''));
  if ($m[1] === 'TAGFAIL') { http_response_code(422); echo '{"message":"tag detail"}'; exit; }
  http_response_code(201); echo '{"tags":' . json_encode(json_decode($body, true)['tags']) . '}'; exit;
}
file_put_contents(__DIR__ . '/last.json', $body);
// Was the lead already in the backup when GHL was called? (backup-first check)
$leadFiles = glob(getenv('LEAD_PRIVATE_DIR') . '/leads/*.jsonl') ?: [];
$em = json_decode($body, true)['email'] ?? '';
file_put_contents(__DIR__ . '/backup_seen.txt', $em !== '' && array_filter($leadFiles, fn ($f) => str_contains(file_get_contents($f), '"' . $em . '"')) ? 'yes' : 'no');
if (str_starts_with($em, 'slowupsert')) { sleep(3); }
file_put_contents(__DIR__ . '/auth.txt', $_SERVER['HTTP_AUTHORIZATION'] ?? '');
$email = json_decode($body, true)['email'] ?? '';
$found = $match($email, json_decode($body, true)['phone'] ?? '');
if ($found) { http_response_code(200); echo json_encode(['contact' => ['id' => $found['id']], 'new' => false]); exit; }
if (str_starts_with($email, 'fail')) { http_response_code(400); echo '{"message":"internal GHL detail"}'; exit; }
http_response_code(201);
if (str_starts_with($email, 'noid')) { echo '{"new":true}'; exit; }
$id = str_starts_with($email, 'tagfail') ? 'TAGFAIL' : 'C-' . substr(md5($email), 0, 6);
echo json_encode(['contact' => ['id' => $id], 'new' => true]);
PHP

LEAD_PRIVATE_DIR="$PRIV" php -S 127.0.0.1:8781 -t "$ROOT/server/public_html" >/dev/null 2>&1 & SITE_PID=$!
LEAD_PRIVATE_DIR="$PRIV" php -S 127.0.0.1:8782 -t "$TMP/ghl" "$TMP/ghl/index.php" >/dev/null 2>&1 & GHL_PID=$!
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
tag() { python3 -c "import json;print(json.dumps(json.load(open('$TMP/ghl/tag.json'))))"; }
tagpath() { cut -d' ' -f1 "$TMP/ghl/tag.txt"; }
cid() { python3 -c "import hashlib;print('C-'+hashlib.md5(b'$1').hexdigest()[:6])"; }
note() { python3 -c "import json;print(json.load(open('$TMP/ghl/note.json'))['body'])"; }
# backup email key: the lead's received line merged with its outcome line (same id).
backup() { python3 -c "
import json,glob
rows=[json.loads(l) for f in sorted(glob.glob('$PRIV/leads/*.jsonl')) for l in open(f)]
rec=[r for r in rows if r['status']=='received' and r['fields'].get('email')=='$1'][-1]
out=[r for r in rows if r['status']=='outcome' and r['id']==rec['id']]
print({**rec, **(out[-1] if out else {})}.get('$2', 'MISSING'))"; }

# --- GHL calls share one DNS cache per request (the host's resolver can be slow)
expect "one shared curl handle per request" "$(php -r 'require $argv[1]; echo lead_curl_share() === lead_curl_share() ? "same" : "different";' "$ROOT/server/public_html/_server/lead-handler.php")" same
expect "connect timeout allows a slow DNS lookup" "$(php -r 'require $argv[1]; echo LEAD_CONNECT_TIMEOUT_SECONDS;' "$ROOT/server/public_html/_server/lead-handler.php")" 5
expect "both GHL request paths use the shared handle" "$(grep -c 'CURLOPT_SHARE => lead_curl_share()' "$ROOT/server/public_html/_server/lead-handler.php")" 2

# --- method / origin / input validation
expect "GET 405" "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8781/send-lead.php)" 405
expect "cross-origin" "$(post send-lead.php '{}' https://evil.example)" 403
expect "bad json" "$(post send-lead.php 'not json')" 400
expect "bad json body" "$(body)" '{"ok":false,"error":"Invalid submission."}'
expect "missing required" "$(post send-lead.php '{"email":"a@b.co"}')" 400
expect "missing required body" "$(body)" '{"ok":false,"error":"Please fill in the required fields."}'
expect "bad email" "$(post send-lead.php '{"clinicName":"C","email":"nope","specialty":"Dental","phone":"+17135550142"}')" 400
expect "bad email body" "$(body)" '{"ok":false,"error":"Please enter a valid email address."}'
expect "too long" "$(post send-lead.php "{\"clinicName\":\"$(printf 'x%.0s' {1..151})\",\"email\":\"a@b.co\",\"specialty\":\"Dental\"}")" 400
expect "honeypot" "$(post send-lead.php '{"clinicName":"C","email":"a@b.co","specialty":"Dental","website":"spam","phone":"+17135550142"}')" 200

# --- main form: exact GHL payload, same as the original send-lead.php
expect "main ok" "$(post send-lead.php '{"name":"Jane Q Doe","clinicName":"Bright Dental","email":"jane@bright.co","phone":"+1 713 555 0100","specialty":"Dental","locations":"3-5","message":"Recall"}')" 200
expect "main ok body" "$(body)" '{"ok":true}'
expect "main payload" "$(ghl)" '{"companyName": "Bright Dental", "customFields": [{"field_value": "Recall", "key": "biggest_gap"}, {"field_value": "3-5", "key": "locations"}, {"field_value": "Dental", "key": "specialty"}], "email": "jane@bright.co", "firstName": "Jane", "lastName": "Q Doe", "locationId": "LOC123", "name": "Jane Q Doe", "phone": "+17135550100", "source": "Website form"}'
expect "auth header" "$(cat "$TMP/ghl/auth.txt")" "Bearer pit-test"
expect "backup written before GHL is called" "$(cat "$TMP/ghl/backup_seen.txt")" yes
# tag added through the Add Tags API (never in the upsert body, which would replace all tags)
expect "main tag body" "$(tag)" '{"tags": ["website-lead"]}'
expect "main tag contact" "$(tagpath)" "/contacts/$(cid jane@bright.co)/tags"
expect "tag call authorised" "$(cut -d' ' -f2- "$TMP/ghl/tag.txt")" "Bearer pit-test"
expect "upsert has no tags" "$(ghl | grep -c '"tags"')" 0
expect "backup records tag" "$(backup jane@bright.co ghl_tagged)" True

expect "main no name" "$(post send-lead.php '{"clinicName":"C","email":"c@c.co","specialty":"Med spa","phone":"+17135550142"}')" 200
expect "main no-name payload" "$(ghl)" '{"companyName": "C", "customFields": [{"field_value": "Med spa", "key": "specialty"}], "email": "c@c.co", "locationId": "LOC123", "phone": "+17135550142", "source": "Website form"}'

# --- funnel form: exact payload, source pinned server-side
expect "funnel ok" "$(post free-system/send-lead.php '{"name":"Sam","email":"sam@x.co","phone":"+17135550142","clinicName":"","clinicType":"Chiropractic","source":"hacked"}')" 200
expect "funnel payload" "$(ghl)" '{"customFields": [{"field_value": "Chiropractic", "key": "clinic_type"}], "email": "sam@x.co", "firstName": "Sam", "lastName": "", "locationId": "LOC123", "name": "Sam", "phone": "+17135550142", "source": "Funnel - Free System"}'
expect "funnel tag body" "$(tag)" '{"tags": ["free-system-lead"]}'
expect "funnel tag contact" "$(tagpath)" "/contacts/$(cid sam@x.co)/tags"
expect "funnel requires name" "$(post free-system/send-lead.php '{"email":"sam@x.co"}')" 400

# --- GHL failure: generic message, no upstream detail, lead still backed up
expect "ghl fail" "$(post free-system/send-lead.php '{"name":"F","email":"fail@x.co","phone":"+17135550142"}')" 502
expect "ghl fail body" "$(body)" '{"ok":false,"error":"Something went wrong. Please try again, or email info@docsscale.com."}'
expect "failed lead backed up" "$(grep -c '"fail@x.co"' "$PRIV"/leads/*.jsonl)" 1
expect "ghl detail logged" "$(grep -c 'internal GHL detail' "$PRIV/logs/errors.log")" 1
expect "failed upsert: no tag attempted" "$(backup fail@x.co ghl_tagged)" None
expect "backup count (4 real leads)" "$(grep -c '"status":"received"' "$PRIV"/leads/*.jsonl)" 4
expect "every lead has an outcome line" "$(grep -c '"status":"outcome"' "$PRIV"/leads/*.jsonl)" 4
expect "backup perms" "$(php -r 'printf("%o", fileperms($argv[1]) & 0777);' "$PRIV"/leads/*.jsonl)" 600

# --- rate limit: 5 sends per IP per 10 min (4 used above)
expect "5th send ok" "$(post send-lead.php '{"clinicName":"C","email":"r@r.co","specialty":"Dental","phone":"+17135550142"}')" 200
expect "6th send limited" "$(post send-lead.php '{"clinicName":"C","email":"r@r.co","specialty":"Dental","phone":"+17135550142"}')" 429

# --- tagging problems never fail the visitor's submission (the contact is saved)
rm -rf "$PRIV/ratelimit"
expect "tag fails: still ok" "$(post send-lead.php '{"clinicName":"C","email":"tagfail@x.co","specialty":"Dental","phone":"+17135550142"}')" 200
expect "tag fails: body ok" "$(body)" '{"ok":true}'
expect "tag fails: logged" "$(grep -c "add tag 'website-lead' to TAGFAIL: HTTP 422 tag detail" "$PRIV/logs/errors.log")" 1
expect "tag fails: backup says untagged" "$(backup tagfail@x.co ghl_tagged)" False
expect "no contact id: still ok" "$(post free-system/send-lead.php '{"name":"N","email":"noid@x.co","phone":"+17135550142"}')" 200
expect "no contact id: logged" "$(grep -c "returned no contact id; tag 'free-system-lead' not added" "$PRIV/logs/errors.log")" 1
expect "no contact id: backup says untagged" "$(backup noid@x.co ghl_tagged)" False

# --- a page cached before the switch still sends "3–5" (en dash): stored as GHL's "3-5"
rm -rf "$PRIV/ratelimit"
expect "old en dash: ok" "$(post send-lead.php '{"clinicName":"C","email":"dash@x.co","specialty":"Dental","locations":"3–5","phone":"+17135550142"}')" 200
expect "old en dash: sent as 3-5" "$(ghl | grep -c '"field_value": "3-5", "key": "locations"')" 1

# --- phone: required, sent to GHL in E.164; numbers without a country code are
#     refused unless they're valid US numbers (GHL would otherwise prefix +1)
rm -rf "$PRIV/ratelimit"; rm -f "$TMP/ghl/last.json"
expect "phone missing: refused" "$(post send-lead.php '{"clinicName":"C","email":"nophone@x.co","specialty":"Dental"}')" 400
expect "phone missing: required message" "$(body)" '{"ok":false,"error":"Please fill in the required fields."}'
expect "local Pakistani number: refused" "$(post free-system/send-lead.php '{"name":"P","email":"pk@x.co","phone":"03225351511"}')" 400
expect "local number: clear message" "$(body)" '{"ok":false,"error":"Please enter a valid phone number, including the country code."}'
expect "+1 in front of a non-US number: refused" "$(post free-system/send-lead.php '{"name":"P","email":"pk@x.co","phone":"+103225351511"}')" 400
expect "refused numbers never reach GHL" "$([ -f "$TMP/ghl/last.json" ] && echo sent || echo not-sent)" not-sent
expect "Pakistani number with +92: ok" "$(post free-system/send-lead.php '{"name":"P","email":"pk@x.co","phone":"+92 322 5351511"}')" 200
expect "Pakistani number: E.164 to GHL" "$(python3 -c "import json;print(json.load(open('$TMP/ghl/last.json'))['phone'])")" "+923225351511"
rm -rf "$PRIV/ratelimit"
expect "old US format (cached page): ok" "$(post send-lead.php '{"clinicName":"C","email":"usold@x.co","phone":"(713) 555-0100","specialty":"Dental"}')" 200
expect "old US format: E.164 to GHL" "$(python3 -c "import json;print(json.load(open('$TMP/ghl/last.json'))['phone'])")" "+17135550100"
expect "UK number: E.164 to GHL" "$(post send-lead.php '{"clinicName":"C","email":"uk@x.co","phone":"+44 20 7946 0958","specialty":"Dental"}' >/dev/null; python3 -c "import json;print(json.load(open('$TMP/ghl/last.json'))['phone'])")" "+442079460958"

# --- clinic website ("clinicWebsite"; "website" is the honeypot): GHL's standard
#     Website field, https added; non-addresses left out
expect "honeypot still named website" "$(post send-lead.php '{"clinicName":"C","email":"bot@x.co","phone":"+17135550142","specialty":"Dental","website":"spam"}' >/dev/null; grep -c 'honeypot filled' "$PRIV/logs/rejected.log")" 2
rm -rf "$PRIV/ratelimit"
expect "website: ok" "$(post send-lead.php '{"clinicName":"W","email":"web@x.co","phone":"+17135550142","specialty":"Dental","clinicWebsite":"brightdental.com"}')" 200
expect "website: https added, sent as website" "$(python3 -c "import json;print(json.load(open('$TMP/ghl/last.json')).get('website'))")" "https://brightdental.com"
expect "not a website: still ok" "$(post send-lead.php '{"clinicName":"W","email":"web2@x.co","phone":"+17135550142","specialty":"Dental","clinicWebsite":"ask me"}')" 200
expect "not a website: not sent" "$(python3 -c "import json;print(json.load(open('$TMP/ghl/last.json')).get('website'))")" None
expect "not a website: kept in the backup" "$(backup web2@x.co fields | grep -c 'ask me')" 1
expect "funnel ignores clinicWebsite" "$(post free-system/send-lead.php '{"name":"F","email":"fw@x.co","phone":"+17135550142","clinicWebsite":"x.com"}' >/dev/null; python3 -c "import json;print(json.load(open('$TMP/ghl/last.json')).get('website'))")" None

# --- existing contacts: only empty fields are filled (never name or source);
#     the submission goes into a note; the tag is always added
rm -rf "$PRIV/ratelimit"
expect "existing: ok" "$(post send-lead.php '{"name":"New Name","clinicName":"New Clinic","email":"old@x.co","phone":"+1 713 555 0101","specialty":"Weight loss","locations":"1","message":"Hi again","clinicWebsite":"newclinic.com"}')" 200
expect "existing: lookup query" "$(tail -1 "$TMP/ghl/dup.txt")" "locationId=LOC123&email=old%40x.co&number=%2B17135550101"
expect "existing: only empty fields sent" "$(ghl)" '{"customFields": [{"field_value": "Hi again", "key": "biggest_gap"}, {"field_value": "1", "key": "locations"}], "email": "old@x.co", "locationId": "LOC123", "phone": "+17135550101", "website": "https://newclinic.com"}'
expect "existing: note on the contact" "$(cat "$TMP/ghl/note.txt")" "/contacts/C-OLD/notes"
expect "existing: note has the whole submission" "$(note | tail -n +2)" "Name: New Name
Clinic: New Clinic
Website: newclinic.com
Email: old@x.co
Phone: +17135550101
Specialty: Weight loss
Locations: 1
Biggest gap: Hi again"
expect "existing: note heading" "$(note | head -1 | cut -d, -f1)" "New website submission: Website form"
expect "existing: tagged" "$(tagpath)" "/contacts/C-OLD/tags"
expect "existing: backup" "$(backup old@x.co ghl_existing) $(backup old@x.co ghl_noted) $(backup old@x.co ghl_tagged)" "True True True"
expect "new contact: backup" "$(backup jane@bright.co ghl_existing) $(backup jane@bright.co ghl_noted)" "False None"

rm -f "$TMP/ghl/last.json"
expect "nothing to fill: ok" "$(post send-lead.php '{"clinicName":"Other","email":"oldfull@x.co","phone":"+17135550198","specialty":"Med spa","locations":"2","message":"New gap"}')" 200
expect "nothing to fill: no upsert" "$([ -f "$TMP/ghl/last.json" ] && echo called || echo not-called)" not-called
expect "nothing to fill: note + tag" "$(cat "$TMP/ghl/note.txt") $(tagpath)" "/contacts/C-FULL/notes /contacts/C-FULL/tags"

expect "found by phone: ok" "$(post free-system/send-lead.php '{"name":"Pat","email":"new@x.co","phone":"+17135550199","clinicName":"PH Clinic","clinicType":"Dental"}')" 200
expect "found by phone: email kept, matched on it" "$(ghl)" '{"companyName": "PH Clinic", "customFields": [{"field_value": "Dental", "key": "clinic_type"}], "email": "orig@x.co", "locationId": "LOC123"}'
expect "found by phone: new email in note" "$(note | grep -c '^Email: new@x.co$')" 1
expect "found by phone: funnel tag" "$(tag) $(tagpath)" '{"tags": ["free-system-lead"]} /contacts/C-PH/tags'

expect "no email yet: ok" "$(post free-system/send-lead.php '{"name":"Ned","email":"ne@x.co","phone":"+17135550177"}')" 200
expect "no email yet: email filled, matched on phone" "$(ghl)" '{"email": "ne@x.co", "locationId": "LOC123", "phone": "+17135550177"}'
expect "field list fetched once (cached)" "$(cat "$TMP/ghl/cf.count")" 1

rm -rf "$PRIV/ratelimit"
rm -f "$PRIV/cache/custom-fields.json"; touch "$TMP/ghl/cf.fail"
expect "field list fails: ok" "$(post send-lead.php '{"clinicName":"C2","email":"old2@x.co","specialty":"Dental","message":"Gap two","phone":"+17135550142"}')" 200
expect "field list fails: no custom fields sent" "$(ghl)" '{"companyName": "C2", "email": "old2@x.co", "locationId": "LOC123", "phone": "+17135550142"}'
expect "field list fails: values in note" "$(note | grep -c '^Biggest gap: Gap two$')" 1
expect "field list fails: logged" "$(grep -c 'custom field list failed: HTTP 500 cf detail' "$PRIV/logs/errors.log")" 1
rm -f "$TMP/ghl/cf.fail"

expect "lookup fails: ok" "$(post send-lead.php '{"name":"Liz","clinicName":"L","email":"lookupfail@x.co","specialty":"Dental","phone":"+17135550142"}')" 200
expect "lookup fails: full upsert" "$(ghl)" '{"companyName": "L", "customFields": [{"field_value": "Dental", "key": "specialty"}], "email": "lookupfail@x.co", "firstName": "Liz", "lastName": "", "locationId": "LOC123", "name": "Liz", "phone": "+17135550142", "source": "Website form"}'
expect "lookup fails: logged" "$(grep -c 'contact lookup failed: HTTP 500 lookup detail' "$PRIV/logs/errors.log")" 1
expect "lookup fails: no note" "$(backup lookupfail@x.co ghl_noted)" None

expect "note fails: still ok" "$(post free-system/send-lead.php '{"name":"Nia","email":"oldnotefail@x.co","clinicName":"NF","phone":"+17135550142"}')" 200
expect "note fails: logged" "$(grep -c 'add note to NOTEFAIL: HTTP 500 note detail' "$PRIV/logs/errors.log")" 1
expect "note fails: backup" "$(backup oldnotefail@x.co ghl_noted) $(backup oldnotefail@x.co ghl_tagged)" "False True"

# --- time budget: a slow GHL can't hold the request; the save always runs,
#     the tag is skipped (and logged) once the budget is spent. Own server and
#     config (editing config.php under a running server can hit PHP's opcode cache).
BUDGET_PRIV="$TMP/private-budget"; mkdir -p "$BUDGET_PRIV"
cat > "$BUDGET_PRIV/config.php" <<'PHP'
<?php return [
  'ghl_token' => 'pit-test', 'ghl_location_id' => 'LOC123',
  'allowed_origins' => ['http://127.0.0.1:8784'],
  'ghl_api_url' => 'http://127.0.0.1:8782/contacts/upsert',
  'time_budget' => 3.5,
];
PHP
LEAD_PRIVATE_DIR="$BUDGET_PRIV" php -S 127.0.0.1:8784 -t "$ROOT/server/public_html" >/dev/null 2>&1 & BUDGET_PID=$!
wait_for 8784
start=$(date +%s)
code=$(curl -s -o "$TMP/resp" -w '%{http_code}' -X POST http://127.0.0.1:8784/send-lead.php -H 'Content-Type: application/json' -H 'Origin: http://127.0.0.1:8784' --data '{"clinicName":"S","email":"slowupsert@x.co","specialty":"Dental","phone":"+17135550142"}')
expect "slow GHL: still ok" "$code" 200
expect "slow GHL: finished within the budget" "$(( $(date +%s) - start <= 6 ))" 1
budget_out() { python3 -c "import json,glob;r=[json.loads(l) for f in glob.glob('$BUDGET_PRIV/leads/*.jsonl') for l in open(f)];print(r[-1]['$1'])"; }
expect "slow GHL: lookup skipped to leave time for the save" "$(grep -c 'contact lookup skipped: time budget used' "$BUDGET_PRIV/logs/errors.log")" 1
expect "slow GHL: contact saved" "$(budget_out sent_to_ghl)" True
expect "slow GHL: tag skipped" "$(budget_out ghl_tagged)" False
expect "slow GHL: skip logged" "$(grep -c "add tag 'website-lead' to .*skipped: time budget used" "$BUDGET_PRIV/logs/errors.log")" 1
kill $BUDGET_PID 2>/dev/null || true

# --- missing config: lead still validated and backed up, GHL skipped
rm -rf "$PRIV/ratelimit"; mv "$PRIV/config.php" "$PRIV/config.off"
expect "no config: origin still enforced" "$(post send-lead.php '{}' https://evil.example)" 403
expect "no config: validation still runs" "$(post send-lead.php '{"email":"a@b.co"}' https://docsscale.com)" 400
expect "no config: 502 generic" "$(post send-lead.php '{"clinicName":"C","email":"noconf@x.co","specialty":"Dental","phone":"+17135550142"}' https://docsscale.com)" 502
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
expect "staging: test mode ok" "$(stage_post send-lead.php '{"clinicName":"C","email":"stage@x.co","specialty":"Dental","phone":"+17135550142"}')" 200
expect "staging: GHL not called" "$([ -f "$TMP/ghl/last.json" ] && echo called || echo not-called)" not-called
expect "staging: lead in staging dir" "$(grep -c '"stage@x.co"' "$STAGE_PRIV"/leads/*.jsonl)" 1
expect "staging: nothing in prod dir" "$(grep -c '"stage@x.co"' "$PRIV"/leads/*.jsonl)" 0
expect "staging: validation still runs" "$(stage_post send-lead.php '{"email":"a@b.co"}')" 400
kill $STAGE_PID 2>/dev/null || true

echo "passed: $pass  failed: $fail"
[[ $fail -eq 0 ]]
