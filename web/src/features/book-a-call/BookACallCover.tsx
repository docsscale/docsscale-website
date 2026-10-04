// "What we'll cover": the six points of the call as tinted numbered cards (the
// same card style the page used for its three points), plus the reassurance line.
import { BOOK_A_CALL } from '@/content/book-a-call';
import { T } from '@/styles/tokens';

const TINTS = [
  { bg: T.peachBg, fg: T.peachFg },
  { bg: T.tealTintBg, fg: T.tealTintFg },
  { bg: T.lavenderBg, fg: T.lavenderFg },
  { bg: T.sageBg, fg: T.sageFg },
  { bg: T.peachBg, fg: T.peachFg },
  { bg: T.tealTintBg, fg: T.tealTintFg },
] as const;

export function BookACallCover() {
  return (
    <div data-screen-label="Cover" style={{ padding: '0 0 clamp(56px,7vw,96px)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(26px,3vw,38px)',
            lineHeight: 1.05,
            letterSpacing: '-.04em',
          }}
        >
          {BOOK_A_CALL.coverHeading}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            gap: 14,
          }}
        >
          {BOOK_A_CALL.cover.map((point, i) => {
            const tint = TINTS[i]!;
            return (
              <div
                key={point.title}
                data-lift="1"
                style={{
                  background: tint.bg,
                  color: tint.fg,
                  borderRadius: 28,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: tint.fg,
                    color: tint.bg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.02em', lineHeight: 1.15 }}>
                  {point.title}
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{point.body}</p>
              </div>
            );
          })}
        </div>
        <p
          style={{
            margin: 0,
            background: T.surface,
            border: `1px solid ${T.hairline}`,
            borderRadius: 999,
            padding: '16px 28px',
            textAlign: 'center',
            fontSize: 'clamp(15px,1.6vw,17px)',
            fontWeight: 700,
            lineHeight: 1.4,
            color: T.teal,
          }}
        >
          {BOOK_A_CALL.reassurance}
        </p>
      </div>
    </div>
  );
}
