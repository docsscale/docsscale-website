import { requireUser } from '../../../../lib/seo/auth';
import { crmLocationId, crmToken } from '../../../../lib/seo/config';
import type { CrmData } from '../../../../lib/seo/sources/crm';
import { latestSnapshot, sourceRows } from '../../../../lib/seo/store';
import { Badge, Change, Empty, Grid2, H1, Section, Source, Table, Tile, fmt, link, when } from '../../ui';

export const dynamic = 'force-dynamic';

// Leads matched with where they came from (owner, 9 Oct 2026, automation plan
// item 5). The CRM is the lead count of record; the website's forms save each
// lead with its UTM tags and landing page, and this tab reads those back as
// counts. Google never says which phrase a visitor searched, so each landing
// page is shown with the phrases Search Console shows it for.

export default async function Leads() {
  await requireUser('/seo/leads', 'seo');
  const snap = latestSnapshot<CrmData>('crm');
  const connected = Boolean(crmToken() && crmLocationId());
  const row = sourceRows().find((s) => s.name === 'crm');
  if (!snap) {
    return (
      <>
        <H1 lede="Which pages and channels turn into real leads, from the CRM's own records. Counts only: no name or contact detail is copied here.">Leads and their sources</H1>
        <Empty>
          {connected
            ? row?.status === 'failing'
              ? `The CRM did not answer on the last run: ${row.message}`
              : 'The CRM is connected; the next daily run will read it (or start a run on the Data sources tab).'
            : <>Not connected yet. Paste a read-only CRM token and the account id on the <a href="/seo/settings" style={link}>Settings</a> tab.</>}
        </Empty>
      </>
    );
  }
  const d = snap.data;
  const src = `The CRM · ${d.current[0]} to ${d.current[1]} against ${d.previous[0]} to ${d.previous[1]} · read ${when(snap.taken)}`;
  const pct = (n: number) => (d.totals.current ? `${Math.round((n / d.totals.current) * 100)}%` : '—');

  return (
    <>
      <H1 lede="Which pages and channels turn into real leads, from the CRM's own records. Counts only: no name or contact detail is copied here.">Leads and their sources</H1>
      <div className="sx-tiles">
        <Tile label="Leads" value={fmt(d.totals.current)} sub={<Change now={d.totals.current} before={d.totals.previous} />} source="Added to the CRM in the last 28 days" />
        <Tile label="From the website" value={fmt(d.website.current)} sub={<Change now={d.website.current} before={d.website.previous} />} source={`${pct(d.website.current)} of all leads`} />
        <Tile label="Organic search" value={fmt(d.byChannel.find((c) => c.channel === 'Organic search')?.current ?? 0)} sub={<Change now={d.byChannel.find((c) => c.channel === 'Organic search')?.current ?? 0} before={d.byChannel.find((c) => c.channel === 'Organic search')?.previous ?? 0} />} source="Tagged as organic by the visitor's first page" />
        <Tile label="Paid" value={fmt(d.byChannel.filter((c) => c.channel.startsWith('Paid')).reduce((s, c) => s + c.current, 0))} sub={<Change now={d.byChannel.filter((c) => c.channel.startsWith('Paid')).reduce((s, c) => s + c.current, 0)} before={d.byChannel.filter((c) => c.channel.startsWith('Paid')).reduce((s, c) => s + c.previous, 0)} />} source="Paid search and paid social" />
      </div>
      {d.note && !d.note.startsWith('Counts only') && <p><Badge tone="warn">{d.note}</Badge></p>}

      <Grid2>
        <Section title="By channel" note="From the UTM tags the website kept in the visitor's tab and sent with the form. A lead with no tags is a direct or untagged visit, or one added in the CRM by hand.">
          <Table head={['Channel', 'Leads', 'Previous 28 days']} rows={d.byChannel.map((c) => [c.channel, fmt(c.current), fmt(c.previous)])} empty="No leads in either period." />
          <Source>{src}</Source>
        </Section>
        <Section title="By source" note="The CRM's own source field: which form, funnel or other route the lead came in by.">
          <Table head={['Source', 'Leads', 'Previous 28 days']} rows={d.bySource.map((c) => [c.source, fmt(c.current), fmt(c.previous)])} empty="No leads in either period." />
          <Source>{src}</Source>
        </Section>
      </Grid2>

      <Section title="By landing page, with the phrases that bring it visitors" note="The first page each lead saw. Google never tells which phrase one visitor searched, so the phrases are what Search Console shows that page for over the same period: the closest honest match.">
        <Table
          head={['Landing page', 'Leads', 'Previous 28 days', 'Channels', 'Search phrases for this page (clicks / impressions)']}
          rows={d.byLandingPage.map((p) => [
            p.page, fmt(p.current), fmt(p.previous), p.channels.join(', '),
            p.queries.length ? p.queries.map((q) => `${q.query} (${q.clicks} / ${q.impressions})`).join(' · ') : p.page.startsWith('/') ? 'No search phrases recorded for this page' : '—',
          ])}
          empty="No landing pages recorded yet."
        />
        <Source>{src} · Search phrases from Search Console's page and query report</Source>
      </Section>

      {d.byCampaign.some((c) => c.campaign !== '(no campaign)') && (
        <Section title="By campaign" note="The utm_campaign tag, when the link carried one.">
          <Table head={['Campaign', 'Leads', 'Previous 28 days']} rows={d.byCampaign.map((c) => [c.campaign, fmt(c.current), fmt(c.previous)])} />
          <Source>{src}</Source>
        </Section>
      )}
      <Source>Fields read from the CRM: {d.fieldsFound.join(', ') || 'none of the attribution fields were found'}</Source>
    </>
  );
}
