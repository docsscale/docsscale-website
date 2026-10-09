import { requireUser } from '../../../../lib/seo/auth';
import { STATUSES, approverRole, findings, type Status } from '../../../../lib/seo/findings';
import { recentRuns } from '../../../../lib/seo/run';
import { Empty, H1, Section, Source, when } from '../../ui';
import { FindingCard } from './finding';

export const dynamic = 'force-dynamic';

// The fix queue (docs/SEO-DASHBOARD-PLAN.md, section 7): every rule-based
// finding with its evidence, waiting for the owner's decision. "Approve"
// marks an item for the next weekly run, which turns it into an editor task,
// a draft or a pull request; nothing publishes from here.

const OPEN: Status[] = ['Detected', 'Recommended', 'Approved', 'In progress'];

export default async function Queue({ searchParams }: { searchParams: Promise<{ show?: string; rule?: string }> }) {
  const user = await requireUser('/seo/queue', 'seo');
  const { show = 'open', rule } = await searchParams;
  const list = show === 'all' ? findings() : show === 'open' ? findings(`status IN (${OPEN.map(() => '?').join(',')})`, ...OPEN) : findings('status = ?', show);
  const shown = rule ? list.filter((f) => f.rule === rule) : list;
  const counts = new Map<string, number>();
  for (const f of findings()) counts.set(f.status, (counts.get(f.status) ?? 0) + 1);
  const rules = [...new Set(list.map((f) => f.rule))].sort();
  const lastRun = recentRuns(1)[0];
  const back = `/seo/queue?show=${show}${rule ? `&rule=${encodeURIComponent(rule)}` : ''}`;

  return (
    <>
      <H1 lede={<>Findings the rules detected, each with its evidence. {approverRole() === 'admin' ? 'Only the owner approves' : 'The owner and the SEO role approve'}; an approved item waits for the next weekly run, which makes the editor task, draft or pull request. Nothing publishes from this screen.</>}>Fix queue</H1>
      <div className="sx-chips" style={{ marginBottom: 10 }}>
        <a href="/seo/queue?show=open" className="sx-chip" aria-current={show === 'open' || undefined}>Open <span className="sx-chip-n">{OPEN.reduce((s, k) => s + (counts.get(k) ?? 0), 0)}</span></a>
        {STATUSES.map((s) => <a key={s} href={`/seo/queue?show=${encodeURIComponent(s)}`} className="sx-chip" aria-current={show === s || undefined}>{s} <span className="sx-chip-n">{counts.get(s) ?? 0}</span></a>)}
        <a href="/seo/queue?show=all" className="sx-chip" aria-current={show === 'all' || undefined}>All</a>
      </div>
      {rules.length > 1 && (
        <div className="sx-chips" style={{ fontSize: 12, alignItems: 'center' }}>
          <span style={{ color: '#6C6962', marginRight: 4 }}>Kind</span>
          <a href={`/seo/queue?show=${show}`} className="sx-chip" aria-current={!rule || undefined}>all</a>
          {rules.map((r) => <a key={r} href={`/seo/queue?show=${show}&rule=${encodeURIComponent(r)}`} className="sx-chip" aria-current={rule === r || undefined}>{r} <span className="sx-chip-n">{list.filter((f) => f.rule === r).length}</span></a>)}
        </div>
      )}
      <Section title={`${shown.length} ${show === 'open' ? 'open items' : show === 'all' ? 'items' : show.toLowerCase() + ' items'}`} note="Highest impact first. Open an item for its evidence, the decisions and the instruction note.">
        <div style={{ display: 'grid', gap: 10 }}>
          {shown.length === 0 ? <Empty>{lastRun ? 'Nothing here.' : 'No run has detected anything yet. Findings appear after the first daily run.'}</Empty> : shown.map((f) => <FindingCard key={f.id} f={f} user={user} back={back} />)}
        </div>
        <Source>Rules run after every daily collection · last run {when(lastRun?.started)} · thresholds on the Settings tab</Source>
      </Section>
    </>
  );
}
