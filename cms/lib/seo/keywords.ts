// Each page's primary keyword, copied from the approved keyword map
// (docs/seo/keywords/keyword-map.md, 6 Oct 2026). A page that is not here has
// no keyword of its own and its keyword checks read "Unknown". Change this
// list when the keyword map changes.
export const FOCUS_KEYWORDS: Record<string, string> = {
  '/': 'healthcare marketing agency',
  '/services/': 'healthcare marketing services',
  '/industries/dental/': 'dental marketing agency',
  '/industries/chiropractic/': 'chiropractor marketing agency',
  '/industries/physical-therapy/': 'physical therapy marketing',
  '/industries/med-spa/': 'med spa marketing agency',
  '/services/paid-ads/': 'healthcare ppc agency',
  '/services/local-seo/': 'local seo for medical practices',
  '/services/social-media-management/': 'healthcare social media marketing agency',
  '/services/patient-reactivation/': 'patient reactivation',
  '/blog/google-business-profile-for-dentists/': 'google business profile for dentists',
  '/blog/facebook-ads-for-chiropractors/': 'chiropractic facebook ads',
};

// Findings the owner has declined (project files, reports/declined-fixes.md).
// The linter still shows them, marked as declined, and leaves them out of the score.
export const DECLINED: { path: string; check: string; note: string }[] = [
  { path: '/industries/', check: 'title-length', note: 'Owner declined, 7 Oct 2026' },
  { path: '/services/', check: 'title-length', note: 'Owner declined, 7 Oct 2026' },
  { path: '/free-system/', check: 'title-length', note: 'Owner declined, 7 Oct 2026' },
];
