import crypto from 'node:crypto';
import { NextRequest } from 'next/server';
import { deviceOf, shortIp } from '../../../../lib/seo/auth';
import { readKeyMatches } from '../../../../lib/seo/config';
import { SOURCES, recentRuns, type SourceName } from '../../../../lib/seo/run';
import { latestSnapshot, now, sourceRows, store } from '../../../../lib/seo/store';

// Read-only access for Claude (owner, 8 Oct 2026: "Can you also access this
// dashboard?"). An admin makes a read-only key on the Settings tab and keeps
// it in the cloud environment's secrets; the app keeps only its hash.
// GET /api/seo/read?what=<source>|sources|all with "Authorization: Bearer
// <key>". Every read is in the Access log. Nothing here can change anything.
export const dynamic = 'force-dynamic';

const sha = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

export async function GET(request: NextRequest) {
  const key = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!key || !readKeyMatches(key)) return new Response('Not found', { status: 404 });

  const what = request.nextUrl.searchParams.get('what') ?? 'sources';
  const db = store();
  const session = sha(`read:${key}:${new Date().toISOString().slice(0, 10)}`);
  const ip = shortIp((request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || request.headers.get('x-real-ip') || '');
  db.prepare('INSERT INTO sessions (hash, email, created, last_seen, ip, device) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (hash) DO UPDATE SET last_seen = excluded.last_seen')
    .run(session, 'Claude (read-only key)', now(), now(), ip, `${deviceOf(request.headers.get('user-agent') ?? '')}, read-only API`);
  db.prepare('INSERT INTO page_views (session, at, path) VALUES (?, ?, ?)').run(session, now(), `/api/seo/read?what=${what}`);

  const names = Object.keys(SOURCES) as SourceName[];
  if (what === 'sources') return Response.json({ sources: sourceRows(), runs: recentRuns() });
  if (what === 'all') return Response.json(Object.fromEntries(names.map((n) => [n, latestSnapshot(n)])));
  if (names.includes(what as SourceName)) return Response.json(latestSnapshot(what) ?? { taken: null, data: null });
  return Response.json({ error: `Unknown "what"; one of: sources, all, ${names.join(', ')}` }, { status: 400 });
}
