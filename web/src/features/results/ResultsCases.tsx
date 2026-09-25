import { T } from '@/styles/tokens';

export function ResultsCases() {
  return (
    <div
      data-screen-label="Cases"
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
              minHeight: 380,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
              }}
            >
              <span>Dental · Austin, TX</span>
              <span>Jan–Jun 2026</span>
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(64px,7vw,110px)',
                  lineHeight: 0.9,
                  letterSpacing: '-.05em',
                }}
              >
                184
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginTop: 12,
                  letterSpacing: '-.02em',
                }}
              >
                new patients booked in six months. 91% showed.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Implants
              </span>
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Full system
              </span>
            </div>
          </div>
          <div
            style={{
              gridColumn: 'span 2',
              order: undefined,
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
                gap: '24px 32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  Situation
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  Two hygienists idle on Fridays. An ad agency reporting clicks. A website that looked fine
                  and booked nothing after 5 pm.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  What we built
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  One implant funnel with three screening questions, Meta and Google campaigns in their own
                  accounts, text-back on every missed call, reminders, and a recall campaign for 412 dormant
                  patients.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  Result
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  184 new patients booked, 167 showed, $48k attributed in the last month measured. Hiring a
                  third hygienist.
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap',
                borderTop: `1px solid ${T.hairline}`,
                paddingTop: 22,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    minHeight: undefined,
                    borderRadius: '50%',
                    background: T.band,
                    border: `1px dashed ${T.hairlineHover}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 4,
                    color: T.caption,
                    fontSize: 10,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    boxSizing: 'border-box',
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
                      fontSize: 15,
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
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: T.body,
                  maxWidth: 520,
                  fontStyle: 'italic',
                }}
              >
                “The weekly report is the only marketing email I actually open.”
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
              gridColumn: 'span 2',
              order: -1,
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
                gap: '24px 32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  Situation
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  Strong Instagram following, weak calendar. DMs answered the next day, if at all. Consult
                  requests leaking to a competitor two blocks away.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  What we built
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  An injectables consult funnel, Instagram and Meta campaigns, DM and form replies within
                  minutes, and a reminder sequence with a same-day reschedule for no-shows.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  Result
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  62 booked consults in the quarter, 54 showed, and a 38% treatment acceptance on first visit.
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap',
                borderTop: `1px solid ${T.hairline}`,
                paddingTop: 22,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    minHeight: undefined,
                    borderRadius: '50%',
                    background: T.band,
                    border: `1px dashed ${T.hairlineHover}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 4,
                    color: T.caption,
                    fontSize: 10,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    boxSizing: 'border-box',
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
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Lauren Ortiz, RN
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: T.caption,
                    }}
                  >
                    Owner, med spa · Scottsdale, AZ
                  </span>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: T.body,
                  maxWidth: 520,
                  fontStyle: 'italic',
                }}
              >
                “Same followers, same budget. The difference was somebody answering at 9 pm.”
              </p>
            </div>
          </div>
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
              minHeight: 380,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
              }}
            >
              <span>Med spa · Scottsdale, AZ</span>
              <span>Q1 2026</span>
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(64px,7vw,110px)',
                  lineHeight: 0.9,
                  letterSpacing: '-.05em',
                }}
              >
                62
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginTop: 12,
                  letterSpacing: '-.02em',
                }}
              >
                booked consults from one injectables campaign.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Injectables
              </span>
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Growth
              </span>
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
              background: T.sageBg,
              color: T.sageFg,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
              minHeight: 380,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
              }}
            >
              <span>Physical therapy · Denver, CO</span>
              <span>Feb–Jul 2026</span>
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(64px,7vw,110px)',
                  lineHeight: 0.9,
                  letterSpacing: '-.05em',
                }}
              >
                2.4×
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginTop: 12,
                  letterSpacing: '-.02em',
                }}
              >
                more post-op evaluations on the same ad budget.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Post-op rehab
              </span>
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Growth
              </span>
            </div>
          </div>
          <div
            style={{
              gridColumn: 'span 2',
              order: undefined,
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
                gap: '24px 32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  Situation
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  Referral-dependent, with a Google Ads account nobody had touched in a year. Web form leads
                  called back the next business day.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  What we built
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  A post-surgery rehab landing page with insurance screening, rebuilt Google campaigns, and a
                  callback within four minutes on every form.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  Result
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  2.4× more evaluations booked, cost per booked visit down 41%, two new referring surgeons who
                  found them through the page.
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap',
                borderTop: `1px solid ${T.hairline}`,
                paddingTop: 22,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    minHeight: undefined,
                    borderRadius: '50%',
                    background: T.band,
                    border: `1px dashed ${T.hairlineHover}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 4,
                    color: T.caption,
                    fontSize: 10,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    boxSizing: 'border-box',
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
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Marcus Lee, DPT
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: T.caption,
                    }}
                  >
                    Owner, physical therapy · Denver, CO
                  </span>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: T.body,
                  maxWidth: 520,
                  fontStyle: 'italic',
                }}
              >
                “Four-minute callbacks did more than the new ads did.”
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
              gridColumn: 'span 2',
              order: -1,
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
                gap: '24px 32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  Situation
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  Eleven years of patients in the practice software, nobody contacted after their last visit.
                  Growth stalled at referrals.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  What we built
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  A reactivation campaign to 640 patients not seen in 12+ months, written in the doctor&apos;s
                  voice, with a review request after every completed visit.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
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
                  Result
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: T.body,
                  }}
                >
                  31 rebooked in month one, 19 new Google reviews, zero ad spend.
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap',
                borderTop: `1px solid ${T.hairline}`,
                paddingTop: 22,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    minHeight: undefined,
                    borderRadius: '50%',
                    background: T.band,
                    border: `1px dashed ${T.hairlineHover}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 4,
                    color: T.caption,
                    fontSize: 10,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    boxSizing: 'border-box',
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
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Dr. Sam Whitfield, DC
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: T.caption,
                    }}
                  >
                    Owner, chiropractic · Tampa, FL
                  </span>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: T.body,
                  maxWidth: 520,
                  fontStyle: 'italic',
                }}
              >
                “Patients we assumed had moved away. They just hadn&apos;t been asked.”
              </p>
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
              minHeight: 380,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
              }}
            >
              <span>Chiropractic · Tampa, FL</span>
              <span>Aug 2026</span>
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(64px,7vw,110px)',
                  lineHeight: 0.9,
                  letterSpacing: '-.05em',
                }}
              >
                31
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginTop: 12,
                  letterSpacing: '-.02em',
                }}
              >
                dormant patients rebooked in the first month. Zero ad spend.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Reactivation
              </span>
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Retain only
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
