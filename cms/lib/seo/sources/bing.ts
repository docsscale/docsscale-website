import { seoConfig } from '../config';
import { daysAgo, getJson, isoDay } from '../http';

// Bing Webmaster API. The key could also submit addresses; this code only
// calls read methods. The key is part of the address Bing asks for, so errors
// never quote the address in full (see getJson).

export type BingData = {
  site: string;
  current: readonly [string, string];
  previous: readonly [string, string];
  totals: { current: { clicks: number; impressions: number }; previous: { clicks: number; impressions: number } };
  daily: { date: string; clicks: number; impressions: number }[];
  queries: { query: string; clicks: number; impressions: number; position: number | null }[];
  pages: { page: string; clicks: number; impressions: number }[];
  crawl: { date: string; crawled: number; errors: number; inIndex: number }[];
  crawlIssues: { url: string; issue: string; httpCode: number | null }[];
};

type Raw = Record<string, unknown>;

const day = (v: unknown) => {
  const ms = Number(/\/Date\((-?\d+)/.exec(String(v))?.[1]);
  return Number.isFinite(ms) ? isoDay(new Date(ms)) : '';
};

async function call(method: string): Promise<Raw[]> {
  const url = `https://ssl.bing.com/webmaster/api.svc/json/${method}?siteUrl=${encodeURIComponent(seoConfig.bingSite)}&apikey=${encodeURIComponent(seoConfig.bingKey)}`;
  return ((await getJson<{ d?: Raw[] }>(url)).d ?? []) as Raw[];
}

/** Bing's issue flags, in plain words (Bing Webmaster API, CrawlIssues). */
const ISSUES: [number, string][] = [
  [1, 'Permanent redirect (301)'], [2, 'Temporary redirect (302)'], [4, 'Client error (4xx)'], [8, 'Server error (5xx)'],
  [16, 'Blocked by robots.txt'], [32, 'Contains malware'], [64, 'Important page blocked by robots.txt'],
  [128, 'DNS error'], [256, 'Timed out'],
];

export async function collectBing(): Promise<BingData> {
  if (!seoConfig.bingKey) throw new Error('No Bing key is set on the server.');
  const [traffic, queries, pages, crawl, issues] = await Promise.all([
    call('GetRankAndTrafficStats'), call('GetQueryStats'), call('GetPageStats'), call('GetCrawlStats'), call('GetCrawlIssues'),
  ]);
  const cur = [isoDay(daysAgo(29)), isoDay(daysAgo(2))] as const;
  const prev = [isoDay(daysAgo(57)), isoDay(daysAgo(30))] as const;
  const daily = traffic
    .map((r) => ({ date: day(r.Date), clicks: Number(r.Clicks ?? 0), impressions: Number(r.Impressions ?? 0) }))
    .filter((r) => r.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  const sum = (range: readonly [string, string]) =>
    daily.filter((d) => d.date >= range[0] && d.date <= range[1]).reduce((s, d) => ({ clicks: s.clicks + d.clicks, impressions: s.impressions + d.impressions }), { clicks: 0, impressions: 0 });

  // Query and page rows come per week; add them up per query or page.
  const group = (rows: Raw[], key: string) => {
    const out = new Map<string, { clicks: number; impressions: number; posSum: number; posN: number }>();
    for (const r of rows) {
      const k = String(r[key]);
      const g = out.get(k) ?? { clicks: 0, impressions: 0, posSum: 0, posN: 0 };
      g.clicks += Number(r.Clicks ?? 0);
      g.impressions += Number(r.Impressions ?? 0);
      const pos = Number(r.AvgImpressionPosition);
      if (pos > 0) { g.posSum += pos * Number(r.Impressions ?? 1); g.posN += Number(r.Impressions ?? 1); }
      out.set(k, g);
    }
    return [...out].sort((a, b) => b[1].impressions - a[1].impressions);
  };

  return {
    site: seoConfig.bingSite,
    current: cur,
    previous: prev,
    totals: { current: sum(cur), previous: sum(prev) },
    daily: daily.filter((d) => d.date >= prev[0]),
    queries: group(queries, 'Query').map(([query, g]) => ({ query, clicks: g.clicks, impressions: g.impressions, position: g.posN ? Math.round((g.posSum / g.posN) * 10) / 10 : null })),
    pages: group(pages, 'Query').map(([page, g]) => ({ page, clicks: g.clicks, impressions: g.impressions })),
    crawl: crawl
      .map((r) => ({ date: day(r.Date), crawled: Number(r.CrawledPages ?? 0), errors: Number(r.CrawlErrors ?? 0), inIndex: Number(r.InIndex ?? 0) }))
      .filter((r) => r.date)
      .sort((a, b) => a.date.localeCompare(b.date)),
    crawlIssues: issues.map((r) => ({
      url: String(r.Url),
      issue: ISSUES.filter(([bit]) => (Number(r.Issues) & bit) !== 0).map(([, t]) => t).join(', ') || 'Other',
      httpCode: r.HttpCode == null ? null : Number(r.HttpCode),
    })),
  };
}
