import { spawn } from 'node:child_process';
import { IS_PRODUCTION, seoConfig } from './config';
import { setting } from './store';

// Mail goes out from the existing mailbox through the server's own mail
// program, as the daily failure email does (docs/SERVER.md), so it stays free.
// Sign-in links, the weekly summary and alerts all use the one sender below.

export async function sendMail(to: string, subject: string, body: string) {
  if (seoConfig.mailMode === 'console') {
    if (IS_PRODUCTION) throw new Error('SEO_MAIL_MODE=console is for a developer machine only.');
    console.log(`[seo] mail to ${to}: ${subject}\n${body}`);
    return;
  }
  const message = [
    `From: DocsScale <${seoConfig.mailFrom}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body,
    '',
  ].join('\r\n');

  await new Promise<void>((resolve, reject) => {
    const child = spawn('/usr/sbin/sendmail', ['-t', '-i', '-f', seoConfig.mailFrom], { stdio: ['pipe', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (d) => (err += String(d)));
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`sendmail exited ${code}: ${err.slice(0, 200)}`))));
    child.stdin.end(message);
  });
}

export async function sendSignInLink(to: string, link: string) {
  const body = [
    'Here is your sign-in link for the DocsScale SEO dashboard.',
    '',
    link,
    '',
    'It works once and expires in 15 minutes. If you did not ask for it, ignore this email.',
  ].join('\n');
  await sendMail(to, 'Your sign-in link for the DocsScale SEO dashboard', body);
}

/** An email to every admin, unless that kind of email is switched off on the
 *  Settings tab (owner, 9 Oct 2026: "I just visit the dashboard", so the
 *  dashboard comes to the inbox only when there is something to read).
 *  Never throws: a mail fault must not fail the run that caused it. */
export async function notifyAdmins(kind: 'summary' | 'alert', subject: string, body: string): Promise<boolean> {
  if (setting(`email.${kind}`, 'on') !== 'on') return false;
  const footer = `\n\n—\nThe DocsScale SEO dashboard: ${seoConfig.publicUrl}/seo\nSwitch these emails off on the Settings tab.`;
  let sent = false;
  for (const to of seoConfig.adminEmails) {
    try { await sendMail(to, subject, body + footer); sent = true; } catch (e) { console.error(`[seo] email to an admin failed: ${(e as Error).message}`); }
  }
  return sent;
}
