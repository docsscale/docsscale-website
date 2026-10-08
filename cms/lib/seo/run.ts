import { seoConfig } from './config';
import { collectAnalytics } from './sources/analytics';
import { collectBing } from './sources/bing';
import { collectContent } from './sources/content';
import { collectPageSpeed } from './sources/pagespeed';
import { collectSearchConsole } from './sources/search-console';
import { collectSite, type SiteData } from './sources/site';
import { latestSnapshot, now, recordSource, saveSnapshot, store } from './store';

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
  pagespeed: 'PageSpeed Insights',
} as const;
export type SourceName = keyof typeof SOURCES;

const JOBS: Record<Job, SourceName[]> = {
  daily: ['site', 'search-console', 'analytics', 'bing', 'content'],
  weekly: ['pagespeed'],
  all: ['site', 'search-console', 'analytics', 'bing', 'content', 'pagespeed'],
};

function notSetUp(name: SourceName): string | null {
  if ((name === 'search-console' || name === 'analytics') && !seoConfig.googleKeyFile) return 'The Google key file is not set on the server.';
  if (name === 'bing' && !seoConfig.bingKey) return 'The Bing key is not set on the server.';
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
    db.prepare('UPDATE runs SET finished = ?, ok = ? WHERE id = ?').run(now(), ok ? 1 : 0, id);
  })();
  return id;
}

export type RunRow = { id: number; job: string; started: string; finished: string | null; ok: number | null; started_by: string };
export const recentRuns = (n = 10) => store().prepare('SELECT * FROM runs ORDER BY id DESC LIMIT ?').all(n) as RunRow[];
