import { requireUser } from '../../../../lib/seo/auth';
import { latestImport, stamp, type KeywordRow } from '../../../../lib/seo/imports';
import { FOCUS_KEYWORDS } from '../../../../lib/seo/keywords';
import type { BingData } from '../../../../lib/seo/sources/bing';
import type { SearchConsoleData } from '../../../../lib/seo/sources/search-console';
import type { SiteData } from '../../../../lib/seo/sources/site';
import { latestSnapshot } from '../../../../lib/seo/store';
import { Badge, Empty, H1, Section, Source, Table, fmt, link, when } from '../../ui';

export const dynamic = 'force-dynamic';

// Keywords and rankings (docs/SEO-DASHBOARD-PLAN.md, section 8, tab 8): the
// approved keyword map against what Search Console and Bing report for each
// phrase; coverage both ways; cannibalization from queries. Daily positions
// would need a paid connector (phase 3); until then "current position" is
// Search Console's average over the last 28 days, or Insufficient data.

const pathOf = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';

export default async function Keywords() {
  await requireUser('/seo/keywords');
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  const bing = latestSnapshot<BingData>('bing');
  const site = latestSnapshot<SiteData>('site');
  const live = new Set(site?.data.pages.map((p) => p.path) ?? []);
  const gq = new Map((gsc?.data.queries ?? []).map((q) => [q.query.toLowerCase(), q]));
  const bq = new Map((bing?.data.queries ?? []).map((q) => [q.query.toLowerCase(), q]));
  const pageClicks = new Map((gsc?.data.pages ?? []).map((p) => [pathOf(p.page), p]));
  const pos = (p: number | null | undefined, impressions: number | undefined) => (p == null || !impressions ? 'Insufficient data' : fmt(p, 1));
  // A rank tracker's export, uploaded on the Imports tab (owner, 9 Oct 2026: shared tools, uploaded by hand).
  const tool = latestImport<KeywordRow>('keywords');
  const toolRows = new Map((tool?.rows ?? []).map((r) => [r.keyword.toLowerCase(), r]));
  const toolPos = (kw: string) => { const r = toolRows.get(kw.toLowerCase()); return !tool ? 'No upload' : !r ? 'Not in the upload' : r.position == null ? 'Not ranking' : fmt(r.position); };
  const toolVol = (kw: string) => { const r = toolRows.get(kw.toLowerCase()); return !tool ? 'No upload' : !r || r.volume == null ? 'Unknown' : fmt(r.volume); };

  const mapped = new Set(Object.keys(FOCUS_KEYWORDS));
  const unmapped = [...live].filter((p) => !mapped.has(p) && !['/', '/industries/', '/how-it-works/', '/results/', '/about/', '/book-a-call/', '/free-system/', '/privacy/', '/terms/', '/blog/'].includes(p));
  const src = `Keyword map (approved 6 Oct 2026) · Search Console${gsc ? ` ${gsc.data.current[0]} to ${gsc.data.current[1]}, fetched ${when(gsc.taken)}` : ' not read yet'} · Bing${bing ? ` fetched ${when(bing.taken)}` : ' not read yet'}`;

  return (
    <>
      <H1 lede={<>One primary keyword per page, from the approved keyword map. &ldquo;Average position&rdquo; is Google&rsquo;s average over 28 days for the exact phrase; daily tracking needs a paid connector, which is off.</>}>Keywords and rankings</H1>
      <Section title="The keyword map and where each phrase stands">
        <Table
          head={['Page', 'Primary keyword', 'Page live', 'Google average position', 'Google impressions', 'Google clicks (phrase)', 'Bing average position', 'Tool position', 'Searches a month (tool)', 'Page clicks, all phrases']}
          rows={Object.entries(FOCUS_KEYWORDS).map(([path, kw]) => {
            const g = gq.get(kw.toLowerCase());
            const b = bq.get(kw.toLowerCase());
            return [
              path, kw,
              <Badge key="l" tone={live.has(path) ? 'good' : 'neutral'}>{site ? (live.has(path) ? 'Yes' : 'Not yet') : 'Unknown'}</Badge>,
              gsc ? pos(g?.position, g?.impressions) : 'Unknown', gsc ? fmt(g?.impressions ?? 0) : 'Unknown', gsc ? fmt(g?.clicks ?? 0) : 'Unknown',
              bing ? pos(b?.position, b?.impressions) : 'Unknown',
              toolPos(kw), toolVol(kw),
              gsc ? fmt(pageClicks.get(path)?.clicks ?? 0) : 'Unknown',
            ];
          })}
        />
        <Source>{src} · Tool columns: {tool ? stamp(tool.meta) : 'no keyword export uploaded yet (Imports tab)'}. Google hides rare phrases, so a phrase with no row may still have been searched.</Source>
      </Section>

      {tool && (
        <Section title="Every keyword in the uploaded export" note="Top 200 by searches a month, as the tool reported them. Position is the tool's, on the day of the export.">
          <Table
            head={['Keyword', 'Position', 'Previous', 'Searches a month', 'Page', 'Mapped to']}
            rows={[...tool.rows].sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0)).slice(0, 200).map((r) => [
              r.keyword, r.position == null ? 'Not ranking' : fmt(r.position), r.previous == null ? '—' : fmt(r.previous), r.volume == null ? 'Unknown' : fmt(r.volume),
              r.url ? pathOf(r.url) : '—', Object.entries(FOCUS_KEYWORDS).find(([, kw]) => kw.toLowerCase() === r.keyword.toLowerCase())?.[0] ?? '—',
            ])}
          />
          <Source>{stamp(tool.meta)} · {fmt(tool.rows.length)} rows</Source>
        </Section>
      )}

      <Section title="Coverage" note="Keyword-map rows with no live page, and live pages with no keyword of their own.">
        <p style={{ fontSize: 14, margin: '0 0 8px' }}>
          <strong>Mapped keywords with no page yet:</strong> {site ? (Object.keys(FOCUS_KEYWORDS).filter((p) => !live.has(p)).map((p) => `${p} ("${FOCUS_KEYWORDS[p]}")`).join('; ') || 'none') : 'Unknown until the site is read'}.
        </p>
        <p style={{ fontSize: 14, margin: 0 }}>
          <strong>Live pages with no keyword:</strong> {site ? (unmapped.join(', ') || 'none (brand and navigation pages have none on purpose)') : 'Unknown'}.
        </p>
        <Source>Keyword map · live site{site ? `, checked ${when(site.taken)}` : ''}</Source>
      </Section>

      <Section title="Two pages on one phrase (cannibalization)" note="Phrases where Google showed more than one of our pages in the period. Decide which page should rank and point the other at it.">
        {!gsc ? <Empty>Search Console has not been read yet.</Empty> : (
          <Table
            head={['Phrase', 'Pages shown', 'Impressions', 'Average positions']}
            rows={gsc.data.cannibalization.sort((a, b) => b.pages.reduce((s, p) => s + p.impressions, 0) - a.pages.reduce((s, p) => s + p.impressions, 0)).map((c) => [
              c.query, c.pages.map((p) => pathOf(p.page)).join(', '), fmt(c.pages.reduce((s, p) => s + p.impressions, 0)), c.pages.map((p) => fmt(p.position, 1)).join(', '),
            ])}
            empty="None in this period."
          />
        )}
        <Source>{gsc ? `Search Console, ${gsc.data.current[0]} to ${gsc.data.current[1]} · fetched ${when(gsc.taken)}` : ''} · items above the threshold are in the <a href="/seo/queue" style={link}>fix queue</a></Source>
      </Section>

      <Section title="Every phrase Google reported" note="Top 100 by impressions, with the keyword map's page where the phrase is a primary keyword.">
        {!gsc ? <Empty>Search Console has not been read yet.</Empty> : (
          <Table
            head={['Phrase', 'Clicks', 'Impressions', 'Average position', 'Previous 28 days', 'Mapped to']}
            rows={gsc.data.queries.slice(0, 100).map((q) => [q.query, fmt(q.clicks), fmt(q.impressions), fmt(q.position, 1), q.prevPosition == null ? 'New' : fmt(q.prevPosition, 1), Object.entries(FOCUS_KEYWORDS).find(([, kw]) => kw.toLowerCase() === q.query.toLowerCase())?.[0] ?? '—'])}
            empty="Google reported no phrases for this period."
          />
        )}
      </Section>
    </>
  );
}
