// A picture from the content (a post's cover, a picture inside a post, an
// offer's picture). Uploads are served as AVIF or WebP at the width that fits,
// with their size written in so nothing jumps while they load
// (scripts/optimise-uploads.mjs makes the versions). Any other picture is shown
// as it is.
import type { CSSProperties } from 'react';
import type { Picture as PictureData } from './posts';

type Props = {
  picture: PictureData;
  /** Rendered width in the layout, e.g. "(max-width: 760px) 100vw, 760px". */
  sizes: string;
  style?: CSSProperties;
  /** The page's main picture: fetched first, never lazily. */
  priority?: boolean;
  /** Decorative use (the same picture is described elsewhere on the page). */
  decorative?: boolean;
};

export function Picture({ picture, sizes, style, priority = false, decorative = false }: Props) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- static export; versions are made at build time
    <img
      src={picture.src}
      alt={decorative ? '' : picture.alt}
      width={picture.width}
      height={picture.height}
      loading={priority ? undefined : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={style}
    />
  );
  if (!picture.fast) return img;
  const srcSet = (ext: string) =>
    picture.fast!.widths.map((w) => `${picture.fast!.base}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      {img}
    </picture>
  );
}
