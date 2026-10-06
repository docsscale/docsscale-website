// Template for the service pages (/services/local-seo/ …). All copy comes from
// src/content/service-pages.ts; each page takes the colour of its stage.
import Link from 'next/link';
import type { ServicePage as Service } from '@/content/service-pages';
import { AnimatedHeading } from '@/features/motion/AnimatedHeading';
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
  textWrap: 'balance',
} as const;
const section = { padding: 'clamp(56px,7vw,96px) 0' } as const;
const stack = { display: 'flex', flexDirection: 'column', gap: 'clamp(28px,3.5vw,40px)' } as const;
const card = { background: T.surface, border: `1px solid ${T.hairline}`, borderRadius: 28 } as const;

type Accent = { bg: string; fg: string };
type Props = { service: Service; accent: Accent };

export function ServicePage({ service }: { service: Service }) {
  const accent = STAGE_COLORS[service.stage];
  return (
    <>
      <Hero service={service} accent={accent} />
      <Included service={service} accent={accent} />
      <Process service={service} accent={accent} />
      {service.example && <Example service={service} accent={accent} />}
      <Fit service={service} accent={accent} />
      <Faqs service={service} />
      <Related service={service} />
      <Cta service={service} accent={accent} />
    </>
  );
}

function Hero({ service: s, accent }: Props) {
  return (
    <div id="top" data-screen-label="Hero" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,64px)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <nav
          aria-label="Breadcrumb"
          style={{ fontSize: 13, color: T.caption, display: 'flex', gap: 8, flexWrap: 'wrap' }}
        >
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/services">Services</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" style={{ color: T.ink, fontWeight: 600 }}>
            {s.name}
          </span>
        </nav>
        <div
          data-hero-rise=""
          className="two"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            gap: 14,
          }}
        >
          <div
            style={{
              ...card,
              gridColumn: 'span 2',
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
                alignSelf: 'flex-start',
                padding: '7px 12px',
                borderRadius: 999,
                background: accent.bg,
                color: accent.fg,
              }}
            >
              {s.stageLabel}
              {' · Service'}
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
              <em className="serif-accent" style={{ color: accent.fg }}>
                {s.h1Accent}
              </em>
            </AnimatedHeading>
            {/* The direct answer: complete on its own, so it can be quoted without the page. */}
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: T.ink, maxWidth: 640 }}>
              {s.directAnswer}
            </p>
          </div>
          <div
            style={{
              background: accent.bg,
              color: accent.fg,
              borderRadius: 28,
              padding: 'clamp(24px,3vw,36px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <span style={eyebrow}>At a glance</span>
            <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {s.glance.map((g) => (
                <div key={g.label} style={{ borderTop: `1px solid ${accent.fg}33`, paddingTop: 12 }}>
                  <dt style={{ ...eyebrow, fontSize: 11 }}>{g.label}</dt>
                  <dd style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 16, lineHeight: 1.35 }}>
                    {g.value}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              data-lift="1"
              href="/book-a-call"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 14,
                background: T.surface,
                color: T.ink,
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              <span>Book a strategy call</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Included({ service: s, accent }: Props) {
  return (
    <div data-screen-label="Included" style={{ ...section, background: T.band }}>
      <div className="container" style={stack}>
        <h2 style={{ ...sectionH2, maxWidth: 760 }}>What you get.</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 14,
          }}
        >
          {s.included.map((item, i) => (
            <div
              key={item.title}
              data-lift="1"
              style={{ ...card, padding: 26, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: accent.bg,
                  color: accent.fg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                {`0${i + 1}`}
              </span>
              <h3
                style={{ margin: 0, fontWeight: 800, fontSize: 19, letterSpacing: '-.02em', lineHeight: 1.2 }}
              >
                {item.title}
              </h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.body }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Process({ service: s, accent }: Props) {
  const divider = `1px solid ${T.hairline}`;
  return (
    <div data-screen-label="Process" style={section}>
      <div className="container" style={stack}>
        <h2 style={{ ...sectionH2, maxWidth: 760 }}>How we do it, step by step.</h2>
        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            borderTop: divider,
          }}
        >
          {s.process.map((step, i) => (
            <li
              key={step.title}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px minmax(0,1fr)',
                gap: 20,
                padding: '24px 0',
                borderBottom: i < s.process.length - 1 ? divider : undefined,
                alignItems: 'start',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: accent.bg,
                  color: accent.fg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                {i + 1}
              </span>
              <div>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, letterSpacing: '-.02em' }}>
                  {step.title}
                </h3>
                <p style={{ margin: '6px 0 0', color: T.body, lineHeight: 1.55, maxWidth: 720 }}>
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Example({ service: s, accent }: Props) {
  const e = s.example!;
  return (
    <div data-screen-label="Example" style={{ ...section, background: T.band }}>
      <div className="container" style={stack}>
        <h2 style={{ ...sectionH2, maxWidth: 760 }}>What it looked like for one clinic.</h2>
        <div
          style={{
            ...card,
            padding: 'clamp(24px,3.5vw,44px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              ...eyebrow,
              color: T.caption,
            }}
          >
            <span>{e.context}</span>
            <span>{e.period}</span>
          </div>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, maxWidth: 760 }}>{e.summary}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
              gap: 14,
            }}
          >
            {e.results.map((r) => (
              <div
                key={r.label}
                style={{ background: accent.bg, color: accent.fg, borderRadius: 20, padding: 22 }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 'clamp(34px,4vw,48px)',
                    letterSpacing: '-.04em',
                    lineHeight: 1,
                  }}
                >
                  {r.value}
                </div>
                <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{r.label}</div>
              </div>
            ))}
          </div>
          {e.quote && (
            <figure style={{ margin: 0, borderTop: `1px solid ${T.hairline}`, paddingTop: 24 }}>
              <blockquote
                style={{
                  margin: 0,
                  fontSize: 20,
                  lineHeight: 1.45,
                  fontWeight: 600,
                  letterSpacing: '-.01em',
                  maxWidth: 760,
                }}
              >
                {'“'}
                {e.quote.text}
                {'”'}
              </blockquote>
              <figcaption style={{ marginTop: 10, fontSize: 14, color: T.caption }}>{e.quote.by}</figcaption>
            </figure>
          )}
          <Link
            href="/results"
            style={{ fontSize: 15, fontWeight: 700, color: T.teal, alignSelf: 'flex-start' }}
          >
            See all results →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Fit({ service: s, accent }: Props) {
  const list = {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  } as const;
  const item = {
    display: 'grid',
    gridTemplateColumns: '22px minmax(0,1fr)',
    gap: 10,
    lineHeight: 1.5,
  } as const;
  return (
    <div data-screen-label="Fit" style={section}>
      <div className="container" style={stack}>
        <h2 style={{ ...sectionH2, maxWidth: 760 }}>Who it suits, and who it doesn’t.</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 14,
          }}
        >
          <div
            style={{
              background: accent.bg,
              color: accent.fg,
              borderRadius: 28,
              padding: 'clamp(24px,3vw,36px)',
            }}
          >
            <h3 style={{ ...eyebrow, margin: '0 0 18px' }}>A good fit if</h3>
            <ul style={list}>
              {s.fit.good.map((line) => (
                <li key={line} style={{ ...item, fontWeight: 600 }}>
                  <span aria-hidden="true">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ ...card, padding: 'clamp(24px,3vw,36px)' }}>
            <h3 style={{ ...eyebrow, margin: '0 0 18px', color: T.caption }}>Probably not for you if</h3>
            <ul style={list}>
              {s.fit.notFor.map((line) => (
                <li key={line} style={{ ...item, color: T.body }}>
                  <span aria-hidden="true">—</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Faqs({ service: s }: { service: Service }) {
  return (
    <div data-screen-label="FAQ" style={{ ...section, background: T.band }}>
      <div className="container" style={stack}>
        <h2 style={{ ...sectionH2, maxWidth: 760 }}>Questions clinic owners ask.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${T.hairlineHover}` }}>
          {s.faqs.map((f, i) => (
            <div
              key={f.q}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
                gap: '12px 40px',
                padding: '22px 0',
                borderBottom: i < s.faqs.length - 1 ? `1px solid ${T.hairlineHover}` : undefined,
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

function Related({ service: s }: { service: Service }) {
  return (
    <div data-screen-label="Related" style={{ padding: 'clamp(40px,5vw,64px) 0 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h2 style={{ ...eyebrow, margin: 0, color: T.caption }}>Works with</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {s.related.map((r) => (
            <Link
              key={r.href + r.label}
              href={r.href}
              data-lift="1"
              style={{
                ...card,
                borderRadius: 999,
                padding: '12px 18px',
                fontWeight: 700,
                fontSize: 14,
                display: 'inline-flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <span>{r.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cta({ accent }: Props) {
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
              {"Let's look at your numbers."}
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
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: accent.fg,
                color: '#FFFFFF',
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
