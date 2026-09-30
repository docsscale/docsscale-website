// /industries/: the overview of the industry pages (content/specialties.ts),
// plus the other specialties we serve without a page of their own yet.
import Link from 'next/link';
import { INDUSTRIES_PAGE } from '@/content/industries';
import { industryHref, SPECIALTIES } from '@/content/specialties';
import { AnimatedHeading } from '@/features/motion/AnimatedHeading';
import { ServicesCTA } from '@/features/services/ServicesCTA';
import { T } from '@/styles/tokens';

const eyebrow = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
} as const;

export function IndustriesPage() {
  return (
    <>
      <div
        id="top"
        data-screen-label="Hero"
        style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,64px)' }}
      >
        <div data-hero-rise="" className="container">
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(28px,4vw,52px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <span style={{ ...eyebrow, color: T.caption }}>{INDUSTRIES_PAGE.eyebrow}</span>
            <AnimatedHeading
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(38px,5vw,72px)',
                lineHeight: 1,
                letterSpacing: '-.045em',
                textWrap: 'balance',
                maxWidth: 900,
              }}
            >
              {INDUSTRIES_PAGE.h1}
              <em className="serif-accent" style={{ color: T.teal }}>
                {INDUSTRIES_PAGE.h1Accent}
              </em>
            </AnimatedHeading>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: T.body, maxWidth: 600 }}>
              {INDUSTRIES_PAGE.intro}
            </p>
          </div>
        </div>
      </div>

      <div data-screen-label="Industries" style={{ padding: '0 0 clamp(40px,5vw,64px)' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 14,
          }}
        >
          {SPECIALTIES.map((s) => (
            <Link
              key={s.slug}
              href={industryHref(s.slug)}
              data-lift="1"
              style={{
                background: s.accentBg,
                color: s.accentFg,
                borderRadius: 28,
                padding: 'clamp(24px,3vw,32px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 28,
                minHeight: 240,
              }}
            >
              <span style={eyebrow}>{s.name}</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: '-.02em',
                  lineHeight: 1.15,
                  color: T.ink,
                }}
              >
                {s.h1} <em className="serif-accent">{s.h1Accent}</em>
              </span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {INDUSTRIES_PAGE.cardLink} {s.name.toLowerCase()} →
              </span>
            </Link>
          ))}
        </div>
        <p
          className="container"
          style={{ margin: '28px auto 0', fontSize: 15, lineHeight: 1.6, color: T.body, maxWidth: 1320 }}
        >
          {INDUSTRIES_PAGE.others}
        </p>
      </div>

      <ServicesCTA />
    </>
  );
}
