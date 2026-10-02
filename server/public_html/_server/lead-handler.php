<?php
// Shared handler for the public lead endpoints (send-lead.php files).
//
// Request flow:
//   method check → config → same-origin check → size/JSON check → honeypot
//   → required/length/email validation → rate limit
//   → lead backup, "received" line (before any GHL call, so nothing is lost if
//     the request is cut off)
//   → GHL, within a 20 s time budget: look up the contact by email/phone
//       new contact      → upsert with every field (as before)
//       existing contact → upsert only fields that are empty on the contact
//                          (never name or source), matched by the contact's
//                          own email/phone; then add a note with the whole
//                          submission
//     → reply to the visitor as soon as the contact is saved (where the server
//       allows it) → add the form's tag (existing tags kept) → note
//   → lead backup, "outcome" line (same id) → JSON response if not sent yet
//
// Secrets and data live OUTSIDE public_html, next to it:
//   ../private/config.php      GHL token + settings (created by hand, see docs)
//   ../private/leads/*.jsonl   one line per submission, with the GHL outcome
//   ../private/logs/*.log      GHL errors and rejected requests
//   ../private/ratelimit/      per-IP counters
//
// Responses keep the original contract: {"ok":true} on success,
// {"ok":false,"error":"..."} otherwise. Upstream (GHL) details are logged,
// never sent to the browser.

declare(strict_types=1);

const LEAD_GHL_API_URL = 'https://services.leadconnectorhq.com/contacts/upsert';
const LEAD_GHL_API_VERSION = '2021-07-28';
const LEAD_MAX_BODY_BYTES = 16384;
const LEAD_RATE_WINDOW_SECONDS = 600;
const LEAD_RATE_MAX_PER_IP = 5;
const LEAD_RATE_MAX_GLOBAL = 60;
const LEAD_DEFAULT_ORIGINS = ['https://docsscale.com', 'https://www.docsscale.com'];
const LEAD_GENERIC_ERROR = 'Something went wrong. Please try again, or email info@docsscale.com.';
// Time budget for all GHL calls of one submission, and each call's own cap.
// The contact save always gets at least LEAD_UPSERT_MIN_SECONDS; the lookup and
// field list leave room for it, and the tag and note are skipped (and logged)
// once the budget is spent.
const LEAD_TIME_BUDGET_SECONDS = 20;
// Includes the DNS lookup: the host's resolver has been seen taking over 3 s.
const LEAD_CONNECT_TIMEOUT_SECONDS = 5;
const LEAD_UPSERT_MIN_SECONDS = 3;
// Where the lead came from, sent by the forms after analytics consent, saved to
// the GHL custom fields in the "Tracking" folder (keys without "contact.").
const LEAD_ATTRIBUTION_FIELDS = ['utmSource' => 150, 'utmMedium' => 150, 'utmCampaign' => 150, 'landingPage' => 500];
const LEAD_ATTRIBUTION_KEYS = ['utmSource' => 'utm_source', 'utmMedium' => 'utm_medium', 'utmCampaign' => 'utm_campaign', 'landingPage' => 'landing_page'];
const LEAD_CALL_CAPS = ['lookup' => 5, 'fields' => 5, 'upsert' => 8, 'tag' => 4, 'note' => 4];

function lead_private_dir(): string
{
    // Production: public_html/_server/ → domains/docsscale.com/private.
    // Staging lives in public_html/staging_html/, so its deploy adds
    // _server/environment.php naming its own private folder (never inside the
    // web root). LEAD_PRIVATE_DIR overrides both for local tests.
    if ($env = getenv('LEAD_PRIVATE_DIR')) {
        return $env;
    }
    $environment = __DIR__ . '/environment.php';
    if (is_file($environment)) {
        $settings = require $environment;
        if (is_array($settings) && !empty($settings['private_dir'])) {
            return $settings['private_dir'];
        }
    }
    return dirname(__DIR__, 2) . '/private';
}

function handle_lead_request(string $formKey): never
{
    header('Content-Type: application/json');
    header('Cache-Control: no-store');

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        lead_respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
    }

    $forms = require __DIR__ . '/forms.php';
    $form = $forms[$formKey] ?? null;
    if ($form === null) {
        lead_log('errors', "unknown form '$formKey'");
        lead_respond(500, ['ok' => false, 'error' => LEAD_GENERIC_ERROR]);
    }
    // A missing config must not lose leads: validate and back up the
    // submission as usual, and only skip the GHL call.
    $config = lead_load_config();
    if ($config === null) {
        lead_log('errors', 'private/config.php missing or incomplete; leads are backed up but not sent to GHL');
    }

    if (!lead_is_same_origin($config['allowed_origins'] ?? LEAD_DEFAULT_ORIGINS)) {
        lead_log('rejected', "$formKey: cross-origin or missing Origin/Referer");
        lead_respond(403, ['ok' => false, 'error' => 'Invalid submission.']);
    }

    $raw = file_get_contents('php://input', false, null, 0, LEAD_MAX_BODY_BYTES + 1);
    if ($raw === false || strlen($raw) > LEAD_MAX_BODY_BYTES) {
        lead_respond(413, ['ok' => false, 'error' => 'Invalid submission.']);
    }
    $input = json_decode($raw, true);
    if (!is_array($input)) {
        lead_respond(400, ['ok' => false, 'error' => 'Invalid submission.']);
    }

    // Honeypot: a hidden "website" field that people never fill in. Bots
    // get a normal-looking success and nothing is sent to GHL.
    if (lead_field($input, 'website') !== '') {
        lead_log('rejected', "$formKey: honeypot filled");
        lead_respond(200, ['ok' => true]);
    }

    $values = [];
    foreach ($form['fields'] as $key => $maxLength) {
        $values[$key] = lead_field($input, $key);
        if (mb_strlen($values[$key]) > $maxLength) {
            lead_respond(400, ['ok' => false, 'error' => 'Please shorten your answers and try again.']);
        }
    }
    foreach ($form['required'] as $key) {
        if ($values[$key] === '') {
            lead_respond(400, ['ok' => false, 'error' => 'Please fill in the required fields.']);
        }
    }
    if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
        lead_respond(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
    }
    if (($values['phone'] ?? '') !== '') {
        $phone = lead_normalize_phone($values['phone']);
        if ($phone === null) {
            lead_log('rejected', "$formKey: invalid phone");
            lead_respond(400, ['ok' => false, 'error' => 'Please enter a valid phone number, including the country code.']);
        }
        $values['phone'] = $phone;
    }

    $ipHash = hash('sha256', lead_client_ip());
    if (!lead_rate_limit_allows($ipHash)) {
        lead_log('rejected', "$formKey: rate limited " . substr($ipHash, 0, 12));
        lead_respond(429, ['ok' => false, 'error' => 'Too many submissions. Please wait a few minutes and try again.']);
    }

    // Back the lead up before anything can go wrong with GHL; the outcome is
    // appended under the same id at the end.
    $leadId = lead_store_received($formKey, $ipHash, $values);
    ignore_user_abort(true);
    @set_time_limit(LEAD_TIME_BUDGET_SECONDS + 15);
    lead_deadline((float) ($config['time_budget'] ?? LEAD_TIME_BUDGET_SECONDS));

    $existing = null;
    $lookedUp = false;
    if ($config === null) {
        [$httpCode, $response, $curlError] = [0, false, 'not attempted: no config'];
    } elseif ($config['test_mode']) {
        lead_store_outcome($leadId, $formKey, ['sent_to_ghl' => false, 'ghl_http' => 0, 'test_mode' => true]);
        lead_respond(200, ['ok' => true]);
    } else {
        $body = ($form['build'])($values, $config['ghl_location_id'], $form['source']);
        // Existing contact: keep what GHL already has. If the lookup itself fails,
        // fall back to the full upsert so the lead is never lost (and log it).
        $existing = lead_find_contact($values, $config, $formKey);
        $lookedUp = true;
        if ($existing === null) {
            [$httpCode, $response, $curlError] = lead_send_to_ghl($body, $config, null, 'upsert');
            $contactId = lead_contact_id($response);
        } else {
            $contactId = (string) $existing['id'];
            $update = lead_fill_only($body, $existing, $config, $formKey);
            if ($update === null) {
                [$httpCode, $response, $curlError] = [200, '{}', '']; // nothing empty to fill
            } else {
                [$httpCode, $response, $curlError] = lead_send_to_ghl($update, $config, null, 'upsert');
                $updatedId = lead_contact_id($response);
                if ($updatedId !== '' && $updatedId !== $contactId) {
                    lead_log('errors', "$formKey: GHL upsert updated $updatedId, lookup found $contactId; note and tag go to $updatedId");
                    $contactId = $updatedId;
                }
            }
        }
    }
    $ok = $response !== false && $httpCode >= 200 && $httpCode < 300;

    // The contact is saved: the visitor needn't wait for the tag and note.
    if ($ok) {
        lead_reply_early(['ok' => true]);
    }

    // Tag the contact so GHL workflows can start. Upsert's own `tags` field would
    // replace all existing tags, so the separate Add Tags call is used. A tagging
    // failure doesn't fail the visitor's submission (the contact is saved); it is
    // logged and recorded in the backup so the tag can be added by hand.
    $tagged = null;
    if ($ok && !empty($form['tag'])) {
        $tagged = lead_add_tag($contactId ?? '', $form['tag'], $config, $formKey);
    }

    // A repeat submission's details go into a note, so nothing the person wrote
    // is lost even though their existing fields weren't overwritten.
    $noted = null;
    if ($ok && $existing !== null) {
        $noted = lead_add_note($contactId, lead_note_text($form, $values), $config, $formKey);
    }

    lead_store_outcome($leadId, $formKey, [
        'sent_to_ghl' => $ok,
        'ghl_http' => $httpCode,
        'ghl_tagged' => $tagged,
        'ghl_existing' => $lookedUp ? $existing !== null : null,
        'ghl_noted' => $noted,
    ]);

    if ($ok) {
        lead_respond(200, ['ok' => true]);
    }

    lead_log('errors', sprintf(
        '%s: GHL HTTP %d %s',
        $formKey,
        $httpCode,
        $response === false ? "curl: $curlError" : lead_ghl_message($response)
    ));
    lead_respond(502, ['ok' => false, 'error' => LEAD_GENERIC_ERROR]);
}

function lead_respond(int $status, array $payload): never
{
    if (!lead_reply_early()) {
        http_response_code($status);
        echo json_encode($payload);
    }
    exit;
}

/**
 * Sends the visitor's 200 reply now and lets the script carry on (PHP-FPM or
 * LiteSpeed). Where the server can't do that, nothing is sent here and the
 * reply goes out at the end as before. Called without a payload, it only says
 * whether a reply has already gone out.
 */
function lead_reply_early(?array $payload = null): bool
{
    static $sent = false;
    if ($payload === null || $sent) {
        return $sent;
    }
    $finish = function_exists('fastcgi_finish_request') ? 'fastcgi_finish_request'
        : (function_exists('litespeed_finish_request') ? 'litespeed_finish_request' : null);
    if ($finish === null) {
        return false;
    }
    http_response_code(200);
    echo json_encode($payload);
    $finish();
    return $sent = true;
}

/**
 * One curl share handle per request, holding the DNS cache (and TLS sessions),
 * so GHL's address is looked up once and reused by every call of a submission.
 */
function lead_curl_share(): CurlShareHandle
{
    static $share = null;
    if ($share === null) {
        $share = curl_share_init();
        curl_share_setopt($share, CURLSHOPT_SHARE, CURL_LOCK_DATA_DNS);
        curl_share_setopt($share, CURLSHOPT_SHARE, CURL_LOCK_DATA_SSL_SESSION);
    }
    return $share;
}

/** Starts the GHL time budget (with $seconds) or returns seconds left in it. */
function lead_deadline(?float $seconds = null): float
{
    static $deadline = null;
    if ($seconds !== null) {
        $deadline = microtime(true) + $seconds;
    }
    return $deadline === null ? PHP_FLOAT_MAX : $deadline - microtime(true);
}

/**
 * Timeout in seconds for one GHL call of kind $kind ('lookup', 'fields',
 * 'upsert', 'tag', 'note'), or null to skip the call because the budget is
 * spent. The lookup and field list keep room for the save; the save always runs.
 */
function lead_call_timeout(string $kind): ?float
{
    $left = lead_deadline();
    $cap = LEAD_CALL_CAPS[$kind] ?? 5;
    if ($kind === 'upsert') {
        return max(LEAD_UPSERT_MIN_SECONDS, min($cap, $left));
    }
    if ($kind === 'lookup' || $kind === 'fields') {
        $left -= LEAD_CALL_CAPS['upsert'];
    }
    $timeout = min($cap, $left);
    return $timeout >= 1 ? $timeout : null;
}

function lead_field(array $input, string $key): string
{
    $value = $input[$key] ?? '';
    return is_scalar($value) ? trim((string) $value) : '';
}

/**
 * The phone number in E.164 (+17135550100), or null if it isn't one.
 * The forms send E.164 already (country picker, checked in the browser). A US
 * number in the old free-text format, from a page cached before the change,
 * is still accepted: 10 digits, or 11 starting with 1, as a valid NANP number.
 * Anything else without a country code is refused rather than guessed: GHL
 * would otherwise prefix +1 to it (that's how "+103225351511" got in).
 */
function lead_normalize_phone(string $phone): ?string
{
    $digits = preg_replace('/\D+/', '', $phone);
    if (str_starts_with(ltrim($phone), '+')) {
        $e164 = '+' . $digits;
    } elseif (strlen($digits) === 10) {
        $e164 = '+1' . $digits;
    } elseif (strlen($digits) === 11 && $digits[0] === '1') {
        $e164 = '+' . $digits;
    } else {
        return null;
    }
    if (!preg_match('/^\+[1-9]\d{7,14}$/', $e164)) {
        return null;
    }
    // North America (+1): area code and exchange can't start with 0 or 1.
    if (str_starts_with($e164, '+1') && !preg_match('/^\+1[2-9]\d{2}[2-9]\d{6}$/', $e164)) {
        return null;
    }
    return $e164;
}

/** GHL custom fields for the lead's UTM tags and landing page (only those sent). */
function lead_attribution_custom_fields(array $v): array
{
    $fields = [];
    foreach (LEAD_ATTRIBUTION_KEYS as $name => $key) {
        if (($v[$name] ?? '') !== '') {
            $fields[] = ['key' => $key, 'field_value' => $v[$name]];
        }
    }
    return $fields;
}

function lead_split_name(string $name): array
{
    $parts = preg_split('/\s+/', $name, 2);
    return [$parts[0], $parts[1] ?? ''];
}

/** @return array{ghl_token?:string,ghl_location_id?:string,allowed_origins:list<string>,test_mode:bool}|null */
function lead_load_config(): ?array
{
    $file = lead_private_dir() . '/config.php';
    if (!is_file($file)) {
        return null;
    }
    $config = require $file;
    if (!is_array($config)) {
        return null;
    }
    // Test mode (staging): leads are validated and backed up but never sent to GHL,
    // so no token is needed.
    $config['test_mode'] = !empty($config['test_mode']);
    if (!$config['test_mode'] && (empty($config['ghl_token']) || empty($config['ghl_location_id']))) {
        return null;
    }
    $config['allowed_origins'] ??= LEAD_DEFAULT_ORIGINS;
    return $config;
}

function lead_is_same_origin(array $allowedOrigins): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        return in_array(rtrim($origin, '/'), $allowedOrigins, true);
    }
    // Some privacy tools strip Origin; fall back to the Referer's origin.
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    $parts = parse_url($referer);
    if (!isset($parts['scheme'], $parts['host'])) {
        return false;
    }
    $refererOrigin = $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
    return in_array($refererOrigin, $allowedOrigins, true);
}

function lead_client_ip(): string
{
    // The site sits behind Hostinger's CDN; the first X-Forwarded-For entry
    // is the visitor. It can be spoofed, which only weakens the per-IP limit;
    // the global limit still caps total volume.
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwarded !== '') {
        $first = trim(explode(',', $forwarded)[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) {
            return $first;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function lead_rate_limit_allows(string $ipHash): bool
{
    $dir = lead_ensure_dir('ratelimit');
    if ($dir === null) {
        return true; // fail open: never lose a real lead to a storage problem
    }
    $now = time();
    return lead_rate_bucket_hit("$dir/_global.json", LEAD_RATE_MAX_GLOBAL, $now)
        && lead_rate_bucket_hit("$dir/" . substr($ipHash, 0, 32) . '.json', LEAD_RATE_MAX_PER_IP, $now);
}

function lead_rate_bucket_hit(string $file, int $max, int $now): bool
{
    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        return true;
    }
    flock($fh, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($fh), true);
    $hits = array_values(array_filter(
        is_array($hits) ? $hits : [],
        static fn($t): bool => is_int($t) && $t > $now - LEAD_RATE_WINDOW_SECONDS
    ));
    $allowed = count($hits) < $max;
    if ($allowed) {
        $hits[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
    @chmod($file, 0600);
    return $allowed;
}

/** @return array{0:int,1:string|false,2:string} */
function lead_send_to_ghl(array $body, array $config, ?string $url = null, string $kind = 'upsert'): array
{
    $timeout = lead_call_timeout($kind);
    if ($timeout === null) {
        return [0, false, 'skipped: time budget used'];
    }
    $ch = curl_init($url ?? $config['ghl_api_url'] ?? LEAD_GHL_API_URL);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($body),
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $config['ghl_token'],
            'Version: ' . LEAD_GHL_API_VERSION,
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_CONNECTTIMEOUT_MS => (int) (min(LEAD_CONNECT_TIMEOUT_SECONDS, $timeout) * 1000),
        CURLOPT_TIMEOUT_MS => (int) ($timeout * 1000),
        CURLOPT_NOSIGNAL => true,
        CURLOPT_SHARE => lead_curl_share(),
    ]);
    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    return [$httpCode, $response, $curlError];
}

/** Base URL of the GHL API (tests point ghl_api_url at a local fake). */
function lead_ghl_base(array $config): string
{
    return (string) preg_replace('#/contacts/upsert$#', '', $config['ghl_api_url'] ?? LEAD_GHL_API_URL);
}

/** GET a GHL API path; returns the decoded JSON, or null on any failure. */
function lead_ghl_get(string $path, array $query, array $config, string $formKey, string $what, string $kind): ?array
{
    $timeout = lead_call_timeout($kind);
    if ($timeout === null) {
        lead_log('errors', "$formKey: GHL $what skipped: time budget used");
        return null;
    }
    $ch = curl_init(lead_ghl_base($config) . $path . '?' . http_build_query($query));
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $config['ghl_token'],
            'Version: ' . LEAD_GHL_API_VERSION,
            'Accept: application/json',
        ],
        CURLOPT_CONNECTTIMEOUT_MS => (int) (min(LEAD_CONNECT_TIMEOUT_SECONDS, $timeout) * 1000),
        CURLOPT_TIMEOUT_MS => (int) ($timeout * 1000),
        CURLOPT_NOSIGNAL => true,
        CURLOPT_SHARE => lead_curl_share(),
    ]);
    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $decoded = is_string($response) ? json_decode($response, true) : null;
    if ($httpCode >= 200 && $httpCode < 300 && is_array($decoded)) {
        return $decoded;
    }
    lead_log('errors', sprintf(
        '%s: GHL %s failed: HTTP %d %s',
        $formKey,
        $what,
        $httpCode,
        $response === false ? 'curl: ' . curl_error($ch) : lead_ghl_message((string) $response)
    ));
    return null;
}

/**
 * The existing GHL contact with this email (or phone), matched the way GHL's
 * upsert matches. null when there is none, or when the lookup fails (then the
 * caller falls back to a full upsert, as before this check existed).
 */
function lead_find_contact(array $values, array $config, string $formKey): ?array
{
    $query = ['locationId' => $config['ghl_location_id'], 'email' => $values['email']];
    if (($values['phone'] ?? '') !== '') {
        $query['number'] = $values['phone'];
    }
    $found = lead_ghl_get('/contacts/search/duplicate', $query, $config, $formKey, 'contact lookup', 'lookup');
    $contact = $found['contact'] ?? null;
    return is_array($contact) && !empty($contact['id']) ? $contact : null;
}

/**
 * GHL custom field ids by key ("specialty" => "0AUL…"), cached for a day in
 * private/cache. null if GHL can't be asked (the caller then leaves custom
 * fields alone and records the values in the note).
 */
function lead_custom_field_ids(array $config, string $formKey): ?array
{
    $dir = lead_ensure_dir('cache');
    $file = $dir === null ? null : "$dir/custom-fields.json";
    if ($file !== null && is_file($file) && filemtime($file) > time() - 86400) {
        $cached = json_decode((string) file_get_contents($file), true);
        if (is_array($cached)) {
            return $cached;
        }
    }
    $path = '/locations/' . rawurlencode($config['ghl_location_id']) . '/customFields';
    $list = lead_ghl_get($path, ['model' => 'contact'], $config, $formKey, 'custom field list', 'fields');
    if ($list === null || !isset($list['customFields']) || !is_array($list['customFields'])) {
        return null;
    }
    $ids = [];
    foreach ($list['customFields'] as $field) {
        $key = preg_replace('/^contact\./', '', (string) ($field['fieldKey'] ?? ''));
        if ($key !== '' && !empty($field['id'])) {
            $ids[$key] = (string) $field['id'];
        }
    }
    if ($file !== null) {
        file_put_contents($file, json_encode($ids), LOCK_EX);
        @chmod($file, 0600);
    }
    return $ids;
}

/**
 * Reduces a full upsert body to the upsert for an existing contact: never the
 * name or source, other fields only where the contact has no value yet; null
 * when there is nothing to fill. The contact is matched by its own email (or,
 * without one, its own phone), so its email is never changed and the upsert
 * can't land on a different contact.
 */
function lead_fill_only(array $body, array $contact, array $config, string $formKey): ?array
{
    $isEmpty = static fn ($value): bool => $value === null || $value === '' || $value === [];
    $filled = [];
    foreach ($body as $key => $value) {
        if (in_array($key, ['locationId', 'firstName', 'lastName', 'name', 'source', 'customFields'], true)) {
            continue;
        }
        if ($isEmpty($contact[$key] ?? null)) {
            $filled[$key] = $value;
        }
    }
    if (!empty($body['customFields'])) {
        $ids = lead_custom_field_ids($config, $formKey);
        $current = [];
        foreach ($contact['customFields'] ?? [] as $field) {
            if (isset($field['id'])) {
                $current[$field['id']] = $field['value'] ?? ($field['fieldValue'] ?? null);
            }
        }
        $custom = [];
        foreach ($ids === null ? [] : $body['customFields'] as $field) {
            $id = $ids[$field['key']] ?? null;
            if ($id !== null && $isEmpty($current[$id] ?? null)) {
                $custom[] = $field;
            }
        }
        if ($custom) {
            $filled['customFields'] = $custom;
        }
    }
    if ($filled === []) {
        return null;
    }
    $match = $isEmpty($contact['email'] ?? null)
        ? ['phone' => (string) ($contact['phone'] ?? '')]
        : ['email' => (string) $contact['email']];
    return ['locationId' => $body['locationId']] + $match + $filled;
}

/** The whole submission as a plain-text GHL note (labels from forms.php). */
function lead_note_text(array $form, array $values): string
{
    $lines = [sprintf('New website submission: %s, %s UTC', $form['source'], gmdate('j M Y H:i'))];
    foreach ($form['labels'] ?? [] as $key => $label) {
        if (($values[$key] ?? '') !== '') {
            $lines[] = "$label: " . $values[$key];
        }
    }
    return implode("\n", $lines);
}

/** The contact id in an upsert response ('' when there is none). */
function lead_contact_id(string|false $upsertResponse): string
{
    $decoded = is_string($upsertResponse) ? json_decode($upsertResponse, true) : null;
    return is_array($decoded) ? (string) ($decoded['contact']['id'] ?? '') : '';
}

/** Adds a note to an existing contact; true when GHL confirms it. */
function lead_add_note(string $contactId, string $text, array $config, string $formKey): bool
{
    $url = lead_ghl_base($config) . '/contacts/' . rawurlencode($contactId) . '/notes';
    [$httpCode, $response, $curlError] = lead_send_to_ghl(['body' => $text], $config, $url, 'note');
    if ($response !== false && $httpCode >= 200 && $httpCode < 300) {
        return true;
    }
    lead_log('errors', sprintf(
        '%s: GHL add note to %s: HTTP %d %s',
        $formKey,
        $contactId,
        $httpCode,
        $response === false ? "curl: $curlError" : lead_ghl_message($response)
    ));
    return false;
}

/** Adds $tag to the contact ('' = the upsert returned none); true when GHL confirms it. */
function lead_add_tag(string $contactId, string $tag, array $config, string $formKey): bool
{
    if ($contactId === '') {
        lead_log('errors', "$formKey: GHL upsert returned no contact id; tag '$tag' not added");
        return false;
    }
    $url = lead_ghl_base($config) . '/contacts/' . rawurlencode($contactId) . '/tags';
    [$httpCode, $response, $curlError] = lead_send_to_ghl(['tags' => [$tag]], $config, $url, 'tag');
    if ($response !== false && $httpCode >= 200 && $httpCode < 300) {
        return true;
    }
    lead_log('errors', sprintf(
        "%s: GHL add tag '%s' to %s: HTTP %d %s",
        $formKey,
        $tag,
        $contactId,
        $httpCode,
        $response === false ? "curl: $curlError" : lead_ghl_message($response)
    ));
    return false;
}

function lead_ghl_message(string $response): string
{
    $decoded = json_decode($response, true);
    $message = is_array($decoded) ? ($decoded['message'] ?? '') : '';
    if (is_array($message)) {
        $message = implode(' ', $message);
    }
    return substr((string) ($message ?: $response), 0, 500);
}

/**
 * Lead backup: ../private/leads/YYYY-MM.jsonl, two lines per submission with the
 * same `id`. The "received" line (the form's fields) is written before any GHL
 * call; the "outcome" line records what GHL did. A received line with no outcome
 * means the request was cut off: check GHL and re-enter the lead if it's missing.
 * Outcome fields: `sent_to_ghl`, `ghl_http`; `ghl_tagged` / `ghl_noted` true/false
 * when attempted, null when not; `ghl_existing` whether the contact already
 * existed (null: not looked up).
 */
function lead_store_received(string $formKey, string $ipHash, array $values): string
{
    $id = bin2hex(random_bytes(6));
    lead_append_backup($formKey, [
        'time' => gmdate('c'),
        'id' => $id,
        'form' => $formKey,
        'status' => 'received',
        'ip_hash' => substr($ipHash, 0, 16),
        'fields' => $values,
    ]);
    return $id;
}

function lead_store_outcome(string $id, string $formKey, array $outcome): void
{
    lead_append_backup($formKey, ['time' => gmdate('c'), 'id' => $id, 'form' => $formKey, 'status' => 'outcome'] + $outcome);
}

function lead_append_backup(string $formKey, array $record): void
{
    $dir = lead_ensure_dir('leads');
    if ($dir === null) {
        lead_log('errors', "$formKey: could not write lead backup");
        return;
    }
    $file = "$dir/" . gmdate('Y-m') . '.jsonl';
    file_put_contents($file, json_encode($record, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    @chmod($file, 0600);
}

function lead_log(string $name, string $message): void
{
    $dir = lead_ensure_dir('logs');
    if ($dir === null) {
        error_log("lead-handler: $message");
        return;
    }
    $file = "$dir/$name.log";
    file_put_contents($file, gmdate('c') . " $message\n", FILE_APPEND | LOCK_EX);
    @chmod($file, 0600);
}

function lead_ensure_dir(string $name): ?string
{
    $dir = lead_private_dir() . '/' . $name;
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return null;
    }
    return $dir;
}
