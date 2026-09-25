import Link from 'next/link';
import { T } from '@/styles/tokens';

export function AboutTeam() {
  return (
    <div
      data-screen-label="Team"
      style={{
        padding: 'clamp(56px,7vw,96px) 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(28px,3.5vw,40px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(32px,4vw,56px)',
              lineHeight: 1,
              letterSpacing: '-.04em',
              maxWidth: 760,
            }}
          >
            The people on your account.
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.55,
              color: T.body,
              maxWidth: 420,
            }}
          >
            Small by design. The person on your strategy call is the person who runs your account.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 14,
          }}
        >
          <div
            data-lift="1"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: 280,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 120,
                  borderRadius: 20,
                  background: T.band,
                  border: `1px dashed ${T.hairlineHover}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 16,
                  color: T.caption,
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  boxSizing: 'border-box',
                }}
              >
                Team photo
              </div>
            </div>
            <div
              style={{
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: '-.02em',
                }}
              >
                Sam
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: T.body,
                }}
              >
                Founder · strategy and accounts
              </span>
            </div>
          </div>
          <div
            data-lift="1"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: 280,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 120,
                  borderRadius: 20,
                  background: T.band,
                  border: `1px dashed ${T.hairlineHover}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 16,
                  color: T.caption,
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  boxSizing: 'border-box',
                }}
              >
                Team photo
              </div>
            </div>
            <div
              style={{
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: '-.02em',
                }}
              >
                [Name]
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: T.body,
                }}
              >
                Paid media and funnels
              </span>
            </div>
          </div>
          <div
            data-lift="1"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: 280,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 120,
                  borderRadius: 20,
                  background: T.band,
                  border: `1px dashed ${T.hairlineHover}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 16,
                  color: T.caption,
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  boxSizing: 'border-box',
                }}
              >
                Team photo
              </div>
            </div>
            <div
              style={{
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: '-.02em',
                }}
              >
                [Name]
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: T.body,
                }}
              >
                Front-desk follow-up and scripts
              </span>
            </div>
          </div>
          <div
            style={{
              background: T.ink,
              color: T.bg,
              borderRadius: 28,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                opacity: 0.7,
              }}
            >
              Where
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              <span>2100 S Lamar Blvd, Suite 210</span>
              <span>Austin, TX 78704</span>
              <span
                style={{
                  opacity: 0.75,
                }}
              >
                (512) 555-0148 · hello@docsscale.com
              </span>
            </div>
            <Link
              data-lift="1"
              href="/book-a-call"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 48,
                background: T.bg,
                color: T.ink,
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Book a strategy call
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
