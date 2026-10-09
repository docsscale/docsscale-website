import type { User } from '../../../../lib/seo/auth';
import { canSee } from '../../../../lib/seo/auth';
import { approverRole, findingLog, type Finding } from '../../../../lib/seo/findings';
import { decideFinding, progressFinding, saveFindingNote } from '../../actions';
import { Badge, T, button, day, input } from '../../ui';

// One item of the fix queue with its evidence, its three decisions and the
// instruction note (docs/SEO-DASHBOARD-PLAN.md, section 7).

const small = { ...button, padding: '6px 10px', fontSize: 13 } as const;
const quiet = { ...small, background: T.surface, color: T.body, borderWidth: 1, borderStyle: 'solid', borderColor: T.hairline } as const;

export const tone = (s: string): 'good' | 'bad' | 'neutral' =>
  s === 'Done' || s === 'Outcome measured' || s === 'Approved' ? 'good' : s === 'Rejected' ? 'bad' : 'neutral';

export function FindingCard({ f, user, back, open = false }: { f: Finding; user: User; back: string; open?: boolean }) {
  const mayDecide = canSee(user, approverRole());
  const maySeo = canSee(user, 'seo');
  const stale = f.last_seen < new Date(Date.now() - 2 * 86400_000).toISOString() && !['Done', 'Outcome measured', 'Rejected'].includes(f.status);
  const log = findingLog(f.id);
  return (
    <details open={open} style={{ background: T.surface, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '12px 16px', margin: '10px 0' }}>
      <summary style={{ cursor: 'pointer', fontSize: 15, color: T.ink, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge tone={f.impact === 'High' ? 'bad' : f.impact === 'Medium' ? 'neutral' : 'good'}>{f.impact} impact</Badge>
        <Badge tone={tone(f.status)}>{f.status === 'Approved' ? 'Approved, waiting for the next run' : f.status}</Badge>
        <span>{f.what}</span>
        {stale && <Badge tone="neutral">No longer detected</Badge>}
      </summary>
      <div style={{ fontSize: 14, color: T.body, marginTop: 10, display: 'grid', gap: 6 }}>
        <div><strong>Evidence:</strong> {f.evidence}</div>
        <div><strong>Impact:</strong> {f.impact}. {f.impact_reason} <strong>Effort:</strong> {f.effort}. <strong>Who acts:</strong> {f.who}.</div>
        <div>
          <strong>Found:</strong> {day(f.created)}; last seen {day(f.last_seen)}.
          {f.decided_by && <> <strong>Decided:</strong> {f.status === 'Approved' || f.status === 'Saved for later' || f.status === 'Rejected' ? f.status : 'decision'} by {f.decided_by}, {day(f.decided_at)}.</>}
          {f.horizon && <> <strong>Plan:</strong> next {f.horizon} days.</>}
          {f.done_at && <> <strong>Done:</strong> {day(f.done_at)}; outcome check {day(f.check_date)}.</>}
          {f.outcome && <> <strong>Outcome:</strong> {f.outcome}. {f.outcome_detail}</>}
        </div>
        {f.note && <div style={{ background: '#fff8e6', borderRadius: 8, padding: 8 }}><strong>Instruction note:</strong> {f.note}</div>}

        {maySeo && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {mayDecide && (f.status === 'Detected' || f.status === 'Recommended' || f.status === 'Saved for later') && (
              <>
                <form action={decideFinding}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="to" value="Approved" /><input type="hidden" name="back" value={back} /><button type="submit" style={small}>Approve</button></form>
                {f.status !== 'Saved for later' && <form action={decideFinding}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="to" value="Saved for later" /><input type="hidden" name="back" value={back} /><button type="submit" style={quiet}>Save for later</button></form>}
                <form action={decideFinding}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="to" value="Rejected" /><input type="hidden" name="back" value={back} /><button type="submit" style={quiet}>Reject</button></form>
              </>
            )}
            {!mayDecide && f.status === 'Detected' && (
              <form action={decideFinding}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="to" value="Recommended" /><input type="hidden" name="back" value={back} /><button type="submit" style={quiet}>Recommend to the owner</button></form>
            )}
            {f.status === 'Approved' && <form action={progressFinding}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="to" value="In progress" /><input type="hidden" name="back" value={back} /><button type="submit" style={quiet}>Mark in progress</button></form>}
            {(f.status === 'Approved' || f.status === 'In progress') && <form action={progressFinding}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="to" value="Done" /><input type="hidden" name="back" value={back} /><button type="submit" style={small}>Mark done</button></form>}
            {f.status === 'Rejected' && mayDecide && <form action={decideFinding}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="to" value="Recommended" /><input type="hidden" name="back" value={back} /><button type="submit" style={quiet}>Reconsider</button></form>}
            {(f.status === 'Done' || f.status === 'Outcome measured') && (
              <form action={progressFinding} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="hidden" name="id" value={f.id} /><input type="hidden" name="to" value="Approved" /><input type="hidden" name="back" value={back} />
                <input name="reason" required placeholder="Reason for reopening (required)" style={{ ...input, width: 260, padding: '6px 8px', fontSize: 13 }} />
                <button type="submit" style={quiet}>Reopen</button>
              </form>
            )}
          </div>
        )}
        {maySeo && (
          <form action={saveFindingNote} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', marginTop: 4 }}>
            <input type="hidden" name="id" value={f.id} /><input type="hidden" name="back" value={back} />
            <label style={{ flex: '1 1 260px', fontSize: 12 }}>Instruction note (kept with the item and followed when it is carried out)
              <textarea name="note" defaultValue={f.note} rows={2} style={{ ...input, fontSize: 13, marginTop: 2 }} />
            </label>
            <label style={{ fontSize: 12 }}>Plan horizon
              <select name="horizon" defaultValue={f.horizon ?? ''} style={{ ...input, width: 'auto', padding: '6px 8px', fontSize: 13, marginTop: 2, display: 'block' }}>
                <option value="">By effort</option><option value="30">30 days</option><option value="60">60 days</option><option value="90">90 days</option>
              </select>
            </label>
            <button type="submit" style={quiet}>Save note</button>
          </form>
        )}
        {log.length > 0 && (
          <details style={{ fontSize: 12, color: T.caption }}>
            <summary style={{ cursor: 'pointer' }}>History ({log.length})</summary>
            <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>{log.map((l, i) => <li key={i}>{day(l.at)}: {l.from_status} → {l.to_status} by {l.by}{l.note ? `. ${l.note}` : ''}</li>)}</ul>
          </details>
        )}
      </div>
    </details>
  );
}
