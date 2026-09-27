// Responsive versions of the content images, made by scripts/optimise-images.sh
// (keep the widths there in sync). Each image is served as AVIF, then WebP, with
// the original JPEG as the fallback for browsers that support neither.
const HERO = [640, 980, 1280, 1600];

/** Rendered width of the funnel hero mockup (landing and thank-you pages). */
export const HERO_SIZES = '(max-width: 1060px) calc(100vw - 32px), 980px';
const FUNNEL_SHOT = [400, 800, 1200];

export const IMAGE_WIDTHS: Record<string, readonly number[]> = {
  '/free-system/images/hero-mockup.jpg': HERO,
  '/free-system/images/funnel-new-patient.jpg': FUNNEL_SHOT,
  '/free-system/images/funnel-service-promo.jpg': FUNNEL_SHOT,
  '/free-system/images/funnel-booking.jpg': FUNNEL_SHOT,
  '/free-system/images/funnel-application.jpg': FUNNEL_SHOT,
  '/free-system/images/funnel-reactivation.jpg': FUNNEL_SHOT,
  '/free-system/images/funnel-review.jpg': FUNNEL_SHOT,
};
