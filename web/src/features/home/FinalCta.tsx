import { HomeLeadForm } from '@/features/lead-form/HomeLeadForm';
import { T } from '@/styles/tokens';

export function FinalCta() {
  return (
    <div
      id="call"
      data-screen-label="Final CTA"
      style={{ background: T.band, padding: 'clamp(64px,8vw,112px) 0' }}
    >
      <div className="container">
        <div
          id="cta-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
            gap: 14,
          }}
        >
          <div
            style={{
              gridColumn: 'span 2',
              background: T.surface,
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(28px,4vw,52px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
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
              Start here
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
              {'Your next new patient starts with '}
              <em className="serif-accent" style={{ color: T.teal }}>
                one call.
              </em>
            </h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: T.body, maxWidth: 520 }}>
              A free 30-minute strategy call. We look at your numbers, pick the service line to grow first,
              and tell you honestly whether we&apos;re the right fit.
            </p>
          </div>
          <div
            style={{
              background: T.tealTintBg,
              borderRadius: 28,
              padding: 'clamp(24px,3vw,32px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <HomeLeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
