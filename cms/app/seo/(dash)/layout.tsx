import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { canSee, currentUser, type Role } from '../../../lib/seo/auth';
import { findings } from '../../../lib/seo/findings';
import { recentRuns } from '../../../lib/seo/run';
import { sourceRows } from '../../../lib/seo/store';
import { leave } from '../actions';
import '../seo.css';
import { when } from '../ui';
import { Shell, type NavGroup } from './shell';

export const dynamic = 'force-dynamic';

// Tabs grouped under a few headings in the sidebar
// (docs/SEO-DASHBOARD-PLAN.md, section 8). Each page checks the role again.
const TABS: { group: string; items: { href: string; label: string; role: Role; icon: string }[] }[] = [
  { group: '', items: [{ href: '/seo', label: 'Overview', role: 'editor', icon: 'home' }] },
  {
    group: 'Search',
    items: [
      { href: '/seo/google', label: 'Google', role: 'seo', icon: 'google' },
      { href: '/seo/bing', label: 'Bing', role: 'seo', icon: 'bing' },
      { href: '/seo/keywords', label: 'Keywords and rankings', role: 'editor', icon: 'keywords' },
      { href: '/seo/questions', label: 'Questions and gaps', role: 'editor', icon: 'questions' },
      { href: '/seo/ai', label: 'AI visibility', role: 'seo', icon: 'ai' },
    ],
  },
  {
    group: 'Site',
    items: [
      { href: '/seo/analytics', label: 'Analytics and leads', role: 'seo', icon: 'analytics' },
      { href: '/seo/content', label: 'Content inventory', role: 'editor', icon: 'content' },
      { href: '/seo/edits', label: 'Edit log', role: 'editor', icon: 'edits' },
      { href: '/seo/technical', label: 'Technical health', role: 'seo', icon: 'technical' },
      { href: '/seo/links', label: 'Links', role: 'seo', icon: 'links' },
    ],
  },
  {
    group: 'Actions',
    items: [
      { href: '/seo/queue', label: 'Fix queue', role: 'seo', icon: 'queue' },
      { href: '/seo/plan', label: '30/60/90 plan', role: 'editor', icon: 'plan' },
      { href: '/seo/history', label: 'History and outcomes', role: 'editor', icon: 'history' },
      { href: '/seo/imports', label: 'Imports', role: 'seo', icon: 'imports' },
    ],
  },
  {
    group: 'Admin',
    items: [
      { href: '/seo/sources', label: 'Data sources', role: 'seo', icon: 'sources' },
      { href: '/seo/settings', label: 'Settings', role: 'admin', icon: 'settings' },
      { href: '/seo/access', label: 'Access log', role: 'admin', icon: 'access' },
    ],
  },
];

const ghost = { background: 'none', border: '1px solid #E6E3DC', color: '#5C5A55', borderRadius: 8, padding: '6px 10px', fontSize: 12.5, cursor: 'pointer', fontWeight: 500 } as const;

export default async function DashLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/seo/sign-in');
  const groups: NavGroup[] = TABS.map((g) => ({ group: g.group, items: g.items.filter((i) => canSee(user, i.role)).map(({ href, label, icon }) => ({ href, label, icon })) })).filter((g) => g.items.length);
  // The sidebar shows how many findings wait for a decision, and the top bar
  // when the data was last collected, so freshness is visible on every tab.
  const waiting = canSee(user, 'seo') ? findings("status IN ('Detected','Recommended')").length : 0;
  const lastRun = recentRuns(1)[0];
  const failing = sourceRows().filter((s) => s.status !== 'ok').length;
  const pulse = lastRun ? (
    <span className="sx-pulse" title={failing ? `${failing} data source(s) did not answer on the last run` : 'Every data source answered on the last run'}>
      <span className={`sx-dot${failing ? ' bad' : ''}`} />
      Data as of {when(lastRun.finished ?? lastRun.started)}
    </span>
  ) : (
    <span className="sx-pulse"><span className="sx-dot bad" />No data collected yet</span>
  );

  return (
    <div className="sx-root">
      <Shell
        groups={groups}
        counts={{ '/seo/queue': waiting }}
        user={{ email: user.email, role: user.role }}
        pulse={pulse}
        userMenu={
          <div className="sx-user-actions">
            <a href="/keystatic" style={{ ...ghost, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Content editor</a>
            <form action={leave}><button type="submit" style={ghost}>Sign out</button></form>
          </div>
        }
      >
        {children}
      </Shell>
    </div>
  );
}
