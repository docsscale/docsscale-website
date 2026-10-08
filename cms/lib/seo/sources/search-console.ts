import { seoConfig } from '../config';
import { googleToken, periods, postJson } from '../http';

// Google Search Console, read-only. Ported from the weekly report script the
// project already runs (scripts/google_reports.py in the project files).

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
export type Totals = { clicks: number; impressions: number; ctr: number; position: number };
export type QueryRow = { query: string; clicks: number; impressions: number; position: number; prevPosition: number | null };
export type PageRow = { page: string; clicks: number; impressions: number; position: number };

export type SearchConsoleData = {
  site: string;
  current: readonly [string, string];
  previous: readonly [string, string];
  totals: { current: Totals; previous: Totals };
  daily: { date: string; clicks: number; impressions: number }[];
  queries: QueryRow[];
  pageOneNoClicks: QueryRow[];
  positions11to20: QueryRow[];
  cannibalization: { query: string; pages: PageRow[] }[];
  pages: PageRow[];
  sitemaps: { path: string; lastSubmitted?: string; lastDownloaded?: string; errors?: string; warnings?: string }[];
  index: { url: string; verdict: string; coverage: string; lastCrawl: string | null }[];
};

const round = (n: number) => Math.round(n * 10) / 10;

export async function collectSearchConsole(sitemapUrls: string[]): Promise<SearchConsoleData> {
  const token = await googleToken();
  const auth = { Authorization: `Bearer ${token}` };
  const base = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(seoConfig.gscSite)}`;
  const query = async (range: readonly [string, string], dimensions: string[], rowLimit = 1000) =>
    ((await postJson<{ rows?: Row[] }>(`${base}/searchAnalytics/query`, { startDate: range[0], endDate: range[1], dimensions, rowLimit }, auth)).rows ?? []);
  const totals = async (range: readonly [string, string]): Promise<Totals> => {
    const r = (await query(range, []))[0];
    return { clicks: r?.clicks ?? 0, impressions: r?.impressions ?? 0, ctr: r?.ctr ?? 0, position: r ? round(r.position) : 0 };
  };

  const { current, previous } = periods(3);
  const [cur, prev, daily, qCur, qPrev, pairs, pages] = await Promise.all([
    totals(current),
    totals(previous),
    query(current, ['date']),
    query(current, ['query']),
    query(previous, ['query']),
    query(current, ['query', 'page']),
    query(current, ['page']),
  ]);

  const prevPos = new Map(qPrev.map((r) => [r.keys![0], round(r.position)]));
  const queries = qCur
    .map((r) => ({ query: r.keys![0], clicks: r.clicks, impressions: r.impressions, position: round(r.position), prevPosition: prevPos.get(r.keys![0]) ?? null }))
    .sort((a, b) => b.impressions - a.impressions);

  const byQuery = new Map<string, PageRow[]>();
  for (const r of pairs) {
    const list = byQuery.get(r.keys![0]) ?? [];
    list.push({ page: r.keys![1], clicks: r.clicks, impressions: r.impressions, position: round(r.position) });
    byQuery.set(r.keys![0], list);
  }

  const sm = await (await fetch(`${base}/sitemaps`, { headers: auth })).json() as { sitemap?: SearchConsoleData['sitemaps'] };

  // Index status of every page in the sitemap (URL inspection allows 2,000 a day).
  const index: SearchConsoleData['index'] = [];
  for (const url of sitemapUrls) {
    const r = await postJson<{ inspectionResult?: { indexStatusResult?: { verdict?: string; coverageState?: string; lastCrawlTime?: string } } }>(
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      { inspectionUrl: url, siteUrl: seoConfig.gscSite },
      auth,
    );
    const s = r.inspectionResult?.indexStatusResult ?? {};
    index.push({ url, verdict: s.verdict ?? 'Unknown', coverage: s.coverageState ?? 'Unknown', lastCrawl: s.lastCrawlTime ?? null });
  }

  return {
    site: seoConfig.gscSite,
    current,
    previous,
    totals: { current: cur, previous: prev },
    daily: daily.map((r) => ({ date: r.keys![0], clicks: r.clicks, impressions: r.impressions })),
    queries,
    pageOneNoClicks: queries.filter((q) => q.position <= 10 && q.clicks === 0),
    positions11to20: queries.filter((q) => q.position > 10 && q.position <= 20),
    cannibalization: [...byQuery].filter(([, p]) => p.length > 1).map(([q, p]) => ({ query: q, pages: p })),
    pages: pages.map((r) => ({ page: r.keys![0], clicks: r.clicks, impressions: r.impressions, position: round(r.position) })),
    sitemaps: (sm.sitemap ?? []).map((s) => ({ path: s.path, lastSubmitted: s.lastSubmitted, lastDownloaded: s.lastDownloaded, errors: s.errors, warnings: s.warnings })),
    index,
  };
}
