import { githubToken, seoConfig } from '../config';
import { getJson } from '../http';
import type { Check } from '../lint';
import { lintPost } from '../post-lint';
import { store } from '../store';

// Content history and the edit log, built from the content files and their git
// history on GitHub, so nothing extra has to be recorded while editing. Posts
// are read from both the live branch (main) and the working copy the editing
// screen saves to (content/working).

const BRANCHES = ['main', 'content/working'];
const MAX_COMMITS_PER_RUN = 25; // stays inside GitHub's hourly limit without a token (60 requests)

export type PostRow = {
  slug: string;
  path: string;
  title: string;
  status: string;
  live: boolean;
  published: string | null;
  updated: string | null;
  reviewed: string | null;
  words: number;
  seoTitle: string;
  seoDescription: string;
  /** The focus keyword the editor gave the post (Search engines (SEO) → Focus keyword). */
  keyword: string;
  /** The pre-publish checks on the content file (lib/seo/post-lint.ts) and their score. */
  score: number;
  checks: Check[];
};
export type ContentData = { repo: string; posts: PostRow[]; newEdits: number; pendingEdits: boolean; editsError: string | null };

const gh = <T>(path: string) =>
  getJson<T>(`https://api.github.com/repos/${seoConfig.githubRepo}${path}`, {
    headers: { Accept: 'application/vnd.github+json', ...(githubToken() ? { Authorization: `Bearer ${githubToken()}` } : {}) },
  });

async function raw(ref: string, file: string): Promise<string | null> {
  const res = await fetch(`https://raw.githubusercontent.com/${seoConfig.githubRepo}/${ref}/${file}`, {
    headers: githubToken() ? { Authorization: `Bearer ${githubToken()}` } : {},
    signal: AbortSignal.timeout(30_000),
  });
  return res.ok ? res.text() : null;
}

/** Splits a content file into its top-level fields (each with its text) and
 *  the body, without a YAML library: a field starts at a line with no indent. */
export function splitFile(text: string): { fields: Map<string, string>; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  const front = m ? m[1] : text; // a .yaml file is all fields and no body
  const fields = new Map<string, string>();
  let key = '';
  for (const line of front.split('\n')) {
    const k = /^([A-Za-z][\w-]*):/.exec(line);
    if (k) key = k[1];
    if (key) fields.set(key, (fields.get(key) ?? '') + line + '\n');
  }
  return { fields, body: m ? m[2] : '' };
}

const scalar = (fields: Map<string, string>, key: string) => {
  const v = fields.get(key);
  if (!v) return '';
  const inline = v.split('\n')[0].replace(/^[^:]+:\s*/, '').trim();
  const text = inline && !/^[>|]-?$/.test(inline) ? inline : v.split('\n').slice(1).map((l) => l.trim()).join(' ').trim();
  return text.replace(/^['"]|['"]$/g, '');
};

/** A field inside an object field (seo.title). A folded value (">-", "|")
 *  continues on the more-indented lines that follow it. */
const nested = (fields: Map<string, string>, key: string, sub: string) => {
  const lines = (fields.get(key) ?? '').split('\n');
  const at = lines.findIndex((l) => new RegExp(`^\\s+${sub}:`).test(l));
  if (at < 0) return '';
  const head = lines[at];
  const indent = /^\s*/.exec(head)![0].length;
  const inline = head.replace(/^[^:]+:\s*/, '').trim();
  if (inline && !/^[>|]-?$/.test(inline)) return inline.replace(/^['"]|['"]$/g, '').trim();
  const rest: string[] = [];
  for (const l of lines.slice(at + 1)) {
    if (l.trim() && (/^\s*/.exec(l)![0].length <= indent)) break;
    rest.push(l.trim());
  }
  return rest.join(' ').trim();
};

/** Words a reader sees: Markdoc tags, markup and links' addresses left out. */
export const countWords = (body: string) =>
  body
    .replace(/\{%[\s\S]*?%\}/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#>*_`[\]|-]/g, ' ')
    .split(/\s+/)
    .filter((w) => /\w/.test(w)).length;

export function postFromFile(slug: string, text: string, live: boolean): PostRow {
  const { fields, body } = splitFile(text);
  const keyword = nested(fields, 'seo', 'focusKeyword');
  const lint = lintPost({
    title: scalar(fields, 'title'), summary: scalar(fields, 'summary'), seoTitle: nested(fields, 'seo', 'title'), seoDescription: nested(fields, 'seo', 'description'),
    keyword, body, hasCover: Boolean(scalar(fields, 'cover')), coverAlt: scalar(fields, 'coverAlt'),
  });
  return {
    slug,
    path: `/blog/${slug}/`,
    title: scalar(fields, 'title'),
    status: scalar(fields, 'status') || 'Unknown',
    live,
    published: scalar(fields, 'published') || null,
    updated: scalar(fields, 'updated') || null,
    reviewed: scalar(fields, 'reviewed') || null,
    words: countWords(body),
    seoTitle: nested(fields, 'seo', 'title'),
    seoDescription: nested(fields, 'seo', 'description'),
    keyword,
    score: lint.score,
    checks: lint.checks,
  };
}

/** Which fields a commit changed in one file, and the body's words before and after. */
function diffFile(before: string | null, after: string | null) {
  const a = before ? splitFile(before) : { fields: new Map<string, string>(), body: '' };
  const b = after ? splitFile(after) : { fields: new Map<string, string>(), body: '' };
  const changed = [...new Set([...a.fields.keys(), ...b.fields.keys()])].filter((k) => a.fields.get(k) !== b.fields.get(k));
  if (a.body !== b.body) changed.push('body');
  const hasBody = (t: string | null) => Boolean(t && t.startsWith('---'));
  return { changed, wordsBefore: hasBody(before) ? countWords(a.body) : null, wordsAfter: hasBody(after) ? countWords(b.body) : null };
}

/** Reads commits not seen before, oldest first, a limited number per run.
 *  Each commit is saved as soon as it is read, so a run that hits GitHub's
 *  limit keeps what it got and the next run carries on from there. */
async function collectEdits(): Promise<{ added: number; pending: boolean; error: string | null }> {
  const db = store();
  const known = new Set((db.prepare('SELECT DISTINCT sha FROM edits').all() as { sha: string }[]).map((r) => r.sha));
  let added = 0;
  let pending = false;
  let error: string | null = null;
  try {
    for (const branch of BRANCHES) {
      const commits = await gh<{ sha: string }[]>(`/commits?sha=${encodeURIComponent(branch)}&path=content&per_page=100`);
      for (const c of commits.reverse()) {
        if (known.has(c.sha)) continue;
        if (added >= MAX_COMMITS_PER_RUN) { pending = true; break; }
        const detail = await gh<{
          sha: string;
          parents: { sha: string }[];
          commit: { author: { name: string; date: string }; message: string };
          files?: { filename: string; status: string; previous_filename?: string }[];
        }>(`/commits/${c.sha}`);
        for (const f of (detail.files ?? []).filter((x) => x.filename.startsWith('content/'))) {
          const parent = detail.parents[0]?.sha;
          const before = f.status === 'added' || !parent ? null : await raw(parent, f.previous_filename ?? f.filename);
          const after = f.status === 'removed' ? null : await raw(detail.sha, f.filename);
          const d = /\.(mdoc|ya?ml)$/.test(f.filename) ? diffFile(before, after) : { changed: [f.status === 'added' ? 'new file' : 'file'], wordsBefore: null, wordsAfter: null };
          db.prepare(
            'INSERT OR IGNORE INTO edits (sha, file, at, author, message, branch, fields, words_before, words_after) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          ).run(detail.sha, f.filename, detail.commit.author.date, detail.commit.author.name, detail.commit.message.split('\n')[0], branch,
            f.status === 'removed' ? 'file removed' : d.changed.join(', ') || 'no field changes', d.wordsBefore, d.wordsAfter);
        }
        known.add(c.sha);
        added++;
      }
    }
  } catch (e) {
    error = (e as Error).message.slice(0, 300);
    pending = true;
  }
  return { added, pending, error };
}

/** Every post, from the live branch and the working copy (a live post wins). */
export async function collectPosts(): Promise<PostRow[]> {
  const posts = new Map<string, PostRow>();
  for (const branch of BRANCHES) {
    const tree = await gh<{ tree: { path: string; type: string }[] }>(`/git/trees/${encodeURIComponent(branch)}?recursive=1`);
    const files = tree.tree.filter((t) => /^content\/posts\/[^/]+\/index\.mdoc$/.test(t.path)).map((t) => t.path);
    for (const file of files) {
      const slug = file.split('/')[2];
      if (posts.get(slug)?.live) continue; // main is read first; its live copy wins over the working copy
      const text = await raw(branch, file);
      if (text) posts.set(slug, postFromFile(slug, text, branch === 'main' && /^status:\s*published\s*$/m.test(text)));
    }
  }
  return [...posts.values()];
}

export async function collectContent(): Promise<ContentData> {
  const posts = await collectPosts();
  const edits = await collectEdits();
  return { repo: seoConfig.githubRepo, posts, newEdits: edits.added, pendingEdits: edits.pending, editsError: edits.error };
}
