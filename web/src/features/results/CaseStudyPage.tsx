// Template for the full case study pages (/results/<slug>/). All copy comes
// from src/content/case-studies.ts; the accent colour is the stage the case
// turns on. The hero is static, like the service pages, so the heading paints
// within the performance target on a phone.
import Link from 'next/link';
import type { CaseStudy as Case } from '@/content/case-studies';
import { STAGE_COLORS, T } from '@/styles/tokens';

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
const h3 = { margin: 0, fontWeight: 800, fontSize: 19, lineHeight: 1.3, letterSpacing: '-.015em' } as const;
const body = { margin: 0, fontSize: 15, lineHeight: 1.6, color: T.body } as const;
const white = '#FFFFFF';

// The four stops of the journey diagram, drawn with the same strokes as the
// service pages' process strip.
const ICON_PATHS: Record<Case['journey']['stages'][number]['icon'], string> = {
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM15.5 15.5 20 20',
  page: 'M5 4.5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1ZM4 8.5h16M7.5 12h5M7.5 15h9',
  calendar:
    'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM4 10h16M8 4v4M16 4v4M9 14.5l2 2 4-4',
  refresh: 'M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6M17.7 6.4H21V3M6.3 17.6H3V21',
};

function Icon({ name, color, size = 26 }: { name: keyof typeof ICON_PATHS; color: string; size?: number }) {
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

// The journey as a strip: four stops, left to right, each in its stage colour.
// Reuses the service pages' .service-flow layout (two rows on a phone).
function JourneyFlow({ cs }: { cs: Case }) {
  return (
    <div
      className="service-flow"
      style={{ ...card, padding: 'clamp(18px,2.4vw,28px) clamp(18px,2.4vw,32px)' }}
    >
      {cs.journey.stages.map((s, i) => {
        const colour = STAGE_COLORS[s.stage];
        return (
          <div key={s.stage} className="service-flow-stop">
            <span
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: colour.bg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon name={s.icon} color={colour.fg} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ ...eyebrow, letterSpacing: '.06em', color: colour.fg }}>{s.label}</span>
              <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-.01em', lineHeight: 1.25 }}>
                {s.title}
              </span>
            </span>
            {i < cs.journey.stages.length - 1 ? (
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
        );
      })}
    </div>
  );
}

export function CaseStudyPage({ cs }: { cs: Case }) {
  return (
    <>
      <Hero cs={cs} />
      <Starting cs={cs} />
      <Journey cs={cs} />
      <Timeline cs={cs} />
      <Quote cs={cs} />
      <Lessons cs={cs} />
      <Faqs cs={cs} />
      <Cta cs={cs} />
    </>
  );
}

function Hero({ cs }: { cs: Case }) {
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
              Case study · {cs.specialty} · {cs.city}
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
              {cs.h1}{' '}
              <em className="serif-accent" style={{ color: cs.accentFg }}>
                {cs.h1Accent}
              </em>
            </h1>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: T.body, maxWidth: 620 }}>
              {cs.intro}
            </p>
          </div>
          <dl
            className="service-hero-graphic"
            style={{
              margin: 0,
              background: cs.accentBg,
              color: cs.accentFg,
              borderRadius: 28,
              padding: 'clamp(24px,3vw,36px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {cs.facts.map((f) => (
              <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <dt style={{ ...eyebrow, letterSpacing: '.06em', opacity: 0.8 }}>{f.label}</dt>
                <dd style={{ margin: 0, fontSize: 15, lineHeight: 1.45, fontWeight: 600 }}>{f.value}</dd>
              </div>
            ))}
            {cs.website && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <dt style={{ ...eyebrow, letterSpacing: '.06em', opacity: 0.8 }}>Website</dt>
                <dd style={{ margin: 0, fontSize: 15, lineHeight: 1.45, fontWeight: 700 }}>
                  <a href={cs.website.href} rel="noopener" target="_blank" style={{ color: 'inherit' }}>
                    {cs.website.label} ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

function Starting({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="Starting point" style={{ ...section, background: T.band }}>
      <div className="container" style={column}>
        <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>{cs.starting.heading}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760 }}>
          {cs.starting.paragraphs.map((p) => (
            <p key={p} style={{ ...body, fontSize: 17, lineHeight: 1.55 }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Journey({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="Journey" style={section}>
      <div className="container" style={column}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>{cs.journey.heading}</h2>
          <p style={{ ...body, fontSize: 17, maxWidth: 760 }}>{cs.journey.intro}</p>
        </div>
        <JourneyFlow cs={cs} />
        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))',
            gap: 14,
          }}
        >
          {cs.journey.stages.map((s, i) => {
            const colour = STAGE_COLORS[s.stage];
            return (
              <li key={s.stage} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ ...eyebrow, letterSpacing: '.06em', color: colour.fg }}>
                  {i + 1} · {s.label}
                </span>
                <h3 style={h3}>{s.title}</h3>
                <p style={body}>{s.body}</p>
              </li>
            );
          })}
        </ol>
        <p style={{ ...body, maxWidth: 760 }}>
          The four stages are explained on{' '}
          <Link href="/how-it-works/" style={{ color: T.teal, fontWeight: 700 }}>
            How it works
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function Timeline({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="Timeline" style={{ ...section, background: T.band }}>
      <div className="container" style={column}>
        <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>{cs.timeline.heading}</h2>
        <ol className="case-timeline" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {cs.timeline.steps.map((s, i) => (
            <li key={s.when} style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: cs.accentFg,
                    border: `4px solid ${cs.accentBg}`,
                    flex: 'none',
                  }}
                />
                {i < cs.timeline.steps.length - 1 ? (
                  <span
                    className="case-timeline-line"
                    aria-hidden="true"
                    style={{ flex: 1, height: 2, background: T.hairlineHover, borderRadius: 1 }}
                  />
                ) : null}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 24 }}>
                <span style={{ ...eyebrow, color: cs.accentFg }}>{s.when}</span>
                <h3 style={h3}>{s.title}</h3>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '4px 0' }}>
                  {s.sources.map((src) => (
                    <span
                      key={src}
                      style={{
                        padding: '5px 11px',
                        borderRadius: 999,
                        background: white,
                        border: `1px solid ${T.hairline}`,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {src}
                    </span>
                  ))}
                </div>
                <p style={body}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p style={{ ...body, fontSize: 13, color: T.caption, maxWidth: 760 }}>
          The chips show where new patients came from in each stretch, as the owner described it.
        </p>
      </div>
    </div>
  );
}

function Quote({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="Quote" style={section}>
      <div className="container">
        <figure
          style={{
            margin: 0,
            background: cs.accentBg,
            color: cs.accentFg,
            borderRadius: 28,
            padding: 'clamp(28px,4vw,52px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <blockquote
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 'clamp(20px,2.2vw,30px)',
              lineHeight: 1.35,
              letterSpacing: '-.02em',
              maxWidth: 900,
              textWrap: 'balance',
            }}
          >
            {`“${cs.quote.text}”`}
          </blockquote>
          <figcaption style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{cs.quote.name}</span>
            <span style={{ fontSize: 13, opacity: 0.85 }}>{cs.quote.role}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

function Lessons({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="Lessons" style={{ ...section, paddingTop: 0 }}>
      <div className="container" style={column}>
        <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>{cs.lessons.heading}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 14,
          }}
        >
          {cs.lessons.items.map((it) => (
            <div key={it.title} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={h3}>{it.title}</h3>
              <p style={body}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Faqs({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="FAQ" style={{ ...section, background: T.band }}>
      <div className="container" style={column}>
        <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>What chiropractors ask us.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${T.hairlineHover}` }}>
          {cs.faqs.map((f, i) => (
            <div
              key={f.q}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
                gap: '12px 40px',
                padding: '22px 0',
                borderBottom: i < cs.faqs.length - 1 ? `1px solid ${T.hairlineHover}` : undefined,
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
              <p style={body}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cta({ cs }: { cs: Case }) {
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
              {cs.ctaHeading}
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
                background: cs.accentFg,
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
