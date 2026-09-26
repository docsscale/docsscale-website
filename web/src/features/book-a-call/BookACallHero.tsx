import { SplitWords } from '@/features/motion/SplitWords';
import { BookCallForm } from '@/features/lead-form/BookCallForm';
import { T } from '@/styles/tokens';
export function BookACallHero() {
  return (
    <div
      id="top"
      data-screen-label="Hero"
      style={{
        padding: 'clamp(28px,4vw,56px) 0 clamp(56px,7vw,96px)',
      }}
    >
      <div
        data-hero-rise=""
        className="two container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
          gap: 14,
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(28px,4vw,52px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 22,
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
              Book a strategy call
            </span>
            <h1
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(36px,4.6vw,64px)',
                lineHeight: 1,
                letterSpacing: '-.045em',
                textWrap: 'balance',
              }}
            >
              <SplitWords>
                {'Thirty minutes. Your numbers. '}
                <em
                  className="serif-accent"
                  style={{
                    color: T.teal,
                  }}
                >
                  A plan either way.
                </em>
              </SplitWords>
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.5,
                color: T.body,
              }}
            >
              Free, no deck, and no pitch for anything on the first call. If we&apos;re not the right fit for
              your clinic, we&apos;ll tell you who is.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
              gap: 14,
            }}
          >
            <div
              data-lift="1"
              style={{
                background: T.peachBg,
                color: T.peachFg,
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
                  background: T.peachFg,
                  color: T.peachBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                1
              </span>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: '-.02em',
                  lineHeight: 1.15,
                }}
              >
                Where patients come from today
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                Referrals, search, ads, walk-ins. Rough numbers are fine.
              </p>
            </div>
            <div
              data-lift="1"
              style={{
                background: T.lavenderBg,
                color: T.lavenderFg,
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
                  background: T.lavenderFg,
                  color: T.lavenderBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                2
              </span>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: '-.02em',
                  lineHeight: 1.15,
                }}
              >
                What happens after 5 pm
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                Who answers, how fast, and what happens to a missed call.
              </p>
            </div>
            <div
              data-lift="1"
              style={{
                background: T.sageBg,
                color: T.sageFg,
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
                  background: T.sageFg,
                  color: T.sageBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                3
              </span>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: '-.02em',
                  lineHeight: 1.15,
                }}
              >
                The one service line to grow first
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                You leave with it named, plus a realistic timeline.
              </p>
            </div>
          </div>
        </div>
        <BookCallForm />
      </div>
    </div>
  );
}
