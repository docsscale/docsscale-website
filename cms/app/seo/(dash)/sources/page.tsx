import { canSee, requireUser } from '../../../../lib/seo/auth';
import { settingsPresence } from '../../../../lib/seo/config';
import { SOURCES, recentRuns } from '../../../../lib/seo/run';
import { sourceRows } from '../../../../lib/seo/store';
import { runNow } from '../../actions';
import { Badge, H1, Section, Source, Table, button, when } from '../../ui';

export const dynamic = 'force-dynamic';

export default async function Sources({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  const user = await requireUser('/seo/sources', 'seo');
  const { run } = await searchParams;
  const rows = new Map(sourceRows().map((r) => [r.name, r]));

  return (
    <>
      <H1>Data sources</H1>
      {run === 'started' && <p><Badge tone="good">Run started. Refresh in a few minutes.</Badge></p>}
      {run === 'busy' && <p><Badge tone="neutral">A run is already going.</Badge></p>}

      <Section title="What each source returned" note="Every source is read on its own, so one failure never stops the others. Daily: our site, Google, GA4, Bing and the content files. Weekly: PageSpeed.">
        <Table
          head={['Source', 'State', 'Last tried', 'Last returned data', 'Message']}
          rows={(Object.keys(SOURCES) as (keyof typeof SOURCES)[]).map((k) => {
            const r = rows.get(k);
            return [
              SOURCES[k],
              <Badge key="s" tone={r?.status === 'ok' ? 'good' : r?.status === 'failing' ? 'bad' : 'neutral'}>{r?.status === 'ok' ? 'OK' : r?.status === 'failing' ? 'Failing' : r?.status === 'not set up' ? 'Not set up' : 'Never run'}</Badge>,
              when(r?.last_attempt), when(r?.last_success), r?.message ?? '—',
            ];
          })}
        />
        {canSee(user, 'admin') && (
          <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
            <form action={runNow}><input type="hidden" name="job" value="daily" /><button type="submit" style={button}>Run the daily sources now</button></form>
            <form action={runNow}><input type="hidden" name="job" value="weekly" /><button type="submit" style={button}>Run PageSpeed now</button></form>
          </div>
        )}
      </Section>

      <Section title="Recent runs">
        <Table
          head={['Run', 'Job', 'Started', 'Finished', 'Result', 'Started by']}
          rows={recentRuns().map((r) => [String(r.id), r.job, when(r.started), r.finished ? when(r.finished) : 'Running', r.ok == null ? '—' : r.ok ? 'All sources OK' : 'Some sources failed', r.started_by])}
          empty="No runs yet."
        />
      </Section>

      {canSee(user, 'admin') && (
        <Section title="Settings on the server" note="Keys live only in the server's environment and its private folder. This screen shows whether each is set, never its value.">
          <Table head={['Setting', 'State']} rows={settingsPresence().map((s) => [s.name, <Badge key="b" tone={s.set ? 'good' : 'neutral'}>{s.set ? 'Set' : 'Not set'}</Badge>])} />
          <Source>Read from the server when this page loaded</Source>
        </Section>
      )}
    </>
  );
}
