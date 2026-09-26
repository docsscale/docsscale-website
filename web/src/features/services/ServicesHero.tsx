import { SplitWords } from '@/features/motion/SplitWords';
import { T } from '@/styles/tokens';
export function ServicesHero() {
  return (
    <div
      id="top"
      data-screen-label="Hero"
      style={{
        padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,64px)',
      }}
    >
      <div
        data-hero-rise=""
        className="two container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
          gap: 14,
        }}
      >
        <div
          style={{
            gridColumn: 'span 2',
            background: '#FFFFFF',
            border: `1px solid ${T.hairline}`,
            borderRadius: 28,
            padding: 'clamp(28px,4vw,52px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            justifyContent: 'space-between',
            minHeight: 360,
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
            Services
          </span>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(38px,5vw,72px)',
              lineHeight: 1,
              letterSpacing: '-.045em',
              textWrap: 'balance',
            }}
          >
            <SplitWords>
              {'Eight services. One team accountable for '}
              <em
                className="serif-accent"
                style={{
                  color: T.teal,
                }}
              >
                the number on your schedule.
              </em>
            </SplitWords>
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.5,
              color: T.body,
              maxWidth: 560,
            }}
          >
            Every service below belongs to one of four stages. Take the whole system, or start with the stage
            that&apos;s leaking most. Either way, we report in booked appointments and patients who showed.
          </p>
        </div>
        <div
          style={{
            background: T.tealTintBg,
            color: T.teal,
            borderRadius: 28,
            padding: 'clamp(24px,3vw,36px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 20,
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
            Jump to a stage
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <a
              data-lift="1"
              href="#attract"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 14,
                background: T.peachBg,
                color: T.peachFg,
                fontWeight: 700,
              }}
            >
              <span>01 · Attract</span>
              <span>3 services →</span>
            </a>
            <a
              data-lift="1"
              href="#capture"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 14,
                background: '#FFFFFF',
                color: T.teal,
                fontWeight: 700,
              }}
            >
              <span>02 · Capture</span>
              <span>2 services →</span>
            </a>
            <a
              data-lift="1"
              href="#convert"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 14,
                background: T.lavenderBg,
                color: T.lavenderFg,
                fontWeight: 700,
              }}
            >
              <span>03 · Convert</span>
              <span>1 service →</span>
            </a>
            <a
              data-lift="1"
              href="#retain"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 14,
                background: T.sageBg,
                color: T.sageFg,
                fontWeight: 700,
              }}
            >
              <span>04 · Retain</span>
              <span>2 services →</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
