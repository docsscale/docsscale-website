import Link from 'next/link';
import { RELATED_HEADING, RELATED_PAGES, type RelatedPageKey } from '@/content/related';
import { T } from '@/styles/tokens';

// "Where to go next": the last block inside <main> on every main-site and
// blog page. It sits inside <main> on purpose: search engines weigh links in
// a page's own text more than the menu and footer, and the site's page
// linter counts only those. Words live in content/related.ts.
export function RelatedPages({ page }: { page: RelatedPageKey }) {
  return (
    <div data-screen-label="Related" style={{ padding: '0 0 clamp(56px,7vw,96px)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(22px,2.6vw,30px)',
            lineHeight: 1.1,
            letterSpacing: '-.03em',
          }}
        >
          {RELATED_HEADING}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))',
            gap: 14,
          }}
        >
          {RELATED_PAGES[page].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-lift="1"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: '20px 22px',
                background: T.surface,
                border: `1px solid ${T.hairline}`,
                borderRadius: 16,
                color: T.ink,
                textDecoration: 'none',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: T.teal }}>{link.label} →</span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: T.body }}>{link.blurb}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
