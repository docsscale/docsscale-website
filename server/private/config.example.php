<?php
// TEMPLATE for the lead handler's config. The real file lives on the server at
//   /home/u145389112/domains/docsscale.com/private/config.php
// i.e. in a "private" folder NEXT TO public_html (never inside it).
// Copy this file there as config.php and paste the new GHL token.
// Never commit or upload the real file anywhere else.

return [
    // GHL → Settings → Private Integrations. Scope: contacts.write only.
    'ghl_token' => 'pit-PASTE-NEW-TOKEN-HERE',

    // GHL sub-account (location) ID for DocsScale.
    'ghl_location_id' => '26SYGuH4RaAOCnaDWCKw',

    // Pages allowed to post to the lead endpoints.
    'allowed_origins' => [
        'https://docsscale.com',
        'https://www.docsscale.com',
    ],
];
