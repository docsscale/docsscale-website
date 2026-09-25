import { Reveal } from '@/features/funnel/Reveal';
import { T } from '@/styles/tokens';

export function FunnelProblem() {
  return (
    <div
      id="problem"
      style={{
        background: T.bg,
        padding: 'clamp(56px,7vw,96px) 0',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        <Reveal
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
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
            Why most clinics stop growing
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(30px,4.4vw,58px)',
              lineHeight: 1,
              letterSpacing: '-.04em',
              textWrap: 'balance',
              maxWidth: 780,
            }}
          >
            {'Most clinics are quietly losing patients'}{' '}
            <em
              className="serif-em"
              style={{
                color: '#B4432F',
              }}
            >
              they already paid to get.
            </em>
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: 14,
          }}
        >
          <Reveal>
            <div
              style={{
                background: T.peachBg,
                borderRadius: 24,
                padding: 'clamp(24px,3vw,40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 'clamp(220px,24vw,320px)',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: -16,
                  right: 16,
                  fontFamily: 'var(--font-instrument-serif),Georgia,serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(80px,10vw,140px)',
                  fontWeight: 400,
                  color: 'rgba(138,75,30,.1)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                01
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: T.peachFg,
                    marginBottom: 16,
                  }}
                >
                  After hours
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 'clamp(18px,2.4vw,26px)',
                    letterSpacing: '-.04em',
                    lineHeight: 1.15,
                    color: T.ink,
                    textWrap: 'balance',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {'They call at 7pm.\nYou miss it. They book\nthe clinic down the road.'}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.peachFg,
                  background: 'rgba(138,75,30,.1)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                }}
              >
                You never know they called
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                background: T.tealTintBg,
                borderRadius: 24,
                padding: 'clamp(24px,3vw,40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 'clamp(220px,24vw,320px)',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: -16,
                  right: 16,
                  fontFamily: 'var(--font-instrument-serif),Georgia,serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(80px,10vw,140px)',
                  fontWeight: 400,
                  color: 'rgba(15,95,99,.1)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                02
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: T.teal,
                    marginBottom: 16,
                  }}
                >
                  No-shows
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 'clamp(18px,2.4vw,26px)',
                    letterSpacing: '-.04em',
                    lineHeight: 1.15,
                    color: T.ink,
                    textWrap: 'balance',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {'A new patient books,\nthen ghosts. The slot\nsits empty all day.'}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.teal,
                  background: 'rgba(15,95,99,.1)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                }}
              >
                Ad spend wasted, no recovery
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                background: T.sageBg,
                borderRadius: 24,
                padding: 'clamp(24px,3vw,40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 'clamp(220px,24vw,320px)',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: -16,
                  right: 16,
                  fontFamily: 'var(--font-instrument-serif),Georgia,serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(80px,10vw,140px)',
                  fontWeight: 400,
                  color: 'rgba(31,90,64,.1)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                03
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: T.sageFg,
                    marginBottom: 16,
                  }}
                >
                  Patient drop-off
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 'clamp(18px,2.4vw,26px)',
                    letterSpacing: '-.04em',
                    lineHeight: 1.15,
                    color: T.ink,
                    textWrap: 'balance',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {'A past patient felt better\nand stopped. Nobody\nreached out.'}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.sageFg,
                  background: 'rgba(31,90,64,.1)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                }}
              >
                One text would have brought them back
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              style={{
                background: T.lavenderBg,
                borderRadius: 24,
                padding: 'clamp(24px,3vw,40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 'clamp(220px,24vw,320px)',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: -16,
                  right: 16,
                  fontFamily: 'var(--font-instrument-serif),Georgia,serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(80px,10vw,140px)',
                  fontWeight: 400,
                  color: 'rgba(74,61,117,.1)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                04
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: T.lavenderFg,
                    marginBottom: 16,
                  }}
                >
                  Wasted ad spend
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 'clamp(18px,2.4vw,26px)',
                    letterSpacing: '-.04em',
                    lineHeight: 1.15,
                    color: T.ink,
                    textWrap: 'balance',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {"You're paying for leads\nthat nobody follows up\nfast enough to close."}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.lavenderFg,
                  background: 'rgba(74,61,117,.1)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                }}
              >
                Speed to lead decides who gets the patient
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <div
            style={{
              background: T.ink,
              color: T.bg,
              borderRadius: 20,
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(18px,2.4vw,28px)',
                letterSpacing: '-.03em',
                maxWidth: 600,
              }}
            >
              {'Not a care problem.'}{' '}
              <em
                className="serif-em"
                style={{
                  color: T.peachBg,
                }}
              >
                A system problem.
              </em>{' '}
              {'This fixes it.'}
            </p>
            <a
              href="#form"
              className="cta-btn"
              style={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {'Get the free system '}
              <span className="arr">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
