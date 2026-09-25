import Link from 'next/link';
import { T } from '@/styles/tokens';

const secondaryButton = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 50,
  padding: '0 22px',
  background: '#FFFFFF',
  border: `1px solid ${T.hairline}`,
  color: T.ink,
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 14,
} as const;

export function NotFound() {
  return (
    <div data-screen-label="404" style={{ padding: 'clamp(64px,10vw,140px) 0' }}>
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 24,
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
          404
        </span>
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(36px,5vw,64px)',
            lineHeight: 1,
            letterSpacing: '-.045em',
            maxWidth: 700,
            textWrap: 'balance',
          }}
        >
          {"This page doesn't exist. "}
          <em className="serif-accent" style={{ color: T.teal }}>
            Let&apos;s get you back on track.
          </em>
        </h1>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: T.body, maxWidth: 480 }}>
          The page you were looking for may have moved or never existed. Try one of these instead.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          <Link
            href="/"
            className="btn-teal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 50,
              padding: '0 22px',
              background: T.teal,
              color: '#FFFFFF',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Go home
          </Link>
          <Link href="/services" style={secondaryButton}>
            See services
          </Link>
          <Link href="/book-a-call" style={secondaryButton}>
            Book a call
          </Link>
        </div>
      </div>
    </div>
  );
}
