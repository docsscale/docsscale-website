import { Reveal } from '@/features/funnel/Reveal';
import { T } from '@/styles/tokens';

export function FunnelProof() {
  return (
    <div
      id="proof"
      style={{
        background: T.band,
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
            gap: 10,
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
            What clinic owners say
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(26px,3.6vw,44px)',
              lineHeight: 1.05,
              letterSpacing: '-.04em',
            }}
          >
            Results from clinics using the system
          </h2>
        </Reveal>
        <Reveal>
          <div id="review-grid">
            <div className="rcard">
              <span className="rstars">★★★★★</span>
              <p
                className="rquote"
                style={{
                  fontSize: 19,
                }}
              >
                {'"'}
                {
                  "We were losing patients every evening and didn't even know it. The missed-call automation alone filled our calendar within the first two weeks. I genuinely can't believe it's free."
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.sageBg,
                    color: T.sageFg,
                  }}
                >
                  CM
                </span>
                <div>
                  <div className="rname">Dr. Carlos Mendez</div>
                  <div className="rsub">Chiropractic · San Antonio, TX</div>
                </div>
              </div>
            </div>
            <div className="rcard dark">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span className="rstat">+31</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: 'rgba(250,249,246,.8)',
                  }}
                >
                  patients reactivated in month one
                </span>
              </div>
              <p
                className="rquote"
                style={{
                  fontSize: 16,
                }}
              >
                {'"'}
                {
                  "These were people already in our system. We just weren't reaching out. One automation changed that."
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.lavenderFg,
                    color: T.bg,
                  }}
                >
                  RT
                </span>
                <div>
                  <div className="rname">Dr. Rachel Thompson</div>
                  <div className="rsub">Med Spa · Miami, FL</div>
                </div>
              </div>
            </div>
            <div className="rcard">
              <span className="rstars">★★★★★</span>
              <p
                className="rquote"
                style={{
                  fontSize: 18,
                }}
              >
                {'"'}
                {
                  "I thought setup would take months. It was running in a week. Our front desk stopped chasing patients who hadn't come back — the system does it for them."
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.peachBg,
                    color: T.peachFg,
                  }}
                >
                  JN
                </span>
                <div>
                  <div className="rname">Dr. James Nguyen</div>
                  <div className="rsub">Dental · San Jose, CA</div>
                </div>
              </div>
            </div>
            <div className="rcard teal">
              <span className="rstars">★★★★★</span>
              <p
                className="rquote"
                style={{
                  fontSize: 17,
                }}
              >
                {'"'}
                {
                  "The no-show recovery sequence is the thing I didn't know I needed. We were just absorbing those empty slots. Now we fill most of them the same day."
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.teal,
                    color: '#FFFFFF',
                  }}
                >
                  DB
                </span>
                <div>
                  <div className="rname">Dr. Daniel Brooks</div>
                  <div className="rsub">Physical Therapy · Nashville, TN</div>
                </div>
              </div>
            </div>
            <div className="rcard">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span className="rstat">4.9★</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: T.body,
                  }}
                >
                  Google rating after 6 weeks
                </span>
              </div>
              <p
                className="rquote"
                style={{
                  fontSize: 16,
                }}
              >
                {'"'}
                {
                  'The review funnel runs quietly in the background. We went from 38 reviews to 94 without asking a single patient ourselves.'
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.lavenderBg,
                    color: T.lavenderFg,
                  }}
                >
                  BK
                </span>
                <div>
                  <div className="rname">Dr. Brian Kim</div>
                  <div className="rsub">Dental · Seattle, WA</div>
                </div>
              </div>
            </div>
            <div className="rcard sand">
              <span className="rstars">★★★★★</span>
              <p
                className="rquote"
                style={{
                  fontSize: 17,
                }}
              >
                {'"'}
                {
                  'After-hours was our biggest gap. Patients would call at 7pm and just never call back. Now every after-hours call gets a text back immediately and most of them book.'
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.peachFg,
                    color: '#FFFFFF',
                  }}
                >
                  MJ
                </span>
                <div>
                  <div className="rname">Dr. Melissa Johnson</div>
                  <div className="rsub">Med Spa · Atlanta, GA</div>
                </div>
              </div>
            </div>
            <div className="rcard dark">
              <span className="rstars">★★★★★</span>
              <p
                className="rquote"
                style={{
                  fontSize: 18,
                }}
              >
                {'"'}
                {
                  "I've tried three other marketing agencies and none of them gave us something this complete on day one. The fact that it's free makes me think I'm missing something — I'm not. It just works."
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.sageFg,
                    color: '#FFFFFF',
                  }}
                >
                  PS
                </span>
                <div>
                  <div className="rname">Dr. Priya Shah</div>
                  <div className="rsub">Chiropractic · Phoenix, AZ</div>
                </div>
              </div>
            </div>
            <div className="rcard">
              <span className="rstars">★★★★★</span>
              <p
                className="rquote"
                style={{
                  fontSize: 17,
                }}
              >
                {'"'}
                {
                  "The intake automation saved us hours every week. Forms come in before the patient even arrives. Our staff was skeptical — now they won't go back."
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.tealTintBg,
                    color: T.teal,
                  }}
                >
                  JM
                </span>
                <div>
                  <div className="rname">Dr. Jessica Morgan</div>
                  <div className="rsub">Dental · Charlotte, NC</div>
                </div>
              </div>
            </div>
            <div className="rcard teal">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span className="rstat">$0</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: T.teal,
                  }}
                >
                  cost to get the system running
                </span>
              </div>
              <p
                className="rquote"
                style={{
                  fontSize: 16,
                }}
              >
                {'"'}
                {
                  'We had a full automation stack live inside GoHighLevel within a week of claiming this. The ROI on free is hard to argue with.'
                }
                {'"'}
              </p>
              <div className="rmeta">
                <span
                  className="ravatar"
                  style={{
                    background: T.teal,
                    color: '#FFFFFF',
                  }}
                >
                  MR
                </span>
                <div>
                  <div className="rname">Dr. Marcus Reynolds</div>
                  <div className="rsub">Dental · Houston, TX</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
