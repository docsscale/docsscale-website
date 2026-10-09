import { bingKey, googleKey, seoConfig } from './config';
import { SITEMAP_SCOPE, getJson, getText, googleToken } from './http';
import type { BingData } from './sources/bing';
import type { SearchConsoleData } from './sources/search-console';
import { latestSnapshot, now, saveSetting, setting, store } from './store';

// Automatic indexing (owner, 9 Oct 2026: "live pages and published blogs
// should auto index in Bing and Search Console and update the dashboard").
// The dashboard watches the sitemap every two hours. A page that is new or
// whose date moved is sent to Bing and the other IndexNow engines at once,
// and Google is told by resubmitting the sitemap through the Search Console
// API (Google offers nothing else for ordinary pages: its Indexing API is
// for job postings only). What each engine then shows for the page comes
// back with the daily run (URL inspection for Google, UrlInfo for Bing) and
// is kept here, one row per page, for the Technical health tab.

export type IndexingRow = {
  page: string; url: string; lastmod: string | null; first_seen: string; changed_at: string;
  indexnow_at: string | null; indexnow_status: string | null; sitemap_at: string | null; sitemap_status: string | null;
  google_verdict: string | null; google_coverage: string | null; google_crawl: string | null; google_checked: string | null;
  bing_crawl: string | null; bing_status: string | null; bing_checked: string | null; gone_at: string | null;
};
export type IndexingLogRow = { id: number; at: string; by: string; action: string; pages: string; result: string };

const WATCH_EVERY_HOURS = 2;
const INDEXNOW = 'https://api.indexnow.org/indexnow';
const pathOf = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';
const log = (by: string, action: string, pages: string[], result: string) =>
  store().prepare('INSERT INTO indexing_log (at, by, action, pages, result) VALUES (?, ?, ?, ?, ?)').run(now(), by, action, pages.join(' '), result.slice(0, 400));

/** Sends addresses to IndexNow (Bing, Yandex, Seznam, Naver and others share it). */
export async function submitIndexNow(urls: string[]): Promise<string> {
  if (!urls.length) return 'nothing to send';
  const host = new URL(seoConfig.siteUrl).hostname;
  const res = await fetch(INDEXNOW, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: seoConfig.indexNowKey, keyLocation: `${seoConfig.siteUrl}/${seoConfig.indexNowKey}.txt`, urlList: urls }),
    signal: AbortSignal.timeout(30_000),
  });
  // 200: received. 202: received, key still being checked (normal the first time).
  if (res.status === 200 || res.status === 202) return `sent (${res.status})`;
  throw new Error(`IndexNow answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/** Resubmits the sitemap in Search Console, which is how Google is told that
 *  pages changed. Needs the dashboard's Google account to be a full user of
 *  the property (a restricted one is refused with 403). */
export async function resubmitSitemap(): Promise<string> {
  if (!googleKey()) throw new Error('No Google key is set.');
  const token = await googleToken(SITEMAP_SCOPE);
  const feed = `${seoConfig.siteUrl}/sitemap.xml`;
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(seoConfig.gscSite)}/sitemaps/${encodeURIComponent(feed)}`, {
    method: 'PUT', headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(30_000),
  });
  if (res.status === 204 || res.status === 200) return 'resubmitted';
  if (res.status === 403) throw new Error('Google refused (403): the dashboard\'s Google account must be a full user of the Search Console property, not restricted.');
  throw new Error(`Google answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/** Reads the sitemap, records what is new, changed or gone, and tells the
 *  engines about the new and changed pages. `by` names who caused it. */
export async function watchSitemap(by = 'sitemap watch'): Promise<{ added: string[]; changed: string[]; gone: string[]; indexnow: string; sitemap: string }> {
  const db = store();
  const sm = await getText(`${seoConfig.siteUrl}/sitemap.xml`);
  if (sm.status !== 200) throw new Error(`The sitemap answered ${sm.status}.`);
  const entries = [...sm.text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: /<loc>\s*(.*?)\s*<\/loc>/.exec(m[1])?.[1] ?? '',
    lastmod: /<lastmod>\s*(.*?)\s*<\/lastmod>/.exec(m[1])?.[1] ?? null,
  })).filter((e) => e.loc);
  if (!entries.length) throw new Error('The sitemap lists no pages.');

  const t = now();
  const known = new Map((db.prepare('SELECT * FROM indexing').all() as IndexingRow[]).map((r) => [r.page, r]));
  const firstEver = known.size === 0;
  const added: string[] = [], changed: string[] = [], gone: string[] = [];
  for (const e of entries) {
    const page = pathOf(e.loc);
    const row = known.get(page);
    if (!row) {
      db.prepare('INSERT INTO indexing (page, url, lastmod, first_seen, changed_at) VALUES (?, ?, ?, ?, ?)').run(page, e.loc, e.lastmod, t, t);
      added.push(e.loc);
    } else if (row.gone_at || (e.lastmod && e.lastmod !== row.lastmod)) {
      db.prepare('UPDATE indexing SET url = ?, lastmod = ?, changed_at = ?, gone_at = NULL WHERE page = ?').run(e.loc, e.lastmod, t, page);
      changed.push(e.loc);
    }
  }
  const listed = new Set(entries.map((e) => pathOf(e.loc)));
  for (const r of known.values()) if (!listed.has(r.page) && !r.gone_at) { db.prepare('UPDATE indexing SET gone_at = ? WHERE page = ?').run(t, r.page); gone.push(r.url); }

  // The first watch only learns what exists; it does not re-announce the whole
  // site. "Send every page now" on the Technical health tab does that on request.
  const toSend = firstEver ? [] : [...added, ...changed];
  if (firstEver) log(by, 'learned the sitemap', entries.map((e) => e.loc), `${entries.length} pages recorded; nothing sent on the first watch`);
  let indexnow = 'nothing to send', sitemap = 'nothing to send';
  if (toSend.length) ({ indexnow, sitemap } = await announce(toSend, by));
  if (gone.length) log(by, 'left the sitemap', gone, 'no longer listed; nothing sent');
  return { added, changed, gone, indexnow, sitemap };
}

/** Tells both engines about these addresses and records the result per page. */
export async function announce(urls: string[], by: string): Promise<{ indexnow: string; sitemap: string }> {
  const db = store();
  const t = now();
  let indexnow: string, sitemap: string;
  try { indexnow = await submitIndexNow(urls); } catch (e) { indexnow = `failed: ${(e as Error).message}`; }
  try { sitemap = await resubmitSitemap(); } catch (e) { sitemap = `failed: ${(e as Error).message}`; }
  for (const u of urls) db.prepare('UPDATE indexing SET indexnow_at = ?, indexnow_status = ?, sitemap_at = ?, sitemap_status = ? WHERE page = ?').run(t, indexnow, t, sitemap, pathOf(u));
  log(by, 'told the engines', urls, `IndexNow: ${indexnow.replace(/\.$/, '')}. Google sitemap: ${sitemap.replace(/\.$/, '')}.`);
  return { indexnow, sitemap };
}

/** Every page in the table that is still in the sitemap. */
export const indexingRows = () => store().prepare('SELECT * FROM indexing WHERE gone_at IS NULL ORDER BY changed_at DESC').all() as IndexingRow[];
export const indexingLog = (n = 30) => store().prepare('SELECT * FROM indexing_log ORDER BY id DESC LIMIT ?').all(n) as IndexingLogRow[];

let watching = false;
/** Checked every ten minutes with the run schedule; watches at most every two hours. */
export function watchSitemapIfDue(): boolean {
  const last = setting('indexing.lastWatch', '');
  if (watching || (last && Date.now() - Date.parse(last) < WATCH_EVERY_HOURS * 3600_000)) return false;
  watching = true;
  saveSetting('indexing.lastWatch', now(), 'sitemap watch', 'Automatic');
  void watchSitemap()
    .then((r) => { if (r.added.length || r.changed.length) console.log(`[seo] sitemap watch: ${r.added.length} new, ${r.changed.length} changed; IndexNow ${r.indexnow}; Google ${r.sitemap}`); })
    .catch((e) => console.error(`[seo] sitemap watch failed: ${(e as Error).message}`))
    .finally(() => { watching = false; });
  return true;
}

/** After the daily run: what Google and Bing now show for each page. Google
 *  comes from the URL inspection already in the Search Console snapshot;
 *  Bing from UrlInfo, one call per page (a handful of pages, once a day). */
export async function refreshIndexState(): Promise<void> {
  const db = store();
  const t = now();
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  if (gsc) {
    for (const i of gsc.data.index) {
      db.prepare('UPDATE indexing SET google_verdict = ?, google_coverage = ?, google_crawl = ?, google_checked = ? WHERE page = ?').run(i.verdict, i.coverage, i.lastCrawl, gsc.taken, pathOf(i.url));
    }
  }
  if (!bingKey() || !latestSnapshot<BingData>('bing')) return;
  for (const r of indexingRows()) {
    try {
      const url = `https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo?siteUrl=${encodeURIComponent(seoConfig.bingSite)}&url=${encodeURIComponent(r.url)}&apikey=${encodeURIComponent(bingKey())}`;
      const d = (await getJson<{ d?: Record<string, unknown> }>(url)).d ?? {};
      const ms = Number(/\/Date\((-?\d+)/.exec(String(d.LastCrawledDate ?? ''))?.[1]);
      const crawl = Number.isFinite(ms) && ms > 0 ? new Date(ms).toISOString() : null;
      const http = d.HttpStatus != null ? Number(d.HttpStatus) : null;
      db.prepare('UPDATE indexing SET bing_crawl = ?, bing_status = ?, bing_checked = ? WHERE page = ?').run(crawl, crawl ? `crawled${http ? `, HTTP ${http}` : ''}` : 'not crawled yet', t, r.page);
    } catch (e) {
      db.prepare('UPDATE indexing SET bing_status = ?, bing_checked = ? WHERE page = ?').run(`Bing did not answer: ${(e as Error).message.slice(0, 120)}`, t, r.page);
    }
  }
}
