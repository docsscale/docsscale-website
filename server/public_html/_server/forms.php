<?php
// Per-form configuration for the shared lead handler.
//
// Each entry describes one public endpoint:
//   fields    — accepted JSON keys => max length (longer input is rejected)
//   required  — keys that must be non-empty
//   source    — GHL "source" value, pinned server-side
//   tag       — GHL tag added to the contact after every successful upsert
//               (via the Add Tags API, so existing tags are kept). GHL workflows
//               trigger on it, because API-created contacts never count as a
//               GHL "form submission".
//   (both forms also accept the LEAD_ATTRIBUTION_FIELDS: UTM tags and landing
//   page, kept in the visitor's browser tab and sent with the form)
//   labels    — field labels for the note added when an existing contact
//               submits again (their fields aren't overwritten; see lead-handler)
//   build     — maps the cleaned values to the GHL /contacts/upsert body
//
// The two builders reproduce the payloads the original per-folder
// send-lead.php files sent, field for field.

declare(strict_types=1);

return [

    // public_html/send-lead.php — homepage CTA form and /book-a-call/ form.
    'main' => [
        'fields' => [
            'name' => 100,
            'clinicName' => 150,
            'clinicWebsite' => 200,
            'email' => 254,
            'phone' => 40,
            'specialty' => 60,
            'locations' => 20,
            'message' => 2000,
        ] + LEAD_ATTRIBUTION_FIELDS,
        'required' => ['clinicName', 'email', 'phone', 'specialty'],
        'source' => 'Website form',
        'tag' => 'website-lead',
        'labels' => [
            'name' => 'Name',
            'clinicName' => 'Clinic',
            'clinicWebsite' => 'Website',
            'email' => 'Email',
            'phone' => 'Phone',
            'specialty' => 'Specialty',
            'locations' => 'Locations',
            'message' => 'Biggest gap',
        ],
        'build' => static function (array $v, string $locationId, string $source): array {
            $body = [
                'locationId' => $locationId,
                'email' => $v['email'],
                'companyName' => $v['clinicName'],
                'source' => $source,
            ];
            // The name field is optional on this form; omit it rather than
            // sending empty strings to GHL.
            if ($v['name'] !== '') {
                [$first, $last] = lead_split_name($v['name']);
                $body['firstName'] = $first;
                $body['lastName'] = $last;
                $body['name'] = $v['name'];
            }
            if ($v['phone'] !== '') {
                $body['phone'] = $v['phone'];
            }
            // GHL's standard Website field ("clinicWebsite": "website" is the
            // honeypot). Text that isn't a web address stays
            // out of it (it's still in the backup and the repeat-lead note).
            $website = lead_normalize_website($v['clinicWebsite'] ?? '');
            if ($website !== null) {
                $body['website'] = $website;
            }
            // GHL custom field keys are the bare keys (no "contact." prefix).
            $custom = [];
            if ($v['message'] !== '') {
                $custom[] = ['key' => 'biggest_gap', 'field_value' => $v['message']];
            }
            if ($v['locations'] !== '') {
                // GHL's option is "3-5" (plain hyphen); pages cached before the
                // site switched from "3–5" (en dash) may still send the old one.
                $custom[] = ['key' => 'locations', 'field_value' => str_replace('–', '-', $v['locations'])];
            }
            if ($v['specialty'] !== '') {
                $custom[] = ['key' => 'specialty', 'field_value' => $v['specialty']];
            }
            $custom = array_merge($custom, lead_attribution_custom_fields($v));
            if ($custom) {
                $body['customFields'] = $custom;
            }
            return $body;
        },
    ],

    // public_html/free-system/send-lead.php — "Claim the free system" funnel.
    'free-system' => [
        'fields' => [
            'name' => 100,
            'email' => 254,
            'phone' => 40,
            'clinicName' => 150,
            'clinicType' => 60,
            'source' => 60, // sent by the page; ignored in favour of the pinned value
        ] + LEAD_ATTRIBUTION_FIELDS,
        'required' => ['name', 'email', 'phone'],
        'source' => 'Funnel - Free System',
        'tag' => 'free-system-lead',
        'labels' => [
            'name' => 'Name',
            'email' => 'Email',
            'phone' => 'Phone',
            'clinicName' => 'Clinic',
            'clinicType' => 'Clinic type',
        ],
        'build' => static function (array $v, string $locationId, string $source): array {
            [$first, $last] = lead_split_name($v['name']);
            $body = [
                'locationId' => $locationId,
                'email' => $v['email'],
                'firstName' => $first,
                'lastName' => $last,
                'name' => $v['name'],
                'source' => $source,
            ];
            if ($v['clinicName'] !== '') {
                $body['companyName'] = $v['clinicName'];
            }
            if ($v['phone'] !== '') {
                $body['phone'] = $v['phone'];
            }
            $custom = $v['clinicType'] !== '' ? [['key' => 'clinic_type', 'field_value' => $v['clinicType']]] : [];
            $custom = array_merge($custom, lead_attribution_custom_fields($v));
            if ($custom) {
                $body['customFields'] = $custom;
            }
            return $body;
        },
    ],

];
