// Google Analytics 4. Paste the Measurement ID ("G-XXXXXXXXXX", from GA4 →
// Admin → Data streams → Web) between the quotes to switch analytics on for the
// whole site and the funnel. Empty = no analytics script and no consent banner.
export const GA_MEASUREMENT_ID = 'G-804589LNJW';

/** Where the visitor's consent choice is remembered (this browser only). */
export const CONSENT_STORAGE_KEY = 'ds-consent';

export const CONSENT_BANNER = {
  text: 'We use analytics cookies to see how visitors use the site, so we can improve it. No advertising cookies.',
  policyLabel: 'Privacy Policy',
  policyHref: '/privacy/#cookies',
  accept: 'Accept',
  decline: 'Decline',
  settingsLink: 'Cookie settings',
} as const;
