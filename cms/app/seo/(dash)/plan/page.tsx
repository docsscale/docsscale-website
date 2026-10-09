import { requireUser } from '../../../../lib/seo/auth';
import { findings } from '../../../../lib/seo/findings';
import type { ContentData } from '../../../../lib/seo/sources/content';
import { latestSnapshot, store } from '../../../../lib/seo/store';
import { addPlanItem, donePlanItem } from '../../actions';
import { Badge, Empty, H1, Section, Source, T, button, day, input, link } from '../../ui';

export const dynamic = 'force-dynamic';

// The 30/60/90-day plan: approved queue items by horizon (set from their
// effort, or by hand on the item), plus lines added here, and the content
// pace against the owner's rule of two to three strong pieces a week.

type PlanItem = { id: number; horizon: number; text: string; added_by: string; added_at: string; done_at: string | null };

export default async function Plan() {
  const user = await requireUser('/seo/plan');
  const approved = findings("status IN ('Approved', 'In progress')");
  const items = store().prepare('SELECT * FROM plan_items WHERE done_at IS NULL ORDER BY horizon, id').all() as PlanItem[];
  const content = latestSnapshot<ContentData>('content');
  const live = (content?.data.posts ?? []).filter((p) => p.live && p.published);
  const weeks = 4;
  const since = new Date(Date.now() - weeks * 7 * 86400_000).toISOString().slice(0, 10);
  const recent = live.filter((p) => (p.published ?? '') >= since).length;

  return (
    <>
      <H1 lede={<>Approved work by horizon. An item lands in the horizon its effort suggests (small: 30 days, medium: 60, large: 90) unless set by hand on the <a href="/seo/queue" style={link}>fix queue</a>.</>}>30/60/90-day plan</H1>
      {[30, 60, 90].map((h) => {
        const q = approved.filter((f) => (f.horizon ?? (f.effort === 'Small' ? 30 : f.effort === 'Medium' ? 60 : 90)) === h);
        const p = items.filter((i) => i.horizon === h);
        return (
          <Section key={h} title={`Next ${h} days`}>
            {q.length + p.length === 0 ? <Empty>Nothing planned here yet.</Empty> : (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, display: 'grid', gap: 6 }}>
                {q.map((f) => <li key={`f${f.id}`}><Badge tone={f.status === 'In progress' ? 'good' : 'neutral'}>{f.status}</Badge> {f.what} <span style={{ color: T.caption }}>({f.who}; {f.effort.toLowerCase()} effort)</span></li>)}
                {p.map((i) => (
                  <li key={`p${i.id}`} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>{i.text} <span style={{ color: T.caption }}>(added by {i.added_by}, {day(i.added_at)})</span></span>
                    {user.role !== 'editor' && <form action={donePlanItem}><input type="hidden" name="id" value={i.id} /><button type="submit" style={{ ...button, padding: '3px 8px', fontSize: 12, background: T.surface, color: T.body, borderWidth: 1, borderStyle: 'solid', borderColor: T.hairline }}>Done</button></form>}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        );
      })}
      {user.role !== 'editor' && (
        <Section title="Add a line to the plan" note="For work that is not a queue item: a page to write, a review to book.">
          <form action={addPlanItem} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input name="text" required placeholder="What" style={{ ...input, flex: '1 1 280px' }} />
            <select name="horizon" defaultValue="30" style={{ ...input, width: 'auto' }}><option value="30">30 days</option><option value="60">60 days</option><option value="90">90 days</option></select>
            <button type="submit" style={button}>Add</button>
          </form>
        </Section>
      )}
      <Section title="Content pace" note="The owner's rule: about two to three strong pages or posts a week, steadily, not in a burst.">
        <p style={{ margin: 0, fontSize: 14 }}>
          {content ? <>{recent} {recent === 1 ? 'post' : 'posts'} went live in the last {weeks} weeks ({(recent / weeks).toFixed(1)} a week); {live.length} live in all.</> : 'The content files have not been read yet.'}
        </p>
        <Source>Content files on GitHub{content ? `, fetched ${day(content.taken)}` : ''} · published dates from the files</Source>
      </Section>
    </>
  );
}
