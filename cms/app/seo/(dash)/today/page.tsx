import { requireUser } from '../../../../lib/seo/auth';
import { findings } from '../../../../lib/seo/findings';
import { KINDS, kindOf, rankOpen } from '../../../../lib/seo/today';
import { recentRuns } from '../../../../lib/seo/run';
import { store } from '../../../../lib/seo/store';
import { donePlanItem } from '../../actions';
import { Badge, Empty, H1, Section, Source, T, Tile, button, day, link, tiles, when } from '../../ui';
import { FindingCard } from '../queue/finding';

export const dynamic = 'force-dynamic';

// Today (owner, 9 Oct 2026: "the dashboard should be easy to check daily
// tasks based on priority or filters"). One ranked list of everything open:
// work already approved comes first, then by impact, then the smaller job
// first, then the older item. Filters narrow it by kind of work, who does
// it, status and page. The fix queue keeps the full detail and history.

type PlanItem = { id: number; horizon: number; text: string; added_by: string; added_at: string };
const WHO = ['You', 'Editor in the CMS', 'Developer, with your OK'] as const;

export default async function Today({ searchParams }: { searchParams: Promise<{ kind?: string; who?: string; status?: string; page?: string }> }) {
  const user = await requireUser('/seo/today', 'seo');
  const { kind, who, status, page } = await searchParams;
  const open = rankOpen(findings("status IN ('Detected', 'Recommended', 'Approved', 'In progress')"));
  const plan = store().prepare('SELECT id, horizon, text, added_by, added_at FROM plan_items WHERE done_at IS NULL ORDER BY horizon, id').all() as PlanItem[];
  const shown = open.filter((f) => (!kind || kindOf(f) === kind) && (!who || f.who === who) && (!status || f.status === status) && (!page || f.page === page));
  const pages = [...new Set(open.map((f) => f.page).filter((p): p is string => !!p))].sort();
  const qs = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ kind, who, status, page, ...o })) if (v) p.set(k, v);
    const s = p.toString();
    return `/seo/today${s ? `?${s}` : ''}`;
  };
  const lastRun = recentRuns(1)[0];
  const high = open.filter((f) => f.impact === 'High').length;
  const committed = open.filter((f) => f.status === 'Approved' || f.status === 'In progress').length;
  const waiting = open.filter((f) => f.status === 'Detected' || f.status === 'Recommended').length;
  const filtered = !!(kind || who || status || page);

  return (
    <>
      <H1 lede={<>Everything open, in the order to do it: work already approved first, then by impact, then the smaller job first. The <a href="/seo/queue" style={link}>fix queue</a> keeps the full detail; the <a href="/seo/plan" style={link}>plan</a> keeps the horizons.</>}>Today</H1>
      <div style={{ ...tiles, marginBottom: 16 }}>
        <Tile label="Open items" value={String(open.length)} sub={`${high} high impact`} source="Fix queue" />
        <Tile label="Approved, to do" value={String(committed)} sub="Approved or in progress" source="Fix queue" />
        <Tile label="Waiting for a decision" value={String(waiting)} sub="Detected or recommended" source="Fix queue" />
        <Tile label="Plan lines" value={String(plan.length)} sub={`${plan.filter((p) => p.horizon === 30).length} in the next 30 days`} source="30/60/90 plan" />
      </div>

      <div className="sx-chips" style={{ marginBottom: 8, alignItems: 'center' }}>
        <span style={{ color: T.caption, fontSize: 12, marginRight: 4 }}>Kind</span>
        <a href={qs({ kind: undefined })} className="sx-chip" aria-current={!kind || undefined}>all</a>
        {KINDS.map((k) => { const n = open.filter((f) => kindOf(f) === k).length; return n ? <a key={k} href={qs({ kind: k })} className="sx-chip" aria-current={kind === k || undefined}>{k} <span className="sx-chip-n">{n}</span></a> : null; })}
      </div>
      <div className="sx-chips" style={{ marginBottom: 8, alignItems: 'center' }}>
        <span style={{ color: T.caption, fontSize: 12, marginRight: 4 }}>Who</span>
        <a href={qs({ who: undefined })} className="sx-chip" aria-current={!who || undefined}>anyone</a>
        {WHO.map((w) => { const n = open.filter((f) => f.who === w).length; return n ? <a key={w} href={qs({ who: w })} className="sx-chip" aria-current={who === w || undefined}>{w} <span className="sx-chip-n">{n}</span></a> : null; })}
      </div>
      <div className="sx-chips" style={{ marginBottom: 8, alignItems: 'center' }}>
        <span style={{ color: T.caption, fontSize: 12, marginRight: 4 }}>Status</span>
        <a href={qs({ status: undefined })} className="sx-chip" aria-current={!status || undefined}>any</a>
        {(['In progress', 'Approved', 'Recommended', 'Detected'] as const).map((s) => { const n = open.filter((f) => f.status === s).length; return n ? <a key={s} href={qs({ status: s })} className="sx-chip" aria-current={status === s || undefined}>{s} <span className="sx-chip-n">{n}</span></a> : null; })}
      </div>
      {pages.length > 1 && (
        <details open={!!page} style={{ marginBottom: 14, fontSize: 12 }}>
          <summary style={{ cursor: 'pointer', color: T.caption }}>Page: {page ?? 'all'}</summary>
          <div className="sx-chips" style={{ marginTop: 8, alignItems: 'center' }}>
            <a href={qs({ page: undefined })} className="sx-chip" aria-current={!page || undefined}>all</a>
            {pages.map((p) => <a key={p} href={qs({ page: p })} className="sx-chip" aria-current={page === p || undefined}>{p}</a>)}
          </div>
        </details>
      )}
      <Section title={filtered ? `${shown.length} of ${open.length} open items` : `${open.length} open items, in order`} note="Open an item for its evidence and buttons. Approve what you want done; the weekly run picks up approved items.">
        <div style={{ display: 'grid', gap: 10 }}>
          {shown.length === 0 ? <Empty>{open.length ? 'Nothing matches these filters.' : lastRun ? 'Nothing is open. Enjoy it.' : 'No run has detected anything yet.'}</Empty>
            : shown.map((f, i) => (
              <div key={f.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 8, alignItems: 'start' }}>
                <span style={{ color: T.caption, fontSize: 13, paddingTop: 14, textAlign: 'right' }}>{i + 1}</span>
                <div>
                  <div style={{ marginBottom: 4 }}><Badge tone="neutral">{kindOf(f)}</Badge> <span style={{ color: T.caption, fontSize: 12 }}>{f.who} · {f.effort.toLowerCase()} effort{f.page ? ` · ${f.page}` : ''}</span></div>
                  <FindingCard f={f} user={user} back={qs({})} />
                </div>
              </div>
            ))}
        </div>
        <Source>Rules run after every daily collection · last run {when(lastRun?.started)} · the order: approved first, then impact, then effort, then age</Source>
      </Section>

      <Section title="Plan lines not tied to a queue item" note="Pages to write, reviews to book, keyword ideas you added. Mark a line done when it is.">
        {plan.length === 0 ? <Empty>Nothing on the plan beyond the queue.</Empty> : (
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, display: 'grid', gap: 6 }}>
            {plan.map((p) => (
              <li key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <Badge tone={p.horizon === 30 ? 'warn' : 'neutral'}>{p.horizon} days</Badge>
                <span>{p.text} <span style={{ color: T.caption }}>(added by {p.added_by}, {day(p.added_at)})</span></span>
                <form action={donePlanItem}><input type="hidden" name="id" value={p.id} /><button type="submit" style={{ ...button, padding: '3px 8px', fontSize: 12, background: T.surface, color: T.body, borderWidth: 1, borderStyle: 'solid', borderColor: T.hairline }}>Done</button></form>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
