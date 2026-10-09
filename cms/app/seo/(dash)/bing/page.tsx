import { requireUser } from '../../../../lib/seo/auth';
import type { BingData } from '../../../../lib/seo/sources/bing';
import { latestSnapshot } from '../../../../lib/seo/store';
import { Change, DailyChart, Empty, H1, Section, Source, T, Table, Tile, fmt, when } from '../../ui';

export const dynamic = 'force-dynamic';

export default async function Bing() {
  await requireUser('/seo/bing', 'seo');
  const snap = latestSnapshot<BingData>('bing');
  if (!snap) return (<><H1>Bing</H1><Empty>Bing has not been read yet. See the Data sources tab.</Empty></>);
  const d = snap.data;
  const src = `Bing Webmaster Tools · ${d.current[0]} to ${d.current[1]} · fetched ${when(snap.taken)}`;

  return (
    <>
      <H1>Bing</H1>
      <div className="sx-tiles">
        <Tile label="Clicks" value={fmt(d.totals.current.clicks)} sub={<Change now={d.totals.current.clicks} before={d.totals.previous.clicks} />} source="Last 28 days" />
        <Tile label="Impressions" value={fmt(d.totals.current.impressions)} sub={<Change now={d.totals.current.impressions} before={d.totals.previous.impressions} min={100} />} source="Last 28 days" />
        <Tile label="Pages in Bing's index" value={d.crawl.length ? fmt(d.crawl[d.crawl.length - 1].inIndex) : 'Unknown'} source="Latest crawl report" />
        <Tile label="Crawl issues" value={fmt(d.crawlIssues.length)} source="Pages Bing had trouble with" />
      </div>

      <Section title="Clicks and impressions per day">
        <DailyChart points={d.daily} series={[{ key: 'impressions', label: 'Impressions', color: '#9DB9BB' }, { key: 'clicks', label: 'Clicks', color: T.teal }]} />
        <Source>{src}</Source>
      </Section>

      <Section title="Top phrases" note="Bing reports these by week; they are added up here over everything Bing returned.">
        <Table head={['Phrase', 'Clicks', 'Impressions', 'Average position']} rows={d.queries.slice(0, 50).map((q) => [q.query, fmt(q.clicks), fmt(q.impressions), fmt(q.position, 1)])} empty="Bing reported no phrases yet." />
        <Source>{src}</Source>
      </Section>

      <Section title="Crawl issues">
        <Table head={['Page', 'Issue', 'HTTP code']} rows={d.crawlIssues.map((c) => [c.url, c.issue, c.httpCode == null ? 'Unknown' : String(c.httpCode)])} empty="Bing reports no crawl issues." />
        <Source>{src}</Source>
      </Section>

      <Section title="Crawl activity">
        <Table head={['Day', 'Pages crawled', 'Crawl errors', 'In index']} rows={d.crawl.slice(-14).reverse().map((c) => [c.date, fmt(c.crawled), fmt(c.errors), fmt(c.inIndex)])} />
        <Source>{src}</Source>
      </Section>
    </>
  );
}
