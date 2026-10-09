import { requireUser } from '../../../../lib/seo/auth';
import { findings, outcomeOf } from '../../../../lib/seo/findings';
import { Badge, Empty, H1, Section, Source, Table, day } from '../../ui';
import { FindingCard } from '../queue/finding';

export const dynamic = 'force-dynamic';

// History and outcomes (docs/SEO-DASHBOARD-PLAN.md, section 7): every Done
// item, its before and after over equal periods, and the verdict: worked, no
// effect, hurt, or too early. Rejected items are listed too, so a reader
// knows what was decided against.

export default async function History() {
  const user = await requireUser('/seo/history');
  const done = findings("status IN ('Done', 'Outcome measured')");
  const rejected = findings("status IN ('Rejected', 'Saved for later')");
  const tone = (o: string) => (o === 'worked' ? 'good' : o === 'hurt' ? 'bad' : 'neutral') as 'good' | 'bad' | 'neutral';

  return (
    <>
      <H1 lede={<>Each change is checked 28 days after it was done (60 for a new page), over equal 28-day periods of Search Console data. Under 100 impressions in both periods the honest verdict is &ldquo;no effect: insufficient data&rdquo;.</>}>History and outcomes</H1>
      <Section title="Done">
        <Table
          head={['Change', 'Done', 'Check', 'Outcome', 'Detail']}
          rows={done.map((f) => {
            const o = f.outcome ? { outcome: f.outcome, detail: f.outcome_detail ?? '' } : outcomeOf(f) ?? { outcome: 'too early', detail: '' };
            return [f.what, day(f.done_at), day(f.check_date), <Badge key="o" tone={tone(o.outcome)}>{o.outcome}</Badge>, o.detail];
          })}
          empty="Nothing has been marked done yet."
        />
        <Source>Search Console snapshots kept by the dashboard · verdicts recorded on the day the check falls due</Source>
      </Section>
      {done.length > 0 && (
        <Section title="Details and reopening" note="A done item reopens only with a written reason, which is kept with it.">
          {done.map((f) => <FindingCard key={f.id} f={f} user={user} back="/seo/history" />)}
        </Section>
      )}
      <Section title="Rejected and saved for later">
        {rejected.length === 0 ? <Empty>None.</Empty> : rejected.map((f) => <FindingCard key={f.id} f={f} user={user} back="/seo/history" />)}
      </Section>
    </>
  );
}
