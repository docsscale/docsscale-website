#!/usr/bin/env node
// Builds a release folder and uploads it to Hostinger.
//
//   node scripts/deploy.mjs --target staging            (web build + server files → staging)
//   node scripts/deploy.mjs --target production --yes   (same → docsscale.com; guarded)
//   node scripts/deploy.mjs --target staging --dry-run  (assemble release/<target>/ only)
//   node scripts/deploy.mjs --target preview            (drafts included → preview.docsscale.com)
//   node scripts/deploy.mjs --target production --prune (report only: files on the
//        server that are not in this release. Uploads nothing, deletes nothing.
//        The list is saved to release/<target>-prune.txt.)
//   node scripts/deploy.mjs --target production --delete-listed <file> --yes
//        (deletes exactly the paths in <file>, one per line: a prune list the
//         owner has read and approved. Needs the owner's approval every time.)
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
//   preview    → preview.docsscale.com's own public_html (upload credentials for
//                 that domain): the site built with drafts, password, noindex, no PHP
//   staging    → public_html/staging_html/ (+ password .htaccess, noindex robots,
//                                           _server/environment.php → private-staging/)
// Files are uploaded over existing ones; a deploy never deletes anything. Files
// from older releases stay on the server until pruned (--prune lists them;
// --delete-listed removes an approved list). Old pages must not stay reachable
// meanwhile: redirect them in .htaccess, as for /services/<industry>/.
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_CHECKS = [
  'Lint, types, format, build',
  'Lead handler tests (PHP)',
  'Dependency audit',
  'Pixel + behaviour parity with the live build',
  'Performance budget',
];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args[args.indexOf(`--${name}`) + 1];
const target = option('target');
if (!['staging', 'production', 'preview'].includes(target))
  fail('Use --target staging, --target production or --target preview');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const release = path.join(root, 'release', target);
const git = (cmd) => execSync(`git ${cmd}`, { cwd: root }).toString().trim();

const rollbackOriginal = flag('rollback-original');
if (rollbackOriginal && target !== 'production') fail('--rollback-original is for production only.');
if (rollbackOriginal && !flag('yes') && !flag('dry-run')) fail('Rollback needs --yes.');

const pruneReport = flag('prune');
const deleteList = flag('delete-listed') ? option('delete-listed') : null;
if (deleteList && !flag('yes')) fail('--delete-listed needs --yes, and the owner\'s approval of that exact list.');
if (deleteList && !fs.existsSync(deleteList)) fail(`No such list: ${deleteList}`);

// 1. Safety checks for production (skipped for the emergency rollback, which
//    must work even when main or CI is broken, and for the read-only prune report).
// The publish workflow (.github/workflows/publish.yml) has just built and
// checked this exact commit itself, in the same job, before it existed on
// GitHub; the CI gate below cannot apply to it. Honoured only inside that workflow.
const publishedByWorkflow =
  flag('checked-by-publish-workflow') && process.env.GITHUB_WORKFLOW === 'Publish content';
if (flag('checked-by-publish-workflow') && !publishedByWorkflow)
  fail('--checked-by-publish-workflow only works inside the "Publish content" workflow.');

if (target === 'production' && !flag('dry-run') && !rollbackOriginal && !pruneReport && !publishedByWorkflow) {
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
// The preview site shows drafts too (CONTENT_PREVIEW), every page noindex.
if (!flag('skip-build') && !rollbackOriginal)
  execSync('npm run build', {
    cwd: path.join(root, 'web'),
    stdio: 'inherit',
    env: { ...process.env, ...(target === 'preview' ? { CONTENT_PREVIEW: '1' } : {}) },
  });

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
  // The preview site is for reading content: it has no lead handler, so its
  // forms cannot send anything anywhere.
  if (target !== 'preview') copyDir(path.join(root, 'server/public_html'), release);
}
if (target === 'preview') {
  // Production's rules (redirects, the 404 page) followed by the password and noindex.
  fs.writeFileSync(
    path.join(release, '.htaccess'),
    fs.readFileSync(path.join(root, 'server/public_html/.htaccess'), 'utf8') +
      '\n' +
      fs.readFileSync(path.join(root, 'server/preview/.htaccess'), 'utf8'),
  );
  fs.copyFileSync(path.join(root, 'server/staging/robots.txt'), path.join(release, 'robots.txt'));
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

// 3b. Prune: what is on the server but not in this release.
// Never listed and never deleted: anything that isn't this site's own deploy
// output (the staging site inside production's folder, certificate challenges,
// host-managed files, dotfiles).
const PROTECTED = [/^staging_html(\/|$)/, /^\.well-known(\/|$)/, /^cgi-bin(\/|$)/, /(^|\/)\.[^/]+/, /(^|\/)error_log$/];
const isProtected = (rel) => PROTECTED.some((pattern) => pattern.test(rel));
const resources = base.replace('/api/tus/', '/api/resources/');
const encode = (rel) => rel.split('/').map(encodeURIComponent).join('/');
async function listServer(dir = '') {
  const response = await fetch(`${resources}/${encode(dir)}`, { headers });
  if (!response.ok) fail(`could not list ${dir || '/'} on the server (${response.status})`);
  const found = [];
  for (const item of (await response.json()).items ?? []) {
    const rel = dir ? `${dir}/${item.name}` : item.name;
    if (isProtected(rel)) continue;
    if (item.isDir) found.push(...(await listServer(rel)));
    else found.push({ rel, size: item.size, modified: item.modified.slice(0, 10) });
  }
  return found;
}
if (pruneReport) {
  const inRelease = new Set(files.map((file) => file.split(path.sep).join('/')));
  const extra = (await listServer()).filter((file) => !inRelease.has(file.rel));
  const hashed = extra.filter((file) => /(^|\/)_next\/static\//.test(file.rel));
  const other = extra.filter((file) => !hashed.includes(file));
  const kb = (list) => `${Math.round(list.reduce((sum, file) => sum + file.size, 0) / 1024)} KB`;
  console.log(`\nPrune report for ${target} (nothing was changed):`);
  console.log(`  ${hashed.length} old build files under /_next/static/ (${kb(hashed)}): from older releases; no current page links to them`);
  console.log(`  ${other.length} other files not in this release (${kb(other)}): read the list before approving`);
  for (const file of other) console.log(`    ${file.modified}  ${file.rel}`);
  const out = path.join(root, 'release', `${target}-prune.txt`);
  fs.writeFileSync(out, [...other, ...hashed].map((file) => file.rel).join('\n') + '\n');
  console.log(`  Full list: ${path.relative(root, out)}. To delete an approved list: --delete-listed <file> --yes`);
  process.exit(0);
}
if (deleteList) {
  const inRelease = new Set(files.map((file) => file.split(path.sep).join('/')));
  const wanted = fs.readFileSync(deleteList, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
  // Refuse the whole list if any line could remove something that is in use.
  for (const rel of wanted) {
    if (rel.startsWith('/') || rel.includes('..') || rel.endsWith('/')) fail(`not a plain file path: ${rel}`);
    if (isProtected(rel)) fail(`protected, never deleted: ${rel}`);
    if (inRelease.has(rel)) fail(`in the current release, not deleted: ${rel}`);
  }
  let removed = 0;
  for (const rel of wanted) {
    const response = await fetch(`${resources}/${encode(rel)}`, { method: 'DELETE', headers });
    if (response.ok) removed++;
    else console.log(`  not deleted (${response.status}): ${rel}`);
  }
  console.log(`Deleted ${removed} of ${wanted.length} listed files on ${target}. Nothing was uploaded.`);
  process.exit(0);
}

// .htaccess first on staging so the password is in place before content lands.
files.sort((a, b) => (a === '.htaccess' ? -1 : b === '.htaccess' ? 1 : a.localeCompare(b)));
let done = 0;
// Each file is retried up to 4 times (network blips happen, e.g. a connect
// timeout on 28 Sep 2026 stopped a production deploy halfway). Uploads only
// overwrite, so retrying a file, or re-running the whole deploy, is safe.
async function upload(rel) {
  const body = fs.readFileSync(path.join(release, rel));
  const dest = `${base}/${rel.split(path.sep).map(encodeURIComponent).join('/')}?override=true`;
  const created = await fetch(dest, {
    method: 'POST',
    headers: { ...headers, 'Upload-Length': String(body.length), 'Upload-Offset': '0' },
  });
  if (created.status !== 201) throw new Error(`create failed (${created.status})`);
  if (body.length) {
    const patched = await fetch(dest, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': '0' },
      body,
    });
    if (patched.status !== 204) throw new Error(`upload failed (${patched.status})`);
  }
}
async function uploadWithRetries(rel) {
  for (let attempt = 1; ; attempt++) {
    try {
      await upload(rel);
      break;
    } catch (error) {
      if (attempt === 4) fail(`${rel}: ${error.message} (after 4 attempts; re-run the deploy to finish)`);
      console.log(`  retrying ${rel} (${error.message})`);
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
  done++;
  if (done % 25 === 0 || done === queue.length) console.log(`  uploaded ${done}/${queue.length}`);
}

// The preview site is rebuilt on every save in the editing screen, so it only
// sends the files that changed since the last upload (a list of each file's
// fingerprint is kept on the server), several at a time. Staging and
// production always send everything, one file at a time.
let queue = files;
const MANIFEST = '.deploy-manifest.json';
if (target === 'preview') {
  const fingerprint = (rel) =>
    crypto.createHash('sha256').update(fs.readFileSync(path.join(release, rel))).digest('hex');
  // version.txt carries the time of this build, so it always changes; it goes
  // last and tells an open preview page that the new version is complete.
  const now = Object.fromEntries(files.filter((rel) => rel !== 'version.txt').map((rel) => [rel, fingerprint(rel)]));
  let before = {};
  try {
    const response = await fetch(`${base.replace('/api/tus/', '/api/raw/')}/${MANIFEST}`, { headers });
    if (response.ok) before = await response.json();
  } catch {
    // No list yet, or unreadable: send everything.
  }
  queue = Object.keys(now).filter((rel) => before[rel] !== now[rel]);
  console.log(`  ${queue.length} of ${files.length} files changed since the last preview`);
  const waiting = [...queue];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (waiting.length) await uploadWithRetries(waiting.shift());
    }),
  );
  fs.writeFileSync(path.join(release, MANIFEST), JSON.stringify(now));
  await uploadWithRetries(MANIFEST);
  await uploadWithRetries('version.txt');
} else {
  for (const rel of files) await uploadWithRetries(rel);
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
