// The four-quadrant DocsScale mark: one quarter-circle per system stage.
// The nav uses the strong stage colours, the dark footer the pale ones.
import { T } from '@/styles/tokens';

const PALETTES = {
  strong: [T.peachFg, T.teal, T.sageFg, T.lavenderFg],
  pale: ['#FBE7D6', '#DDEEEE', '#DAEDE2', '#E5DFF5'],
} as const;

const RADII = ['50% 0 0 0', '0 50% 0 0', '0 0 0 50%', '0 0 50% 0'];

export function LogoMark({ palette }: { palette: keyof typeof PALETTES }) {
  return (
    <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 20, height: 20 }}>
      {PALETTES[palette].map((color, i) => (
        <span key={i} style={{ background: color, borderRadius: RADII[i] }} />
      ))}
    </span>
  );
}
