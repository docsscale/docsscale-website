import Link from 'next/link';
import { PROCESS_STEPS } from '@/content/home';
import { STAGE_COLORS, T } from '@/styles/tokens';

export function HowItWorks() {
  return (
    <div
      id="how"
      data-screen-label="How it works"
      style={{
        padding: 'clamp(64px,8vw,112px) 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(32px,4vw,48px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 760,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              color: T.caption,
            }}
          >
            How it works
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(36px,4.6vw,66px)',
              lineHeight: 0.98,
              letterSpacing: '-.045em',
              textWrap: 'balance',
            }}
          >
            {'From a 30-minute call to '}
            <em
              className="serif-accent"
              style={{
                color: T.sageFg,
              }}
            >
              a schedule that fills itself.
            </em>
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))',
            gap: 14,
          }}
        >
          {PROCESS_STEPS.map((e) => (
            <div
              className="card-border-hover"
              data-lift="1"
              style={{
                background: T.surface,
                border: `1px solid ${T.hairline}`,
                borderRadius: 28,
                padding: 26,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                minHeight: 250,
              }}
              key={e.n}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    color: T.caption,
                  }}
                >
                  {e.label}
                </span>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: STAGE_COLORS[e.stage].bg,
                    color: STAGE_COLORS[e.stage].fg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  {e.n}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: '-.03em',
                  lineHeight: 1.1,
                }}
              >
                {e.title}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: T.body,
                }}
              >
                {e.body}
              </p>
              <span
                style={{
                  fontSize: 12,
                  color: T.caption,
                  fontWeight: 600,
                  marginTop: 'auto',
                }}
              >
                {e.meta}
              </span>
            </div>
          ))}
          <Link
            href="/book-a-call"
            className="btn-dark-to-teal"
            data-lift="1"
            style={{
              background: T.ink,
              color: T.bg,
              borderRadius: 28,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 18,
              minHeight: 250,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              Start
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: '-.035em',
                lineHeight: 1.05,
              }}
            >
              Book the strategy call. No deck, just your numbers.
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: T.bg,
                color: T.ink,
                fontWeight: 800,
              }}
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
