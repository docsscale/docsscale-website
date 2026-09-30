import Link from 'next/link';
import { T } from '@/styles/tokens';

export function ServicesSpecialtyLinks() {
  return (
    <div
      data-screen-label="Specialty links"
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
          Or see how it works for your specialty
        </span>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <Link
            href="/industries/dental"
            data-lift="1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 44,
              padding: '0 18px',
              borderRadius: 999,
              border: `1px solid ${T.hairline}`,
              background: '#FFFFFF',
              color: T.ink,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Dental
            <span
              style={{
                color: T.caption,
              }}
            >
              →
            </span>
          </Link>
          <Link
            href="/industries/chiropractic"
            data-lift="1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 44,
              padding: '0 18px',
              borderRadius: 999,
              border: `1px solid ${T.hairline}`,
              background: '#FFFFFF',
              color: T.ink,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Chiropractic
            <span
              style={{
                color: T.caption,
              }}
            >
              →
            </span>
          </Link>
          <Link
            href="/industries/physical-therapy"
            data-lift="1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 44,
              padding: '0 18px',
              borderRadius: 999,
              border: `1px solid ${T.hairline}`,
              background: '#FFFFFF',
              color: T.ink,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Physical Therapy
            <span
              style={{
                color: T.caption,
              }}
            >
              →
            </span>
          </Link>
          <Link
            href="/industries/med-spa"
            data-lift="1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 44,
              padding: '0 18px',
              borderRadius: 999,
              border: `1px solid ${T.hairline}`,
              background: '#FFFFFF',
              color: T.ink,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Med Spa
            <span
              style={{
                color: T.caption,
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
