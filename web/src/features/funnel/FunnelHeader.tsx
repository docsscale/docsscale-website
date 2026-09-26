import Link from 'next/link';
import { BrandLogo } from '@/features/site-chrome/BrandLogo';
import { T } from '@/styles/tokens';

const ctaStyle = {
  height: 44,
  padding: '0 22px',
  fontSize: 14,
  boxShadow: '0 2px 12px rgba(15,95,99,.3)',
} as const;

// Funnel header: logo plus an optional call-to-action. The landing page scrolls
// to its form, the thank-you page links to the booking page, the booking page
// has none.
type Props = { cta?: { label: string; href: string } };

export function FunnelHeader({ cta }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(250,249,246,.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.hairline}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          height: 66,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <Link
          href="/free-system/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            color: T.ink,
          }}
        >
          <BrandLogo variant="dark" height={28} />
        </Link>
        {cta &&
          (cta.href.startsWith('#') ? (
            <a href={cta.href} className="cta-btn" style={ctaStyle}>
              {cta.label}
            </a>
          ) : (
            <Link href={cta.href} className="cta-btn" style={ctaStyle}>
              {cta.label}
            </Link>
          ))}
      </div>
    </div>
  );
}
