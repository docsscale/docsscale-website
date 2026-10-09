import { bingKey, crmLocationId, crmToken, googleKey, seoConfig } from './config';
import { findings, recordFindings } from './findings';
import { refreshIndexState, watchSitemapIfDue } from './indexing';
import { refreshSeedIdeas } from './write-next';
import { notifyAdmins } from './mail';
import { sendMonthlyIfDue } from './report';
import { collectAnalytics } from './sources/analytics';
import { collectBing } from './sources/bing';
import { collectContent } from './sources/content';
import { collectCrm } from './sources/crm';
import { collectPageSpeed } from './sources/pagespeed';
import { collectSearchConsole } from './sources/search-console';
import { collectSite, type SiteData } from './sources/site';
import { latestSnapshot, now, recordSource, saveSnapshot, sourceRows, store } from './store';

// The collector jobs. Hostinger's cron calls /api/seo/run once a day ("daily")
// and once a week ("weekly"); an admin can also start a run from the screen.
// Each source is tried on its own, so one failing source never stops the rest,
// and the Data sources tab shows what each one returned and when.

export type Job = 'daily' | 'weekly' | 'all';

export const SOURCES = {
  site: 'Our site (sitemap, robots.txt, llms.txt, page linter)',
  'search-console': 'Google Search Console',
  analytics: 'Google Analytics 4',
  bing: 'Bing Webmaster Tools',
  content: 'Content files and edit history (GitHub)',
  crm: 'The CRM (leads and where they came from; counts only)',
  pagespeed: 'PageSpeed Insights',
} as const;
export type SourceName = keyof typeof SOURCES;

const JOBS: Record<Job, SourceName[]> = {
  daily: ['site', 'search-console', 'analytics', 'bing', 'content', 'crm'],
  weekly: ['pagespeed'],
  all: ['site', 'search-console', 'analytics', 'bing', 'content', 'crm', 'pagespeed'],
};

function notSetUp(name: SourceName): string | null {
  if ((name === 'search-console' || name === 'analytics') && !googleKey()) return 'The Google key is not set on the server.';
  if (name === 'bing' && !bingKey()) return 'The Bing key is not set on the server.';
  if (name === 'crm' && !(crmToken() && crmLocationId())) return 'The CRM token and account are not set on the Settings tab.';
  return null;
}

async function collect(name: SourceName): Promise<unknown> {
  switch (name) {
    case 'site': return collectSite();
    case 'search-console': {
      const site = latestSnapshot<SiteData>('site')?.data;
      return collectSearchConsole([...(site?.pages.map((p) => p.url) ?? []), ...(site?.failing.map((p) => p.url) ?? [])]);
    }
    case 'analytics': return collectAnalytics();
    case 'bing': return collectBing();
    case 'content': return collectContent();
    case 'crm': return collectCrm();
    case 'pagespeed': return collectPageSpeed();
  }
}

/** Starts a run unless one is already going. Returns the run's number, or null. */
export function startRun(job: Job, startedBy: string): number | null {
  const db = store();
  const halfHourAgo = new Date(Date.now() - 30 * 60_000).toISOString();
  const busy = db.prepare('SELECT id FROM runs WHERE finished IS NULL AND started > ?').get(halfHourAgo);
  if (busy) return null;
  const id = Number(db.prepare('INSERT INTO runs (job, started, started_by) VALUES (?, ?, ?)').run(job, now(), startedBy).lastInsertRowid);
  void (async () => {
    let ok = true;
    for (const name of JOBS[job]) {
      const missing = notSetUp(name);
      if (missing) { recordSource(name, 'not set up', missing); continue; }
      try {
        const data = await collect(name);
        saveSnapshot(name, data);
        recordSource(name, 'ok', 'Returned data');
      } catch (e) {
        ok = false;
        recordSource(name, 'failing', (e as Error).message.slice(0, 400));
      }
    }
    // What Google and Bing show for each page, for the Indexing panel.
    if (job !== 'weekly') { try { await refreshIndexState(); } catch (e) { console.error(`[seo] index state refresh failed: ${(e as Error).message}`); } }
    // After the data, the rule-based findings for the fix queue (plan, section 7).
    let added = 0;
    try { added = recordFindings().added; } catch (e) { ok = false; recordSource('findings', 'failing', (e as Error).message.slice(0, 400)); }
    db.prepare('UPDATE runs SET finished = ?, ok = ? WHERE id = ?').run(now(), ok ? 1 : 0, id);
    await alertIfNeeded(job, added);
    if (job !== 'weekly') {
      try { await nudgeNotIndexed(); } catch (e) { console.error(`[seo] indexing nudge failed: ${(e as Error).message}`); }
      try { await sendMonthlyIfDue(); } catch (e) { console.error(`[seo] monthly report failed: ${(e as Error).message}`); }
      // Keyword ideas for the specialties, once a week each, so What to write next stays fresh.
      try { await refreshSeedIdeas('Daily run'); } catch (e) { console.error(`[seo] seed keyword ideas failed: ${(e as Error).message}`); }
    }
  })();
  return id;
}

/** The app's own schedule, so no cron job has to be set up by hand (owner,
 *  8 Oct 2026): the daily sources once a day from 10:00 UTC, PageSpeed once a
 *  week. Checked every few minutes while the app runs, and whenever anything
 *  calls /api/seo/run, which is what Hostinger's cron does; a caller can only
 *  make a run happen that was due anyway. */
/** Only what is new or worse goes to the inbox (owner's rule, 7 Oct 2026):
 *  a source that stopped answering (PageSpeed's shared quota is not news),
 *  or a new High-impact finding. One email per run, at most. */
async function alertIfNeeded(job: Job, added: number) {
  const since = new Date(Date.now() - 2 * 3600_000).toISOString();
  // "Stopped answering" means it worked within the last day and a half and
  // failed in this run; a source that has been failing for days, or was never
  // set up, is on the Data sources tab, not in the inbox every morning.
  const wasFine = new Date(Date.now() - 36 * 3600_000).toISOString();
  const broken = sourceRows().filter((s) => s.status === 'failing' && !(s.name === 'pagespeed' && /429/.test(s.message ?? '')) && (s.last_attempt ?? '') > since && (s.last_success ?? '') > wasFine);
  const urgent = added ? findings("status = 'Detected' AND impact = 'High' AND created > ?", since) : [];
  if (!broken.length && !urgent.length) return;
  const lines = [
    `The ${job} run of the SEO dashboard found something new.`,
    '',
    ...broken.map((s) => `- ${s.name} stopped answering: ${(s.message ?? '').slice(0, 200)}`),
    ...urgent.map((f) => `- New, high impact: ${f.what}`),
    '',
    'Open the fix queue to decide what happens next.',
  ];
  await notifyAdmins('alert', `SEO dashboard: ${broken.length ? 'a data source stopped answering' : 'a new high-impact finding'}`, lines.join('\n'));
}

/** "Still not indexed" (owner, 9 Oct 2026, automation plan item 4): a page
 *  the queue has shown as out of Google's index for 14 days, and that this
 *  run saw out again, gets one email naming it and the one step that helps
 *  (Google offers no free way to request indexing for it from here), then
 *  again every 28 days while it stays out. Each nudge is in the item's log. */
export async function nudgeNotIndexed(): Promise<number> {
  const db = store();
  const twoWeeks = new Date(Date.now() - 14 * 86400_000).toISOString();
  const yesterday = new Date(Date.now() - 86400_000).toISOString();
  const fourWeeks = new Date(Date.now() - 28 * 86400_000).toISOString();
  const due = findings("rule = 'not-indexed' AND status IN ('Detected', 'Recommended', 'Approved', 'In progress') AND created <= ? AND last_seen >= ?", twoWeeks, yesterday)
    .filter((f) => !db.prepare("SELECT 1 FROM finding_log WHERE finding = ? AND by = 'indexing nudge' AND at > ?").get(f.id, fourWeeks));
  if (!due.length) return 0;
  const inspect = (page: string) => `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(seoConfig.gscSite)}&id=${encodeURIComponent(seoConfig.siteUrl + page)}`;
  const lines = [
    `${due.length === 1 ? 'One page is' : `${due.length} pages are`} still out of Google's index two weeks after the dashboard first noticed. Google has no free way for us to request indexing on your behalf; it takes one click from you, per page:`,
    '',
    ...due.flatMap((f) => [`- ${f.page}: open ${inspect(f.page ?? '/')} and press "Request indexing".`, `  Google said: ${f.evidence.replace(/^.*?inspection on \d{4}-\d\d-\d\d: /, '').slice(0, 160)}`]),
    '',
    'Links from other pages of the site help too; the fix queue lists those as separate items.',
  ];
  const sent = await notifyAdmins('alert', `SEO dashboard: ${due.length === 1 ? 'a page is' : `${due.length} pages are`} still not in Google after two weeks`, lines.join('\n'));
  if (sent) for (const f of due) db.prepare('INSERT INTO finding_log (finding, at, by, from_status, to_status, note) VALUES (?, ?, ?, ?, ?, ?)').run(f.id, now(), 'indexing nudge', f.status, f.status, 'Emailed the admins: still not indexed after two weeks, with the Search Console step.');
  return sent ? due.length : 0;
}

export function runIfDue(): Job | null {
  const db = store();
  // The sitemap watch rides the same ten-minute check (lib/seo/indexing.ts).
  try { watchSitemapIfDue(); } catch (e) { console.error(`[seo] sitemap watch could not start: ${(e as Error).message}`); }
  // A run the app was restarted under (an install, for instance) never writes
  // its end; close it so the Data sources tab does not show it running forever.
  db.prepare('UPDATE runs SET finished = started, ok = 0 WHERE finished IS NULL AND started < ?').run(new Date(Date.now() - 30 * 60_000).toISOString());
  const last = (jobs: string[]) =>
    (db.prepare(`SELECT MAX(started) AS at FROM runs WHERE job IN (${jobs.map(() => '?').join(',')})`).get(...jobs) as { at: string | null }).at;
  const hoursSince = (iso: string | null) => (iso ? (Date.now() - Date.parse(iso)) / 3600_000 : Infinity);
  const utcHour = new Date().getUTCHours();
  if (utcHour >= 10 && hoursSince(last(['daily', 'all'])) > 20) return startRun('daily', 'schedule') ? 'daily' : null;
  if (utcHour >= 10 && hoursSince(last(['weekly', 'all'])) > 6.5 * 24) return startRun('weekly', 'schedule') ? 'weekly' : null;
  return null;
}

export type RunRow = { id: number; job: string; started: string; finished: string | null; ok: number | null; started_by: string };
export const recentRuns = (n = 10) => store().prepare('SELECT * FROM runs ORDER BY id DESC LIMIT ?').all(n) as RunRow[];
