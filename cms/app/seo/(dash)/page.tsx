import { requireUser } from '../../../lib/seo/auth';
import type { AnalyticsData } from '../../../lib/seo/sources/analytics';
import type { BingData } from '../../../lib/seo/sources/bing';
import type { SearchConsoleData } from '../../../lib/seo/sources/search-console';
import type { SiteData } from '../../../lib/seo/sources/site';
import { firstSnapshot, latestSnapshot, sourceRows } from '../../../lib/seo/store';
import { Badge, Change, Empty, H1, Section, Source, Tile, day, fmt, link, tiles, when } from '../ui';

export const dynamic = 'force-dynamic';

export default async function Overview() {
  await requireUser('/seo');
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  const ga = latestSnapshot<AnalyticsData>('analytics');
  const bing = latestSnapshot<BingData>('bing');
  const site = latestSnapshot<SiteData>('site');
  const base = {
    gsc: firstSnapshot<SearchConsoleData>('search-console'),
    ga: firstSnapshot<AnalyticsData>('analytics'),
    bing: firstSnapshot<BingData>('bing'),
    site: firstSnapshot<SiteData>('site'),
  };
  const baseline = (snap: { taken: string } | null, value: string) => (snap ? `Baseline ${value} (${day(snap.taken)})` : '');
  const failingSources = sourceRows().filter((s) => s.status !== 'ok');

  return (
    <>
      <H1>Overview</H1>
      <p style={{ color: '#5C5A55', marginTop: 0 }}>
        Last 28 days against the 28 days before. The baseline is the first figure the dashboard ever recorded. Search
        data on a young site is thin: &ldquo;Insufficient data&rdquo; is the honest answer, not a fault.
      </p>

      {!gsc && !ga && !bing && !site ? (
        <Empty>No data has been collected yet. An admin can start the first run on the Data sources tab.</Empty>
      ) : (
        <div style={tiles}>
          <Tile
            label="Google clicks"
            value={gsc ? fmt(gsc.data.totals.current.clicks) : 'Unknown'}
            sub={gsc && <Change now={gsc.data.totals.current.clicks} before={gsc.data.totals.previous.clicks} />}
            source={gsc ? `Search Console · ${gsc.data.current[0]} to ${gsc.data.current[1]} · ${baseline(base.gsc, fmt(base.gsc?.data.totals.current.clicks))}` : 'Search Console · not collected yet'}
          />
          <Tile
            label="Google impressions"
            value={gsc ? fmt(gsc.data.totals.current.impressions) : 'Unknown'}
            sub={gsc && <Change now={gsc.data.totals.current.impressions} before={gsc.data.totals.previous.impressions} min={100} />}
            source={gsc ? `Search Console · ${baseline(base.gsc, fmt(base.gsc?.data.totals.current.impressions))}` : 'Search Console · not collected yet'}
          />
          <Tile
            label="Visitors (users)"
            value={ga ? fmt(ga.data.totals.current.totalUsers) : 'Unknown'}
            sub={ga && <Change now={ga.data.totals.current.totalUsers} before={ga.data.totals.previous.totalUsers} />}
            source={ga ? `GA4, visitors who accepted cookies · ${baseline(base.ga, fmt(base.ga?.data.totals.current.totalUsers))}` : 'GA4 · not collected yet'}
          />
          <Tile
            label="Leads (forms and booked calls)"
            value={ga ? fmt(ga.data.leads.current) : 'Unknown'}
            sub={ga && <Change now={ga.data.leads.current} before={ga.data.leads.previous} />}
            source="GA4 events generate_lead and book_call. The CRM is the count of record."
          />
          <Tile
            label="Bing clicks"
            value={bing ? fmt(bing.data.totals.current.clicks) : 'Unknown'}
            sub={bing && <Change now={bing.data.totals.current.clicks} before={bing.data.totals.previous.clicks} />}
            source={bing ? `Bing Webmaster · ${baseline(base.bing, fmt(base.bing?.data.totals.current.clicks))}` : 'Bing · not collected yet'}
          />
          <Tile
            label="Site health score"
            value={site?.data.averageScore != null ? `${site.data.averageScore} / 100` : 'Unknown'}
            sub={site && <span>{site.data.checks.filter((c) => !c.pass).length} site-wide checks failing</span>}
            source={site ? `Page linter, average of ${site.data.pages.length} pages · ${baseline(base.site, fmt(base.site?.data.averageScore))}` : 'Linter · not run yet'}
          />
        </div>
      )}

      {gsc && (
        <Section title="Quick wins in Google" note="Phrases where a better title or a stronger page could earn clicks soon.">
          <p style={{ margin: 0, fontSize: 14 }}>
            {gsc.data.pageOneNoClicks.length} phrases on page one with no clicks, and {gsc.data.positions11to20.length} phrases at
            average positions 11 to 20. <a href="/seo/google" style={link}>See them on the Google tab</a>.
          </p>
          <Source>Search Console · {gsc.data.current[0]} to {gsc.data.current[1]} · fetched {when(gsc.taken)}</Source>
        </Section>
      )}

      <Section title="Data sources">
        {failingSources.length === 0 && sourceRows().length > 0 ? (
          <p style={{ margin: 0 }}><Badge tone="good">All sources returned data on their last run</Badge></p>
        ) : sourceRows().length === 0 ? (
          <Empty>No run yet.</Empty>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>
            {failingSources.map((s) => <li key={s.name}><strong>{s.name}</strong>: {s.status}. {(s.message ?? '').slice(0, 160)}</li>)}
          </ul>
        )}
        <Source><a href="/seo/sources" style={link}>Details and last run times</a></Source>
      </Section>
    </>
  );
}
