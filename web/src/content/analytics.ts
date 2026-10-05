// Google Analytics 4. Paste the Measurement ID ("G-XXXXXXXXXX", from GA4 →
// Admin → Data streams → Web) between the quotes to switch analytics on for the
// whole site and the funnel. Empty = no analytics script and no consent banner.
export const GA_MEASUREMENT_ID = 'G-804589LNJW';

// Microsoft Clarity (heatmaps and recordings). Loaded with GA, after "Accept",
// on docsscale.com only (never staging, local builds or tests). Forms are
// masked (data-clarity-mask on each <form>). Empty = no Clarity.
export const CLARITY_PROJECT_ID = 'yr9lxbtgy0';

/**
 * Team visits: opening https://docsscale.com/?team=on once in a browser marks
 * all its later visits as internal (GA4 parameter traffic_type=internal), so
 * GA4's "Internal Traffic" data filter can exclude them. ?team=off undoes it.
 * Remembered in this browser only; see docs/TRACKING.md.
 */
export const TEAM_STORAGE_KEY = 'ds-team';
export const TEAM_MESSAGES = {
  on: 'This browser is now marked as DocsScale team traffic. Your visits will be excluded from Google Analytics reports. Open docsscale.com/?team=off to undo.',
  off: 'This browser is no longer marked as DocsScale team traffic.',
} as const;

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
