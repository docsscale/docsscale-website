import type { CSSProperties } from 'react';
import { T } from '@/styles/tokens';

// Dashed stand-in for a photo that has not been supplied yet. The caption says
// what belongs there; swap the Placeholder for an <img> once the photo exists.
type Props = {
  placeholder?: string;
  shape?: 'rect' | 'circle';
  radius?: number;
  style?: CSSProperties;
};

export function Placeholder({ placeholder, shape = 'rect', radius = 20, style }: Props) {
  const circle = shape === 'circle';
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: circle ? undefined : 120,
        borderRadius: circle ? '50%' : radius,
        background: T.band,
        border: `1px dashed ${T.hairlineHover}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: circle ? 4 : 16,
        color: T.caption,
        fontSize: circle ? 10 : 13,
        fontWeight: 600,
        lineHeight: 1.4,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {shape === 'rect' && placeholder}
    </div>
  );
}
