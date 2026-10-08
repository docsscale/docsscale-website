import { requireUser } from '../../../../lib/seo/auth';
import { seoConfig } from '../../../../lib/seo/config';
import { store } from '../../../../lib/seo/store';
import { addPerson, removePerson } from '../../actions';
import { H1, Section, Source, Table, button, input, when } from '../../ui';

export const dynamic = 'force-dynamic';

type Session = { hash: string; email: string; created: string; last_seen: string; ip: string; device: string; ended: string | null; pages: number };

const minutes = (a: string, b: string) => {
  const m = Math.round((Date.parse(b) - Date.parse(a)) / 60_000);
  return m < 1 ? 'Under a minute' : m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
};

export default async function AccessLog() {
  await requireUser('/seo/access', 'admin');
  const db = store();
  // Kept for 12 months (plan, section 10).
  const yearAgo = new Date(Date.now() - 365 * 86400_000).toISOString();
  db.prepare('DELETE FROM page_views WHERE at < ?').run(yearAgo);
  db.prepare('DELETE FROM sessions WHERE last_seen < ?').run(yearAgo);
  db.prepare('DELETE FROM sign_in_requests WHERE at < ?').run(yearAgo);
  const sessions = db
    .prepare('SELECT s.*, (SELECT COUNT(*) FROM page_views v WHERE v.session = s.hash) AS pages FROM sessions s ORDER BY created DESC LIMIT 200')
    .all() as Session[];
  const people = db.prepare('SELECT email, role, added_at, added_by FROM users ORDER BY email').all() as { email: string; role: string; added_at: string; added_by: string }[];

  return (
    <>
      <H1>Access log</H1>
      <Section title="Sign-ins" note="Who signed in, when, for how long and on what device. Addresses are shortened on purpose. Kept for 12 months; tell the team this log exists.">
        <Table
          head={['Who', 'Signed in', 'Time spent', 'Pages seen', 'Device', 'Address (shortened)', 'Signed out']}
          rows={sessions.map((s) => [s.email, when(s.created), minutes(s.created, s.last_seen), String(s.pages), s.device, s.ip, s.ended ? when(s.ended) : 'No'])}
          empty="Nobody has signed in yet."
        />
      </Section>

      <Section title="People who may sign in" note="Admins are set on the server and can't be changed here. SEO can see every tab except the Access log. Editor sees the Overview and the content tabs.">
        <Table
          head={['Email', 'Role', 'Added', 'By', '']}
          rows={[
            ...seoConfig.adminEmails.map((e) => [e, 'admin', 'Set on the server', '—', '']),
            ...people.map((p) => [p.email, p.role, when(p.added_at), p.added_by,
              <form key="r" action={removePerson}><input type="hidden" name="email" value={p.email} /><button type="submit" style={{ ...button, background: '#8A4B1E', padding: '4px 10px', fontSize: 12 }}>Remove</button></form>]),
          ]}
        />
        <form action={addPerson} style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'end' }}>
          <label style={{ flex: '1 1 220px', fontSize: 13 }}>Email<input name="email" type="email" required style={input} /></label>
          <label style={{ fontSize: 13 }}>Role
            <select name="role" style={{ ...input, width: 'auto' }}><option value="seo">SEO</option><option value="editor">Editor</option></select>
          </label>
          <button type="submit" style={button}>Add</button>
        </form>
        <Source>Changes take effect at once: a person removed here is signed out on their next click.</Source>
      </Section>
    </>
  );
}
