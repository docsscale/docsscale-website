import { T } from '@/styles/tokens';

export function BookACallReassurance() {
  return (
    <div
      data-screen-label="Reassurance"
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
          {'What the call '}
          <em
            className="serif-accent"
            style={{
              color: T.peachFg,
            }}
          >
            is not.
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
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: '-.02em',
              }}
            >
              Not a sales pitch
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: T.body,
              }}
            >
              We don&apos;t quote or propose anything on the first call. You get a plan; what you do with it
              is up to you.
            </p>
          </div>
          <div
            data-lift="1"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: '-.02em',
              }}
            >
              Not a junior
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: T.body,
              }}
            >
              You talk to the person who would run your account. No hand-off afterwards.
            </p>
          </div>
          <div
            data-lift="1"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: '-.02em',
              }}
            >
              Not for every clinic
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: T.body,
              }}
            >
              If your market, budget, or timing isn&apos;t right for this, we say so and point you somewhere
              useful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
