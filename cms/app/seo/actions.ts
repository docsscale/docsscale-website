'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSignInLink, redeemSignInLink, requireUser, signOut } from '../../lib/seo/auth';
import { IS_PRODUCTION, createReadKey, saveSecret } from '../../lib/seo/config';
import { sendSignInLink } from '../../lib/seo/mail';
import { parseCsv } from '../../lib/seo/csv';
import { approverRole, moveFinding, noteFinding } from '../../lib/seo/findings';
import { announce, indexingRows, watchSitemap } from '../../lib/seo/indexing';
import { startRun } from '../../lib/seo/run';
import { collectContent } from '../../lib/seo/sources/content';
import { now, recordSource, saveSetting, saveSnapshot, store } from '../../lib/seo/store';

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
  for (const name of ['bingKey', 'pagespeedKey', 'githubToken', 'crmToken', 'crmLocationId'] as const) {
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
  if (name === 'crmToken') { saveSecret('crmToken', ''); saveSecret('crmLocationId', ''); }
  redirect('/seo/settings?saved=1');
}

export async function removePerson(form: FormData) {
  await requireUser('/seo/access (remove person)', 'admin');
  store().prepare('DELETE FROM users WHERE email = ?').run(String(form.get('email') ?? ''));
  redirect('/seo/access');
}

// Phase 2 (docs/SEO-DASHBOARD-PLAN.md, sections 6 to 8). Every action checks
// the role again, and every change to the queue is logged with who made it.

const back = (to: string) => redirect(to);

/** Approve, Save for later or Reject: the owner's three decisions. Only the
 *  admin, unless Settings extends it to the SEO role (decision 3). */
export async function decideFinding(form: FormData) {
  const user = await requireUser('/seo/queue (decide)', approverRole());
  const to = String(form.get('to'));
  if (to === 'Approved' || to === 'Saved for later' || to === 'Rejected' || to === 'Recommended') {
    moveFinding(Number(form.get('id')), to, user.email, String(form.get('note') ?? '').trim());
  }
  back(String(form.get('back') || '/seo/queue'));
}

/** In progress, Done, or back to Approved: progress noted by the SEO role. A
 *  Done item reopens only with a written reason (plan, section 7). */
export async function progressFinding(form: FormData) {
  const user = await requireUser('/seo/queue (progress)', 'seo');
  const to = String(form.get('to'));
  const reason = String(form.get('reason') ?? '').trim();
  if (to === 'In progress' || to === 'Done' || to === 'Approved') moveFinding(Number(form.get('id')), to, user.email, '', reason);
  back(String(form.get('back') || '/seo/queue'));
}

export async function saveFindingNote(form: FormData) {
  const user = await requireUser('/seo/queue (note)', 'seo');
  const h = Number(form.get('horizon'));
  noteFinding(Number(form.get('id')), String(form.get('note') ?? '').trim().slice(0, 2000), user.email, [30, 60, 90].includes(h) ? h : null);
  back(String(form.get('back') || '/seo/queue'));
}

/** The Overview's written summary (the weekly run's judgement) and the
 *  "what to ignore" list, kept between weeks. */
export async function writeNote(form: FormData) {
  const user = await requireUser('/seo (note)', 'seo');
  const kind = String(form.get('kind')) === 'ignore' ? 'ignore' : 'overview';
  const text = String(form.get('text') ?? '').trim().slice(0, 8000);
  if (text) store().prepare('INSERT INTO notes (kind, at, by, text, reason) VALUES (?, ?, ?, ?, ?)').run(kind, now(), user.email, text, String(form.get('reason') ?? '').trim().slice(0, 500));
  back('/seo');
}

export async function removeNote(form: FormData) {
  await requireUser('/seo (remove note)', 'seo');
  store().prepare('UPDATE notes SET removed = ? WHERE id = ?').run(now(), Number(form.get('id')));
  back('/seo');
}

export async function addPlanItem(form: FormData) {
  const user = await requireUser('/seo/plan (add)', 'seo');
  const h = Number(form.get('horizon'));
  const text = String(form.get('text') ?? '').trim().slice(0, 500);
  if (text && [30, 60, 90].includes(h)) store().prepare('INSERT INTO plan_items (horizon, text, added_by, added_at) VALUES (?, ?, ?, ?)').run(h, text, user.email, now());
  back('/seo/plan');
}

export async function donePlanItem(form: FormData) {
  await requireUser('/seo/plan (done)', 'seo');
  store().prepare('UPDATE plan_items SET done_at = ? WHERE id = ?').run(now(), Number(form.get('id')));
  back('/seo/plan');
}

/** The manual AI-check log: the one place a person types a result, and it is
 *  labelled as manual (plan, section 9). */
export async function addAiCheck(form: FormData) {
  const user = await requireUser('/seo/ai (log)', 'seo');
  const assistant = String(form.get('assistant') ?? '').trim().slice(0, 60);
  const question = String(form.get('question') ?? '').trim().slice(0, 300);
  if (assistant && question) {
    store().prepare('INSERT INTO ai_checks (at, by, assistant, question, cited, detail) VALUES (?, ?, ?, ?, ?, ?)')
      .run(now(), user.email, assistant, question, form.get('cited') === 'yes' ? 1 : 0, String(form.get('detail') ?? '').trim().slice(0, 500));
  }
  back('/seo/ai');
}

/** CSV only, 2 MB at most, the first 5,000 rows kept; stamped with source,
 *  date and who uploaded it. Never served back as a page. */
export async function importCsv(form: FormData) {
  const user = await requireUser('/seo/imports (upload)', 'seo');
  const file = form.get('file');
  const source = String(form.get('source') ?? '').trim().slice(0, 80) || 'Other';
  if (!(file instanceof File) || file.size === 0) return back('/seo/imports?error=nothing');
  if (file.size > 2_000_000 || !/\.csv$/i.test(file.name)) back('/seo/imports?error=csv');
  const parsed = parseCsv(await file.text());
  if (!parsed.columns.length) back('/seo/imports?error=csv');
  store().prepare('INSERT INTO imports (at, by, source, filename, note, rows, columns, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(now(), user.email, source, file.name.slice(0, 120), String(form.get('note') ?? '').trim().slice(0, 500), parsed.rows.length, JSON.stringify(parsed.columns), JSON.stringify(parsed.rows.slice(0, 5000)));
  back('/seo/imports?saved=1');
}

/** Settings the admin changes on screen, each with a reason (plan, section 9). */
export async function saveEmailSettings(form: FormData) {
  const user = await requireUser('/seo/settings (emails)', 'admin');
  for (const key of ['email.summary', 'email.alert', 'email.monthly']) saveSetting(key, form.get(key) ? 'on' : 'off', user.email, 'Changed on the Settings tab');
  back('/seo/settings?saved=1');
}

export async function saveQueueSettings(form: FormData) {
  const user = await requireUser('/seo/settings (queue)', 'admin');
  const reason = String(form.get('reason') ?? '').trim().slice(0, 300) || 'No reason given';
  saveSetting('approvers', form.get('approvers') === 'seo' ? 'seo' : 'admin', user.email, reason);
  for (const [key, min, max] of [['threshold.minImpressions', 1, 10000], ['threshold.lostClicksPct', 10, 90], ['threshold.staleDays', 30, 1000]] as const) {
    const v = Number(form.get(key));
    if (Number.isFinite(v) && v >= min && v <= max) saveSetting(key, String(Math.round(v)), user.email, reason);
  }
  back('/seo/settings?saved=1');
}

/** "Check my drafts now" on the Content tab: reads the content files again
 *  (the daily run would otherwise show the morning's copy) and runs the
 *  pre-publish checks on every post. */
export async function refreshContent() {
  await requireUser('/seo/content (check drafts)', 'editor');
  try {
    saveSnapshot('content', await collectContent());
    recordSource('content', 'ok', 'Returned data (checked from the Content tab)');
  } catch (e) {
    recordSource('content', 'failing', (e as Error).message.slice(0, 400));
    back('/seo/content?checked=error');
  }
  back('/seo/content?checked=1');
}

/** Technical health → Indexing: look at the sitemap now (new and changed
 *  pages are sent), or send every page to both engines on request. */
export async function watchSitemapNow() {
  await requireUser('/seo/technical (watch sitemap)', 'seo');
  try { await watchSitemap('Technical health tab'); } catch (e) { back(`/seo/technical?indexing=${encodeURIComponent((e as Error).message.slice(0, 120))}`); }
  back('/seo/technical?indexing=watched');
}

export async function sendAllPages() {
  const user = await requireUser('/seo/technical (send all pages)', 'admin');
  const urls = indexingRows().map((r) => r.url);
  if (!urls.length) { try { await watchSitemap(user.email); } catch { /* reported on the panel */ } }
  await announce(indexingRows().map((r) => r.url), user.email);
  back('/seo/technical?indexing=sent');
}
