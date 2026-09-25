import { T } from '@/styles/tokens';

export function ThankYouHero() {
  return (
    <div
      style={{
        padding: 'clamp(56px,8vw,100px) 0 clamp(40px,5vw,64px)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: T.sageBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M7 19l7 7 15-15"
              stroke="#1F5A40"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: T.sageBg,
            color: T.sageFg,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: T.sageFg,
            }}
          />
          YOU ARE IN
        </span>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(36px,5.5vw,72px)',
            lineHeight: 0.97,
            letterSpacing: '-.05em',
            textWrap: 'balance',
          }}
        >
          Check your email.
          <br />
          <em
            className="serif-em"
            style={{
              color: T.teal,
            }}
          >
            The system is on its way.
          </em>
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(16px,2vw,19px)',
            lineHeight: 1.6,
            color: T.body,
            maxWidth: 560,
            textWrap: 'pretty',
          }}
        >
          We have sent the full GoHighLevel system to your inbox. 6 funnels, 17 automations, full CRM setup —
          all yours.
        </p>
        <div
          style={{
            width: '100%',
            marginTop: 8,
          }}
        >
          {/* The live HTML was hand-edited to show the hero mockup here instead of the
              "DELIVERY GRAPHIC" placeholder; the rebuild keeps the image everywhere. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, same file as the landing hero */}
          <img
            src="/free-system/images/hero-mockup.jpg"
            alt="GoHighLevel funnels, CRM dashboard, and automations mockup"
            style={{
              width: '100%',
              aspectRatio: '16/10',
              borderRadius: 20,
              display: 'block',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </div>
  );
}
