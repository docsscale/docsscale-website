// Template for the full case study pages (/results/<slug>/). All copy comes
// from src/content/case-studies.ts; the accent colour is the stage the case
// turns on. The page is built to be scanned: a numbers panel in the hero, the
// journey as four stage cards with a patient's path under them, a timeline,
// the client's words, then the free system and the two ways to act on it.
// The hero is static, like the service pages, so the heading paints within
// the performance target on a phone.
import Link from 'next/link';
import type { CaseStudy as Case } from '@/content/case-studies';
import { FUNNELS } from '@/content/funnel';
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
const STAGE_LIST = Object.values(STAGE_COLORS);
const pill = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  height: 52,
  padding: '0 24px',
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 15,
  whiteSpace: 'nowrap',
} as const;

// The two ways to act on the page, in the order the owner asked for: claim
// the free system first, book a call second. `dark` is for the ink CTA band.
function Actions({ accent, dark }: { accent: string; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <Link
        data-lift="1"
        href="/free-system/"
        style={{
          ...pill,
          paddingRight: 8,
          background: dark ? T.bg : T.ink,
          color: dark ? T.ink : T.bg,
        }}
      >
        Claim the free system
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: accent,
            color: white,
          }}
        >
          →
        </span>
      </Link>
      <Link
        data-lift="1"
        href="/book-a-call"
        style={{
          ...pill,
          background: 'transparent',
          color: dark ? T.bg : T.ink,
          border: `1.5px solid ${dark ? 'rgba(250,249,246,.4)' : T.hairlineHover}`,
        }}
      >
        Book a strategy call
      </Link>
    </div>
  );
}

// Stage icons, drawn with the same strokes as the service pages' process strip.
const ICON_PATHS: Record<Case['journey']['stages'][number]['icon'], string> = {
  megaphone:
    'M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1ZM16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10',
  chat: 'M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM8 9.5h8M8 12.5h5',
  calendar:
    'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM4 10h16M8 4v4M16 4v4M9 14.5l2 2 4-4',
  refresh: 'M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6M17.7 6.4H21V3M6.3 17.6H3V21',
};

function Icon({ name, color, size = 24 }: { name: keyof typeof ICON_PATHS; color: string; size?: number }) {
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

function Check({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ flex: 'none', marginTop: 2 }}
    >
      <circle cx="9" cy="9" r="8.25" fill={color} fillOpacity=".14" />
      <path
        d="M5.5 9.2l2.3 2.3 4.7-4.9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaseStudyPage({ cs }: { cs: Case }) {
  return (
    <>
      <Hero cs={cs} />
      <Journey cs={cs} />
      <Timeline cs={cs} />
      <Quote cs={cs} />
      <FreeSystem cs={cs} />
      <Faqs cs={cs} />
      <Cta cs={cs} />
    </>
  );
}

function Hero({ cs }: { cs: Case }) {
  return (
    <div id="top" data-screen-label="Hero" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,64px)' }}>
      <div className="container">
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
            }}
          >
            <span style={{ ...eyebrow, color: T.caption }}>
              Case study · {cs.specialty} · {cs.city}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
              <Actions accent={cs.accentFg} />
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {cs.facts.map((f) => (
                <li
                  key={f}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    border: `1px solid ${T.hairline}`,
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.body,
                  }}
                >
                  {f}
                </li>
              ))}
              {cs.website && (
                <li style={{ padding: '6px 12px', fontSize: 13, fontWeight: 700 }}>
                  <a href={cs.website.href} rel="noopener" target="_blank" style={{ color: cs.accentFg }}>
                    {cs.website.label} ↗
                  </a>
                </li>
              )}
            </ul>
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
              justifyContent: 'space-between',
              gap: 18,
            }}
          >
            {cs.stats.map((s, i) => (
              <div
                key={s.value}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  paddingTop: i ? 18 : 0,
                  borderTop: i ? `1px solid ${cs.accentFg}33` : undefined,
                }}
              >
                <dd
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: i ? 'clamp(28px,2.6vw,36px)' : 'clamp(56px,6vw,88px)',
                    lineHeight: 0.95,
                    letterSpacing: i ? '-.03em' : '-.05em',
                  }}
                >
                  {s.value}
                </dd>
                <dt
                  style={{
                    fontSize: i ? 14 : 17,
                    lineHeight: 1.35,
                    fontWeight: i ? 600 : 700,
                    letterSpacing: '-.01em',
                    opacity: i ? 0.85 : 1,
                  }}
                >
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

// The journey as four stage cards in a row, each in its stage colour with an
// arrow to the next, and a patient's path as a chain of stops under them.
function Journey({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="Journey" style={{ ...section, background: T.band }}>
      <div className="container" style={column}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ ...sectionH2, maxWidth: 760, textWrap: 'balance' }}>{cs.journey.heading}</h2>
          <p style={{ ...body, fontSize: 17, maxWidth: 760 }}>{cs.journey.intro}</p>
        </div>
        <ol className="case-stages" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {cs.journey.stages.map((s, i) => {
            const colour = STAGE_COLORS[s.stage];
            return (
              <li
                key={s.stage}
                className="case-stage"
                style={{
                  ...card,
                  padding: 'clamp(22px,2.4vw,30px)',
                  borderTop: `6px solid ${colour.fg}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      background: colour.bg,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    <Icon name={s.icon} color={colour.fg} />
                  </span>
                  <span style={{ ...eyebrow, letterSpacing: '.06em', color: colour.fg }}>
                    {i + 1} · {s.label}
                  </span>
                </div>
                <h3 style={h3}>{s.title}</h3>
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 9,
                  }}
                >
                  {s.points.map((p) => (
                    <li key={p} style={{ display: 'flex', gap: 9, ...body, fontSize: 14, lineHeight: 1.45 }}>
                      <Check color={colour.fg} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {i < cs.journey.stages.length - 1 ? (
                  <svg
                    className="case-stage-arrow"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="11.5" fill={white} stroke={T.hairline} />
                    <path
                      d="M8 12h8M13 8.5l3.5 3.5-3.5 3.5"
                      stroke={T.ink}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ol>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ ...eyebrow, color: T.caption }}>{cs.journey.path.heading}</span>
          <ol
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {cs.journey.path.stops.map((stop, i) => {
              const colour = STAGE_COLORS[stop.stage];
              return (
                <li key={stop.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      padding: '9px 14px',
                      borderRadius: 999,
                      background: colour.bg,
                      color: colour.fg,
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: '-.01em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {stop.text}
                  </span>
                  {i < cs.journey.path.stops.length - 1 ? (
                    <span aria-hidden="true" style={{ color: T.hairlineHover, fontWeight: 700 }}>
                      →
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Timeline({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="Timeline" style={section}>
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
                        background: T.band,
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
    <div data-screen-label="Quote" style={{ ...section, background: T.band }}>
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

// The free system: the same pieces, free to claim. The funnel names come from
// the free system page itself so the two never drift apart.
function FreeSystem({ cs }: { cs: Case }) {
  return (
    <div data-screen-label="Free system" style={section}>
      <div className="container">
        <div
          style={{
            ...card,
            padding: 'clamp(28px,4vw,52px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 'clamp(24px,3vw,40px)',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ ...eyebrow, color: cs.accentFg }}>Free system</span>
            <h2 style={{ ...sectionH2, fontSize: 'clamp(30px,3.6vw,48px)', textWrap: 'balance' }}>
              {cs.freeSystem.heading}
            </h2>
            <p style={{ ...body, fontSize: 16, maxWidth: 560 }}>{cs.freeSystem.body}</p>
            <Actions accent={cs.accentFg} />
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
              gap: 10,
            }}
          >
            {FUNNELS.map((f, i) => {
              const colour = STAGE_LIST[i % STAGE_LIST.length] ?? STAGE_COLORS.retain;
              return (
                <li
                  key={f.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 16,
                    background: colour.bg,
                    color: colour.fg,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '-.01em',
                    lineHeight: 1.25,
                  }}
                >
                  <Check color={colour.fg} />
                  {f.title}
                </li>
              );
            })}
          </ul>
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
              Claim the system free, or book a 30-minute call and leave with a plan.
            </p>
          </div>
          <Actions accent={cs.accentFg} dark />
        </div>
      </div>
    </div>
  );
}
