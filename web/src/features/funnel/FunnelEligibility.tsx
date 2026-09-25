import { Reveal } from '@/features/funnel/Reveal';
import { T } from '@/styles/tokens';

export function FunnelEligibility() {
  return (
    <div
      id="eligibility"
      style={{
        background: T.bg,
        padding: 'clamp(56px,7vw,96px) 0',
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Reveal
          style={{
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
            Is this for you?
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(26px,3.6vw,44px)',
              lineHeight: 1.05,
              letterSpacing: '-.04em',
              textWrap: 'balance',
            }}
          >
            This system is built for clinic owners who
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 12,
            width: '100%',
            textAlign: 'left',
          }}
        >
          <Reveal>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: T.sageBg,
                border: '1px solid #c5e0d8',
                borderRadius: 16,
                padding: 20,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: T.sageFg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 7l3 3 6-6"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: undefined,
                }}
              >
                Are tired of missed calls turning into missed patients
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: T.tealTintBg,
                border: '1px solid #c8e4e6',
                borderRadius: 16,
                padding: 20,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: T.teal,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 7l3 3 6-6"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: undefined,
                }}
              >
                Want more booked appointments without more ad spend
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: T.peachBg,
                border: '1px solid #f0d5bc',
                borderRadius: 16,
                padding: 20,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: T.peachFg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 7l3 3 6-6"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: undefined,
                }}
              >
                Have dormant patients sitting in a CRM that nobody follows up with
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: T.lavenderBg,
                border: '1px solid #d5cee8',
                borderRadius: 16,
                padding: 20,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: T.lavenderFg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 7l3 3 6-6"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: undefined,
                }}
              >
                Want their front desk focused on patients in the building, not chasing leads
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: T.sageBg,
                border: '1px solid #c5e0d8',
                borderRadius: 16,
                padding: 20,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: T.sageFg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 7l3 3 6-6"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: undefined,
                }}
              >
                Run a chiropractic, dental, med spa, physical therapy, or weight loss clinic
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: T.ink,
                border: `1px solid ${T.ink}`,
                borderRadius: 16,
                padding: 20,
                height: '100%',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(218,237,226,.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 7l3 3 6-6"
                    stroke="#DAEDE2"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: T.bg,
                }}
              >
                Are ready to let a system do the follow-up work for them
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
