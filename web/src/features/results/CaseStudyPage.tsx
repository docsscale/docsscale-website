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
              <li key={s.stage} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span
                  style={{
                    ...eyebrow,
                    alignSelf: 'flex-start',
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: colour.bg,
                    color: colour.fg,
                  }}
                >
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
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
          {cs.timeline.steps.map((s, i) => (
            <li
              key={s.when}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))',
                gap: '10px 40px',
                padding: '24px 0',
                borderTop: `1px solid ${T.hairlineHover}`,
                borderBottom: i === cs.timeline.steps.length - 1 ? `1px solid ${T.hairlineHover}` : undefined,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ ...eyebrow, color: cs.accentFg }}>{s.when}</span>
                <h3 style={h3}>{s.title}</h3>
              </div>
              <p style={{ ...body, gridColumn: 'span 2' }}>{s.body}</p>
            </li>
          ))}
        </ol>
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
