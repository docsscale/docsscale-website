import { requireUser } from '../../../../lib/seo/auth';
import type { QueryRow, SearchConsoleData } from '../../../../lib/seo/sources/search-console';
import { latestSnapshot } from '../../../../lib/seo/store';
import { Badge, Change, DailyChart, Empty, H1, Section, Source, T, Table, Tile, fmt, when } from '../../ui';

export const dynamic = 'force-dynamic';

const path = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';
const queryRows = (rows: QueryRow[]) =>
  rows.slice(0, 50).map((q) => [q.query, fmt(q.clicks), fmt(q.impressions), fmt(q.position, 1), q.prevPosition == null ? 'New' : fmt(q.prevPosition, 1)]);
const QUERY_HEAD = ['Phrase', 'Clicks', 'Impressions', 'Average position', 'Previous 28 days'];

export default async function Google() {
  await requireUser('/seo/google', 'seo');
  const snap = latestSnapshot<SearchConsoleData>('search-console');
  if (!snap) return (<><H1>Google Search</H1><Empty>Search Console has not been read yet. See the Data sources tab.</Empty></>);
  const d = snap.data;
  const src = `Search Console · ${d.current[0]} to ${d.current[1]} (the last 3 days are left out: Google's data is late) · fetched ${when(snap.taken)}`;

  return (
    <>
      <H1>Google Search</H1>
      <div className="sx-tiles">
        <Tile label="Clicks" value={fmt(d.totals.current.clicks)} sub={<Change now={d.totals.current.clicks} before={d.totals.previous.clicks} />} source="Last 28 days" />
        <Tile label="Impressions" value={fmt(d.totals.current.impressions)} sub={<Change now={d.totals.current.impressions} before={d.totals.previous.impressions} min={100} />} source="Last 28 days" />
        <Tile label="Click rate" value={`${fmt(d.totals.current.ctr * 100, 1)}%`} source="Clicks ÷ impressions" />
        <Tile label="Average position" value={d.totals.current.impressions ? fmt(d.totals.current.position, 1) : 'Unknown'} source="An average over every phrase; lower is better" />
      </div>

      <Section title="Clicks and impressions per day">
        <DailyChart points={d.daily} series={[{ key: 'impressions', label: 'Impressions', color: '#9DB9BB' }, { key: 'clicks', label: 'Clicks', color: T.teal }]} />
        <Source>{src}</Source>
      </Section>

      <Section title="Page-one phrases with no clicks" note="We show on page one but nobody clicks. A clearer title or description is usually the fix.">
        <Table head={QUERY_HEAD} rows={queryRows(d.pageOneNoClicks)} empty="None in this period." />
        <Source>{src}</Source>
      </Section>

      <Section title="Phrases at positions 11 to 20" note="Just off page one: the closest wins.">
        <Table head={QUERY_HEAD} rows={queryRows(d.positions11to20)} empty="None in this period." />
        <Source>{src}</Source>
      </Section>

      <Section title="Top phrases">
        <Table head={QUERY_HEAD} rows={queryRows(d.queries)} empty="Google reported no phrases for this period. Rare phrases are hidden by Google." />
        <Source>{src}</Source>
      </Section>

      <Section title="Top pages">
        <Table head={['Page', 'Clicks', 'Impressions', 'Average position']} rows={d.pages.slice(0, 50).map((p) => [path(p.page), fmt(p.clicks), fmt(p.impressions), fmt(p.position, 1)])} />
        <Source>{src}</Source>
      </Section>

      <Section title="Index coverage" note="Google's verdict for every page in the sitemap, from URL inspection.">
        <Table
          head={['Page', 'Verdict', 'Google says', 'Last crawled']}
          rows={d.index.map((i) => [path(i.url), <Badge key="v" tone={i.verdict === 'PASS' ? 'good' : 'bad'}>{i.verdict === 'PASS' ? 'Indexed' : 'Not indexed'}</Badge>, i.coverage, i.lastCrawl ? when(i.lastCrawl) : 'Never'])}
        />
        <Source>Search Console URL inspection · fetched {when(snap.taken)}</Source>
      </Section>

      <Section title="Sitemaps">
        <Table head={['Sitemap', 'Submitted', 'Last read by Google', 'Errors', 'Warnings']} rows={d.sitemaps.map((s) => [s.path, when(s.lastSubmitted), when(s.lastDownloaded), s.errors ?? '0', s.warnings ?? '0'])} />
        <Source>Search Console · fetched {when(snap.taken)}</Source>
      </Section>
    </>
  );
}
