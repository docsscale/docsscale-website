import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { seoConfig } from './config';

// What the app sets up for itself in the private folder when it starts, so an
// install needs nothing typed into hPanel (owner, 8 Oct 2026):
//   - cron-token: the secret Hostinger's cron sends to /api/seo/run;
//   - cron.mjs: the script the two cron jobs run ("node cron.mjs daily"),
//     which reads that token from the file beside it.
// The admin addresses from the install are kept by the store itself. Also
// called from the places that need the token, in case the start hook did not run.

let done = false;

export function ensureServerFiles() {
  if (done) return;
  done = true;
  const dir = seoConfig.dataDir;
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });

  const tokenFile = path.join(dir, 'cron-token');
  if (!fs.existsSync(tokenFile) && !process.env.SEO_CRON_TOKEN) {
    fs.writeFileSync(tokenFile, crypto.randomBytes(24).toString('hex') + '\n', { mode: 0o600 });
  }

  const script = `// Written by the SEO dashboard when it starts; run by Hostinger's cron:
//   node ${path.join(dir, 'cron.mjs')} daily   (or weekly)
// Reads the run token from the file beside it and asks the app to collect.
import fs from 'node:fs';
import path from 'node:path';
const job = ['daily', 'weekly', 'all'].includes(process.argv[2]) ? process.argv[2] : 'daily';
const token = fs.readFileSync(path.join(import.meta.dirname, 'cron-token'), 'utf8').trim();
const res = await fetch(${JSON.stringify(seoConfig.publicUrl)} + '/api/seo/run?job=' + job, {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + token },
});
console.log(new Date().toISOString(), job, res.status, (await res.text()).slice(0, 200));
process.exit(res.ok ? 0 : 1);
`;
  const scriptFile = path.join(dir, 'cron.mjs');
  if (!fs.existsSync(scriptFile) || fs.readFileSync(scriptFile, 'utf8') !== script) fs.writeFileSync(scriptFile, script, { mode: 0o600 });
}

/** The command each cron job runs, shown on the Settings tab. */
export const cronCommand = (job: 'daily' | 'weekly') => `/opt/alt/alt-nodejs24/root/bin/node ${path.join(seoConfig.dataDir, 'cron.mjs')} ${job}`;
