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
          <span
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              width: 16,
              height: 16,
            }}
          >
            <span
              style={{
                background: T.peachFg,
                borderRadius: '50% 0 0 0',
              }}
            />
            <span
              style={{
                background: T.teal,
                borderRadius: '0 50% 0 0',
              }}
            />
            <span
              style={{
                background: T.sageFg,
                borderRadius: '0 0 0 50%',
              }}
            />
            <span
              style={{
                background: T.lavenderFg,
                borderRadius: '0 0 50% 0',
              }}
            />
          </span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: '-.03em',
              color: T.bg,
            }}
          >
            DocsScale
          </span>
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
