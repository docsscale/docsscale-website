// The full case study pages, listed under the result cards on /results/.
// One card per entry in content/case-studies.ts; the cards above stay as
// they are. The row is the way in to those pages from the site's own text.
import Link from 'next/link';
import { CASE_STUDIES, caseStudyHref } from '@/content/case-studies';
import { T } from '@/styles/tokens';

export function ResultsFullCases() {
  return (
    <div data-screen-label="Full cases" style={{ background: T.band, padding: '0 0 clamp(56px,7vw,96px)' }}>
      <div
        className="container"
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px,2.5vw,28px)' }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(28px,3.4vw,44px)',
            lineHeight: 1,
            letterSpacing: '-.04em',
          }}
        >
          The full stories.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 14,
          }}
        >
          {CASE_STUDIES.map((cs) => (
            <Link
              key={cs.slug}
              href={caseStudyHref(cs.slug)}
              data-lift="1"
              style={{
                background: cs.accentBg,
                color: cs.accentFg,
                borderRadius: 28,
                padding: 'clamp(24px,3vw,36px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 20,
                minHeight: 200,
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
                {cs.specialty} · {cs.city}
              </span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(20px,2vw,26px)',
                  lineHeight: 1.2,
                  letterSpacing: '-.02em',
                }}
              >
                {cs.h1} {cs.h1Accent}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Read the case study →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
