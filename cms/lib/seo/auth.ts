import crypto from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { seoConfig } from './config';
import { now, store } from './store';

// Email-link sign-in (owner's decision 2, 6 Oct 2026): no passwords to store or
// leak. Roles and the access log: docs/SEO-DASHBOARD-PLAN.md, sections 3 and 8.

export type Role = 'admin' | 'seo' | 'editor';
export type User = { email: string; role: Role; session: string };

const COOKIE = 'ds_seo';
const SESSION_DAYS = 30;
const LINK_MINUTES = 15;
const RANK: Record<Role, number> = { editor: 1, seo: 2, admin: 3 };

const sha = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

export function roleOf(email: string): Role | null {
  const e = email.toLowerCase();
  if (seoConfig.adminEmails.includes(e)) return 'admin';
  const row = store().prepare('SELECT role FROM users WHERE email = ?').get(e) as { role: Role } | undefined;
  return row?.role ?? null;
}

/** Shortened addresses (owner's decision 4): the last part of an IPv4 address
 *  and all but the first three groups of an IPv6 address are dropped. */
export function shortIp(ip: string) {
  if (!ip) return 'Unknown';
  if (ip.includes('.')) return ip.replace(/^::ffff:/, '').split('.').slice(0, 3).join('.') + '.x';
  return ip.split(':').slice(0, 3).join(':') + '::x';
}

/** A plain description of the browser, not the full user-agent string. */
export function deviceOf(ua: string) {
  const os = /iPhone|iPad/.test(ua) ? 'iPhone/iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Unknown system';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Unknown browser';
  return `${browser} on ${os}`;
}

async function client() {
  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || '';
  return { ip: shortIp(ip), device: deviceOf(h.get('user-agent') ?? '') };
}

/** Returns the link to send, or null when the address may not sign in or has
 *  asked too often. The screen says the same thing either way, so it never
 *  reveals which addresses are on the list. */
export async function createSignInLink(rawEmail: string): Promise<{ email: string; link: string } | null> {
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const { ip } = await client();
  const db = store();
  const hourAgo = new Date(Date.now() - 3600_000).toISOString();
  const recent = db
    .prepare('SELECT COUNT(*) AS n FROM sign_in_requests WHERE at > ? AND (email = ? OR ip = ?)')
    .get(hourAgo, email, ip) as { n: number };
  db.prepare('INSERT INTO sign_in_requests (at, email, ip) VALUES (?, ?, ?)').run(now(), email, ip);
  if (recent.n >= 5 || !roleOf(email)) return null;
  const token = crypto.randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + LINK_MINUTES * 60_000).toISOString();
  db.prepare('INSERT INTO login_tokens (hash, email, expires) VALUES (?, ?, ?)').run(sha(token), email, expires);
  return { email, link: `${seoConfig.publicUrl}/seo/sign-in/confirm?t=${encodeURIComponent(token)}` };
}

/** Uses up a link and starts a session. Called from a button press, not from
 *  opening the link, because mail scanners open links on their own. */
export async function redeemSignInLink(token: string): Promise<boolean> {
  const db = store();
  const row = db.prepare('SELECT email, expires, used_at FROM login_tokens WHERE hash = ?').get(sha(token)) as
    | { email: string; expires: string; used_at: string | null }
    | undefined;
  if (!row || row.used_at || row.expires < now() || !roleOf(row.email)) return false;
  db.prepare('UPDATE login_tokens SET used_at = ? WHERE hash = ?').run(now(), sha(token));
  const session = crypto.randomBytes(32).toString('base64url');
  const { ip, device } = await client();
  db.prepare('INSERT INTO sessions (hash, email, created, last_seen, ip, device) VALUES (?, ?, ?, ?, ?, ?)').run(
    sha(session), row.email, now(), now(), ip, device,
  );
  (await cookies()).set(COOKIE, session, {
    httpOnly: true,
    secure: seoConfig.publicUrl.startsWith('https://'),
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 86400,
  });
  return true;
}

export async function signOut() {
  const c = await cookies();
  const session = c.get(COOKIE)?.value;
  if (session) store().prepare('UPDATE sessions SET ended = ? WHERE hash = ?').run(now(), sha(session));
  c.delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const session = (await cookies()).get(COOKIE)?.value;
  if (!session) return null;
  const row = store().prepare('SELECT email, created, ended FROM sessions WHERE hash = ?').get(sha(session)) as
    | { email: string; created: string; ended: string | null }
    | undefined;
  if (!row || row.ended) return null;
  if (Date.now() - Date.parse(row.created) > SESSION_DAYS * 86400_000) return null;
  const role = roleOf(row.email); // a person taken off the list loses access at once
  return role ? { email: row.email, role, session: sha(session) } : null;
}

/** Every dashboard page starts with this: no session, no page; and each page
 *  seen is written to the access log. */
export async function requireUser(path: string, minRole: Role = 'editor'): Promise<User> {
  const user = await currentUser();
  if (!user) redirect('/seo/sign-in');
  if (RANK[user.role] < RANK[minRole]) redirect('/seo');
  const db = store();
  db.prepare('UPDATE sessions SET last_seen = ? WHERE hash = ?').run(now(), user.session);
  db.prepare('INSERT INTO page_views (session, at, path) VALUES (?, ?, ?)').run(user.session, now(), path);
  return user;
}

export const canSee = (user: User, minRole: Role) => RANK[user.role] >= RANK[minRole];
