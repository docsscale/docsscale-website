import path from 'node:path';

// Everything the SEO dashboard needs from the server's environment. Keys and
// key files are never in the repository (the repository is public) and are
// never printed: the screen only says whether each one is set.
// docs/SEO-DASHBOARD-PLAN.md, sections 2 and 10.

const env = (name: string) => (process.env[name] ?? '').trim();

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const seoConfig = {
  /** Private folder outside every served folder: the store and the key files. */
  dataDir: env('SEO_DATA_DIR') || path.join(process.cwd(), '.seo-data'),
  /** Who is admin is set on the server only, so nobody can promote themselves on screen. */
  adminEmails: env('SEO_ADMIN_EMAILS').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean),
  publicUrl: env('SEO_PUBLIC_URL') || 'https://cms.docsscale.com',
  siteUrl: (env('SEO_SITE_URL') || 'https://docsscale.com').replace(/\/$/, ''),
  mailFrom: env('SEO_MAIL_FROM') || 'info@docsscale.com',
  /** "console" prints sign-in links instead of sending them; refused in production. */
  mailMode: env('SEO_MAIL_MODE') || 'sendmail',
  cronToken: env('SEO_CRON_TOKEN'),
  googleKeyFile: env('GOOGLE_SERVICE_ACCOUNT_FILE'),
  gscSite: env('GSC_SITE') || 'sc-domain:docsscale.com',
  ga4Property: env('GA4_PROPERTY') || 'properties/556073979',
  bingKey: env('BING_API_KEY'),
  bingSite: env('BING_SITE_URL') || 'https://docsscale.com/',
  pagespeedKey: env('PAGESPEED_API_KEY'),
  githubRepo: env('GITHUB_REPO') || 'docsscale/docsscale-website',
  /** Optional while the repository is public; needed once it is private again. */
  githubToken: env('SEO_GITHUB_TOKEN'),
};

/** For the Data sources tab: which settings exist, never their values. */
export function settingsPresence() {
  return [
    { name: 'Admin addresses', set: seoConfig.adminEmails.length > 0 },
    { name: 'Scheduled run token', set: Boolean(seoConfig.cronToken) },
    { name: 'Google service account key file', set: Boolean(seoConfig.googleKeyFile) },
    { name: 'Bing Webmaster API key', set: Boolean(seoConfig.bingKey) },
    { name: 'PageSpeed API key (optional)', set: Boolean(seoConfig.pagespeedKey) },
    { name: 'GitHub read token (needed once the repository is private)', set: Boolean(seoConfig.githubToken) },
  ];
}
