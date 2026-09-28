import { AnimatedHeading } from '@/features/motion/AnimatedHeading';
import { TEAM } from '@/content/about';
import { SITE } from '@/content/site';
import { T } from '@/styles/tokens';
import { SPECIALTIES } from '@/content/specialties';
export function AboutHero() {
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
            minHeight: 420,
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
            About
          </span>
          <AnimatedHeading
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(38px,5vw,72px)',
              lineHeight: 1,
              letterSpacing: '-.045em',
              textWrap: 'balance',
            }}
          >
            {'We only work with clinics. '}
            <em
              className="serif-accent"
              style={{
                color: T.teal,
              }}
            >
              On purpose.
            </em>
          </AnimatedHeading>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.5,
              color: T.body,
              maxWidth: 600,
            }}
          >
            DocsScale started after watching good practices lose evening calls to voicemail while paying for
            ads to bring in more of them. Fixing what happens after someone reaches out comes first. Ads come
            second, and only once the front desk can hold what they bring in.
          </p>
        </div>
        <div
          style={{
            gridRow: 'span 2',
            borderRadius: 28,
            overflow: 'hidden',
            minHeight: 420,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              minHeight: 120,
              borderRadius: 20,
              background: T.band,
              border: `1px dashed ${T.hairlineHover}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 16,
              color: T.caption,
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.4,
              boxSizing: 'border-box',
            }}
          >
            Founder photo, real, in the office
          </div>
          <div
            style={{
              position: 'absolute',
              left: 16,
              bottom: 16,
              background: '#FFFFFF',
              borderRadius: 14,
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 600,
              pointerEvents: 'none',
            }}
          >
            {`${TEAM[0]!.name} · ${TEAM[0]!.role}`}
          </div>
        </div>
        <div
          data-lift="1"
          style={{
            background: T.peachBg,
            color: T.peachFg,
            borderRadius: 28,
            padding: 26,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 12,
            minHeight: 180,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.06em',
            }}
          >
            Founded
          </span>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 44,
                letterSpacing: '-.04em',
                lineHeight: 1,
              }}
            >
              {SITE.founded}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginTop: 6,
              }}
            >
              Houston, Texas
            </div>
          </div>
        </div>
        <div
          data-lift="1"
          style={{
            background: T.tealTintBg,
            color: T.teal,
            borderRadius: 28,
            padding: 26,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 12,
            minHeight: 180,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.06em',
            }}
          >
            Focus
          </span>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 44,
                letterSpacing: '-.04em',
                lineHeight: 1,
              }}
            >
              {/* One per specialty page: dental, chiropractic, physical therapy, med spa. */}
              {SPECIALTIES.length}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginTop: 6,
              }}
            >
              clinic specialties, nothing else
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
