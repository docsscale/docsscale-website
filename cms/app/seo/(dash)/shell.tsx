'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';

// The dashboard shell: a sidebar with the grouped tabs, a top bar with the
// page's place and the data's freshness, and the page itself. A client
// component only so the sidebar can open and close on a phone and so the
// current tab can be highlighted; everything it shows is handed in as props.

export type NavItem = { href: string; label: string; icon: string };
export type NavGroup = { group: string; items: NavItem[] };

// Simple 24-unit outline icons, drawn by hand (no icon library to keep the app small).
const ICONS: Record<string, ReactNode> = {
  home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></>,
  google: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  bing: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h5M8 16h8" /></>,
  keywords: <><path d="M4 7h16M4 12h10M4 17h13" /></>,
  questions: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" /></>,
  ai: <><path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z" /><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></>,
  analytics: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  content: <><path d="M6 3h9l5 5v13H6z" /><path d="M14 3v6h6M9 13h6M9 17h6" /></>,
  edits: <><path d="M4 20h4l10-10-4-4L4 16z" /><path d="m12 8 4 4" /></>,
  technical: <><path d="m9 7-5 5 5 5M15 7l5 5-5 5" /></>,
  links: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  queue: <><path d="M4 6h16M4 12h16M4 18h10" /><path d="m17 16 2 2 3-3" /></>,
  plan: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  history: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  imports: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M4 19h16" /></>,
  sources: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  access: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
};

export function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[name] ?? ICONS.content}</svg>;
}

export function Shell({ groups, counts, user, userMenu, pulse, children }: {
  groups: NavGroup[];
  counts: Record<string, number>;
  user: { email: string; role: string };
  userMenu: ReactNode;
  pulse: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = groups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group }))).find((i) => (i.href === '/seo' ? pathname === '/seo' : pathname.startsWith(i.href)));

  return (
    <div className="sx-shell" data-open={open || undefined}>
      <aside className="sx-side" aria-label="Dashboard sections">
        <Link href="/seo" className="sx-brand" onClick={() => setOpen(false)}>
          <span className="sx-brand-mark">D</span>
          <span>
            <div className="sx-brand-name">DocsScale</div>
            <div className="sx-brand-sub">SEO command center</div>
          </span>
        </Link>
        <nav className="sx-nav">
          {groups.map((g) => (
            <div key={g.group || 'top'} className="sx-nav-group">
              {g.group && <div className="sx-nav-label">{g.group}</div>}
              {g.items.map((i) => (
                <Link key={i.href} href={i.href} className="sx-nav-item" aria-current={current?.href === i.href ? 'page' : undefined} onClick={() => setOpen(false)}>
                  <Icon name={i.icon} />
                  <span>{i.label}</span>
                  {counts[i.href] ? <span className="sx-nav-count">{counts[i.href]}</span> : null}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sx-user">
          <div className="sx-user-row">
            <span className="sx-avatar">{user.email.slice(0, 1)}</span>
            <span style={{ minWidth: 0 }}>
              <div className="sx-user-email" title={user.email}>{user.email}</div>
              <div className="sx-user-role">{user.role}</div>
            </span>
          </div>
          {userMenu}
        </div>
      </aside>
      <div className="sx-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="sx-main">
        <header className="sx-top">
          <button type="button" className="sx-burger" aria-label={open ? 'Close the menu' : 'Open the menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg viewBox="0 0 24 24">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <div className="sx-crumb">
            {current?.group && <><span>{current.group}</span><span className="sx-crumb-sep">/</span></>}
            <strong>{current?.label ?? 'Dashboard'}</strong>
          </div>
          <div className="sx-top-right">{pulse}</div>
        </header>
        <main className="sx-content">{children}</main>
      </div>
    </div>
  );
}
