import { T } from '@/styles/tokens';

export function ServicesCapture() {
  return (
    <div
      id="capture"
      data-screen-label="Capture"
      style={{
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              maxWidth: 760,
            }}
          >
            <span
              style={{
                alignSelf: 'flex-start',
                height: 30,
                padding: '0 12px',
                borderRadius: 999,
                background: T.tealTintBg,
                color: T.teal,
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              02 · Capture
            </span>
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(32px,4vw,56px)',
                lineHeight: 1,
                letterSpacing: '-.04em',
                textWrap: 'balance',
              }}
            >
              Turn the click into a request, on any phone, at any hour.
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.55,
              color: T.body,
              maxWidth: 420,
            }}
          >
            Ads pointed at a site that doesn&apos;t book waste your money. We fix the landing before we scale
            the traffic.
          </p>
        </div>
        <div
          className="two"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            gap: 14,
          }}
        >
          <div
            data-lift="1"
            style={{
              background: T.tealTintBg,
              color: T.teal,
              borderRadius: 28,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              <span>Website design</span>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                04
              </span>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 24,
                letterSpacing: '-.03em',
                lineHeight: 1.1,
              }}
            >
              A clinic site that books. Not a brochure.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.5,
                borderTop: '1px solid #0F5F6333',
                paddingTop: 14,
              }}
            >
              <div>
                <b>
                  {'You get'}
                  {':'}
                </b>{' '}
                {
                  'booking in three taps from any page, a page per service, provider bios, insurance and pricing clarity, fast on phones, accessibility basics covered.'
                }
              </div>
              <div>
                <b>
                  {'Counted in'}
                  {':'}
                </b>{' '}
                {'booking rate per visitor.'}
              </div>
              <div>
                <b>
                  {'Launch'}
                  {':'}
                </b>{' '}
                {'4–6 weeks. Rebuilds of an existing site: 2–3 weeks.'}
              </div>
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
              gap: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              <span>Funnel design</span>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                05
              </span>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 24,
                letterSpacing: '-.03em',
                lineHeight: 1.1,
              }}
            >
              One landing page per service line, built around one offer.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.5,
                borderTop: '1px solid #0F5F6333',
                paddingTop: 14,
              }}
            >
              <div>
                <b>
                  {'You get'}
                  {':'}
                </b>{' '}
                {
                  'the page, the offer, a form with three screening questions, instant text confirmation, and a missed-call text-back that sends the same page.'
                }
              </div>
              <div>
                <b>
                  {'Counted in'}
                  {':'}
                </b>{' '}
                {'requests per 100 visitors.'}
              </div>
              <div>
                <b>
                  {'Per funnel'}
                  {':'}
                </b>{' '}
                {'1–2 weeks.'}
              </div>
            </div>
          </div>
          <div
            style={{
              gridColumn: 'span 2',
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            }}
          >
            <div
              style={{
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                borderRight: `1px solid ${T.hairline}`,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                  color: T.caption,
                }}
              >
                What a funnel looks like
              </span>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: '-.03em',
                  lineHeight: 1.1,
                }}
              >
                New patient visit, this week.
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: T.body,
                }}
              >
                Tell us what&apos;s going on and a real person from our office texts you back within minutes.
              </p>
              <span
                style={{
                  fontSize: 12,
                  color: T.caption,
                  fontWeight: 600,
                }}
              >
                Most insurance accepted · Self-pay welcome
              </span>
            </div>
            <div
              style={{
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  height: 42,
                  border: `1px solid ${T.hairline}`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: 14,
                  color: T.caption,
                }}
              >
                Full name
              </div>
              <div
                style={{
                  height: 42,
                  border: `1px solid ${T.hairline}`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: 14,
                  color: T.caption,
                }}
              >
                Mobile number
              </div>
              <div
                style={{
                  height: 42,
                  border: `1px solid ${T.hairline}`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: 14,
                  color: T.caption,
                }}
              >
                <span>What&apos;s bothering you?</span>
                <span>▾</span>
              </div>
              <div
                style={{
                  height: 46,
                  borderRadius: 999,
                  background: T.teal,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Request my appointment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
