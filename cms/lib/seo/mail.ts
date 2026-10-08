import { spawn } from 'node:child_process';
import { IS_PRODUCTION, seoConfig } from './config';

// Sign-in links go out from the existing mailbox through the server's own mail
// program, as the daily failure email does (docs/SERVER.md), so it stays free.

export async function sendSignInLink(to: string, link: string) {
  const subject = 'Your sign-in link for the DocsScale SEO dashboard';
  const body = [
    'Here is your sign-in link for the DocsScale SEO dashboard.',
    '',
    link,
    '',
    'It works once and expires in 15 minutes. If you did not ask for it, ignore this email.',
  ].join('\n');

  if (seoConfig.mailMode === 'console') {
    if (IS_PRODUCTION) throw new Error('SEO_MAIL_MODE=console is for a developer machine only.');
    console.log(`[seo] sign-in link for ${to}: ${link}`);
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
