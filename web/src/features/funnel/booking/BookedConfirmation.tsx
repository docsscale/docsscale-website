import { BOOKED_STEPS } from '@/content/funnel';
import { cardStyle } from './BookingView';

export function BookedConfirmation() {
  return (
    <div style={{ padding: 'clamp(56px,8vw,96px) 0', textAlign: 'center' }}>
      <div
        style={{
          maxWidth: 620,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#DAEDE2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M7 19l7 7 15-15"
              stroke="#1F5A40"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#DAEDE2',
            color: '#1F5A40',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            borderRadius: 999,
          }}
        >
          Call booked
        </span>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(32px,5vw,60px)',
            lineHeight: 0.97,
            letterSpacing: '-.05em',
            textWrap: 'balance',
            color: '#1A1A1A',
          }}
        >
          You are on the calendar.
          <br />
          <em className="serif-em" style={{ color: '#0F5F63' }}>
            We will see you soon.
          </em>
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(15px,1.8vw,18px)',
            lineHeight: 1.65,
            maxWidth: 500,
            textWrap: 'pretty',
            color: '#5C5A55',
          }}
        >
          Check your email for the calendar invite with the call details. Come with your current monthly new
          patient numbers — that is where we will start.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
            maxWidth: 420,
            textAlign: 'left',
          }}
        >
          {BOOKED_STEPS.map((step) => (
            <div
              key={step.text}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 18px',
                ...cardStyle,
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: step.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M1.5 6l2.5 2.5 5.5-5"
                    stroke={step.stroke}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#5C5A55' }}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
