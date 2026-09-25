import { T } from '@/styles/tokens';

/** One tool in the hero's scrolling integrations strip. */
export function IntegrationChip({ name, dot }: { name: string; dot: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        border: `1px solid ${T.hairline}`,
        borderRadius: 999,
        whiteSpace: 'nowrap',
        background: T.surface,
      }}
    >
      <span style={{ width: 18, height: 18, borderRadius: 5, background: dot, display: 'inline-block' }} />
      <span style={{ fontWeight: 800, letterSpacing: '-.02em', color: T.ink, fontSize: 14 }}>{name}</span>
    </span>
  );
}
