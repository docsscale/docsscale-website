import crypto from 'node:crypto';
import { seoConfig } from '../../../../lib/seo/config';
import { startRun, type Job } from '../../../../lib/seo/run';

// Called by Hostinger's cron: POST /api/seo/run?job=daily (or weekly) with
// "Authorization: Bearer <SEO_CRON_TOKEN>". Answers at once; the run carries
// on in the background and records its result for the Data sources tab.
export const dynamic = 'force-dynamic';

const same = (a: string, b: string) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function POST(request: Request) {
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!seoConfig.cronToken || !same(given, seoConfig.cronToken)) return new Response('Not found', { status: 404 });
  const job = new URL(request.url).searchParams.get('job') as Job;
  if (!['daily', 'weekly', 'all'].includes(job)) return new Response('Unknown job', { status: 400 });
  const id = startRun(job, 'schedule');
  return Response.json(id ? { started: id } : { skipped: 'A run is already going' }, { status: id ? 202 : 409 });
}
