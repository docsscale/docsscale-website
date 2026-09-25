import { FAQS } from '@/content/home';
import { SITE } from '@/content/site';
import { T } from '@/styles/tokens';

export function Faq() {
  return (
    <div
      id="faq"
      data-screen-label="FAQ"
      style={{
        padding: 'clamp(64px,8vw,112px) 0',
      }}
    >
      <div
        id="faq-grid"
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
          gap: '40px 64px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
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
            Questions
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(36px,4.6vw,66px)',
              lineHeight: 0.98,
              letterSpacing: '-.045em',
              textWrap: 'balance',
            }}
          >
            {'What clinic owners '}
            <em
              className="serif-accent"
              style={{
                color: T.lavenderFg,
              }}
            >
              ask us first.
            </em>
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.6,
              color: T.body,
            }}
          >
            {'Something missing? Email '}
            <a
              href={`mailto:${SITE.email}`}
              style={{
                fontWeight: 700,
              }}
            >
              {SITE.email}
            </a>
            {' and a person answers.'}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: `1px solid ${T.hairline}`,
            gridColumn: 'span 2',
          }}
        >
          {FAQS.map((e, t) => (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
                gap: '12px 40px',
                padding: '22px 0',
                borderBottom: t < FAQS.length - 1 ? `1px solid ${T.hairline}` : undefined,
              }}
              key={e.q}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  lineHeight: 1.35,
                  letterSpacing: '-.01em',
                }}
              >
                {e.q}
              </div>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: T.body,
                }}
              >
                {e.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
