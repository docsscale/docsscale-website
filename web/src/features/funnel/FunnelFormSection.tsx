import { Reveal } from '@/features/funnel/Reveal';
import { FunnelForm } from '@/features/funnel/FunnelForm';
import { T } from '@/styles/tokens';

export function FunnelFormSection() {
  return (
    <div
      id="form"
      style={{
        background: T.bg,
        padding: 'clamp(64px,8vw,112px) 0',
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          textAlign: 'center',
        }}
      >
        <Reveal
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: T.sageBg,
              color: T.sageFg,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              borderRadius: 999,
            }}
          >
            Claim your free system
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(30px,4.4vw,56px)',
              lineHeight: 0.97,
              letterSpacing: '-.05em',
              color: T.ink,
              textWrap: 'balance',
            }}
          >
            Get the full system.
            <br />
            <em
              className="serif-em"
              style={{
                color: T.teal,
              }}
            >
              Sent straight to your inbox.
            </em>
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px,1.8vw,18px)',
              color: T.body,
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            6 funnels. 17 automations. Full patient CRM. Enter your details and it lands in your inbox in
            minutes.
          </p>
        </Reveal>
        <Reveal
          style={{
            width: '100%',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,160px),1fr))',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                textAlign: 'center',
                background: T.band,
                borderRadius: 16,
                padding: '22px 16px',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: T.sageBg,
                  color: T.sageFg,
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: T.ink,
                }}
              >
                Fill the short form
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                30 seconds. Name, email, clinic type.
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                textAlign: 'center',
                background: T.band,
                borderRadius: 16,
                padding: '22px 16px',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: T.tealTintBg,
                  color: T.teal,
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: T.ink,
                }}
              >
                Check your inbox
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                The full system lands in minutes.
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                textAlign: 'center',
                background: T.band,
                borderRadius: 16,
                padding: '22px 16px',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: T.peachBg,
                  color: T.peachFg,
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: T.ink,
                }}
              >
                Go live in 5 days
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Import to GoHighLevel. Watch it run.
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal
          style={{
            width: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: `1.5px solid ${T.hairline}`,
              borderRadius: 24,
              padding: 'clamp(28px,4vw,48px)',
              boxShadow: '0 8px 40px rgba(0,0,0,.06)',
            }}
          >
            <FunnelForm />
          </div>
        </Reveal>
        <Reveal
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            flexWrap: 'wrap',
            marginTop: 24,
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13,
              fontWeight: 700,
              color: T.caption,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7.5l3 3 7-7"
                stroke="#1F5A40"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Instant delivery
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13,
              fontWeight: 700,
              color: T.caption,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7.5l3 3 7-7"
                stroke="#1F5A40"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            No credit card
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13,
              fontWeight: 700,
              color: T.caption,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7.5l3 3 7-7"
                stroke="#1F5A40"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Keep forever
          </span>
        </Reveal>
      </div>
    </div>
  );
}
