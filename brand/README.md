# DocsScale brand assets

The official logo, icon and social image. Use these rather than recreating the logo.

## originals/
The files exactly as supplied (September 2026). Never edit these.

| File | What it is |
|---|---|
| `logo-dark.webp` | Full logo, dark ink, for light backgrounds |
| `logo-light.webp` | Full logo, white ink, for dark backgrounds |
| `icon.png` | The cross-and-arrow mark on its own |
| `social-share.webp` | Link-preview artwork (1733×907) |

## files/
Ready-to-use versions made from the originals.

| File | Use |
|---|---|
| `logo-dark.png`, `logo-light.png` | Transparent PNGs, trimmed to the artwork, full resolution. **Use these wherever exact colour matters.** |
| `logo-dark.svg`, `logo-light.svg` | Vector versions, traced from the PNGs. Very close at normal sizes; edges are slightly less smooth than a designer-drawn vector when printed large. |
| `icon.png` | Transparent square icon (735×735) |
| `icon.svg` | Vector icon (traced), used as the browser favicon |
| `social-share-1200x630.jpg` | Link-preview image: scaled to cover 1200×630 (no stretching; about 2 px trimmed from each side), 63 KB |

The originals are raster images with soft shading, so no automatic trace can match
them pixel for pixel. If you ever need a perfect vector (signage, print), ask the
logo designer for the source file (AI, EPS, PDF or Figma) and replace the SVGs here.

## Where they are used on the website
- Header, footer and funnel: `web/public/brand/logo-*.webp` (96 px tall, sharp on 3× screens), rendered by `web/src/features/site-chrome/BrandLogo.tsx`.
- Favicons: `web/public/favicon.ico` (16/32/48), `icon.svg`, `apple-touch-icon.png` (180, on the site's cream background), `android-chrome-192x192.png`, `android-chrome-512x512.png`, `site.webmanifest`, all linked from `web/src/app/layout.tsx`. `favicon.png` (96) is kept for old bookmarks.
- Social image: `web/public/og-image.jpg`, added to every page by `web/src/features/seo/metadata.ts`.

### Regenerating the web files
```bash
magick brand/files/logo-dark.png -strip -filter Lanczos -resize x96 -quality 90 -define webp:alpha-quality=100 web/public/brand/logo-dark.webp
magick brand/files/icon.png -strip -define icon:auto-resize=48,32,16 web/public/favicon.ico
magick brand/files/icon.png -strip -resize 148x148 -background '#FAF9F6' -gravity center -extent 180x180 web/public/apple-touch-icon.png
```
