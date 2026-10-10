import Link from 'next/link';
import { T } from '@/styles/tokens';

export function ServicesRetain() {
  return (
    <div
      id="retain"
      data-screen-label="Retain"
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
                background: T.sageBg,
                color: T.sageFg,
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              04 · Retain
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
              Bring patients back, and let happy ones bring the next.
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
            Your cheapest new patient is one who already trusts you. Most clinics never ask them back.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 14,
          }}
        >
          <div
            data-lift="1"
            style={{
              background: T.sageBg,
              color: T.sageFg,
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
              <span>Reputation & reviews</span>
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
                07
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
              A rating that holds up when patients compare.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.5,
                borderTop: '1px solid #1F5A4033',
                paddingTop: 14,
              }}
            >
              <div>
                <b>
                  {'You get'}
                  {':'}
                </b>{' '}
                {
                  'a review request after every visit, replies within 24 hours in your voice, monitoring across Google and the directories that matter for your specialty.'
                }
              </div>
              <div>
                <b>
                  {'Counted in'}
                  {':'}
                </b>{' '}
                {'new reviews per month and average rating.'}
              </div>
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
              <span>Reactivation & recall</span>
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
                08
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
              Past patients invited back at the right time, in your name.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.5,
                borderTop: '1px solid #1F5A4033',
                paddingTop: 14,
              }}
            >
              <div>
                <b>
                  {'You get'}
                  {':'}
                </b>{' '}
                {
                  'outreach to everyone not seen in 12+ months, recall timed to their treatment, referral prompts after good visits. No discounts.'
                }
              </div>
              <div>
                <b>
                  {'Counted in'}
                  {':'}
                </b>{' '}
                {'rebooked visits.'}
              </div>
              <div>
                <b>
                  {'First results'}
                  {':'}
                </b>{' '}
                {'within the first month.'}
              </div>
            </div>
            <Link
              href="/services/patient-reactivation/"
              style={{ fontSize: 14, fontWeight: 700, color: T.sageFg }}
            >
              How we run reactivation →
            </Link>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 22px',
                borderBottom: `1px solid ${T.hairline}`,
                fontSize: 12,
                color: T.caption,
                fontWeight: 600,
              }}
            >
              <span>Reactivation · month one</span>
              <span
                style={{
                  color: T.sageFg,
                }}
              >
                Running
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 22px',
                borderBottom: `1px solid ${T.hairline}`,
                fontSize: 14,
              }}
            >
              <span
                style={{
                  color: T.body,
                }}
              >
                Not seen in 12+ months
              </span>
              <b>412</b>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 22px',
                borderBottom: `1px solid ${T.hairline}`,
                fontSize: 14,
              }}
            >
              <span
                style={{
                  color: T.body,
                }}
              >
                Invited back
              </span>
              <b>386</b>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 22px',
                fontSize: 14,
              }}
            >
              <span
                style={{
                  color: T.body,
                }}
              >
                Rebooked
              </span>
              <b
                style={{
                  color: T.sageFg,
                }}
              >
                31
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
