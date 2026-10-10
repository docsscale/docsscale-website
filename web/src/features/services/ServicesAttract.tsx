import Link from 'next/link';
import { T } from '@/styles/tokens';

export function ServicesAttract() {
  return (
    <div
      id="attract"
      data-screen-label="Attract"
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
                background: T.peachBg,
                color: T.peachFg,
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              01 · Attract
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
              Get in front of patients already looking for what you do.
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
            One service line at a time. Traffic that arrives pre-screened, so your front desk talks to people
            who can actually book.
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
              background: T.peachBg,
              color: T.peachFg,
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
              <span>Paid advertising</span>
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
                01
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
              Meta and Google campaigns that book, not click.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.5,
                borderTop: '1px solid #8A4B1E33',
                paddingTop: 14,
              }}
            >
              <div>
                <b>
                  {'You get'}
                  {':'}
                </b>{' '}
                {
                  'one campaign per service line, creative refreshed monthly, screening questions before any callback.'
                }
              </div>
              <div>
                <b>
                  {'Counted in'}
                  {':'}
                </b>{' '}
                {'booked appointments and cost per booked visit.'}
              </div>
              <div>
                <b>
                  {'Live in'}
                  {':'}
                </b>{' '}
                {'2–3 weeks.'}
              </div>
            </div>
            <Link href="/services/paid-ads/" style={{ fontSize: 14, fontWeight: 700, color: T.peachFg }}>
              How we run paid ads →
            </Link>
          </div>
          <div
            data-lift="1"
            style={{
              background: T.peachBg,
              color: T.peachFg,
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
              <span>SEO</span>
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
                02
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
              Rank for the treatments you want more of, where you serve.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.5,
                borderTop: '1px solid #8A4B1E33',
                paddingTop: 14,
              }}
            >
              <div>
                <b>
                  {'You get'}
                  {':'}
                </b>{' '}
                {
                  'Google Business Profile management, pages for the treatments you want more of, review velocity, monthly rank report.'
                }
              </div>
              <div>
                <b>
                  {'Counted in'}
                  {':'}
                </b>{' '}
                {'calls and bookings from search, not positions.'}
              </div>
              <div>
                <b>
                  {'Traction in'}
                  {':'}
                </b>{' '}
                {'3–6 months.'}
              </div>
            </div>
          </div>
          <div
            data-lift="1"
            style={{
              background: T.peachBg,
              color: T.peachFg,
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
              <span>Social media management</span>
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
                03
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
              A consistent presence in your voice, approved in ten minutes.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.5,
                borderTop: '1px solid #8A4B1E33',
                paddingTop: 14,
              }}
            >
              <div>
                <b>
                  {'You get'}
                  {':'}
                </b>{' '}
                {
                  '12–16 posts a month planned ahead, stories from real visits with permission, comments and DMs answered.'
                }
              </div>
              <div>
                <b>
                  {'Counted in'}
                  {':'}
                </b>{' '}
                {'inquiries from profile, not followers.'}
              </div>
              <div>
                <b>
                  {'First calendar'}
                  {':'}
                </b>{' '}
                {'week one.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
