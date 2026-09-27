import type { CSSProperties } from 'react';
import { preload } from 'react-dom';
import { IMAGE_WIDTHS } from '@/content/images';

// <picture> with AVIF and WebP at several widths; the browser downloads only the
// one that fits the layout (`sizes`) and screen density. The <picture> itself is
// display:contents, so the <img> lays out exactly as a plain <img> would.
type Props = {
  src: string;
  alt: string;
  /** Rendered width of the image in the layout, e.g. "(max-width: 700px) 100vw, 360px". */
  sizes: string;
  style?: CSSProperties;
  loading?: 'lazy';
  /** The page's main (largest) image: fetch it before other images. */
  priority?: boolean;
};

const srcSetFor = (src: string, ext: string) => {
  const widths = IMAGE_WIDTHS[src];
  if (!widths) throw new Error(`No responsive versions for ${src}: run scripts/optimise-images.sh`);
  const base = src.replace(/\.[a-z]+$/, '');
  return widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
};

/**
 * Preloads the AVIF version that fits `sizes`, for the page's main image. Call it
 * in the page component, with the same `sizes` as the ResponsiveImage. Browsers
 * without AVIF support ignore it and pick their format from the <picture>.
 */
export function preloadResponsiveImage(src: string, sizes: string) {
  const largest = IMAGE_WIDTHS[src]?.at(-1);
  preload(src.replace(/\.[a-z]+$/, `-${largest}.avif`), {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: srcSetFor(src, 'avif'),
    imageSizes: sizes,
    fetchPriority: 'high',
  });
}

export function ResponsiveImage({ src, alt, sizes, style, loading, priority }: Props) {
  const srcSet = (ext: string) => srcSetFor(src, ext);
  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        style={style}
      />
    </picture>
  );
}
