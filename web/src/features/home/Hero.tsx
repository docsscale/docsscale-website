// Homepage hero: a bento grid of tiles. Server Component; the specialty-driven
// bits are the small client leaves from specialty-context.
import { HERO, INTEGRATIONS } from '@/content/home';
import { STAGE_COLORS, T } from '@/styles/tokens';
import { AnimatedHeading } from '@/features/motion/AnimatedHeading';
import { HeroJourney } from './HeroJourney';
import { IntegrationChip } from './IntegrationChip';
import { SpecialtyInquiries, SpecialtyPicker, SpecialtyText } from './specialty-context';
const tileLabel = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.06em',
} as const;
const reportRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  borderBottom: '1px solid rgba(31,90,64,.18)',
  padding: '6px 0',
} as const;
const pillColors = Object.values(STAGE_COLORS);
export function Hero() {
  return (
    <div
      id="top"
      data-screen-label="Hero"
      style={{
        padding: 'clamp(24px,4vw,56px) 0 clamp(48px,6vw,80px)',
      }}
    >
      <div
        id="hero-grid"
        data-hero-rise=""
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
          gridAutoFlow: 'dense',
          gap: 14,
        }}
      >
        {/* Headline tile */}
        <div
          style={{
            gridColumn: 'span 2',
            background: T.surface,
            border: `1px solid ${T.hairline}`,
            borderRadius: 28,
            padding: 'clamp(28px,4vw,52px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 28,
            minHeight: 420,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {HERO.stagePills.map((label, i) => (
              <span
                key={label}
                style={{
                  height: 30,
                  padding: '0 12px',
                  borderRadius: 999,
                  background: pillColors[i]!.bg,
                  color: pillColors[i]!.fg,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {label}
              </span>
            ))}
          </div>
          <AnimatedHeading
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(40px,5.2vw,76px)',
              lineHeight: 1,
              letterSpacing: '-.045em',
              textWrap: 'balance',
            }}
          >
            {HERO.headline}
            <em
              className="serif-accent"
              style={{
                color: T.teal,
              }}
            >
              {HERO.headlineAccent}
            </em>
          </AnimatedHeading>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.5,
                color: T.body,
                maxWidth: 440,
              }}
            >
              {HERO.intro}
            </p>
            <a
              id="hero-cta"
              href={HERO.cta.href}
              className="btn-teal"
              data-lift="1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                height: 56,
                padding: '0 8px 0 26px',
                background: T.ink,
                color: T.bg,
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                whiteSpace: 'nowrap',
              }}
            >
              {HERO.cta.label}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: T.bg,
                  color: T.ink,
                }}
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/* Product graphic: example patient journeys (HeroJourney). Until v1.4 this
            was a photo placeholder. */}
        <div
          id="hero-journey-tile"
          style={{
            gridColumn: 'span 1',
            gridRow: 'span 2',
            borderRadius: 28,
            position: 'relative',
            minHeight: 340,
          }}
        >
          <HeroJourney />
        </div>

        {/* Attract: inquiries this week */}
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
            minHeight: 200,
          }}
        >
          <span style={tileLabel}>{HERO.attract.label}</span>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 'clamp(40px,4vw,60px)',
                lineHeight: 0.95,
                letterSpacing: '-.04em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <SpecialtyInquiries />
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginTop: 6,
              }}
            >
              {HERO.attract.suffix}
              <SpecialtyText field="service" />
            </div>
          </div>
        </div>

        {/* Convert: a text conversation */}
        <div
          style={{
            background: T.lavenderBg,
            color: T.lavenderFg,
            borderRadius: 28,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <span style={tileLabel}>{HERO.convert.label}</span>
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '90%',
              background: T.surface,
              color: T.ink,
              padding: '9px 13px',
              borderRadius: '14px 14px 14px 4px',
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            <SpecialtyText field="inquiry" />
          </div>
          <div
            style={{
              alignSelf: 'flex-end',
              maxWidth: '90%',
              background: T.lavenderFg,
              color: T.lavenderBg,
              padding: '9px 13px',
              borderRadius: '14px 14px 4px 14px',
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            {HERO.convert.reply}
          </div>
          <div
            style={{
              alignSelf: 'flex-start',
              background: T.surface,
              color: T.ink,
              padding: '9px 13px',
              borderRadius: '14px 14px 14px 4px',
              fontSize: 13,
            }}
          >
            {HERO.convert.confirm}
          </div>
        </div>

        {/* Specialty picker */}
        <div
          style={{
            gridColumn: 'span 2',
            background: T.tealTintBg,
            color: T.tealTintFg,
            borderRadius: 28,
            padding: 26,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span style={tileLabel}>{HERO.picker.label}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {HERO.picker.hint}
            </span>
          </div>
          <SpecialtyPicker />
        </div>

        {/* Retain: the Monday report */}
        <div
          style={{
            background: T.sageBg,
            color: T.sageFg,
            borderRadius: 28,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <span style={tileLabel}>{HERO.report.label}</span>
          {HERO.report.rows.map((row, i, rows) => (
            <div
              key={row.label}
              style={
                i < rows.length - 1
                  ? reportRow
                  : {
                      ...reportRow,
                      borderBottom: undefined,
                    }
              }
            >
              <span>{row.label}</span>
              <b
                style={{
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {row.value}
              </b>
            </div>
          ))}
          <span
            style={{
              fontSize: 12,
            }}
          >
            {HERO.report.footnote}
          </span>
        </div>

        {/* Platforms we work on: a short list, so a still, centred row (it was a
            scrolling strip while the list was long). */}
        <div
          style={{
            gridColumn: 'span 2',
            background: T.surface,
            border: `1px solid ${T.hairline}`,
            borderRadius: 28,
            padding: '18px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {INTEGRATIONS.map(([name, color]) => (
            <IntegrationChip key={name} name={name} dot={color} />
          ))}
        </div>

        {/* Ownership */}
        <div
          style={{
            background: T.ink,
            color: T.bg,
            borderRadius: 28,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <span
            style={{
              ...tileLabel,
              opacity: 0.7,
            }}
          >
            {HERO.ownership.label}
          </span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-.03em',
              lineHeight: 1.1,
            }}
          >
            {HERO.ownership.text}
          </span>
        </div>
      </div>
    </div>
  );
}
