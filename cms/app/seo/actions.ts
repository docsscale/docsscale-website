'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSignInLink, redeemSignInLink, requireUser, signOut } from '../../lib/seo/auth';
import { IS_PRODUCTION, createReadKey, saveSecret } from '../../lib/seo/config';
import { sendSignInLink } from '../../lib/seo/mail';
import { startRun } from '../../lib/seo/run';
import { now, store } from '../../lib/seo/store';

export async function requestLink(form: FormData) {
  const made = await createSignInLink(String(form.get('email') ?? ''));
  if (made) {
    try {
      await sendSignInLink(made.email, made.link);
    } catch (e) {
      console.error('[seo] sign-in email failed:', (e as Error).message);
      redirect('/seo/sign-in?sent=error');
    }
  }
  redirect('/seo/sign-in?sent=1');
}

export async function confirmLink(form: FormData) {
  const ok = await redeemSignInLink(String(form.get('t') ?? ''));
  redirect(ok ? '/seo' : '/seo/sign-in?expired=1');
}

export async function leave() {
  await signOut();
  redirect('/seo/sign-in');
}

export async function runNow(form: FormData) {
  const user = await requireUser('/seo/sources (run)', 'admin');
  const job = String(form.get('job')) === 'weekly' ? 'weekly' : 'daily';
  const id = startRun(job, user.email);
  redirect(`/seo/sources?run=${id ? 'started' : 'busy'}`);
}

/** People and roles: only the admin changes them (plan, section 3). Admins
 *  themselves are set on the server, not here. */
export async function addPerson(form: FormData) {
  const user = await requireUser('/seo/access (add person)', 'admin');
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const role = String(form.get('role'));
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (role === 'seo' || role === 'editor')) {
    store()
      .prepare('INSERT INTO users (email, role, added_at, added_by) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO UPDATE SET role = excluded.role')
      .run(email, role, now(), user.email);
  }
  redirect('/seo/access');
}

/** Keys given on the Settings tab go to the private folder (lib/seo/config.ts);
 *  the Google key is checked to be a service account key before it is kept. */
export async function saveKeys(form: FormData) {
  await requireUser('/seo/settings (save keys)', 'admin');
  let changed = false;
  const file = form.get('googleKeyFile');
  if (file instanceof File && file.size > 0) {
    let parsed: { type?: unknown; client_email?: unknown; private_key?: unknown } = {};
    try {
      parsed = JSON.parse(await file.text()) as typeof parsed;
    } catch {
      redirect('/seo/settings?error=google');
    }
    if (parsed.type !== 'service_account' || typeof parsed.client_email !== 'string' || typeof parsed.private_key !== 'string') redirect('/seo/settings?error=google');
    saveSecret('googleKey', JSON.stringify(parsed));
    changed = true;
  }
  for (const name of ['bingKey', 'pagespeedKey', 'githubToken'] as const) {
    const value = String(form.get(name) ?? '').trim();
    if (value) {
      saveSecret(name, value);
      changed = true;
    }
  }
  redirect(changed ? '/seo/settings?saved=1' : '/seo/settings?error=nothing');
}

/** A read-only key for Claude (app/api/seo/read). Shown once, on the next
 *  page load, through a one-minute cookie; the app keeps only its hash. */
export async function makeReadKey() {
  await requireUser('/seo/settings (make read-only key)', 'admin');
  const key = createReadKey();
  (await cookies()).set('ds_seo_newkey', key, { httpOnly: true, sameSite: 'lax', secure: IS_PRODUCTION, path: '/seo/settings', maxAge: 60 });
  redirect('/seo/settings?saved=1');
}

export async function clearKey(form: FormData) {
  await requireUser('/seo/settings (remove key)', 'admin');
  const name = String(form.get('name'));
  if (name === 'googleKey' || name === 'bingKey' || name === 'pagespeedKey' || name === 'githubToken' || name === 'readKeyHash') saveSecret(name, '');
  redirect('/seo/settings?saved=1');
}

export async function removePerson(form: FormData) {
  await requireUser('/seo/access (remove person)', 'admin');
  store().prepare('DELETE FROM users WHERE email = ?').run(String(form.get('email') ?? ''));
  redirect('/seo/access');
}
