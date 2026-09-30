// Template for the four industry pages (/industries/dental/ …). All copy comes
// from src/content/specialties.ts; each specialty has its own accent colour.
import { AnimatedHeading } from '@/features/motion/AnimatedHeading';
import Link from 'next/link';
import { industryHref, SPECIALTIES, type Specialty } from '@/content/specialties';
import { T } from '@/styles/tokens';
const eyebrow = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
} as const;
const sectionH2 = {
  margin: 0,
  fontWeight: 800,
  fontSize: 'clamp(32px,4vw,56px)',
  lineHeight: 1,
  letterSpacing: '-.04em',
} as const;
const white = '#FFFFFF';
export function SpecialtyPage({ specialty: s }: { specialty: Specialty }) {
  const lower = s.name.toLowerCase();
  return (
    <>
      <Hero specialty={s} />
      <PainPoints specialty={s} lower={lower} />
      <System specialty={s} lower={lower} />
      <Services specialty={s} lower={lower} />
      <Cta specialty={s} lower={lower} />
    </>
  );
}
function Hero({ specialty: s }: { specialty: Specialty }) {
  const others = SPECIALTIES.filter((o) => o.slug !== s.slug);
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
            background: white,
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
              ...eyebrow,
              color: T.caption,
            }}
          >
            {'For '}
            {s.name}
            {' Practices'}
          </span>
          <AnimatedHeading
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(36px,4.6vw,64px)',
              lineHeight: 1.02,
              letterSpacing: '-.045em',
              textWrap: 'balance',
            }}
          >
            {s.h1}{' '}
            <em
              className="serif-accent"
              style={{
                color: s.accentFg,
              }}
            >
              {s.h1Accent}
            </em>
          </AnimatedHeading>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.5,
              color: T.body,
              maxWidth: 560,
            }}
          >
            {s.intro}
          </p>
        </div>
        <div
          style={{
            background: s.accentBg,
            color: s.accentFg,
            borderRadius: 28,
            padding: 'clamp(24px,3vw,36px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <span style={eyebrow}>Also serving</span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {others.map((o) => (
              <Link
                key={o.slug}
                href={industryHref(o.slug)}
                data-lift="1"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: white,
                  color: T.ink,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                <span>{o.name}</span>
                <span>→</span>
              </Link>
            ))}
          </div>
          <Link
            href="/services"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: s.accentFg,
              textDecoration: 'underline',
            }}
          >
            See all services
          </Link>
        </div>
      </div>
    </div>
  );
}
function PainPoints({ specialty: s, lower }: { specialty: Specialty; lower: string }) {
  const divider = `1px solid ${T.hairlineHover}`;
  return (
    <div
      data-screen-label="Pain points"
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
          gap: 'clamp(28px,3.5vw,40px)',
        }}
      >
        <h2
          style={{
            ...sectionH2,
            maxWidth: 760,
            textWrap: 'balance',
          }}
        >
          {'Why '}
          {lower}
          {' practices plateau.'}
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: divider,
          }}
        >
          {s.painPoints.map((point, i) => (
            <div
              key={point.title}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px minmax(0,1fr)',
                gap: 20,
                padding: '24px 0',
                borderBottom: i < s.painPoints.length - 1 ? divider : undefined,
                alignItems: 'start',
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: s.accentBg,
                  color: s.accentFg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                {i + 1}
              </span>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 20,
                    letterSpacing: '-.02em',
                  }}
                >
                  {point.title}
                </div>
                <p
                  style={{
                    margin: '6px 0 0',
                    color: T.body,
                    lineHeight: 1.55,
                  }}
                >
                  {point.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function System({ specialty: s, lower }: { specialty: Specialty; lower: string }) {
  return (
    <div
      data-screen-label="System"
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
            ...sectionH2,
            maxWidth: 760,
            textWrap: 'balance',
          }}
        >
          {'The system, built for '}
          {lower}
          {'.'}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 14,
          }}
        >
          {s.stages.map((stage, i) => (
            <div
              key={stage.label}
              data-lift="1"
              style={{
                background: s.accentBg,
                color: s.accentFg,
                borderRadius: 28,
                padding: 26,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 20,
                minHeight: 280,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                <span>
                  {`0${i + 1}`}
                  {' · '}
                  {stage.label}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 19,
                    letterSpacing: '-.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {stage.title}
                </div>
                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {stage.body}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                }}
              >
                {stage.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 999,
                      background: white,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Services({ specialty: s, lower }: { specialty: Specialty; lower: string }) {
  return (
    <div
      data-screen-label="Services"
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
          gap: 'clamp(28px,3.5vw,40px)',
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
          <h2
            style={{
              ...sectionH2,
              maxWidth: 700,
            }}
          >
            {'Where '}
            {lower}
            {' clinics get the most out of the system.'}
          </h2>
          <Link
            href="/services"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: T.teal,
            }}
          >
            See all 8 services →
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))',
            gap: 14,
          }}
        >
          {s.services.map((service) => (
            <div
              key={service.title}
              data-lift="1"
              style={{
                background: white,
                border: `1px solid ${T.hairline}`,
                borderRadius: 28,
                padding: 26,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 19,
                  letterSpacing: '-.02em',
                }}
              >
                {service.title}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: T.body,
                }}
              >
                {service.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Cta({ specialty: s, lower }: { specialty: Specialty; lower: string }) {
  return (
    <div
      data-screen-label="CTA"
      style={{
        padding: 'clamp(56px,7vw,96px) 0',
      }}
    >
      <div className="container">
        <div
          style={{
            background: T.ink,
            color: T.bg,
            borderRadius: 28,
            padding: 'clamp(28px,4vw,52px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              maxWidth: 640,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(30px,3.8vw,52px)',
                lineHeight: 1,
                letterSpacing: '-.04em',
              }}
            >
              {"Let's look at your "}
              {lower}
              {' numbers.'}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.5,
                opacity: 0.75,
              }}
            >
              A free 30-minute strategy call. Bring your numbers, leave with a plan.
            </p>
          </div>
          <Link
            data-lift="1"
            href="/book-a-call"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              height: 56,
              padding: '0 8px 0 26px',
              background: T.bg,
              color: T.ink,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 15,
              whiteSpace: 'nowrap',
            }}
          >
            Book a strategy call
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: s.accentFg,
                color: white,
              }}
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
