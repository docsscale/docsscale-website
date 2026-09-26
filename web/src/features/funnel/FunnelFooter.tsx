import { BrandLogo } from '@/features/site-chrome/BrandLogo';
import { T } from '@/styles/tokens';

export function FunnelFooter() {
  return (
    <div
      style={{
        background: T.ink,
        padding: '32px clamp(16px,4vw,40px)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}
        >
          {/* Same width as the old logo: the three items here are spread out evenly. */}
          <BrandLogo variant="light" width={109.297} rowHeight={22} lazy />
        </div>
        <span
          style={{
            fontSize: 13,
            color: 'rgba(250,249,246,.4)',
          }}
        >
          Marketing agency for healthcare clinics
        </span>
        <span
          style={{
            fontSize: 13,
            color: 'rgba(250,249,246,.4)',
          }}
        >
          © 2026 DocsScale
        </span>
      </div>
    </div>
  );
}
