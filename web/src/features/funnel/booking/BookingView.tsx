import { BOOKING_CHIPS, BOOKING_POINTS } from '@/content/funnel';
import { Reveal } from '../Reveal';
import { BookingEmbed } from './BookingEmbed';

export const cardStyle = { background: '#FFFFFF', border: '1px solid #E6E3DC', borderRadius: 16 } as const;

export function BookingView() {
  return (
    <>
      <div style={{ padding: 'clamp(48px,7vw,88px) 0 clamp(32px,4vw,56px)' }}>
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '0 clamp(16px,4vw,40px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              borderRadius: 999,
              background: '#DDEEEE',
              color: '#0F5F63',
            }}
          >
            FREE STRATEGY CALL
          </span>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(34px,5.2vw,68px)',
              lineHeight: 0.97,
              letterSpacing: '-.05em',
              textWrap: 'balance',
              color: '#1A1A1A',
            }}
          >
            We will find exactly where
            <br />
            <em className="serif-em" style={{ color: '#0F5F63' }}>
              your clinic is leaking patients.
            </em>
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px,1.8vw,18px)',
              lineHeight: 1.65,
              maxWidth: 580,
              textWrap: 'pretty',
              color: '#5C5A55',
            }}
          >
            30 minutes. No pitch, no deck, no pressure. We look at your patient numbers, spot the one biggest
            gap, and tell you honestly whether we can fix it — and how fast.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              width: '100%',
              maxWidth: 520,
              textAlign: 'left',
            }}
          >
            {BOOKING_POINTS.map((point) => (
              <div
                key={point.title}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px 20px',
                  ...cardStyle,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: point.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d={point.path}
                      stroke={point.stroke}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin={point.roundJoin ? 'round' : undefined}
                    />
                  </svg>
                </span>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>{point.title}</span>
                  <span style={{ fontSize: 14, color: '#5C5A55' }}>{point.rest}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 0 clamp(56px,7vw,96px)' }}>
        <div
          style={{
            maxWidth: 860,
            margin: '0 auto',
            padding: '0 clamp(16px,4vw,40px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <Reveal>
            <BookingEmbed />
          </Reveal>
          <Reveal>
            <p style={{ margin: 0, textAlign: 'center', fontSize: 14, color: '#6C6962', fontWeight: 600 }}>
              Replies within one business day if no slot fits.
            </p>
          </Reveal>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              {BOOKING_CHIPS.map((chip) => (
                <span key={chip} className="chip" style={{ background: '#DDEEEE', color: '#0F5F63' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path
                      d="M1.5 7l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
