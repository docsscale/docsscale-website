<?php
// Shared handler for the public lead endpoints (send-lead.php files).
//
// Request flow:
//   method check → config → same-origin check → size/JSON check → honeypot
//   → required/length/email validation → rate limit → GHL upsert
//   → lead backup (always) → JSON response
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

    $ipHash = hash('sha256', lead_client_ip());
    if (!lead_rate_limit_allows($ipHash)) {
        lead_log('rejected', "$formKey: rate limited " . substr($ipHash, 0, 12));
        lead_respond(429, ['ok' => false, 'error' => 'Too many submissions. Please wait a few minutes and try again.']);
    }

    if ($config === null) {
        [$httpCode, $response, $curlError] = [0, false, 'not attempted: no config'];
    } elseif ($config['test_mode']) {
        lead_store($formKey, $ipHash, $values, false, 0);
        lead_respond(200, ['ok' => true]);
    } else {
        $body = ($form['build'])($values, $config['ghl_location_id'], $form['source']);
        [$httpCode, $response, $curlError] = lead_send_to_ghl($body, $config);
    }
    $ok = $response !== false && $httpCode >= 200 && $httpCode < 300;

    lead_store($formKey, $ipHash, $values, $ok, $httpCode);

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
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function lead_field(array $input, string $key): string
{
    $value = $input[$key] ?? '';
    return is_scalar($value) ? trim((string) $value) : '';
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
function lead_send_to_ghl(array $body, array $config): array
{
    $ch = curl_init($config['ghl_api_url'] ?? LEAD_GHL_API_URL);
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
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
    ]);
    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    return [$httpCode, $response, $curlError];
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

/** Append the submission to ../private/leads/YYYY-MM.jsonl, whatever GHL said. */
function lead_store(string $formKey, string $ipHash, array $values, bool $sentToGhl, int $httpCode): void
{
    $dir = lead_ensure_dir('leads');
    if ($dir === null) {
        lead_log('errors', "$formKey: could not write lead backup");
        return;
    }
    $file = "$dir/" . gmdate('Y-m') . '.jsonl';
    $record = [
        'time' => gmdate('c'),
        'form' => $formKey,
        'sent_to_ghl' => $sentToGhl,
        'ghl_http' => $httpCode,
        'ip_hash' => substr($ipHash, 0, 16),
        'fields' => $values,
    ];
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
