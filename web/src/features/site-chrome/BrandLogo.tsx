// The DocsScale logo (sources and vector versions in /brand at the repo root).
// "dark" is the dark-ink version for light backgrounds, "light" the white-ink
// version for dark backgrounds. Files are 96px tall, sharp up to 3x screens.
const LOGOS = {
  dark: { src: '/brand/logo-dark.webp', width: 448, height: 96 },
  light: { src: '/brand/logo-light.webp', width: 437, height: 96 },
} as const;

// Size by height, or by width where the logo must take exactly the space the
// old logo took (rows that spread their items out, like the nav).
type Size = { height: number; width?: never } | { width: number; height?: never };

type Props = Size & {
  variant: keyof typeof LOGOS;
  /** Below-the-fold logos (footers) can load lazily. */
  lazy?: boolean;
  /** Height of the row the logo sits in: a taller logo overhangs it evenly
   *  instead of pushing the content below down. */
  rowHeight?: number;
};

export function BrandLogo({ variant, lazy = false, rowHeight, ...size }: Props) {
  const logo = LOGOS[variant];
  const ratio = logo.width / logo.height;
  const height = size.height ?? size.width / ratio;
  const width = size.width ?? Math.round(ratio * height);
  const overhang = rowHeight && rowHeight < height ? (height - rowHeight) / 2 : 0;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; the file is pre-sized
    <img
      src={logo.src}
      alt="DocsScale"
      width={Math.round(width)}
      height={Math.round(height)}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      style={{ display: 'block', width, height, margin: overhang ? `-${overhang}px 0` : undefined }}
    />
  );
}
