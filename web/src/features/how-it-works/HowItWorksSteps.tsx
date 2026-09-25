import { T } from '@/styles/tokens';

export function HowItWorksSteps() {
  return (
    <div
      data-screen-label="Steps"
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
          gap: 14,
        }}
      >
        <div
          className="two"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            gap: 14,
          }}
        >
          <div
            style={{
              background: T.peachBg,
              color: T.peachFg,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
              minHeight: 320,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                Step 01 · Day 0
              </span>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: T.peachFg,
                  color: T.peachBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                1
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 'clamp(28px,3vw,40px)',
                  lineHeight: 1.02,
                  letterSpacing: '-.04em',
                }}
              >
                The strategy call
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                }}
              >
                Thirty minutes. We look at your services, your market, your current numbers, and pick the one
                service line to grow first. No deck. If we&apos;re not the right fit, we say so on the call.
              </p>
            </div>
          </div>
          <div
            style={{
              gridColumn: 'span 2',
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))',
              gap: '24px 32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
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
                We need from you
              </span>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: T.body,
                }}
              >
                Your services and prices. Roughly how many new patients a month today. Where they come from.
                Who answers the phone after 5 pm.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
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
                You leave with
              </span>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: T.body,
                }}
              >
                The service line to grow first, a realistic timeline for your market, and a plain-English plan
                you can use with or without us.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
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
                Who&apos;s on it
              </span>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: T.body,
                }}
              >
                The person who will run your account. Not a salesperson who hands you off afterwards.
              </div>
            </div>
          </div>
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
            style={{
              gridColumn: 'span 2',
              order: -1,
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))',
              gap: '24px 32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
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
                We build
              </span>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: T.body,
                }}
              >
                The landing page and offer, ad campaigns in your own accounts, the follow-up and reminder
                sequence, scripts for your front desk, and the site changes needed so it books.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
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
                You approve
              </span>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: T.body,
                }}
              >
                Every word patients will read, every image, every offer. Two review rounds are built into the
                timeline. Nothing goes live without your sign-off.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
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
                Connected
              </span>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: T.body,
                }}
              >
                Your practice software, Google Business Profile, ad accounts, phone line, and website.
                Everything stays in accounts you own.
              </div>
            </div>
          </div>
          <div
            style={{
              background: T.tealTintBg,
              color: T.teal,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
              minHeight: 320,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                Step 02 · Weeks 1–3
              </span>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: T.teal,
                  color: T.tealTintBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                2
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 'clamp(28px,3vw,40px)',
                  lineHeight: 1.02,
                  letterSpacing: '-.04em',
                }}
              >
                Build the system
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                }}
              >
                Funnel, ads, follow-up, scripts, site changes. Built in your accounts, in your voice, and
                approved by you before a single patient sees it.
              </p>
            </div>
          </div>
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
            style={{
              background: T.lavenderBg,
              color: T.lavenderFg,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
              minHeight: 320,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                Step 03 · Week 3
              </span>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: T.lavenderFg,
                  color: T.lavenderBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                3
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 'clamp(28px,3vw,40px)',
                  lineHeight: 1.02,
                  letterSpacing: '-.04em',
                }}
              >
                Go live
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                }}
              >
                Ads go live, inquiries start, and every one is answered within minutes and booked, whether
                your front desk is open or not.
              </p>
            </div>
          </div>
          <div
            style={{
              gridColumn: 'span 2',
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
              <span>Launch week · live feed</span>
              <span>Sample</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto',
                  gap: 16,
                  padding: '14px 22px',
                  borderBottom: `1px solid ${T.hairline}`,
                  fontSize: 14,
                  alignItems: 'center',
                }}
              >
                <b
                  style={{
                    color: T.caption,
                  }}
                >
                  Mon 6:42 pm
                </b>
                <span>New inquiry · missed call → texted back in 0:31</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.sageFg,
                    background: T.sageBg,
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  Booked Wed 10:00
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto',
                  gap: 16,
                  padding: '14px 22px',
                  borderBottom: `1px solid ${T.hairline}`,
                  fontSize: 14,
                  alignItems: 'center',
                }}
              >
                <b
                  style={{
                    color: T.caption,
                  }}
                >
                  Tue 12:20 pm
                </b>
                <span>Ad form · screened, callback in 4 min</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.sageFg,
                    background: T.sageBg,
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  Booked Thu 9:30
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto',
                  gap: 16,
                  padding: '14px 22px',
                  borderBottom: `1px solid ${T.hairline}`,
                  fontSize: 14,
                  alignItems: 'center',
                }}
              >
                <b
                  style={{
                    color: T.caption,
                  }}
                >
                  Tue 7:12 pm
                </b>
                <span>Website form · replied in 2 min, wants mornings</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.body,
                    background: T.band,
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  Follow-up Wed
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto',
                  gap: 16,
                  padding: '14px 22px',
                  borderBottom: undefined,
                  fontSize: 14,
                  alignItems: 'center',
                }}
              >
                <b
                  style={{
                    color: T.caption,
                  }}
                >
                  Sat 9:05 am
                </b>
                <span>Google Business Profile call · answered</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.sageFg,
                    background: T.sageBg,
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  Booked Mon 8:30
                </span>
              </div>
            </div>
          </div>
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
            style={{
              gridColumn: 'span 2',
              order: -1,
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
              <span>Weekly report · Monday 7:00 am</span>
              <span>Sample</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,150px),1fr))',
              }}
            >
              <div
                style={{
                  padding: 22,
                  borderRight: `1px solid ${T.hairline}`,
                  borderBottom: `1px solid ${T.hairline}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: T.caption,
                    fontWeight: 600,
                  }}
                >
                  Inquiries
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 34,
                    letterSpacing: '-.04em',
                    color: undefined,
                  }}
                >
                  47
                </span>
              </div>
              <div
                style={{
                  padding: 22,
                  borderRight: `1px solid ${T.hairline}`,
                  borderBottom: `1px solid ${T.hairline}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: T.caption,
                    fontWeight: 600,
                  }}
                >
                  Replied in
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 34,
                    letterSpacing: '-.04em',
                    color: undefined,
                  }}
                >
                  2 min
                </span>
              </div>
              <div
                style={{
                  padding: 22,
                  borderRight: `1px solid ${T.hairline}`,
                  borderBottom: `1px solid ${T.hairline}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: T.caption,
                    fontWeight: 600,
                  }}
                >
                  Booked
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 34,
                    letterSpacing: '-.04em',
                    color: undefined,
                  }}
                >
                  29
                </span>
              </div>
              <div
                style={{
                  padding: 22,
                  borderRight: undefined,
                  borderBottom: `1px solid ${T.hairline}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: T.caption,
                    fontWeight: 600,
                  }}
                >
                  Showed
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 34,
                    letterSpacing: '-.04em',
                    color: T.sageFg,
                  }}
                >
                  26
                </span>
              </div>
            </div>
            <div
              style={{
                padding: '16px 22px',
                fontSize: 13,
                color: T.caption,
                fontWeight: 600,
              }}
            >
              Revenue attributed: $48,200 · Ad spend: $3,100 · No clicks, no impressions, ever.
            </div>
          </div>
          <div
            style={{
              background: T.sageBg,
              color: T.sageFg,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
              minHeight: 320,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                Step 04 · Weekly
              </span>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: T.sageFg,
                  color: T.sageBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                4
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 'clamp(28px,3vw,40px)',
                  lineHeight: 1.02,
                  letterSpacing: '-.04em',
                }}
              >
                Report, then improve
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                }}
              >
                One email every Monday: inquiries, reply time, booked, showed, revenue. A 20-minute review
                each month to decide what to scale next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
