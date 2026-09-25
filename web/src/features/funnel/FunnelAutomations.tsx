import { Reveal } from '@/features/funnel/Reveal';
import { T } from '@/styles/tokens';

export function FunnelAutomations() {
  return (
    <div
      id="automations"
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
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: T.tealTintBg,
              color: T.teal,
              fontWeight: 800,
              fontSize: 22,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            17
          </span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 'clamp(18px,2vw,24px)',
              letterSpacing: '-.025em',
            }}
          >
            THE AUTOMATIONS
          </span>
          <span
            className="chip"
            style={{
              background: T.tealTintBg,
              color: T.teal,
            }}
          >
            Runs 24/7 without you
          </span>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))',
            gap: 10,
          }}
        >
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Instant Lead Response
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  01
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Texts new leads back in seconds, day or night.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Missed Call Text Back
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  02
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Instant text on every missed call. Nobody slips through.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Call Attempt Cascade
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  03
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Follows up leads who did not pick up. Automatically.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Call Back Later
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  04
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Reschedules the callback for leads who asked you to try again.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Not Interested Nurture
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  05
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Keeps cold leads warm over time until they are ready.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Booking Confirmations & Reminders
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  06
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Cuts no-shows without lifting a finger.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  No-Show Recovery
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  07
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Wins back patients who miss their slot, same day.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Post-Visit Follow-Up & Reviews
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  08
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Turns every visit into a 5-star Google review request.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Old Patient Reactivation
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  09
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Texts dormant patients and books the ones who are ready.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Referral System
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  10
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Turns current patients into a steady referral stream.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Missed Call Staff Alert
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  11
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Notifies your front desk the moment a call is missed.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  New Patient Intake
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  12
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Sends the health form automatically before the first visit.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Pre-Visit Prep
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  13
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                What to bring, where to park, when to arrive — sent automatically.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  After-Hours Handling
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  14
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Captures every lead who calls when you are closed.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Treatment Plan Follow-Up
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  15
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Recovers patients who did not commit to their plan.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Birthday Workflow
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  16
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Sends a personal birthday message and offer, automatically.
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="acard">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-.01em',
                  }}
                >
                  Insurance Info Collection
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.caption,
                    background: T.band,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  17
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.body,
                  lineHeight: 1.5,
                }}
              >
                Gathers insurance details before the visit. No phone tag.
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
