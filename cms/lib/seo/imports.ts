import { store } from './store';

// Uploaded exports feed the tabs (owner, 9 Oct 2026: "I'll use shared tools
// and upload data"). A file is recognised by its columns, whatever the tool
// (Semrush, Ahrefs, DataForSEO, SE Ranking, Moz, Keyword Planner, Search
// Console), so no tool-specific format has to be kept up to date:
//   keywords  : a keyword column plus a position and/or a volume column
//   backlinks : a referring (source) page column plus a target or authority column
//   citations : a query or page column with a count of citations or AI mentions
// The newest upload of each kind is what the tabs show, with its stamp.

export type ImportKind = 'keywords' | 'backlinks' | 'citations' | 'other';
export type ImportRow = { id: number; at: string; by: string; source: string; filename: string; note: string; rows: number; columns: string; data?: string };

export type KeywordRow = { keyword: string; position: number | null; volume: number | null; url: string | null; previous: number | null };
export type BacklinkRow = { source: string; target: string | null; authority: number | null; anchor: string | null; domain: string };
export type CitationRow = { label: string; count: number };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** The index of the first column whose name matches one of the patterns, or -1. */
function col(columns: string[], patterns: RegExp[]): number {
  const names = columns.map(norm);
  for (const p of patterns) {
    const i = names.findIndex((n) => p.test(n));
    if (i >= 0) return i;
  }
  return -1;
}

const KEYWORD = [/^(keyword|query|search term|term|phrase)$/, /^(keyword|query)/];
const POSITION = [/^(position|current position|rank|ranking|pos|avg position|average position|google position)$/, /^(position|rank)\b/, /position$/];
const PREVIOUS = [/^(previous position|prev position|previous|prev)/, /previous position/];
const VOLUME = [/^(volume|search volume|searches|avg monthly searches|monthly searches|monthly search volume)$/, /volume/, /monthly searches/];
const PAGE_URL = [/^(url|current url|landing page|page|target url|ranking url|page url)$/, /^url/, /url$/];
const REFERRING = [/^(referring page url|source url|source page|referring url|referring page|backlink url|from url|url from)$/, /referring page/, /^source/, /from url/];
const TARGET = [/^(target url|target page|url to|destination|linked page|target)$/, /target/, /url to/];
const AUTHORITY = [/^(domain rating|dr|domain authority|da|page ascore|authority score|ascore|url rating|ur|trust flow|domain score)$/, /rating/, /authority/, /ascore/];
const ANCHOR = [/^(anchor|anchor text|link anchor)$/, /anchor/];
const COUNT = [/^(citations|citation count|mentions|ai citations|count|references|appearances)$/, /citation/, /mention/];
const LABEL = [/^(query|keyword|prompt|question|page|url|topic)$/, /query|prompt|question/, /page|url/];

export function classify(columns: string[]): ImportKind {
  if (col(columns, REFERRING) >= 0 && (col(columns, TARGET) >= 0 || col(columns, AUTHORITY) >= 0)) return 'backlinks';
  if (col(columns, KEYWORD) >= 0 && (col(columns, POSITION) >= 0 || col(columns, VOLUME) >= 0)) return 'keywords';
  if (col(columns, COUNT) >= 0 && col(columns, LABEL) >= 0) return 'citations';
  return 'other';
}

/** Numbers as tools write them: "1,200", "1.2K", "10-100", "–", "n/a". */
export function num(v: string | undefined): number | null {
  if (v == null) return null;
  const s = v.trim().replace(/,/g, '');
  if (!s || /^(n\/?a|-|–|—|not ranking|>100)$/i.test(s)) return null;
  // Keyword Planner gives bands ("1K – 10K", "10 – 100"): the lower end is kept.
  const band = /^(\d+(?:\.\d+)?\s*[kKmM]?)\s*[-–]\s*\d+(?:\.\d+)?\s*[kKmM]?$/.exec(s);
  const m = /^(-?\d+(?:\.\d+)?)\s*([kKmM])?$/.exec(band ? band[1].replace(/\s/g, '') : s);
  if (!m) return null;
  const n = parseFloat(m[1]) * (m[2] ? (/k/i.test(m[2]) ? 1000 : 1_000_000) : 1);
  return Number.isFinite(n) ? n : null;
}

const domainOf = (u: string) => { try { return new URL(u.startsWith('http') ? u : `https://${u}`).hostname.replace(/^www\./, ''); } catch { return u.split('/')[0]; } };

export function parseKeywords(columns: string[], rows: string[][]): KeywordRow[] {
  const k = col(columns, KEYWORD), p = col(columns, POSITION), v = col(columns, VOLUME), u = col(columns, PAGE_URL), pr = col(columns, PREVIOUS);
  return rows.filter((r) => r[k]?.trim()).map((r) => ({
    keyword: r[k].trim(), position: p >= 0 ? num(r[p]) : null, volume: v >= 0 ? num(r[v]) : null, url: u >= 0 && r[u] ? r[u].trim() : null, previous: pr >= 0 ? num(r[pr]) : null,
  }));
}

export function parseBacklinks(columns: string[], rows: string[][]): BacklinkRow[] {
  const s = col(columns, REFERRING), t = col(columns, TARGET), a = col(columns, AUTHORITY), an = col(columns, ANCHOR);
  return rows.filter((r) => r[s]?.trim()).map((r) => ({
    source: r[s].trim(), target: t >= 0 && r[t] ? r[t].trim() : null, authority: a >= 0 ? num(r[a]) : null, anchor: an >= 0 && r[an] ? r[an].trim() : null, domain: domainOf(r[s].trim()),
  }));
}

export function parseCitations(columns: string[], rows: string[][]): CitationRow[] {
  const l = col(columns, LABEL), c = col(columns, COUNT);
  return rows.filter((r) => r[l]?.trim()).map((r) => ({ label: r[l].trim(), count: num(r[c]) ?? 0 }));
}

/** The newest upload of a kind, parsed, with its stamp; null when none. */
export function latestImport<T>(kind: Exclude<ImportKind, 'other'>): { meta: ImportRow; rows: T[] } | null {
  const list = store().prepare('SELECT id, at, by, source, filename, note, rows, columns FROM imports ORDER BY id DESC LIMIT 200').all() as ImportRow[];
  for (const meta of list) {
    // A competitor's backlink export (source or note says so) is never "ours".
    if (/competitor/i.test(meta.source) || /competitor/i.test(meta.note)) continue;
    const columns = JSON.parse(meta.columns) as string[];
    if (classify(columns) !== kind) continue;
    const data = (store().prepare('SELECT data FROM imports WHERE id = ?').get(meta.id) as { data: string }).data;
    const rows = JSON.parse(data) as string[][];
    const parsed = kind === 'keywords' ? parseKeywords(columns, rows) : kind === 'backlinks' ? parseBacklinks(columns, rows) : parseCitations(columns, rows);
    return { meta, rows: parsed as T[] };
  }
  return null;
}

export const KIND_LABEL: Record<ImportKind, string> = {
  keywords: 'Keyword positions and volumes (shown on Keywords and rankings)',
  backlinks: 'Backlinks (shown on Links)',
  citations: 'AI citations (shown on AI visibility)',
  other: 'Kept as a table only: no keyword, position, volume or referring-page column was recognised',
};

export const stamp = (m: ImportRow) => `${m.source}, ${m.filename}, uploaded ${m.at.slice(0, 10)} by ${m.by}${m.note ? ` (${m.note})` : ''}`;
