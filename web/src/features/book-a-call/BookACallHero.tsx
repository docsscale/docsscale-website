import { AnimatedHeading } from '@/features/motion/AnimatedHeading';
import { BookCallForm } from '@/features/lead-form/BookCallForm';
import { BOOK_A_CALL } from '@/content/book-a-call';
import { T } from '@/styles/tokens';
export function BookACallHero() {
  return (
    <div
      id="top"
      data-screen-label="Hero"
      style={{
        padding: 'clamp(28px,4vw,56px) 0 clamp(56px,7vw,96px)',
      }}
    >
      <div
        data-hero-rise=""
        className="two container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
          gap: 14,
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            alignSelf: 'stretch', // the headline card fills the height of the form beside it
          }}
        >
          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              padding: 'clamp(28px,4vw,52px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 22,
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
              {BOOK_A_CALL.eyebrow}
            </span>
            <AnimatedHeading
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(36px,4.6vw,64px)',
                lineHeight: 1,
                letterSpacing: '-.045em',
                textWrap: 'balance',
              }}
            >
              {BOOK_A_CALL.headline}
              <em
                className="serif-accent"
                style={{
                  color: T.teal,
                }}
              >
                {BOOK_A_CALL.headlineAccent}
              </em>
            </AnimatedHeading>
            <p
              style={{
                margin: 0,
                marginTop: 'auto',
                fontSize: 17,
                lineHeight: 1.5,
                color: T.body,
              }}
            >
              {BOOK_A_CALL.subheadline}
            </p>
          </div>
        </div>
        <BookCallForm />
      </div>
    </div>
  );
}
