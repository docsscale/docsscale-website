// Decides what may go from the working copy (content/working, where the
// editing screen saves) to the live copy (main), and applies it.
//   node scripts/publish-content.mjs            say what would be published, change nothing
//   node scripts/publish-content.mjs --apply    copy the approved posts into the current checkout of main
//
// The rules (docs/COMPLETION-PLAN.md, section 6, "How publishing works"):
// 1. The working copy may differ from main only in content and uploaded
//    pictures. Anything else stops everything: a sign-in to the editing screen
//    can never ship code, even a stolen one.
// 2. A post goes live only when its status is "published" AND the save that
//    last touched it was made in the editing screen by an approver. Who that
//    was is written into the save by the sign-in service, not by the browser,
//    and GitHub confirms the save really came from that service.
// 3. Drafts and "ready for review" posts stay where they are. Taking a live
//    post down is not done here: it needs a redirect, so it is a developer's job.
// Categories and team members follow the posts that use them.
//
// Approvers: the repository variable CONTENT_APPROVERS (email addresses,
// comma-separated), kept outside the editing screen on purpose.
import { execFileSync } from 'node:child_process';

const apply = process.argv.includes('--apply');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const MAIN = 'origin/main';
const WORKING = 'origin/content/working';
const CONTENT = /^(content\/|web\/public\/uploads\/)/;
const SIGN_IN_SERVICE = 'keystatic-cloud[bot]';

const approvers = (process.env.CONTENT_APPROVERS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const stop = (message) => {
  console.log(`STOPPED: ${message}`);
  process.exit(1);
};
const show = (ref, file) => {
  try {
    return execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null; // not in that copy
  }
};
const statusOf = (text) => text?.match(/^status: (\w+)$/m)?.[1] ?? null;
const list = (ref, dir) => git('ls-tree', '-r', '--name-only', ref, '--', dir).split('\n').filter(Boolean);

// 1. Only content differs.
const base = git('merge-base', MAIN, WORKING);
const outside = git('diff', '--name-only', base, WORKING)
  .split('\n')
  .filter((file) => file && !CONTENT.test(file));
if (outside.length) stop(`the working copy changes files that are not content: ${outside.join(', ')}`);

// 2. Which posts are published in the working copy and not yet identical on main?
const slugs = [...new Set(list(WORKING, 'content/posts').map((file) => file.split('/')[2]))];
const publish = [];
const waiting = [];
for (const slug of slugs) {
  const file = `content/posts/${slug}/index.mdoc`;
  const working = show(WORKING, file);
  const live = show(MAIN, file);
  if (statusOf(working) !== 'published') {
    if (statusOf(live) === 'published')
      waiting.push(`${slug}: live, but no longer "published" in the working copy. Not taken down here; ask the developer.`);
    continue;
  }
  const folders = [`content/posts/${slug}`, `web/public/uploads/posts/${slug}`];
  if (!git('diff', '--name-only', MAIN, WORKING, '--', ...folders)) continue; // already live as it is

  // Who made the save that last touched it?
  const commit = git('log', '-1', '--format=%H', WORKING, '--', ...folders);
  const author = git('log', '-1', '--format=%an', commit);
  const savedBy = [...git('log', '-1', '--format=%B', commit).matchAll(/^Co-authored-by: .*<([^>]+)>$/gim)].map((m) =>
    m[1].toLowerCase(),
  );
  const approver = savedBy.find((email) => approvers.includes(email));
  if (author !== SIGN_IN_SERVICE) {
    waiting.push(`${slug}: its last change was not saved in the editing screen (by "${author}").`);
  } else if (!approver) {
    waiting.push(`${slug}: set to "published" by ${savedBy.join(', ') || 'an unknown person'}, who is not an approver.`);
  } else if (!(await cameFromSignInService(commit))) {
    waiting.push(`${slug}: GitHub could not confirm that its last save came from the sign-in service.`);
  } else {
    publish.push({ slug, folders, approver, commit });
  }
}

/** GitHub's own verdict on the save's signature (needs GITHUB_TOKEN in Actions). */
async function cameFromSignInService(sha) {
  const { GITHUB_REPOSITORY: repo, GITHUB_TOKEN: token } = process.env;
  if (!repo || !token) return false;
  const response = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.commit?.verification?.verified === true && data.author?.login === SIGN_IN_SERVICE;
}

for (const line of waiting) console.log(`not published  ${line}`);
for (const { slug, approver } of publish) console.log(`to publish     ${slug} (approved by ${approver})`);
if (!publish.length) {
  console.log('Nothing to publish.');
  process.exit(0);
}
if (!apply) process.exit(0);

// 3. Copy the approved posts, and the categories and team members beside them,
//    into this checkout (of main). The caller builds, checks and commits.
for (const { folders } of publish)
  for (const folder of folders) if (list(WORKING, folder).length) git('checkout', WORKING, '--', folder);
for (const folder of ['content/categories', 'content/team'])
  if (list(WORKING, folder).length) git('checkout', WORKING, '--', folder);
console.log(`PUBLISH=${publish.map((p) => p.slug).join(',')}`);
console.log(`APPROVED_BY=${[...new Set(publish.map((p) => p.approver))].join(',')}`);
