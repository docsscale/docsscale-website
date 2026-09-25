import Link from 'next/link';
import { T } from '@/styles/tokens';

export function ServicesCTA() {
  return (
    <div
      data-screen-label="CTA"
      style={{
        background: T.band,
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
              Not sure which stage is leaking?
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.5,
                opacity: 0.75,
              }}
            >
              Thirty minutes with your numbers and we&apos;ll tell you. Free, and you leave with a plan either
              way.
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
                background: T.teal,
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
