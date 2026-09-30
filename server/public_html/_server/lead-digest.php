<?php
// Daily failure digest for the lead handler. Run by a Hostinger cron job
// (docs/SERVER.md); never over HTTP (_server/ is denied, and this checks too).
//
// Emails the owner only when something needs attention since the last run:
//   - new lines in private/logs/errors.log (GHL errors, skipped tags/notes,
//     missing config, backup write failures);
//   - leads whose outcome says they didn't reach GHL, weren't tagged or didn't
//     get their note;
//   - leads received more than 15 minutes ago with no outcome line (the request
//     was cut off).
// Nothing to report → no email. State (last run, errors.log position) is kept
// in private/digest-state.json, so each problem is reported once.
//
//   php _server/lead-digest.php           (cron)
//   php _server/lead-digest.php --dry-run (prints the email, sends nothing, keeps state)

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/lead-handler.php';

const DIGEST_IN_FLIGHT_SECONDS = 900; // a lead younger than this may still be running
const DIGEST_FIRST_RUN_SECONDS = 86400;
const DIGEST_DEFAULT_TO = 'info@docsscale.com';

exit(digest_run(in_array('--dry-run', $argv, true)));

function digest_run(bool $dryRun): int
{
    $dir = lead_private_dir();
    $stateFile = "$dir/digest-state.json";
    $state = is_file($stateFile) ? (json_decode((string) file_get_contents($stateFile), true) ?: []) : [];
    $now = time();
    $until = $now - DIGEST_IN_FLIGHT_SECONDS;
    $since = (int) ($state['until'] ?? $until - DIGEST_FIRST_RUN_SECONDS);

    [$errorLines, $errorsOffset] = digest_new_error_lines("$dir/logs/errors.log", (int) ($state['errors_offset'] ?? 0));
    $leadProblems = digest_lead_problems("$dir/leads", $since, $until);

    if ($errorLines || $leadProblems) {
        $config = lead_load_config() ?? [];
        $to = $config['digest_to'] ?? DIGEST_DEFAULT_TO;
        [$subject, $body] = digest_message($leadProblems, $errorLines, $now);
        if ($dryRun) {
            echo "To: $to\nSubject: $subject\n\n$body";
            return 0;
        }
        if (!digest_send($to, $subject, $body)) {
            fwrite(STDERR, "lead-digest: sending the email failed; state not advanced, will retry next run\n");
            return 1;
        }
        echo "lead-digest: emailed $to (" . count($leadProblems) . ' lead problem(s), ' . count($errorLines) . " log line(s))\n";
    } else {
        echo "lead-digest: nothing to report\n";
    }
    if (!$dryRun) {
        file_put_contents($stateFile, json_encode(['until' => $until, 'errors_offset' => $errorsOffset, 'ran' => gmdate('c', $now)]), LOCK_EX);
        @chmod($stateFile, 0600);
    }
    return 0;
}

/** @return array{0: list<string>, 1: int} new lines of errors.log and the new read position */
function digest_new_error_lines(string $file, int $offset): array
{
    if (!is_file($file)) {
        return [[], 0];
    }
    $size = filesize($file);
    if ($size < $offset) {
        $offset = 0; // the log was rotated or truncated
    }
    $fh = fopen($file, 'r');
    fseek($fh, $offset);
    $text = (string) stream_get_contents($fh);
    fclose($fh);
    $lines = array_values(array_filter(explode("\n", $text), static fn (string $l): bool => trim($l) !== ''));
    return [$lines, $size];
}

/**
 * Leads received in (since, until] that need attention.
 * @return list<array{time: string, form: string, email: string, problem: string}>
 */
function digest_lead_problems(string $leadsDir, int $since, int $until): array
{
    $received = [];
    $outcomes = [];
    // This month and the previous one cover any window up to a month.
    foreach ([gmdate('Y-m', $until), gmdate('Y-m', strtotime('first day of last month', $until))] as $month) {
        $file = "$leadsDir/$month.jsonl";
        if (!is_file($file)) {
            continue;
        }
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $row = json_decode($line, true);
            if (!is_array($row) || empty($row['id'])) {
                continue; // lines from before v1.2.1 have no id
            }
            if (($row['status'] ?? '') === 'received') {
                $t = strtotime((string) $row['time']);
                if ($t > $since && $t <= $until) {
                    $received[$row['id']] = $row;
                }
            } elseif (($row['status'] ?? '') === 'outcome') {
                $outcomes[$row['id']] = $row;
            }
        }
    }
    $problems = [];
    foreach ($received as $id => $lead) {
        $out = $outcomes[$id] ?? null;
        $issue = match (true) {
            $out === null => 'no GHL outcome recorded (the request was cut off): check GHL, add the contact, tag and note if missing',
            !empty($out['test_mode']) => null,
            ($out['sent_to_ghl'] ?? false) !== true => 'did not reach GoHighLevel (HTTP ' . ($out['ghl_http'] ?? 0) . '): enter the contact by hand',
            ($out['ghl_tagged'] ?? null) === false => 'saved in GHL but not tagged: add the ' . ($lead['form'] === 'free-system' ? 'free-system-lead' : 'website-lead') . ' tag by hand',
            ($out['ghl_noted'] ?? null) === false => 'existing contact updated but the note was not added: add the submission as a note',
            default => null,
        };
        if ($issue !== null) {
            $problems[] = [
                'time' => (string) $lead['time'],
                'form' => (string) $lead['form'],
                'email' => (string) ($lead['fields']['email'] ?? ''),
                'problem' => $issue,
            ];
        }
    }
    return $problems;
}

/** @return array{0: string, 1: string} subject and plain-text body */
function digest_message(array $leadProblems, array $errorLines, int $now): array
{
    $parts = [];
    if ($leadProblems) {
        $parts[] = count($leadProblems) . ' lead' . (count($leadProblems) === 1 ? '' : 's') . ' to check';
    }
    if ($errorLines) {
        $parts[] = count($errorLines) . ' error' . (count($errorLines) === 1 ? '' : 's') . ' logged';
    }
    $subject = 'DocsScale website: ' . implode(', ', $parts) . ' (' . gmdate('j M', $now) . ')';

    $body = "The website's lead handler needs attention. Every lead below is in the backup on the server\n"
        . "(private/leads/), so nothing is lost; each one needs a manual step in GoHighLevel.\n\n";
    if ($leadProblems) {
        $body .= "LEADS TO CHECK\n";
        foreach ($leadProblems as $p) {
            $form = $p['form'] === 'free-system' ? 'Free system funnel' : 'Website form';
            $body .= sprintf("- %s UTC · %s · %s\n  %s\n", str_replace('T', ' ', substr($p['time'], 0, 16)), $form, $p['email'], $p['problem']);
        }
        $body .= "\n";
    }
    if ($errorLines) {
        $shown = array_slice($errorLines, -30);
        $body .= "ERRORS LOGGED (private/logs/errors.log" . (count($errorLines) > 30 ? ', last 30 of ' . count($errorLines) : '') . ")\n";
        foreach ($shown as $line) {
            $body .= "- $line\n";
        }
        $body .= "\n";
    }
    $body .= "What to do: docs/SERVER.md, \"Lead backups\". This email is sent only when something needs attention.\n";
    return [$subject, $body];
}

function digest_send(string $to, string $subject, string $body): bool
{
    // Tests write to a file instead of sending.
    if ($outbox = getenv('LEAD_DIGEST_OUTBOX')) {
        return file_put_contents($outbox, "To: $to\nSubject: $subject\n\n$body", FILE_APPEND) !== false;
    }
    $headers = implode("\r\n", [
        'From: DocsScale website <info@docsscale.com>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Auto-Response-Suppress: All',
    ]);
    return mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f info@docsscale.com');
}
