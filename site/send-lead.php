<?php
// Lead endpoint for the main site (homepage CTA form and /book-a-call/).
// All logic is in _server/lead-handler.php; this file only picks the form.
require __DIR__ . '/_server/lead-handler.php';
handle_lead_request('main');
