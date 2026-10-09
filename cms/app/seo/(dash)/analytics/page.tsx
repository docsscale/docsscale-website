import { requireUser } from '../../../../lib/seo/auth';
import type { AnalyticsData } from '../../../../lib/seo/sources/analytics';
import { latestSnapshot } from '../../../../lib/seo/store';
import { Change, DailyChart, Empty, H1, Section, Source, T, Table, Tile, fmt, when } from '../../ui';

export const dynamic = 'force-dynamic';

export default async function Analytics() {
  await requireUser('/seo/analytics', 'seo');
  const snap = latestSnapshot<AnalyticsData>('analytics');
  if (!snap) return (<><H1>Analytics and leads</H1><Empty>GA4 has not been read yet. See the Data sources tab.</Empty></>);
  const d = snap.data;
  const src = `GA4 · ${d.current[0]} to ${d.current[1]} · ${d.excluded} · fetched ${when(snap.taken)}`;

  return (
    <>
      <H1>Analytics and leads</H1>
      <p style={{ color: T.body, marginTop: 0 }}>
        GA4 only counts visitors who press &ldquo;Accept&rdquo;, so it undercounts. The CRM stays the lead count of record.
      </p>
      <div className="sx-tiles">
        <Tile label="Sessions" value={fmt(d.totals.current.sessions)} sub={<Change now={d.totals.current.sessions} before={d.totals.previous.sessions} />} source="Last 28 days" />
        <Tile label="Visitors" value={fmt(d.totals.current.totalUsers)} sub={<Change now={d.totals.current.totalUsers} before={d.totals.previous.totalUsers} />} source="Last 28 days" />
        <Tile label="Engaged sessions" value={fmt(d.totals.current.engagedSessions)} source="Stayed 10 seconds, saw 2 pages or acted" />
        <Tile label="Leads" value={fmt(d.leads.current)} sub={<Change now={d.leads.current} before={d.leads.previous} />} source="generate_lead and book_call" />
      </div>

      <Section title="Sessions per day">
        <DailyChart points={d.daily} series={[{ key: 'sessions', label: 'Sessions', color: T.teal }]} />
        <Source>{src}</Source>
      </Section>

      <Section title="Sessions by channel" note="Visits referred by AI assistants are pulled out into their own row. Visits from their apps often carry no referrer, so this row undercounts.">
        <Table head={['Channel', 'Sessions', 'Previous 28 days', 'Key events']} rows={d.channels.map((c) => [c.channel, fmt(c.sessions), fmt(c.previous), fmt(c.keyEvents)])} />
        <Source>{src}</Source>
      </Section>

      <Section title="Events">
        <Table head={['Event', 'Count', 'Counted as key event']} rows={d.events.map((e) => [e.event, fmt(e.count), fmt(e.keyEvents)])} />
        <Source>{src}</Source>
      </Section>

      <Section title="Landing pages">
        <Table head={['Page', 'Sessions', 'Key events']} rows={d.landingPages.map((p) => [p.page, fmt(p.sessions), fmt(p.keyEvents)])} />
        <Source>{src}</Source>
      </Section>
    </>
  );
}
