import { RELATED_HEADING, RELATED_PAGES, type RelatedPageKey } from '@/content/related';
import { T } from '@/styles/tokens';

// The funnel's copy of "Where to go next" (see site-chrome/RelatedPages).
// Plain <a> tags, like every other link from the funnel to the main site, so
// the two stylesheets never mix; the funnel's own 1100px measure.
export function FunnelRelated({ page }: { page: RelatedPageKey }) {
  return (
    <div style={{ padding: '0 0 clamp(56px,7vw,96px)' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(22px,2.6vw,30px)',
            lineHeight: 1.1,
            letterSpacing: '-.03em',
            color: T.ink,
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
            <a
              key={link.href}
              href={link.href}
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
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
