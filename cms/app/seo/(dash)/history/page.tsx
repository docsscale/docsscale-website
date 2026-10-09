import { requireUser } from '../../../../lib/seo/auth';
import { findings, outcomeOf } from '../../../../lib/seo/findings';
import { monthlyReports } from '../../../../lib/seo/report';
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
  const monthly = monthlyReports();
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
      <Section title="Monthly reports" note="Written by the run on the first Monday of each month: 28 days against the 28 before, what was done and what it changed. Emailed too, unless switched off on Settings.">
        {monthly.length === 0 ? <Empty>The first report is written on the first Monday of next month.</Empty> : (
          <div style={{ display: 'grid', gap: 10 }}>
            {monthly.map((m, i) => (
              <details key={m.id} open={i === 0} className="sx-finding">
                <summary style={{ cursor: 'pointer', fontWeight: 500 }}>{m.text.split('\n')[0]} <span style={{ color: '#6B6963', fontWeight: 400, fontSize: 13 }}>· written {day(m.at)}</span></summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.55, margin: '10px 0 0' }}>{m.text.split('\n').slice(1).join('\n').trim()}</pre>
              </details>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
