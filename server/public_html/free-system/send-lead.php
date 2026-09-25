<?php
// Lead endpoint for the /free-system/ funnel ("Claim the free system").
// All logic is in ../_server/lead-handler.php; this file only picks the form.
require dirname(__DIR__) . '/_server/lead-handler.php';
handle_lead_request('free-system');
