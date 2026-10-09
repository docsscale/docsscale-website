import type { ReactNode } from 'react';
import '../seo.css';
import { T } from '../ui';

/** The centred card both sign-in screens share. */
export function SignInFrame({ children }: { children: ReactNode }) {
  return (
    <div className="sx-root" style={{ display: 'grid', placeItems: 'center', padding: '24px 16px', background: `radial-gradient(1200px 600px at 50% -10%, ${T.tealTint}, ${T.bg} 60%)` }}>
      <main className="sx-card" style={{ width: '100%', maxWidth: 400, padding: '28px 28px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <span className="sx-brand-mark">D</span>
          <span>
            <div className="sx-brand-name">DocsScale</div>
            <div className="sx-brand-sub">SEO command center</div>
          </span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 650, margin: '0 0 6px' }}>Sign in</h1>
        {children}
      </main>
    </div>
  );
}
