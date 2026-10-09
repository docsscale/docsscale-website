import crypto from 'node:crypto';
import { NextRequest } from 'next/server';
import { deviceOf, shortIp } from '../../../../lib/seo/auth';
import { readKeyMatches } from '../../../../lib/seo/config';
import { notifyAdmins } from '../../../../lib/seo/mail';
import { autoSummary, findings, moveFinding, noteFinding, selfApprovable } from '../../../../lib/seo/findings';
import { lastResearch, pastTopics, research } from '../../../../lib/seo/ideas';
import { announce, indexingLog, indexingRows, watchSitemap } from '../../../../lib/seo/indexing';
import { kindOf, rankOpen } from '../../../../lib/seo/today';
import { whatToWriteNext } from '../../../../lib/seo/write-next';
import { SOURCES, recentRuns, type SourceName } from '../../../../lib/seo/run';
import { latestSnapshot, now, sourceRows, store } from '../../../../lib/seo/store';

// Read-only access for Claude (owner, 8 Oct 2026: "Can you also access this
// dashboard?"). An admin makes a read-only key on the Settings tab and keeps
// it in the cloud environment's secrets; the app keeps only its hash.
// GET /api/seo/read?what=<source>|sources|all with "Authorization: Bearer
// <key>". Every read is in the Access log. POST lets the weekly run act as
// the SEO role does on screen (owner, 9 Oct 2026: "give write access too"):
// write the Overview summary, note progress on queue items, add plan lines,
// the ignore list and manual AI checks, and approve the invisible fixes
// listed in selfApprovable (owner, 9 Oct 2026). It cannot approve anything
// a visitor would see, nor reject, nor touch keys, people or settings.
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
  if (what === 'indexing') return Response.json({ pages: indexingRows(), log: indexingLog() });
  // The Today tab's order, with each item's kind, for the weekly run.
  if (what === 'today') return Response.json({ items: rankOpen(findings("status IN ('Detected', 'Recommended', 'Approved', 'In progress')")).map((f) => ({ ...f, kind: kindOf(f) })) });
  if (what === 'write-next') return Response.json(whatToWriteNext(50));
  if (what === 'ideas') { const topic = request.nextUrl.searchParams.get('topic') ?? ''; return Response.json(topic ? (lastResearch(topic) ?? { error: 'No lookup for this topic yet.' }) : { topics: pastTopics(50) }); }
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
  return Response.json({ error: `Unknown "what"; one of: sources, all, queue, overview, indexing, ${names.join(', ')}` }, { status: 400 });
}

const BY = 'Claude (weekly run)';
type Body = { action?: string; text?: string; id?: number; to?: string; reason?: string; note?: string; horizon?: number; assistant?: string; question?: string; cited?: boolean; detail?: string };

/** Writes the weekly run may make. A plain-text body is the Overview
 *  summary; JSON chooses an action: summary, move (In progress, Done,
 *  Recommended, or Approved only to reopen a Done item with a reason), note,
 *  plan, ignore, ai-check, send-pages (tell Bing and Google about every
 *  page in the sitemap, as the Technical health button does; owner, 9 Oct
 *  2026: "do what you recommend"). Everything is logged under the run's name. */
export async function POST(request: NextRequest) {
  const key = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!key || !readKeyMatches(key)) return new Response('Not found', { status: 404 });
  const raw = (await request.text()).trim();
  let body: Body = { action: 'summary', text: raw };
  if (raw.startsWith('{')) { try { body = JSON.parse(raw) as Body; } catch { return Response.json({ error: 'The body is not valid JSON.' }, { status: 400 }); } }
  const action = body.action ?? 'summary';
  logRead(request, key, `/api/seo/read (${action} written)`);
  const db = store();
  const text = String(body.text ?? '').trim();
  const bad = (m: string) => Response.json({ error: m }, { status: 400 });

  if (action === 'summary') {
    if (!text) return bad('Send the summary as plain text, or JSON {"action":"summary","text":…}.');
    db.prepare('INSERT INTO notes (kind, at, by, text, reason) VALUES (?, ?, ?, ?, ?)').run('overview', now(), BY, text.slice(0, 8000), '');
    // The owner reads it in the inbox too (switch on the Settings tab).
    const s = autoSummary();
    const emailed = await notifyAdmins('summary', 'This week in plain language: your SEO summary', [text.slice(0, 8000), '', s.top.length ? 'What matters most:' : '', ...s.top.slice(0, 3).map((f, i) => `${i + 1}. ${f.what}`), '', `${s.openCount} items are open in the fix queue.`].join('\n'));
    return Response.json({ ok: true, at: now(), emailed });
  }
  if (action === 'move') {
    const to = String(body.to ?? '');
    if (!['In progress', 'Done', 'Recommended', 'Approved'].includes(to)) return bad('to must be In progress, Done, Recommended, or Approved (to reopen a Done item, with a reason).');
    const f = db.prepare('SELECT status, rule, key FROM findings WHERE id = ?').get(Number(body.id)) as { status: string; rule: string; key: string } | undefined;
    if (!f) return bad('No such item.');
    // Approving is the owner's (decision 3), except the invisible fixes the
    // owner let the run approve itself (9 Oct 2026), and reopening a done item.
    if (to === 'Approved' && !['Done', 'Outcome measured'].includes(f.status) && !selfApprovable(f)) return bad('Only the owner approves this kind of item; the key may approve only invisible fixes.');
    const ok = moveFinding(Number(body.id), to as 'In progress', BY, String(body.note ?? ''), String(body.reason ?? ''));
    return ok ? Response.json({ ok: true }) : bad('That move is not allowed (reopening a done item needs a reason).');
  }
  if (action === 'note') {
    const h = Number(body.horizon);
    noteFinding(Number(body.id), text.slice(0, 2000), BY, [30, 60, 90].includes(h) ? h : null);
    return Response.json({ ok: true });
  }
  if (action === 'plan') {
    const h = Number(body.horizon);
    if (!text || ![30, 60, 90].includes(h)) return bad('plan needs text and horizon 30, 60 or 90.');
    db.prepare('INSERT INTO plan_items (horizon, text, added_by, added_at) VALUES (?, ?, ?, ?)').run(h, text.slice(0, 500), BY, now());
    return Response.json({ ok: true });
  }
  if (action === 'ignore') {
    if (!text) return bad('ignore needs text (and reason).');
    db.prepare('INSERT INTO notes (kind, at, by, text, reason) VALUES (?, ?, ?, ?, ?)').run('ignore', now(), BY, text.slice(0, 500), String(body.reason ?? '').slice(0, 500));
    return Response.json({ ok: true });
  }
  if (action === 'ai-check') {
    if (!body.assistant || !body.question) return bad('ai-check needs assistant, question, cited (true/false) and optional detail.');
    db.prepare('INSERT INTO ai_checks (at, by, assistant, question, cited, detail) VALUES (?, ?, ?, ?, ?, ?)').run(now(), BY, String(body.assistant).slice(0, 60), String(body.question).slice(0, 300), body.cited ? 1 : 0, String(body.detail ?? '').slice(0, 500));
    return Response.json({ ok: true });
  }
  if (action === 'send-pages') {
    if (!indexingRows().length) { try { await watchSitemap(BY); } catch (e) { return bad(`The sitemap could not be read: ${(e as Error).message}`); } }
    const urls = indexingRows().map((r) => r.url);
    const result = await announce(urls, BY);
    return Response.json({ ok: true, pages: urls.length, ...result });
  }
  if (action === 'research') {
    if (!text) return bad('research needs text: the topic.');
    try { return Response.json(await research(text, BY)); } catch (e) { return bad((e as Error).message); }
  }
  return bad('Unknown action; one of: summary, move, note, plan, ignore, ai-check, send-pages, research.');
}
