import Link from 'next/link';
import { Reveal } from '@/features/funnel/Reveal';
import { T } from '@/styles/tokens';

export function ThankYouNextStep() {
  return (
    <div
      style={{
        background: T.ink,
        padding: 'clamp(56px,7vw,96px) 0',
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          textAlign: 'center',
        }}
      >
        <Reveal>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(28px,4vw,52px)',
              lineHeight: 1,
              letterSpacing: '-.04em',
              color: T.bg,
              textWrap: 'balance',
            }}
          >
            Want it installed and
            <br />
            <em
              className="serif-em"
              style={{
                color: T.peachBg,
              }}
            >
              running for you?
            </em>
          </h2>
        </Reveal>
        <Reveal>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(16px,1.8vw,18px)',
              lineHeight: 1.65,
              color: 'rgba(250,249,246,.7)',
              maxWidth: 580,
              textWrap: 'pretty',
            }}
          >
            The system works. But setting it up, connecting it to your clinic, switching on 17 automations,
            and getting ads behind it takes time you probably do not have. That is what we do on a call. 30
            minutes, free, no pitch. We look at your clinic and tell you honestly if we can help.
          </p>
        </Reveal>
        <Reveal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Link href="/free-system/book-a-call/" className="cta-btn">
              {'Book your free 30-minute call '}
              <span className="arr">→</span>
            </Link>
            <span
              style={{
                fontSize: 13,
                color: 'rgba(250,249,246,.5)',
                fontWeight: 600,
              }}
            >
              No obligation. Just your numbers and an honest conversation.
            </span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
