#!/usr/bin/env node
// Builds a release folder and uploads it to Hostinger.
//
//   node scripts/deploy.mjs --target staging            (web build + server files → staging)
//   node scripts/deploy.mjs --target production --yes   (same → docsscale.com; guarded)
//   node scripts/deploy.mjs --target staging --dry-run  (assemble release/<target>/ only)
//   node scripts/deploy.mjs --target production --rollback-original --yes
//        (emergency: put back the site exactly as it was before v1.0: the static
//         export in reference/live-2026-09-25/ plus the server code at tag
//         pre-v1.0-live. No build, no CI gate. See docs/RELEASE.md.)
//
// Upload credentials come from Hostinger's "generate upload URL" endpoint and are
// passed as environment variables (never committed):
//   HOSTINGER_UPLOAD_URL   e.g. https://srvXXXX-files.hstgr.io/rest/<id>/api/tus/public_html
//   HOSTINGER_AUTH         the auth_key
//   HOSTINGER_REST         the rest_auth_key
//
// What goes where on the server:
//   production → public_html/              (never touches public_html/staging_html/)
//   staging    → public_html/staging_html/ (+ password .htaccess, noindex robots,
//                                           _server/environment.php → private-staging/)
// Files are uploaded over existing ones; nothing on the server is deleted. Old,
// content-hashed /_next/ files stay harmlessly until cleaned up by hand.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_CHECKS = [
  'Lint, types, format, build',
  'Lead handler tests (PHP)',
  'Dependency audit',
  'Pixel + behaviour parity with the live build',
];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args[args.indexOf(`--${name}`) + 1];
const target = option('target');
if (!['staging', 'production'].includes(target)) fail('Use --target staging or --target production');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const release = path.join(root, 'release', target);
const git = (cmd) => execSync(`git ${cmd}`, { cwd: root }).toString().trim();

const rollbackOriginal = flag('rollback-original');
if (rollbackOriginal && target !== 'production') fail('--rollback-original is for production only.');
if (rollbackOriginal && !flag('yes') && !flag('dry-run')) fail('Rollback needs --yes.');

// 1. Safety checks for production (skipped for the emergency rollback, which
//    must work even when main or CI is broken).
if (target === 'production' && !flag('dry-run') && !rollbackOriginal) {
  if (!flag('yes')) fail('Production deploy needs --yes (after checking staging).');
  if (git('status --porcelain')) fail('Working tree has uncommitted changes.');
  if (git('rev-parse --abbrev-ref HEAD') !== 'main') fail('Production deploys only from main.');
  // GitHub's free plan can't enforce "checks must pass before merge" on a private
  // repo, so the gate is here: this exact commit must be on GitHub with every
  // CI job green.
  const sha = git('rev-parse HEAD');
  if (git('rev-parse origin/main') !== sha) fail('Push main to GitHub first (local main differs from origin/main).');
  const runs = JSON.parse(
    execSync(`gh api repos/docsscale/docsscale-website/commits/${sha}/check-runs --jq '[.check_runs[] | {name, status, conclusion}]'`).toString(),
  );
  const missing = REQUIRED_CHECKS.filter((name) => !runs.some((r) => r.name === name && r.conclusion === 'success'));
  if (missing.length) fail(`CI is not green for ${sha.slice(0, 7)}: ${missing.join(', ')}`);
}

// 2. Build the site (static export → web/out).
if (!flag('skip-build') && !rollbackOriginal) execSync('npm run build', { cwd: path.join(root, 'web'), stdio: 'inherit' });

// 3. Assemble the release folder.
fs.rmSync(release, { recursive: true, force: true });
if (rollbackOriginal) {
  copyDir(path.join(root, 'reference/live-2026-09-25'), release);
  const serverFiles = git('ls-tree -r --name-only pre-v1.0-live -- server/public_html').split('\n');
  for (const file of serverFiles) {
    const dest = path.join(release, path.relative('server/public_html', file));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, execSync(`git show pre-v1.0-live:${file}`, { cwd: root }));
  }
} else {
  copyDir(path.join(root, 'web/out'), release);
  copyDir(path.join(root, 'server/public_html'), release);
}
if (target === 'staging') {
  // Hostinger does not apply public_html/.htaccess to the subdomain folder, so
  // staging gets production's rules followed by the staging-only additions.
  fs.writeFileSync(
    path.join(release, '.htaccess'),
    fs.readFileSync(path.join(root, 'server/public_html/.htaccess'), 'utf8') +
      '\n' +
      fs.readFileSync(path.join(root, 'server/staging/.htaccess'), 'utf8'),
  );
  fs.copyFileSync(path.join(root, 'server/staging/robots.txt'), path.join(release, 'robots.txt'));
  fs.copyFileSync(path.join(root, 'server/staging/environment.php'), path.join(release, '_server/environment.php'));
}
const version = `${rollbackOriginal ? 'original site (pre-v1.0)' : git('describe --tags --always --dirty')} (${new Date().toISOString()})`;
fs.writeFileSync(path.join(release, 'version.txt'), `${target} ${version}\n`);
const files = listFiles(release);
console.log(`Release ${target}: ${files.length} files, ${version}`);
if (flag('dry-run')) process.exit(0);

// 4. Upload.
const { HOSTINGER_UPLOAD_URL: url, HOSTINGER_AUTH: auth, HOSTINGER_REST: rest } = process.env;
if (!url || !auth || !rest) fail('Set HOSTINGER_UPLOAD_URL, HOSTINGER_AUTH and HOSTINGER_REST.');
const base = target === 'staging' ? `${url}/staging_html` : url;
const headers = { 'X-Auth': auth, 'X-Auth-Rest': rest, 'Tus-Resumable': '1.0.0' };

// .htaccess first on staging so the password is in place before content lands.
files.sort((a, b) => (a === '.htaccess' ? -1 : b === '.htaccess' ? 1 : a.localeCompare(b)));
let done = 0;
for (const rel of files) {
  const body = fs.readFileSync(path.join(release, rel));
  const dest = `${base}/${rel.split(path.sep).map(encodeURIComponent).join('/')}?override=true`;
  const created = await fetch(dest, {
    method: 'POST',
    headers: { ...headers, 'Upload-Length': String(body.length), 'Upload-Offset': '0' },
  });
  if (created.status !== 201) fail(`${rel}: create failed (${created.status})`);
  if (body.length) {
    const patched = await fetch(dest, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': '0' },
      body,
    });
    if (patched.status !== 204) fail(`${rel}: upload failed (${patched.status})`);
  }
  done++;
  if (done % 25 === 0 || done === files.length) console.log(`  uploaded ${done}/${files.length}`);
}
console.log(`Deployed ${target}: ${version}`);

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}
function listFiles(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(path.join(dir, e.name), path.join(prefix, e.name)) : [path.join(prefix, e.name)],
  );
}
function fail(message) {
  console.error(`deploy: ${message}`);
  process.exit(1);
}
