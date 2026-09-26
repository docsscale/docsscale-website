import { SplitWords } from '@/features/motion/SplitWords';
import { T } from '@/styles/tokens';
export function ResultsHero() {
  return (
    <div
      id="top"
      data-screen-label="Hero"
      style={{
        padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,64px)',
      }}
    >
      <div
        data-hero-rise=""
        className="two container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
          gap: 14,
        }}
      >
        <div
          style={{
            gridColumn: 'span 2',
            background: '#FFFFFF',
            border: `1px solid ${T.hairline}`,
            borderRadius: 28,
            padding: 'clamp(28px,4vw,52px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            justifyContent: 'space-between',
            minHeight: 360,
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
            Results
          </span>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(38px,5vw,72px)',
              lineHeight: 1,
              letterSpacing: '-.045em',
              textWrap: 'balance',
            }}
          >
            <SplitWords>
              {'Every number here has '}
              <em
                className="serif-accent"
                style={{
                  color: T.peachFg,
                }}
              >
                a clinic and a date
              </em>
              {' behind it.'}
            </SplitWords>
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.5,
              color: T.body,
              maxWidth: 560,
            }}
          >
            Counted in booked appointments and patients who showed, never clicks. If you&apos;d like to speak
            with one of these owners before you speak with us, ask and we&apos;ll make the introduction.
          </p>
        </div>
        <div
          style={{
            background: T.ink,
            color: T.bg,
            borderRadius: 28,
            padding: 'clamp(24px,3vw,36px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              opacity: 0.7,
            }}
          >
            Across current clients
          </span>
          {/* Auto margins keep the stats vertically centred in the card below the label. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              margin: 'auto 0',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid rgba(250,249,246,.15)',
                paddingBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  opacity: 0.75,
                }}
              >
                Median reply time
              </span>
              <b
                style={{
                  fontSize: 26,
                  letterSpacing: '-.03em',
                }}
              >
                2 min
              </b>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid rgba(250,249,246,.15)',
                paddingBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  opacity: 0.75,
                }}
              >
                Show-up rate
              </span>
              <b
                style={{
                  fontSize: 26,
                  letterSpacing: '-.03em',
                }}
              >
                91%
              </b>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: undefined,
                paddingBottom: undefined,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  opacity: 0.75,
                }}
              >
                Clients past 12 months
              </span>
              <b
                style={{
                  fontSize: 26,
                  letterSpacing: '-.03em',
                }}
              >
                100%
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
