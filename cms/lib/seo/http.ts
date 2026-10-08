import crypto from 'node:crypto';
import fs from 'node:fs';
import { seoConfig } from './config';

// Small helpers shared by the data sources. Keys never appear in an error
// message: errors quote the address without its query string.

export async function getJson<T = unknown>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(90_000) });
  if (!res.ok) {
    const text = (await res.text()).slice(0, 300).replace(/\s+/g, ' ');
    throw new Error(`${url.split('?')[0]} answered ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function postJson<T = unknown>(url: string, body: unknown, headers: Record<string, string> = {}) {
  return getJson<T>(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
}

/** Read-only Google access token from the service account key file, minted with
 *  Node's own crypto (no Google library): Search Console and GA4, read scopes only. */
let cached: { token: string; until: number } | null = null;

export async function googleToken(): Promise<string> {
  if (cached && cached.until > Date.now() + 60_000) return cached.token;
  if (!seoConfig.googleKeyJson && !seoConfig.googleKeyFile) throw new Error('No Google key is set on the server.');
  const key = JSON.parse(seoConfig.googleKeyJson || fs.readFileSync(seoConfig.googleKeyFile, 'utf8')) as {
    client_email: string; private_key: string; private_key_id: string; token_uri: string;
  };
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const iat = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'RS256', typ: 'JWT', kid: key.private_key_id });
  const claims = b64({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly',
    aud: key.token_uri,
    iat,
    exp: iat + 3600,
  });
  const signature = crypto.sign('RSA-SHA256', Buffer.from(`${head}.${claims}`), key.private_key).toString('base64url');
  const res = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claims}.${signature}` }),
  });
  if (!res.ok) throw new Error(`Google refused the key (${res.status}).`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: json.access_token, until: Date.now() + json.expires_in * 1000 };
  return cached.token;
}

export const isoDay = (d: Date) => d.toISOString().slice(0, 10);
export const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000);

/** Two equal 28-day periods ending `lagDays` ago (SEO-OS section 6: compare
 *  equal periods; Search Console's last three days are incomplete). */
export function periods(lagDays: number) {
  const end = daysAgo(lagDays);
  const start = daysAgo(lagDays + 27);
  const prevEnd = daysAgo(lagDays + 28);
  const prevStart = daysAgo(lagDays + 55);
  return { current: [isoDay(start), isoDay(end)] as const, previous: [isoDay(prevStart), isoDay(prevEnd)] as const };
}

/** Fetch a public page of our own site as text. */
export async function getText(url: string) {
  const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30_000), headers: { 'User-Agent': 'DocsScale-SEO-dashboard' } });
  return { status: res.status, location: res.headers.get('location'), robots: res.headers.get('x-robots-tag'), text: res.status === 200 ? await res.text() : '' };
}
