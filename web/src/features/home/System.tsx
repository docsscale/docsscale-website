import { Placeholder } from '@/components/ui/Placeholder';
import { T } from '@/styles/tokens';
import { StageCard } from './StageCard';
import { SpecialtyText } from './specialty-context';

export function System() {
  return (
    <div
      id="system"
      data-screen-label="System"
      style={{
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
              The system
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
              {'One system, four stages. '}
              <em
                className="serif-accent"
                style={{
                  color: T.teal,
                }}
              >
                Every service belongs to one.
              </em>
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
            Attract the right patients, capture their request, convert it into a booked visit, and keep them
            coming back. One plan, one team.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
            gap: 14,
          }}
        >
          <StageCard
            id="sys-attract-text"
            bg={T.peachBg}
            fg={T.peachFg}
            badge="01 · Attract"
            n={1}
            title="Get in front of patients already looking for what you do."
            body="Paid campaigns around one service line at a time, local search that ranks you for the treatments you want more of, and a social presence planned a month ahead in your voice."
            tags={['Meta & Google ads', 'Local SEO', 'Social media', 'Content']}
          />
          <div
            id="sys-attract-ui"
            style={{
              background: T.surface,
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
              <span>Sponsored · Your Clinic</span>
              <span>Ad preview</span>
            </div>
            <div
              style={{
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  lineHeight: 1.2,
                  letterSpacing: '-.02em',
                }}
              >
                <SpecialtyText field="adHeadline" />
              </div>
              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  minHeight: 180,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <Placeholder placeholder="Ad creative: your team, your rooms" />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: T.body,
                  }}
                >
                  yourclinic.com/new-patients
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.peachFg,
                    background: T.peachBg,
                    padding: '8px 14px',
                    borderRadius: 999,
                  }}
                >
                  Book now
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                alignItems: 'center',
                padding: '12px 22px',
                borderTop: `1px solid ${T.hairline}`,
                fontSize: 12,
                color: T.caption,
              }}
            >
              <span>Ranking for</span>
              <span
                style={{
                  padding: '4px 10px',
                  background: T.band,
                  borderRadius: 999,
                  color: T.body,
                  fontWeight: 600,
                }}
              >
                <SpecialtyText field="service" />
                {' near me'}
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  background: T.band,
                  borderRadius: 999,
                  color: T.body,
                  fontWeight: 600,
                }}
              >
                <SpecialtyText field="service" />
                {' Houston'}
              </span>
            </div>
          </div>
          <div
            id="sys-capture-ui"
            style={{
              background: T.surface,
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
                alignItems: 'center',
                gap: 10,
                padding: '14px 22px',
                borderBottom: `1px solid ${T.hairline}`,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: T.tealTintBg,
                    display: 'block',
                  }}
                />
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: T.tealTintBg,
                    display: 'block',
                  }}
                />
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: T.tealTintBg,
                    display: 'block',
                  }}
                />
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: T.caption,
                  background: T.band,
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontWeight: 600,
                }}
              >
                yourclinic.com/new-patients
              </span>
            </div>
            <div
              style={{
                padding: '26px 22px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
                gap: 20,
                alignItems: 'start',
                flex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 24,
                    lineHeight: 1.05,
                    letterSpacing: '-.03em',
                  }}
                >
                  New patient visit, this week.
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: T.body,
                  }}
                >
                  Tell us what&apos;s going on and a real person from our office texts you back within
                  minutes.
                </p>
                <div
                  style={{
                    fontSize: 12,
                    color: T.caption,
                    fontWeight: 600,
                  }}
                >
                  Most insurance accepted · Self-pay welcome
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    height: 42,
                    border: `1px solid ${T.hairline}`,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: 14,
                    color: T.caption,
                  }}
                >
                  Full name
                </div>
                <div
                  style={{
                    height: 42,
                    border: `1px solid ${T.hairline}`,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: 14,
                    color: T.caption,
                  }}
                >
                  Mobile number
                </div>
                <div
                  style={{
                    height: 42,
                    border: `1px solid ${T.hairline}`,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 12px',
                    fontSize: 14,
                    color: T.caption,
                  }}
                >
                  <span>Preferred time</span>
                  <span>▾</span>
                </div>
                <div
                  style={{
                    height: 46,
                    borderRadius: 999,
                    background: T.teal,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Request my appointment
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 22px',
                borderTop: `1px solid ${T.hairline}`,
                fontSize: 12,
                color: T.caption,
                fontWeight: 600,
              }}
            >
              <span>Missed call? A text goes back in seconds with this page.</span>
              <span>Sample</span>
            </div>
          </div>
          <StageCard
            id="sys-capture-text"
            bg={T.tealTintBg}
            fg={T.tealTintFg}
            badge="02 · Capture"
            n={2}
            title="Turn the click into a request, on any phone, at any hour."
            body="A website built to book, funnels for each service line, forms that ask the right three questions, and a text-back for every call your front desk can't pick up."
            tags={['Website design', 'Funnel & landing pages', 'Booking forms', 'Missed-call text-back']}
          />
          <StageCard
            id="sys-convert-text"
            bg={T.lavenderBg}
            fg={T.lavenderFg}
            badge="03 · Convert"
            n={3}
            title="Answer every inquiry in minutes and move it onto the schedule."
            body="Follow-up in your clinic's voice, booking straight into your practice software, reminders that cut no-shows, and scripts your front desk actually uses."
            tags={['Follow-up sequences', 'Booking', 'Reminders', 'Front-desk scripts']}
          />
          <div
            id="sys-convert-ui"
            style={{
              background: T.surface,
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
              <span>
                {'New inquiry · '}
                <SpecialtyText field="source" />
              </span>
              <span>Tue · 7:12 pm</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: 22,
                flex: 1,
              }}
            >
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
                <SpecialtyText field="inquiry" />
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
                Hi! Yes, we do. This is Maria from the front desk. Are mornings or afternoons better for you?
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
                Mornings.
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
                Thursday 9:30 am with Dr. Hannah is open. Want me to hold it for you?
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
                Yes please.
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
                Booked. Confirmation now, reminder Wednesday evening.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                padding: '12px 22px',
                borderTop: `1px solid ${T.hairline}`,
                fontSize: 12,
                color: T.caption,
                fontWeight: 600,
              }}
            >
              <span>Replied in 2 min · Booked · Reminder scheduled</span>
              <span>Sample</span>
            </div>
          </div>
          <div
            id="sys-retain-ui"
            style={{
              background: T.surface,
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
              <span>Reactivation campaign · Your clinic</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: T.sageFg,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: T.sageFg,
                    display: 'inline-block',
                    animation: 'pulse 1.6s ease-in-out infinite',
                  }}
                />
                Running
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
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
                  Patients not seen in 12+ months
                </span>
                <b>412</b>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
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
                  Invited back, in your name
                </span>
                <b>386</b>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
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
                  Rebooked this month
                </span>
                <b
                  style={{
                    color: T.sageFg,
                  }}
                >
                  31
                </b>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
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
                  {'Due for '}
                  <SpecialtyText field="recall" />
                </span>
                <b>58</b>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: '16px 22px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    fontSize: 12,
                    color: T.caption,
                    fontWeight: 600,
                  }}
                >
                  <span>New review · Google</span>
                  <span>2 min ago</span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      letterSpacing: '.1em',
                      color: T.sageFg,
                    }}
                  >
                    ★★★★★
                  </span>{' '}
                  <span
                    style={{
                      color: T.body,
                    }}
                  >
                    “Booked online in a minute, no wait when I arrived.” · J.M.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <StageCard
            id="sys-retain-text"
            bg={T.sageBg}
            fg={T.sageFg}
            badge="04 · Retain"
            n={4}
            title="Bring patients back, and let happy ones bring the next."
            body="Reactivation for patients who drifted, recall timed to their treatment, review requests after every visit, and referral prompts that don't feel like asks."
            tags={['Reactivation', 'Recall', 'Reviews', 'Referrals']}
          />
        </div>
      </div>
    </div>
  );
}
