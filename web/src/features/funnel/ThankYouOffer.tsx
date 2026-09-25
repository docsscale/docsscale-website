import Link from 'next/link';
import { Reveal } from '@/features/funnel/Reveal';
import { T } from '@/styles/tokens';

export function ThankYouOffer() {
  return (
    <div
      style={{
        background: T.bg,
        padding: 'clamp(56px,7vw,96px) 0',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <Reveal
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: T.caption,
            }}
          >
            On the call
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(26px,3.6vw,44px)',
              lineHeight: 1.05,
              letterSpacing: '-.04em',
            }}
          >
            What happens in those 30 minutes
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 14,
            width: '100%',
          }}
        >
          <Reveal>
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${T.hairline}`,
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: T.tealTintBg,
                  color: T.teal,
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                01
              </span>
              <p
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 17,
                  lineHeight: 1.3,
                  letterSpacing: '-.02em',
                }}
              >
                We review your clinic, services, and current patient numbers.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${T.hairline}`,
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: T.peachBg,
                  color: T.peachFg,
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                02
              </span>
              <p
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 17,
                  lineHeight: 1.3,
                  letterSpacing: '-.02em',
                }}
              >
                We pick the one service line to grow first.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${T.hairline}`,
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: T.sageBg,
                  color: T.sageFg,
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                03
              </span>
              <p
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 17,
                  lineHeight: 1.3,
                  letterSpacing: '-.02em',
                }}
              >
                We tell you honestly whether DocsScale is the right fit.
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <Link href="/free-system/book-a-call/" className="cta-btn">
            {'Book your free 30-minute call '}
            <span className="arr">→</span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
