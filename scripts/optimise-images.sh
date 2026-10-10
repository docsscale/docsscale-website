#!/usr/bin/env bash
# Generates responsive AVIF and WebP versions of the content images, next to the
# originals, as <name>-<width>.avif / .webp. The original JPEG stays as the
# fallback for old browsers. Run after adding or replacing an image, then commit
# the results (no image tooling is needed at build time or in CI).
#   bash scripts/optimise-images.sh
# Needs ImageMagick 7 with AVIF support (brew install imagemagick).
set -euo pipefail
cd "$(dirname "$0")/../web/public"

# <file> <widths...>: widths never exceed the original's width.
variants() {
  local src="$1"; shift
  local base="${src%.*}" full
  full=$(magick identify -format '%w' "$src")
  for w in "$@"; do
    [ "$w" -gt "$full" ] && continue
    magick "$src" -strip -filter Lanczos -resize "${w}x" -quality 60 "${base}-${w}.avif"
    magick "$src" -strip -filter Lanczos -resize "${w}x" -quality 80 "${base}-${w}.webp"
    echo "  ${base}-${w}: $(stat -f%z "${base}-${w}.avif" 2>/dev/null || stat -c%s "${base}-${w}.avif") B avif, $(stat -f%z "${base}-${w}.webp" 2>/dev/null || stat -c%s "${base}-${w}.webp") B webp"
  done
}

# Keep these widths in sync with web/src/content/images.ts.
variants free-system/images/hero-mockup.jpg 640 980 1280 1600
variants images/home/ad-example.jpg 400 600 800 1200
variants images/services/paid-ads-hero.jpg 400 600 800 1200
for f in free-system/images/funnel-*.jpg; do
  case "$f" in *-[0-9]*.jpg) continue ;; esac
  variants "$f" 400 800 1200
done
