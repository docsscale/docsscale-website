import { StatsStrip } from '@/features/funnel/StatsStrip';
import { T } from '@/styles/tokens';

export function FunnelHero() {
  return (
    <div
      id="hero"
      style={{
        padding: 'clamp(56px,8vw,100px) 0 0',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: T.peachBg,
            color: T.peachFg,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: T.peachFg,
            }}
          />
          FREE FOR HEALTHCARE CLINICS — ZERO STRINGS
        </span>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(34px,4.8vw,64px)',
            lineHeight: 0.97,
            letterSpacing: '-.05em',
            textWrap: 'balance',
          }}
        >
          The complete patient-getting system,
          <br />
          <em
            className="serif-em"
            style={{
              color: T.teal,
              letterSpacing: '-.02em',
            }}
          >
            built and handed to you free.
          </em>
        </h1>
        <div
          style={{
            width: '100%',
            maxWidth: 980,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> kept for parity; optimised in the performance step */}
          <img
            src="/free-system/images/hero-mockup.jpg"
            alt="GoHighLevel funnels, CRM dashboard, and automations mockup"
            style={{
              width: '100%',
              aspectRatio: '16/10',
              borderRadius: 20,
              display: 'block',
              objectFit: 'cover',
            }}
          />
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(16px,2vw,20px)',
            lineHeight: 1.55,
            color: T.body,
            maxWidth: 620,
            textWrap: 'pretty',
          }}
        >
          6 pre-built sales funnels. A full patient CRM. 17 done-for-you automations that run the entire
          patient journey hands-free — packaged in GoHighLevel, set up for your clinic, and handed to you
          today at no cost.
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 7,
          }}
        >
          <span
            className="chip"
            style={{
              background: T.sageBg,
              color: T.sageFg,
              border: undefined,
            }}
          >
            ✓ Chiropractic
          </span>
          <span
            className="chip"
            style={{
              background: T.peachBg,
              color: T.peachFg,
              border: undefined,
            }}
          >
            ✓ Dental
          </span>
          <span
            className="chip"
            style={{
              background: T.lavenderBg,
              color: T.lavenderFg,
              border: undefined,
            }}
          >
            ✓ Med Spa
          </span>
          <span
            className="chip"
            style={{
              background: T.tealTintBg,
              color: T.teal,
              border: undefined,
            }}
          >
            ✓ Physical Therapy
          </span>
          <span
            className="chip"
            style={{
              background: T.band,
              color: T.body,
              border: `1px solid ${T.hairline}`,
            }}
          >
            ✓ Weight Loss
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <a href="#form" className="cta-btn">
            {'Claim the free system — it takes 30 seconds '}
            <span className="arr">→</span>
          </a>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 13,
              color: T.caption,
              fontWeight: 600,
            }}
          >
            <span>🔒 100% free</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: T.hairlineHover,
                display: 'inline-block',
              }}
            />
            <span>No credit card</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: T.hairlineHover,
                display: 'inline-block',
              }}
            />
            <span>200+ clinics claimed this</span>
          </div>
        </div>
      </div>
      <StatsStrip />
    </div>
  );
}
