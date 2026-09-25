import { T } from '@/styles/tokens';

export function ServicesConvert() {
  return (
    <div
      id="convert"
      data-screen-label="Convert"
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
                background: T.lavenderBg,
                color: T.lavenderFg,
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              03 · Convert
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
              Answer every inquiry in minutes and move it onto the schedule.
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
            The stage most agencies skip, and the one that decides whether the ad money turned into patients.
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
              gridColumn: 'span 2',
              background: T.lavenderBg,
              color: T.lavenderFg,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
              gap: '24px 40px',
            }}
          >
            <div
              style={{
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
                <span>Follow-up & booking</span>
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
                  06
                </span>
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(24px,2.6vw,34px)',
                  letterSpacing: '-.035em',
                  lineHeight: 1.05,
                }}
              >
                Every inquiry answered within minutes, day or night, in your clinic&apos;s voice.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.5,
                borderTop: '1px solid rgba(74,61,117,.2)',
                paddingTop: 14,
              }}
            >
              <div>
                <b>You get:</b>
                {
                  ' text-back on every missed call, replies to forms and DMs within minutes, booking straight into your practice software, confirmation and reminder sequence, no-show rescue within the hour, scripts your front desk actually uses.'
                }
              </div>
              <div>
                <b>Counted in:</b>
                {' reply time, booked, showed.'}
              </div>
              <div>
                <b>Live:</b>
                {' the day campaigns launch.'}
              </div>
            </div>
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
              <span>Missed call · 7:12 pm</span>
              <span>Texted back in 0:28</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: 22,
              }}
            >
              <div
                style={{
                  alignSelf: 'flex-end',
                  maxWidth: '85%',
                  background: T.lavenderBg,
                  color: T.lavenderFg,
                  padding: '10px 14px',
                  borderRadius: '16px 16px 4px 16px',
                  fontSize: 14,
                  lineHeight: 1.45,
                }}
              >
                Hi, this is Maria from the front desk. Sorry we missed you. Booking a visit, or about an
                existing appointment?
              </div>
              <div
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '85%',
                  background: T.band,
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 4px',
                  fontSize: 14,
                  lineHeight: 1.45,
                }}
              >
                Booking. Anything this week?
              </div>
              <div
                style={{
                  alignSelf: 'flex-end',
                  maxWidth: '85%',
                  background: T.lavenderBg,
                  color: T.lavenderFg,
                  padding: '10px 14px',
                  borderRadius: '16px 16px 4px 16px',
                  fontSize: 14,
                  lineHeight: 1.45,
                }}
              >
                Thursday 9:30 am or 4:15 pm. Which works?
              </div>
            </div>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
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
              The reminder sequence
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 10,
                fontSize: 14,
                padding: '10px 0',
                borderBottom: `1px solid ${T.hairline}`,
              }}
            >
              <b
                style={{
                  color: T.lavenderFg,
                }}
              >
                After booking
              </b>
              <span
                style={{
                  color: T.body,
                }}
              >
                Confirmation, address, what to bring
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 10,
                fontSize: 14,
                padding: '10px 0',
                borderBottom: `1px solid ${T.hairline}`,
              }}
            >
              <b
                style={{
                  color: T.lavenderFg,
                }}
              >
                Evening before
              </b>
              <span
                style={{
                  color: T.body,
                }}
              >
                Reminder. C to confirm, R to reschedule.
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 10,
                fontSize: 14,
                padding: '10px 0',
                borderBottom: `1px solid ${T.hairline}`,
              }}
            >
              <b
                style={{
                  color: T.lavenderFg,
                }}
              >
                Morning of
              </b>
              <span
                style={{
                  color: T.body,
                }}
              >
                “See you at 9:30.”
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 10,
                fontSize: 14,
                padding: '10px 0',
                borderBottom: undefined,
              }}
            >
              <b
                style={{
                  color: T.lavenderFg,
                }}
              >
                Missed
              </b>
              <span
                style={{
                  color: T.body,
                }}
              >
                Reschedule text within the hour, task for the front desk
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
