import { RESULT_STATS } from '@/content/home';
import { STAGE_COLORS, T } from '@/styles/tokens';

export function Results() {
  return (
    <div
      id="results"
      data-screen-label="Results"
      style={{
        background: T.band,
        padding: 'clamp(64px,8vw,112px) 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(32px,4vw,48px)',
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
              gap: 16,
              maxWidth: 760,
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
              Results
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
              {'Results with '}
              <em
                className="serif-accent"
                style={{
                  color: T.peachFg,
                }}
              >
                the clinic&apos;s name
              </em>
              {' on them.'}
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.55,
              color: T.body,
              maxWidth: 420,
            }}
          >
            Every number has a clinic and a date behind it. Want to speak with one of them before you speak
            with us? Ask.
          </p>
        </div>
        <div
          id="results-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gridAutoFlow: 'dense',
            gap: 14,
          }}
        >
          <div
            style={{
              gridColumn: 'span 2',
              background: T.surface,
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 28,
              minHeight: 360,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <span
                style={{
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
                Featured · Dental · Austin, TX
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: T.caption,
                  fontWeight: 600,
                }}
              >
                Jan–Jun 2026
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))',
                gap: '24px 40px',
                alignItems: 'end',
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(34px,3.6vw,52px)',
                  lineHeight: 0.98,
                  letterSpacing: '-.045em',
                }}
              >
                {'184 new patients booked in six months. '}
                <span
                  style={{
                    color: T.teal,
                  }}
                >
                  91% showed.
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: T.body,
                  }}
                >
                  “We had two hygienists sitting idle on Fridays. Six months in, we&apos;re hiring a third.
                  The weekly report is the only marketing email I actually open.”
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: T.peachBg,
                      display: 'inline-block',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      Dr. Anita Patel
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: T.caption,
                      }}
                    >
                      Owner, dental practice · Austin, TX
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {RESULT_STATS.map((e) => (
            <div
              data-lift="1"
              style={{
                background: STAGE_COLORS[e.stage].bg,
                color: STAGE_COLORS[e.stage].fg,
                borderRadius: 28,
                padding: 26,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 20,
                minHeight: 220,
              }}
              key={e.tag}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                {e.tag}
              </span>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 'clamp(40px,4vw,60px)',
                    lineHeight: 0.95,
                    letterSpacing: '-.045em',
                  }}
                >
                  {e.n}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginTop: 6,
                  }}
                >
                  {e.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
