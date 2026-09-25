import { Reveal } from '@/features/funnel/Reveal';
import { T } from '@/styles/tokens';

export function FunnelObjections() {
  return (
    <div
      id="objections"
      style={{
        background: T.band,
        padding: 'clamp(64px,8vw,112px) 0',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
        }}
      >
        <Reveal
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            maxWidth: 640,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: T.caption,
            }}
          >
            Common questions
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(28px,4vw,52px)',
              lineHeight: 1,
              letterSpacing: '-.04em',
              color: T.ink,
              textWrap: 'balance',
            }}
          >
            Every clinic owner asks these.
            <br />
            <em
              className="serif-em"
              style={{
                color: T.teal,
              }}
            >
              Here are the straight answers.
            </em>
          </h2>
        </Reveal>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr',
                gap: 0,
                borderTop: `1px solid ${T.hairline}`,
                borderBottom: undefined,
                padding: '32px 0',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  paddingRight: 40,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-instrument-serif),Georgia,serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(36px,4vw,56px)',
                    fontWeight: 400,
                    color: T.teal,
                    lineHeight: 1,
                  }}
                >
                  01
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 'clamp(16px,1.8vw,20px)',
                    letterSpacing: '-.025em',
                    color: T.ink,
                    lineHeight: 1.3,
                  }}
                >
                  &quot;Why is this actually free?&quot;
                </h3>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 'clamp(14px,1.5vw,16px)',
                    color: T.body,
                    lineHeight: 1.7,
                  }}
                >
                  We build these systems for paid clients every week. The template costs us nothing to share —
                  and a small number of clinic owners who use it will want us to install it, run ads, and grow
                  the clinic with them. That is how we earn. No hidden fees, no upsell on the download.
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.teal,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 8l3.5 3.5 6.5-7"
                      stroke="#1F5A40"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  No strings on the download
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr',
                gap: 0,
                borderTop: `1px solid ${T.hairline}`,
                borderBottom: undefined,
                padding: '32px 0',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  paddingRight: 40,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-instrument-serif),Georgia,serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(36px,4vw,56px)',
                    fontWeight: 400,
                    color: T.teal,
                    lineHeight: 1,
                  }}
                >
                  02
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 'clamp(16px,1.8vw,20px)',
                    letterSpacing: '-.025em',
                    color: T.ink,
                    lineHeight: 1.3,
                  }}
                >
                  &quot;Do I need GoHighLevel already?&quot;
                </h3>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 'clamp(14px,1.5vw,16px)',
                    color: T.body,
                    lineHeight: 1.7,
                  }}
                >
                  You will need a GoHighLevel account — but you do not need one before you claim the system.
                  Download it first. If you want help getting set up, book a free call with us. We have done
                  this hundreds of times and can walk you through account setup in about 20 minutes.
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.teal,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 8l3.5 3.5 6.5-7"
                      stroke="#1F5A40"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  We help you set it up on the call
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr',
                gap: 0,
                borderTop: `1px solid ${T.hairline}`,
                borderBottom: undefined,
                padding: '32px 0',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  paddingRight: 40,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-instrument-serif),Georgia,serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(36px,4vw,56px)',
                    fontWeight: 400,
                    color: T.teal,
                    lineHeight: 1,
                  }}
                >
                  03
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 'clamp(16px,1.8vw,20px)',
                    letterSpacing: '-.025em',
                    color: T.ink,
                    lineHeight: 1.3,
                  }}
                >
                  &quot;How long does setup actually take?&quot;
                </h3>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 'clamp(14px,1.5vw,16px)',
                    color: T.body,
                    lineHeight: 1.7,
                  }}
                >
                  If you install it yourself: a few hours over a weekend. If you book a call and want us to
                  handle everything — most clinics are fully live inside five business days, with automations
                  running and ads turned on.
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.teal,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 8l3.5 3.5 6.5-7"
                      stroke="#1F5A40"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Most clinics live in 5 days
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr',
                gap: 0,
                borderTop: `1px solid ${T.hairline}`,
                borderBottom: `1px solid ${T.hairline}`,
                padding: '32px 0',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  paddingRight: 40,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-instrument-serif),Georgia,serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(36px,4vw,56px)',
                    fontWeight: 400,
                    color: T.teal,
                    lineHeight: 1,
                  }}
                >
                  04
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 'clamp(16px,1.8vw,20px)',
                    letterSpacing: '-.025em',
                    color: T.ink,
                    lineHeight: 1.3,
                  }}
                >
                  &quot;What if I&apos;m not tech-savvy?&quot;
                </h3>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 'clamp(14px,1.5vw,16px)',
                    color: T.body,
                    lineHeight: 1.7,
                  }}
                >
                  The system is built to be imported, not coded. If you can use email and a web browser, you
                  can run it. And if you hit a wall at any point, the free strategy call is exactly where we
                  fix that — together, in real time.
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.teal,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 8l3.5 3.5 6.5-7"
                      stroke="#1F5A40"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  No coding, no technical skills needed
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
