import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Everything the SEO dashboard needs to run. Keys are never in the repository
// (it is public) and are never printed: the screen only says whether each one
// is set. Each setting comes from the first of these that exists:
//   1. the server's environment (hPanel), for anyone who prefers it;
//   2. the private folder: the keys an admin saves on the Settings tab
//      (settings.json) and the scheduled-run token the app makes itself;
//   3. a default that fits cms.docsscale.com.
// So a fresh install needs nothing typed into hPanel (owner, 8 Oct 2026).
// docs/SEO-DASHBOARD-PLAN.md, sections 2 and 10.

const env = (name: string) => (process.env[name] ?? '').trim();

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const publicUrl = env('SEO_PUBLIC_URL') || 'https://cms.docsscale.com';

/** The private folder outside every served folder: the store, the keys, the
 *  cron script. On Hostinger: ~/domains/<host>/private/seo. */
function defaultDataDir() {
  if (!IS_PRODUCTION) return path.join(process.cwd(), '.seo-data');
  return path.join(os.homedir(), 'domains', new URL(publicUrl).hostname, 'private', 'seo');
}

/** Admin addresses can also arrive in seo-settings.json beside the app, which
 *  the install workflow writes from its input; never committed. */
function fileAdmins(): string[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'seo-settings.json'), 'utf8')) as { adminEmails?: unknown };
    return Array.isArray(parsed.adminEmails) ? parsed.adminEmails.map((e) => String(e).trim().toLowerCase()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export const seoConfig = {
  dataDir: env('SEO_DATA_DIR') || defaultDataDir(),
  /** Who is admin is set on the server (environment or install input), never on
   *  screen, so nobody can promote themselves. Seeded into the store at start. */
  adminEmails: [...new Set([...env('SEO_ADMIN_EMAILS').toLowerCase().split(','), ...fileAdmins()].map((s) => s.trim()).filter(Boolean))],
  publicUrl,
  siteUrl: (env('SEO_SITE_URL') || 'https://docsscale.com').replace(/\/$/, ''),
  mailFrom: env('SEO_MAIL_FROM') || 'info@docsscale.com',
  /** "console" prints sign-in links instead of sending them; refused in production. */
  mailMode: env('SEO_MAIL_MODE') || 'sendmail',
  gscSite: env('GSC_SITE') || 'sc-domain:docsscale.com',
  ga4Property: env('GA4_PROPERTY') || 'properties/556073979',
  bingSite: env('BING_SITE_URL') || 'https://docsscale.com/',
  githubRepo: env('GITHUB_REPO') || 'docsscale/docsscale-website',
  /** The IndexNow key: public by design (served at /<key>.txt on the site;
   *  web/public holds the file). It proves the addresses are ours and gives
   *  no access to anything, so it is not a secret. */
  indexNowKey: env('INDEXNOW_KEY') || '569a0945ac9445c41f98e5e73eb6ff3c',
};

/** The keys an admin saves on the Settings tab, in the private folder, read
 *  by the owner of the app only (mode 600). Values never leave the server. */
export type SecretName = 'googleKey' | 'bingKey' | 'pagespeedKey' | 'githubToken' | 'readKeyHash' | 'crmToken' | 'crmLocationId';
const SECRETS_FILE = () => path.join(seoConfig.dataDir, 'settings.json');

function savedSecrets(): Partial<Record<SecretName, string>> {
  try {
    return JSON.parse(fs.readFileSync(SECRETS_FILE(), 'utf8')) as Partial<Record<SecretName, string>>;
  } catch {
    return {};
  }
}

export function saveSecret(name: SecretName, value: string) {
  const all = savedSecrets();
  if (value) all[name] = value;
  else delete all[name];
  fs.mkdirSync(seoConfig.dataDir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(SECRETS_FILE(), JSON.stringify(all), { mode: 0o600 });
}

/** The read-only Google key: the environment (JSON or a file path) or the Settings tab. */
export function googleKey(): string {
  if (env('GOOGLE_SERVICE_ACCOUNT_JSON')) return env('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (env('GOOGLE_SERVICE_ACCOUNT_FILE')) return fs.readFileSync(env('GOOGLE_SERVICE_ACCOUNT_FILE'), 'utf8');
  return savedSecrets().googleKey ?? '';
}
export const bingKey = () => env('BING_API_KEY') || savedSecrets().bingKey || '';
export const pagespeedKey = () => env('PAGESPEED_API_KEY') || savedSecrets().pagespeedKey || '';
/** Optional while the repository is public; needed once it is private again. */
export const githubToken = () => env('SEO_GITHUB_TOKEN') || savedSecrets().githubToken || '';

/** The CRM's read-only token (contacts and custom fields, read only) and the
 *  account it reads, for the Leads tab (owner, 9 Oct 2026). Optional. */
export const crmToken = () => env('SEO_CRM_TOKEN') || savedSecrets().crmToken || '';
export const crmLocationId = () => env('SEO_CRM_LOCATION_ID') || savedSecrets().crmLocationId || '';

/** The token Hostinger's cron sends to start a run: the environment, or one
 *  the app made itself and keeps in the private folder (the cron script
 *  beside it reads the same file, so nobody ever types it). */
export function cronToken(): string {
  if (env('SEO_CRON_TOKEN')) return env('SEO_CRON_TOKEN');
  try {
    return fs.readFileSync(path.join(seoConfig.dataDir, 'cron-token'), 'utf8').trim();
  } catch {
    return '';
  }
}

/** The read-only key for Claude (app/api/seo/read): only its hash is kept, in
 *  the same private file. The environment's SEO_READ_TOKEN also works. */
const hash = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

export function createReadKey(): string {
  const key = 'seo_read_' + crypto.randomBytes(24).toString('hex');
  saveSecret('readKeyHash', hash(key));
  return key;
}

export const hasReadKey = () => Boolean(env('SEO_READ_TOKEN') || savedSecrets().readKeyHash);

export function readKeyMatches(given: string): boolean {
  const expected = env('SEO_READ_TOKEN') ? hash(env('SEO_READ_TOKEN')) : savedSecrets().readKeyHash;
  if (!expected) return false;
  const a = Buffer.from(hash(given));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** The account the Google key belongs to (not a secret), for the Settings tab. */
export function googleKeyAccount(): string {
  try {
    return (JSON.parse(googleKey()) as { client_email?: string }).client_email ?? '';
  } catch {
    return '';
  }
}

/** For the Data sources and Settings tabs: which settings exist, never their values. */
export function settingsPresence() {
  return [
    { name: 'Admin addresses', set: seoConfig.adminEmails.length > 0 },
    { name: 'Scheduled run token', set: Boolean(cronToken()) },
    { name: 'Google service account key', set: Boolean(googleKey()) },
    { name: 'Bing Webmaster API key', set: Boolean(bingKey()) },
    { name: 'PageSpeed API key (optional)', set: Boolean(pagespeedKey()) },
    { name: 'GitHub read token (needed once the repository is private)', set: Boolean(githubToken()) },
    { name: 'CRM read-only token and account (optional, for the Leads tab)', set: Boolean(crmToken() && crmLocationId()) },
  ];
}
