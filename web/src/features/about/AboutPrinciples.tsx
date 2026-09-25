import { T } from '@/styles/tokens';

export function AboutPrinciples() {
  return (
    <div
      data-screen-label="Principles"
      style={{
        background: T.band,
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
        <h2
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(32px,4vw,56px)',
            lineHeight: 1,
            letterSpacing: '-.04em',
            maxWidth: 760,
            textWrap: 'balance',
          }}
        >
          {'How we work, '}
          <em
            className="serif-accent"
            style={{
              color: T.lavenderFg,
            }}
          >
            in four sentences.
          </em>
        </h2>
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
              background: T.peachBg,
              color: T.peachFg,
              borderRadius: 28,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 20,
              minHeight: 240,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
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
                fontSize: 22,
                letterSpacing: '-.03em',
                lineHeight: 1.15,
              }}
            >
              We count booked and showed. Never clicks.
            </div>
          </div>
          <div
            data-lift="1"
            style={{
              background: T.tealTintBg,
              color: T.teal,
              borderRadius: 28,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 20,
              minHeight: 240,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: T.teal,
                color: T.tealTintBg,
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
                fontSize: 22,
                letterSpacing: '-.03em',
                lineHeight: 1.15,
              }}
            >
              You own every account, page and number, from day one.
            </div>
          </div>
          <div
            data-lift="1"
            style={{
              background: T.lavenderBg,
              color: T.lavenderFg,
              borderRadius: 28,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 20,
              minHeight: 240,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: T.lavenderFg,
                color: T.lavenderBg,
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
                fontSize: 22,
                letterSpacing: '-.03em',
                lineHeight: 1.15,
              }}
            >
              One service line first. Then the next.
            </div>
          </div>
          <div
            data-lift="1"
            style={{
              background: T.sageBg,
              color: T.sageFg,
              borderRadius: 28,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 20,
              minHeight: 240,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: T.sageFg,
                color: T.sageBg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              4
            </span>
            <div
              style={{
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: '-.03em',
                lineHeight: 1.15,
              }}
            >
              A real person answers you within one business day.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
