import { AnimatedHeading } from '@/features/motion/AnimatedHeading';
import { T } from '@/styles/tokens';
export function HowItWorksHero() {
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
            How it works
          </span>
          <AnimatedHeading
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(38px,5vw,72px)',
              lineHeight: 1,
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
          </AnimatedHeading>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.5,
              color: T.body,
              maxWidth: 560,
            }}
          >
            Four steps, no surprises. You approve everything before it goes live, and every Monday you get one
            email that tells you whether it worked.
          </p>
        </div>
        <div
          style={{
            background: T.sageBg,
            color: T.sageFg,
            borderRadius: 28,
            padding: 'clamp(24px,3vw,36px)',
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
              letterSpacing: '.08em',
            }}
          >
            The timeline
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid rgba(31,90,64,.2)',
                fontSize: 14,
              }}
            >
              <b>Day 0</b>
              <span>Strategy call</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid rgba(31,90,64,.2)',
                fontSize: 14,
              }}
            >
              <b>Weeks 1–3</b>
              <span>Build and approve</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid rgba(31,90,64,.2)',
                fontSize: 14,
              }}
            >
              <b>Week 3</b>
              <span>Launch, inquiries start</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 12,
                padding: '12px 0',
                borderBottom: undefined,
                fontSize: 14,
              }}
            >
              <b>Weekly</b>
              <span>Monday report, monthly review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
