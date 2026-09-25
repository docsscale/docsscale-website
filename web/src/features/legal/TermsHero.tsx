import { T } from '@/styles/tokens';

export function TermsHero() {
  return (
    <div
      data-screen-label="Hero"
      style={{
        padding: '0 0 clamp(40px,5vw,64px)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
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
          Legal
        </span>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(32px,4.5vw,56px)',
            lineHeight: 1,
            letterSpacing: '-.04em',
          }}
        >
          Terms of Service
        </h1>
        <span
          style={{
            fontSize: 13,
            color: T.caption,
            fontWeight: 600,
          }}
        >
          {'Last updated: '}
          {'September 2026'}
        </span>
      </div>
    </div>
  );
}
