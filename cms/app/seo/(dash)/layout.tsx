import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { canSee, currentUser, type Role } from '../../../lib/seo/auth';
import { leave } from '../actions';
import { T } from '../ui';

export const dynamic = 'force-dynamic';

// Tabs grouped under a few headings so the bar reads on a phone
// (docs/SEO-DASHBOARD-PLAN.md, section 8). Each page checks the role again.
const TABS: { group: string; items: { href: string; label: string; role: Role }[] }[] = [
  { group: '', items: [{ href: '/seo', label: 'Overview', role: 'editor' }] },
  { group: 'Search', items: [{ href: '/seo/google', label: 'Google', role: 'seo' }, { href: '/seo/bing', label: 'Bing', role: 'seo' }] },
  {
    group: 'Site',
    items: [
      { href: '/seo/analytics', label: 'Analytics and leads', role: 'seo' },
      { href: '/seo/content', label: 'Content history', role: 'editor' },
      { href: '/seo/edits', label: 'Edit log', role: 'editor' },
      { href: '/seo/technical', label: 'Technical health', role: 'seo' },
    ],
  },
  { group: 'Admin', items: [{ href: '/seo/sources', label: 'Data sources', role: 'seo' }, { href: '/seo/access', label: 'Access log', role: 'admin' }] },
];

export default async function DashLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/seo/sign-in');
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: T.ink }}>
      <header style={{ background: T.teal, color: '#fff', padding: '12px 16px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <strong>DocsScale SEO</strong>
          <span style={{ fontSize: 13, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span>{user.email} · {user.role}</span>
            <a href="/keystatic" style={{ color: '#fff' }}>Content editor</a>
            <form action={leave}><button type="submit" style={{ background: 'none', border: '1px solid #fff', color: '#fff', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>Sign out</button></form>
          </span>
        </div>
      </header>
      <nav aria-label="Dashboard" style={{ background: T.surface, borderBottom: `1px solid ${T.hairline}`, padding: '8px 16px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: 14 }}>
          {TABS.map((g) => {
            const items = g.items.filter((i) => canSee(user, i.role));
            if (!items.length) return null;
            return (
              <span key={g.group || 'top'} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {g.group && <span style={{ color: T.caption, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{g.group}</span>}
                {items.map((i) => <Link key={i.href} href={i.href} style={{ color: T.teal, textDecoration: 'none' }}>{i.label}</Link>)}
              </span>
            );
          })}
        </div>
      </nav>
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '8px 16px 48px' }}>{children}</main>
    </div>
  );
}
