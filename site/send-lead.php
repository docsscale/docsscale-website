<?php
// Relays the "Book a call" form to GoHighLevel (LeadConnector) as a new/updated contact.
// Runs server-side on Hostinger so the API token never reaches the browser.

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

// --- Configuration -----------------------------------------------------
const GHL_API_TOKEN = 'pit-REDACTED';
const GHL_LOCATION_ID = '26SYGuH4RaAOCnaDWCKw';
const GHL_API_URL = 'https://services.leadconnectorhq.com/contacts/upsert';
const GHL_API_VERSION = '2021-07-28';
// -------------------------------------------------------------------------

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid submission.']);
    exit;
}

function field(array $input, string $key): string {
    return isset($input[$key]) ? trim((string) $input[$key]) : '';
}

$name = field($input, 'name');
$clinicName = field($input, 'clinicName');
$email = field($input, 'email');
$phone = field($input, 'phone');
$specialty = field($input, 'specialty');
$locations = field($input, 'locations');
$message = field($input, 'message');

if ($clinicName === '' || $email === '' || $specialty === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please fill in the required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

// The homepage's mini CTA form doesn't collect a name, only the full
// Book a call form does — omit firstName/lastName/name when absent
// rather than sending empty strings to GHL.
$firstName = '';
$lastName = '';
if ($name !== '') {
    $nameParts = preg_split('/\s+/', $name, 2);
    $firstName = $nameParts[0];
    $lastName = $nameParts[1] ?? '';
}

$customFields = [];
if ($message !== '') {
    $customFields[] = ['key' => 'biggest_gap', 'field_value' => $message];
}
if ($locations !== '') {
    $customFields[] = ['key' => 'locations', 'field_value' => $locations];
}
if ($specialty !== '') {
    $customFields[] = ['key' => 'specialty', 'field_value' => $specialty];
}

$body = [
    'locationId' => GHL_LOCATION_ID,
    'email' => $email,
    'companyName' => $clinicName,
    'source' => 'Website form',
];
if ($name !== '') {
    $body['firstName'] = $firstName;
    $body['lastName'] = $lastName;
    $body['name'] = $name;
}
if ($phone !== '') {
    $body['phone'] = $phone;
}
if (!empty($customFields)) {
    $body['customFields'] = $customFields;
}

$ch = curl_init(GHL_API_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($body),
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . GHL_API_TOKEN,
        'Version: ' . GHL_API_VERSION,
        'Content-Type: application/json',
        'Accept: application/json',
    ],
    CURLOPT_TIMEOUT => 15,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Could not reach GHL: ' . $curlError]);
    exit;
}

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['ok' => true]);
    exit;
}

$decoded = json_decode($response, true);
$ghlMessage = is_array($decoded) && isset($decoded['message'])
    ? (is_array($decoded['message']) ? implode(' ', $decoded['message']) : $decoded['message'])
    : 'GHL rejected the submission (HTTP ' . $httpCode . ').';

http_response_code(502);
echo json_encode(['ok' => false, 'error' => $ghlMessage, 'debug' => $response]);
