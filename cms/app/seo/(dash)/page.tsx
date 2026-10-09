import { canSee, requireUser } from '../../../lib/seo/auth';
import { autoSummary } from '../../../lib/seo/findings';
import type { AnalyticsData } from '../../../lib/seo/sources/analytics';
import type { BingData } from '../../../lib/seo/sources/bing';
import type { SearchConsoleData } from '../../../lib/seo/sources/search-console';
import type { SiteData } from '../../../lib/seo/sources/site';
import { firstSnapshot, latestSnapshot, sourceRows, store } from '../../../lib/seo/store';
import { removeNote, writeNote } from '../actions';
import { Badge, Change, Empty, Grid2, H1, Section, Source, T, Tile, button, day, fmt, input, when } from '../ui';

type Note = { id: number; at: string; by: string; text: string; reason: string };

export const dynamic = 'force-dynamic';

export default async function Overview() {
  const user = await requireUser('/seo');
  const summary = autoSummary();
  const note = store().prepare("SELECT id, at, by, text, reason FROM notes WHERE kind = 'overview' AND removed IS NULL ORDER BY id DESC LIMIT 1").get() as Note | undefined;
  const noteAge = note ? Math.floor((Date.now() - Date.parse(note.at)) / 86400_000) : null;
  const maySeo = canSee(user, 'seo');
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
      <H1 lede={<>Last 28 days against the 28 days before. The baseline is the first figure the dashboard ever recorded. Search data on a young site is thin: &ldquo;Insufficient data&rdquo; is the honest answer, not a fault.</>}>Overview</H1>

      {!gsc && !ga && !bing && !site ? (
        <Empty>No data has been collected yet. An admin can start the first run on the Data sources tab.</Empty>
      ) : (
        <div className="sx-tiles sx-tiles-3">
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

      <Section title="This week in plain language" note={note ? `Written ${when(note.at)} by ${note.by}${noteAge != null && noteAge > 8 ? '. More than eight days old: the figures above are current, this judgement is not.' : ''}` : 'No written summary yet. The figures and findings below are automatic and current; the written judgement comes from the weekly run.'}>
        {note && noteAge != null && noteAge > 8 && <p><Badge tone="bad">Out of date ({noteAge} days)</Badge></p>}
        {note ? <div style={{ whiteSpace: 'pre-wrap', fontSize: 15, lineHeight: 1.5 }}>{note.text}</div> : null}
        {maySeo && (
          <details style={{ marginTop: 10, fontSize: 13 }}>
            <summary style={{ cursor: 'pointer', color: T.teal }}>{note ? 'Write a new summary' : 'Write the summary'}</summary>
            <form action={writeNote} style={{ display: 'grid', gap: 8, marginTop: 8 }}>
              <input type="hidden" name="kind" value="overview" />
              <textarea name="text" rows={8} required placeholder="What moved, what matters most, the top three priorities, what to ignore, risks." style={{ ...input, fontSize: 14 }} />
              <div><button type="submit" style={button}>Save the summary</button></div>
            </form>
          </details>
        )}
      </Section>

      <Grid2>
      <Section title="What moved" note={summary.dataAsOf ? `From the data as of ${when(summary.dataAsOf)}; last 28 days against the 28 before.` : undefined}>
        {summary.moved.length === 0 ? <Empty>No data yet.</Empty> : <ul className="sx-list" style={{ fontSize: 14 }}>{summary.moved.map((m) => <li key={m}>{m}</li>)}</ul>}
      </Section>

      <Section title="What matters most" note={`The top open items of the fix queue by impact (${summary.openCount} open).`} aside={<a href="/seo/queue" className="sx-chip">Open the queue</a>}>
        {summary.top.length === 0 ? <Empty>Nothing open in the queue.</Empty> : (
          <ol className="sx-list" style={{ fontSize: 14 }}>
            {summary.top.map((f) => <li key={f.id}><strong>{f.what}</strong> <span style={{ color: T.caption }}>({f.impact.toLowerCase()} impact, {f.effort.toLowerCase()} effort; {f.who})</span><br />{f.impact_reason}</li>)}
          </ol>
        )}
      </Section>
      </Grid2>

      <Grid2>
      <Section title="What to ignore" note="Known noise, kept between weeks, each with why it is noise.">
        <ul className="sx-list" style={{ fontSize: 14 }}>
          {summary.auto.map((a) => <li key={a}>{a} <span style={{ color: T.caption }}>(automatic)</span></li>)}
          {(store().prepare("SELECT id, at, by, text, reason FROM notes WHERE kind = 'ignore' AND removed IS NULL ORDER BY id").all() as Note[]).map((n) => (
            <li key={n.id}>{n.text}{n.reason ? `: ${n.reason}` : ''} <span style={{ color: T.caption }}>({n.by}, {day(n.at)})</span>
              {maySeo && <form action={removeNote} style={{ display: 'inline', marginLeft: 6 }}><input type="hidden" name="id" value={n.id} /><button type="submit" style={{ background: 'none', border: 0, color: T.teal, cursor: 'pointer', fontSize: 12, padding: 0 }}>remove</button></form>}
            </li>
          ))}
          {summary.auto.length + summary.ignore.length === 0 && <li>Nothing yet.</li>}
        </ul>
        {maySeo && (
          <form action={writeNote} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            <input type="hidden" name="kind" value="ignore" />
            <input name="text" required placeholder="What to ignore" style={{ ...input, flex: '1 1 200px', fontSize: 13, padding: '6px 8px' }} />
            <input name="reason" required placeholder="Why it is noise" style={{ ...input, flex: '1 1 200px', fontSize: 13, padding: '6px 8px' }} />
            <button type="submit" style={{ ...button, padding: '6px 10px', fontSize: 13 }}>Add</button>
          </form>
        )}
      </Section>

      <Section title="Risks" note="Anything that could cost rankings if left alone.">
        {summary.risks.length === 0 ? <p style={{ margin: 0 }}><Badge tone="good">None detected</Badge></p> : <ul className="sx-list" style={{ fontSize: 14 }}>{summary.risks.map((r) => <li key={r}>{r}</li>)}</ul>}
      </Section>
      </Grid2>

      <Grid2>

      {gsc && (
        <Section title="Quick wins in Google" note="Phrases where a better title or a stronger page could earn clicks soon." aside={<a href="/seo/google" className="sx-chip">Google tab</a>}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div><div className="sx-num" style={{ fontSize: 26, fontWeight: 650, lineHeight: 1.1 }}>{gsc.data.pageOneNoClicks.length}</div><div style={{ fontSize: 13, color: T.body }}>phrases on page one with no clicks</div></div>
            <div><div className="sx-num" style={{ fontSize: 26, fontWeight: 650, lineHeight: 1.1 }}>{gsc.data.positions11to20.length}</div><div style={{ fontSize: 13, color: T.body }}>phrases at positions 11 to 20</div></div>
          </div>
          <Source>Search Console · {gsc.data.current[0]} to {gsc.data.current[1]} · fetched {when(gsc.taken)}</Source>
        </Section>
      )}

      <Section title="Data sources" aside={<a href="/seo/sources" className="sx-chip">Details</a>}>
        {failingSources.length === 0 && sourceRows().length > 0 ? (
          <p style={{ margin: 0 }}><Badge tone="good">All sources returned data on their last run</Badge></p>
        ) : sourceRows().length === 0 ? (
          <Empty>No run yet.</Empty>
        ) : (
          <ul className="sx-list" style={{ fontSize: 14 }}>
            {failingSources.map((s) => <li key={s.name}><strong>{s.name}</strong>: {s.status}. {(s.message ?? '').slice(0, 160)}</li>)}
          </ul>
        )}
      </Section>
      </Grid2>
    </>
  );
}
