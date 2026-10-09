import crypto from 'node:crypto';
import { NextRequest } from 'next/server';
import { deviceOf, shortIp } from '../../../../lib/seo/auth';
import { readKeyMatches } from '../../../../lib/seo/config';
import { autoSummary, findings } from '../../../../lib/seo/findings';
import { SOURCES, recentRuns, type SourceName } from '../../../../lib/seo/run';
import { latestSnapshot, now, sourceRows, store } from '../../../../lib/seo/store';

// Read-only access for Claude (owner, 8 Oct 2026: "Can you also access this
// dashboard?"). An admin makes a read-only key on the Settings tab and keeps
// it in the cloud environment's secrets; the app keeps only its hash.
// GET /api/seo/read?what=<source>|sources|all with "Authorization: Bearer
// <key>". Every read is in the Access log. The one thing the key can write
// is the Overview's weekly summary (POST, plain text), which the plan gives
// to the weekly run (section 6); it cannot touch the queue, keys or people.
export const dynamic = 'force-dynamic';

const sha = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

function logRead(request: NextRequest, key: string, path: string) {
  const db = store();
  const session = sha(`read:${key}:${new Date().toISOString().slice(0, 10)}`);
  const ip = shortIp((request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || request.headers.get('x-real-ip') || '');
  db.prepare('INSERT INTO sessions (hash, email, created, last_seen, ip, device) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (hash) DO UPDATE SET last_seen = excluded.last_seen')
    .run(session, 'Claude (read-only key)', now(), now(), ip, `${deviceOf(request.headers.get('user-agent') ?? '')}, read-only API`);
  db.prepare('INSERT INTO page_views (session, at, path) VALUES (?, ?, ?)').run(session, now(), path);
}

export async function GET(request: NextRequest) {
  const key = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!key || !readKeyMatches(key)) return new Response('Not found', { status: 404 });
  const what = request.nextUrl.searchParams.get('what') ?? 'sources';
  logRead(request, key, `/api/seo/read?what=${what}`);

  const names = Object.keys(SOURCES) as SourceName[];
  if (what === 'sources') return Response.json({ sources: sourceRows(), runs: recentRuns() });
  if (what === 'all') return Response.json(Object.fromEntries(names.map((n) => [n, latestSnapshot(n)])));
  if (names.includes(what as SourceName)) return Response.json(latestSnapshot(what) ?? { taken: null, data: null });
  if (what === 'queue') return Response.json({ findings: findings() });
  if (what === 'overview') {
    const db = store();
    return Response.json({
      ...autoSummary(),
      note: db.prepare("SELECT at, by, text FROM notes WHERE kind = 'overview' AND removed IS NULL ORDER BY id DESC LIMIT 1").get() ?? null,
      plan: db.prepare('SELECT horizon, text, added_by, added_at FROM plan_items WHERE done_at IS NULL ORDER BY horizon, id').all(),
      aiChecks: db.prepare('SELECT at, assistant, question, cited, detail FROM ai_checks ORDER BY id DESC LIMIT 50').all(),
      imports: db.prepare('SELECT id, at, by, source, filename, note, rows FROM imports ORDER BY id DESC LIMIT 50').all(),
    });
  }
  return Response.json({ error: `Unknown "what"; one of: sources, all, queue, overview, ${names.join(', ')}` }, { status: 400 });
}

/** The weekly run's written summary for the Overview: plain text, 8,000
 *  characters at most, stamped "Claude (weekly run)". */
export async function POST(request: NextRequest) {
  const key = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!key || !readKeyMatches(key)) return new Response('Not found', { status: 404 });
  logRead(request, key, '/api/seo/read (overview summary written)');
  const text = (await request.text()).trim().slice(0, 8000);
  if (!text) return Response.json({ error: 'Send the summary as plain text in the body.' }, { status: 400 });
  store().prepare('INSERT INTO notes (kind, at, by, text, reason) VALUES (?, ?, ?, ?, ?)').run('overview', now(), 'Claude (weekly run)', text, '');
  return Response.json({ ok: true, at: now() });
}
