import { T } from '@/styles/tokens';

export function HowItWorksPromises() {
  return (
    <div
      data-screen-label="Promises"
      style={{
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
        <h2
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(32px,4vw,56px)',
            lineHeight: 1,
            letterSpacing: '-.04em',
            maxWidth: 760,
            textWrap: 'balance',
          }}
        >
          {"Things we won't do, "}
          <em
            className="serif-accent"
            style={{
              color: T.peachFg,
            }}
          >
            in writing.
          </em>
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 14,
          }}
        >
          <div
            data-lift="1"
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
                width: 36,
                height: 36,
                borderRadius: 12,
                background: T.peachBg,
                color: T.peachFg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              ✕
            </span>
            <div
              style={{
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: '-.02em',
              }}
            >
              Report clicks or impressions
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: T.body,
              }}
            >
              You&apos;ll see inquiries, booked, showed and revenue. If a number doesn&apos;t change your
              schedule, it isn&apos;t in the report.
            </p>
          </div>
          <div
            data-lift="1"
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
                width: 36,
                height: 36,
                borderRadius: 12,
                background: T.tealTintBg,
                color: T.teal,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              ✕
            </span>
            <div
              style={{
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: '-.02em',
              }}
            >
              Lock you in
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: T.body,
              }}
            >
              Month to month, 30 days&apos; notice. Ad accounts, pages, numbers and data are yours on day one
              and the day you leave.
            </p>
          </div>
          <div
            data-lift="1"
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
                width: 36,
                height: 36,
                borderRadius: 12,
                background: T.lavenderBg,
                color: T.lavenderFg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              ✕
            </span>
            <div
              style={{
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: '-.02em',
              }}
            >
              Run discount specials
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: T.body,
              }}
            >
              Coupons attract coupon shoppers. We screen for fit and lead with the visit, not the price.
            </p>
          </div>
          <div
            data-lift="1"
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
                width: 36,
                height: 36,
                borderRadius: 12,
                background: T.sageBg,
                color: T.sageFg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              ✕
            </span>
            <div
              style={{
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: '-.02em',
              }}
            >
              Publish anything you haven&apos;t approved
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: T.body,
              }}
            >
              Every ad, page, post and text patients see gets your sign-off first. Compliance rules for your
              specialty are baked into the review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
