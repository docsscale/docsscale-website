'use server';

import { redirect } from 'next/navigation';
import { createSignInLink, redeemSignInLink, requireUser, signOut } from '../../lib/seo/auth';
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

export async function removePerson(form: FormData) {
  await requireUser('/seo/access (remove person)', 'admin');
  store().prepare('DELETE FROM users WHERE email = ?').run(String(form.get('email') ?? ''));
  redirect('/seo/access');
}
