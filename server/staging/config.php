<?php
// Staging lead-handler config (uploaded to private-staging/config.php).
// Test mode: submissions are validated and saved, never sent to GoHighLevel.
return [
    'test_mode' => true,
    'allowed_origins' => ['https://staging.docsscale.com'],
];
