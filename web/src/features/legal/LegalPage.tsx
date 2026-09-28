// Renders /privacy/ and /terms/ from src/content/legal.ts.
import type { LegalDoc } from '@/content/legal';
import { T } from '@/styles/tokens';

const linkStyle = { color: T.teal, fontWeight: 600, textDecoration: 'underline' } as const;

/** Turns [text](url) in a paragraph into a link: external (https://…) or a #section on the page. */
function withLinks(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/).map((part, i) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (!link) return part;
    const [, label, href = ''] = link;
    return href.startsWith('#') ? (
      <a key={i} href={href} style={linkStyle}>
        {label}
      </a>
    ) : (
      <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {label}
      </a>
    );
  });
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <div data-screen-label="Hero" style={{ padding: '0 0 clamp(40px,5vw,64px)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              color: T.caption,
            }}
          >
            Legal
          </span>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(32px,4.5vw,56px)',
              lineHeight: 1,
              letterSpacing: '-.04em',
            }}
          >
            {doc.title}
          </h1>
          <span style={{ fontSize: 13, color: T.caption, fontWeight: 600 }}>
            {'Last updated: '}
            {doc.updated}
          </span>
        </div>
      </div>
      <div
        data-screen-label="Content"
        style={{ background: T.band, padding: 'clamp(48px,6vw,80px) 0 clamp(64px,8vw,96px)' }}
      >
        <div
          className="container"
          style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 760 }}
        >
          {doc.sections.map((section) => (
            <div
              key={section.heading}
              id={section.id}
              style={{ display: 'flex', flexDirection: 'column', gap: 10, scrollMarginTop: 96 }}
            >
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, letterSpacing: '-.02em' }}>
                {section.heading}
              </h2>
              {section.paragraphs.map((text) => (
                <p key={text} style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: T.body }}>
                  {withLinks(text)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
