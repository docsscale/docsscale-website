// Template for the service pages (/services/paid-ads/ …). All copy comes from
// src/content/service-pages.ts; the accent colour is the service's stage.
// The hero is static (no word-by-word rise): a new template must paint its
// main content within the performance target, and the heading is the largest
// thing on a phone screen.
import Link from 'next/link';
import type { ProcessIcon, ServicePage as Page } from '@/content/service-pages';
import { industryHref, SPECIALTIES } from '@/content/specialties';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
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
const section = { padding: 'clamp(56px,7vw,96px) 0' } as const;
const column = { display: 'flex', flexDirection: 'column', gap: 'clamp(28px,3.5vw,40px)' } as const;
const card = {
  background: '#FFFFFF',
  border: `1px solid ${T.hairline}`,
  borderRadius: 28,
  padding: 'clamp(26px,3vw,40px)',
} as const;
const white = '#FFFFFF';

export function ServicePage({ page: p }: { page: Page }) {
  return (
    <>
      <Hero page={p} />
      <Process page={p} />
      <CaseStudy page={p} />
      <Fit page={p} />
      <Faqs page={p} />
      <Industries page={p} />
      <Cta page={p} />
    </>
  );
}

function Hero({ page: p }: { page: Page }) {
  const photo = p.heroPhoto;
  return (
    <div id="top" data-screen-label="Hero" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,64px)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              ...card,
              padding: 'clamp(28px,4vw,52px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              justifyContent: 'space-between',
              minHeight: 360,
            }}
          >
            <span style={{ ...eyebrow, color: T.caption }}>
              {p.stage}
              {' · '}
              {p.name}
            </span>
            <h1
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(36px,4.6vw,64px)',
                lineHeight: 1.02,
                letterSpacing: '-.045em',
                textWrap: 'balance',
              }}
            >
              {p.h1}{' '}
              <em className="serif-accent" style={{ color: p.accentFg }}>
                {p.h1Accent}
              </em>
            </h1>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: T.body, maxWidth: 620 }}>
              {p.intro}
            </p>
          </div>
          {/* The photo tile. On a phone it comes after the text, so the heading and
              intro still paint first and the photo is not the page's main paint. */}
          <div
            style={{
              position: 'relative',
              minHeight: 'clamp(240px,40vw,360px)',
              borderRadius: 28,
              overflow: 'hidden',
              background: p.accentBg,
            }}
          >
            <ResponsiveImage
              src={photo.src}
              sizes={photo.sizes}
              alt={photo.alt}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: photo.position,
              }}
            />
          </div>
        </div>
        <div
          style={{
            background: p.accentBg,
            color: p.accentFg,
            borderRadius: 28,
            padding: 'clamp(18px,2.4vw,24px) clamp(20px,2.4vw,32px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px 20px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ ...eyebrow, marginRight: 4 }}>Works with</span>
          {p.worksWith.map((w) => (
            <Link
              key={w.label}
              href={w.href}
              data-lift="1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 999,
                background: white,
                color: T.ink,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              <span>{w.label}</span>
              <span>→</span>
            </Link>
          ))}
          <Link
            href="/services"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: p.accentFg,
              textDecoration: 'underline',
              marginLeft: 'auto',
            }}
          >
            See all services
          </Link>
        </div>
      </div>
    </div>
  );
}

// Line icons for the process steps and the flow strip, drawn to the site's
// tokens (no image files). Stroke only, so they take the step's accent colour.
const ICON_PATHS: Record<ProcessIcon, string> = {
  target:
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 3.2a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6ZM12 3v2M12 19v2M3 12h2M19 12h2',
  page: 'M5 4.5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1ZM4 8.5h16M7.5 12h5M7.5 15h9',
  megaphone:
    'M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1ZM16.5 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10M7 15l1 5h2',
  reply:
    'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V16A2.5 2.5 0 0 1 4 13.5v-7ZM12 7.5v3l2 1.5',
  refresh: 'M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6M17.7 6.4H21V3M6.3 17.6H3V21',
  chart: 'M4 20h16M7 16V9M12 16V5M17 16v-5',
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM15.5 15.5 20 20',
  calendar:
    'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM4 10h16M8 4v4M16 4v4M9 14.5l2 2 4-4',
};

function Icon({ name, color, size = 24 }: { name: ProcessIcon; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={ICON_PATHS[name]}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// The strip above the steps: the patient's path, left to right, in four stops.
// On a phone it wraps to two rows (styles/layout.css, .service-flow).
function Flow({ page: p }: { page: Page }) {
  return (
    <div
      className="service-flow"
      style={{ ...card, padding: 'clamp(18px,2.4vw,28px) clamp(18px,2.4vw,32px)' }}
    >
      {p.processFlow.map((stop, i) => (
        <div key={stop.label} className="service-flow-stop">
          <span
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: p.accentBg,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon name={stop.icon} color={p.accentFg} size={26} />
          </span>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-.01em', lineHeight: 1.25 }}>
            {stop.label}
          </span>
          {i < p.processFlow.length - 1 ? (
            <svg
              className="service-flow-arrow"
              width="40"
              height="16"
              viewBox="0 0 40 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 8h34M30 2l6 6-6 6"
                stroke={T.hairlineHover}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Process({ page: p }: { page: Page }) {
  return (
    <div data-screen-label="Process" style={{ ...section, background: T.band }}>
      <div className="container" style={column}>
        <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>{p.processHeading}</h2>
        <Flow page={p} />
        <div className="service-steps">
          {p.process.map((step, i) => (
            <div key={step.title} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: p.accentBg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={step.icon} color={p.accentFg} />
                </span>
                <span style={{ ...eyebrow, color: T.caption }}>Step {i + 1}</span>
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 20,
                    letterSpacing: '-.02em',
                    lineHeight: 1.25,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ margin: '8px 0 0', color: T.body, lineHeight: 1.55 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// The service's real case from /results/, copied exactly (content/service-pages.ts).
function CaseStudy({ page: p }: { page: Page }) {
  const c = p.caseStudy;
  const label = { ...eyebrow, letterSpacing: '.06em', color: T.caption } as const;
  return (
    <div data-screen-label="Case study" style={{ padding: 'clamp(56px,7vw,96px) 0 0' }}>
      <div className="container" style={column}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <h2 style={{ ...sectionH2, maxWidth: 700, textWrap: 'balance' }}>{c.heading}</h2>
          <Link href={c.href} style={{ fontSize: 15, fontWeight: 700, color: T.teal }}>
            See the full case →
          </Link>
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
              background: p.accentBg,
              color: p.accentFg,
              borderRadius: 28,
              padding: 'clamp(26px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
              minHeight: 340,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                ...eyebrow,
              }}
            >
              <span>{c.meta}</span>
              <span>{c.period}</span>
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
                {c.stat}
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12, letterSpacing: '-.02em' }}>
                {c.statLine}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '6px 12px',
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
          <div
            style={{
              gridColumn: 'span 2',
              ...card,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={label}>What we built</span>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: T.body }}>{c.built}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={label}>Result</span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 'clamp(18px,1.6vw,22px)',
                    fontWeight: 700,
                    lineHeight: 1.4,
                    letterSpacing: '-.01em',
                  }}
                >
                  {c.result}
                </p>
              </div>
            </div>
            <figure
              style={{
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                paddingTop: 20,
                borderTop: `1px solid ${T.hairline}`,
              }}
            >
              <blockquote
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: T.body,
                  maxWidth: 520,
                  fontStyle: 'italic',
                }}
              >
                {`“${c.quote}”`}
              </blockquote>
              <figcaption style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</span>
                <span style={{ fontSize: 13, color: T.caption }}>{c.role}</span>
              </figcaption>
            </figure>
          </div>
        </div>
        {p.alsoFromResults ? (
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: T.body, maxWidth: 760 }}>
            {p.alsoFromResults.text}{' '}
            <Link href={p.alsoFromResults.href} style={{ color: T.teal, fontWeight: 700 }}>
              Read the case →
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Fit({ page: p }: { page: Page }) {
  const list = (items: string[], mark: string, bg: string, fg: string) => (
    <ul
      style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {items.map((item) => (
        <li
          key={item}
          style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr)', gap: 12, alignItems: 'start' }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              background: bg,
              color: fg,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            {mark}
          </span>
          <span style={{ fontSize: 16, lineHeight: 1.5, color: T.body }}>{item}</span>
        </li>
      ))}
    </ul>
  );
  const h3 = { margin: 0, fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', lineHeight: 1.2 } as const;
  return (
    <div data-screen-label="Fit" style={section}>
      <div className="container" style={column}>
        <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>
          Who it suits, and who it doesn’t.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 14,
          }}
        >
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={h3}>{p.fit.heading}</h3>
            {list(p.fit.items, '✓', p.accentBg, p.accentFg)}
          </div>
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={h3}>{p.notFit.heading}</h3>
            {list(p.notFit.items, '–', T.band, T.body)}
          </div>
        </div>
      </div>
    </div>
  );
}

// The page's FAQPage schema is built from the same list, so the two match.
function Faqs({ page: p }: { page: Page }) {
  return (
    <div data-screen-label="FAQ" style={{ ...section, background: T.band }}>
      <div className="container" style={column}>
        <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>What clinic owners ask us.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${T.hairlineHover}` }}>
          {p.faqs.map((f, i) => (
            <div
              key={f.q}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
                gap: '12px 40px',
                padding: '22px 0',
                borderBottom: i < p.faqs.length - 1 ? `1px solid ${T.hairlineHover}` : undefined,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 17,
                  lineHeight: 1.35,
                  letterSpacing: '-.01em',
                }}
              >
                {f.q}
              </h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.body }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// The four industry pages, each with what this service does for that specialty
// (the matching card from specialties.ts, so the two never disagree).
function Industries({ page: p }: { page: Page }) {
  const match = (title: string) => title.toLowerCase().includes('paid');
  return (
    <div data-screen-label="Industries" style={{ padding: 'clamp(56px,7vw,96px) 0 0' }}>
      <div className="container" style={column}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <h2 style={{ ...sectionH2, maxWidth: 700, textWrap: 'balance' }}>{p.industriesHeading}</h2>
          <Link href="/industries" style={{ fontSize: 15, fontWeight: 700, color: T.teal }}>
            All industries →
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))',
            gap: 14,
          }}
        >
          {SPECIALTIES.map((s) => {
            const service = s.services.find((x) => match(x.title));
            return (
              <Link
                key={s.slug}
                href={industryHref(s.slug)}
                data-lift="1"
                style={{
                  ...card,
                  padding: 26,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  color: T.ink,
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.02em' }}>
                  {s.name}
                  {' →'}
                </span>
                {service ? (
                  <span style={{ fontSize: 14, lineHeight: 1.55, color: T.body }}>{service.body}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Cta({ page: p }: { page: Page }) {
  return (
    <div data-screen-label="CTA" style={section}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 640 }}>
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(30px,3.8vw,52px)',
                lineHeight: 1,
                letterSpacing: '-.04em',
              }}
            >
              {p.ctaHeading}
            </h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, opacity: 0.75 }}>
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
                background: p.accentFg,
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
