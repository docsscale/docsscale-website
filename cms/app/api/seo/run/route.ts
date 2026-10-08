import crypto from 'node:crypto';
import { cronToken } from '../../../../lib/seo/config';
import { runIfDue, startRun, type Job } from '../../../../lib/seo/run';
import { ensureServerFiles } from '../../../../lib/seo/server-files';

// Called by Hostinger's cron (the cron.mjs script the app writes, see
// lib/seo/server-files.ts): POST /api/seo/run?job=daily (or weekly) with
// "Authorization: Bearer <token>". Answers at once; the run carries on in the
// background and records its result for the Data sources tab.
export const dynamic = 'force-dynamic';

const same = (a: string, b: string) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function POST(request: Request) {
  ensureServerFiles();
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const expected = cronToken();
  if (!expected || !same(given, expected)) {
    // Any call still counts as a nudge: a run that was due by the app's own
    // schedule starts, nothing else. The answer never says which it was.
    runIfDue();
    return new Response('Not found', { status: 404 });
  }
  const job = new URL(request.url).searchParams.get('job') as Job;
  if (!['daily', 'weekly', 'all'].includes(job)) return new Response('Unknown job', { status: 400 });
  const id = startRun(job, 'schedule');
  return Response.json(id ? { started: id } : { skipped: 'A run is already going' }, { status: id ? 202 : 409 });
}
