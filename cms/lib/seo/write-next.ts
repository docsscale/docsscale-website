import { lastResearch, pastTopics, research } from './ideas';
import { latestImport, type KeywordRow } from './imports';
import { FOCUS_KEYWORDS } from './keywords';
import type { BingData } from './sources/bing';
import type { SearchConsoleData } from './sources/search-console';
import type { SiteData } from './sources/site';
import { latestSnapshot, store } from './store';

// What to write next (owner, 9 Oct 2026: "I want to know also what blogs
// should we write based on the research from different sources, keywords,
// demands, etc"). One ranked list of pages and posts worth writing, built
// from everything the dashboard already holds: the approved keyword map,
// keyword ideas (Bing counts and Google suggestions), questions people
// searched with no heading answering them, Search Console phrases we are
// shown for without a page about them, and the newest uploaded keyword
// export. Near-duplicate phrases are grouped so one line stands for one
// piece of writing. Nothing here is invented: every reason carries the
// number and the source it came from.

export type Suggestion = {
  /** The phrase to write for; the group's strongest phrase. */
  keyword: string;
  kind: 'Blog post' | 'Service or industry page';
  /** Other phrases the same piece would cover. */
  also: string[];
  /** Plain reasons with their numbers and sources. */
  why: string[];
  sources: string[];
  score: number;
  /** The group key, for "Not for us". */
  key: string;
};

const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'for', 'in', 'on', 'and', 'or', 'is', 'are', 'do', 'does', 'how', 'what', 'why', 'when', 'where', 'which', 'who', 'can', 'should', 'my', 'your', 'i', 'it', 'with', 'you', 'be']);
const FILLER = new Set(['best', 'top', 'good', 'great', 'free', 'near', 'me', '2024', '2025', '2026', 'new', 'latest']);
const QUESTION = /^(who|what|which|how|why|when|where|can|could|do|does|did|is|are|should|will|would)\b/i;
// Phrases that are not a clinic looking for marketing help: job seekers,
// students, sign-in pages, other countries. Kept out and counted in a note.
const NOISE = /\b(jobs?|login|log in|sign in|salary|salaries|careers?|hiring|internship|reddit|course|courses|degree|certification|certificate|pdf|book|books|uk|canada|australia|india|hyderabad|dubai|london)\b| in (?!houston|texas)[a-z]/i;
const PAGE_INTENT = /\b(agency|agencies|company|companies|firm|firms|consultant|consultants|services?|experts?|specialists?)\b/i;

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w));
const clean = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
/** The group a phrase belongs to: its meaningful words, singular, sorted. */
export const groupKey = (phrase: string) =>
  [...new Set(words(phrase).filter((w) => !FILLER.has(w)).map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w)))].sort().join(' ');

/** Topics the dashboard looks up by itself, once a week, so the list stays
 *  fresh without anyone typing (the specialties in
 *  web/src/content/served-specialties.ts, plus the agency's own services). */
export const SEED_TOPICS = [
  'dental marketing', 'chiropractic marketing', 'physical therapy marketing', 'med spa marketing', 'weight loss clinic marketing',
  'dermatology marketing', 'primary care marketing', 'optometry marketing', 'mental health practice marketing',
  'healthcare marketing', 'medical practice marketing', 'patient reactivation', 'local seo for doctors', 'google ads for doctors',
];

/** Looks up any seed topic not looked up in the last week. Returns how many were refreshed. */
export async function refreshSeedIdeas(by: string): Promise<number> {
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  let n = 0;
  for (const t of SEED_TOPICS) {
    const last = lastResearch(t);
    if (last && last.at > weekAgo) continue;
    try { await research(t, by); n++; } catch (e) { console.error(`[seo] keyword ideas for "${t}" failed: ${(e as Error).message}`); }
  }
  return n;
}

export const skippedKeys = () => new Set((store().prepare("SELECT text FROM notes WHERE kind = 'skip-topic' AND removed IS NULL").all() as { text: string }[]).map((r) => r.text));

type Cand = { phrase: string; score: number; why: string; source: string; kind?: Suggestion['kind'] };

export function whatToWriteNext(limit = 25): { items: Suggestion[]; notes: string[]; leftOut: number } {
  const site = latestSnapshot<SiteData>('site');
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  const bing = latestSnapshot<BingData>('bing');
  const notes: string[] = [];
  const cands: Cand[] = [];

  // What the site already answers: a heading sharing most of a phrase's words.
  const headings = (site?.data.pages ?? []).flatMap((p) => (p.headings ?? []).map((h) => ({ page: p.path, w: new Set(words(h)) })));
  const covered = (phrase: string) => {
    const w = words(phrase);
    if (!w.length || !headings.length) return false;
    const need = Math.max(2, Math.ceil(w.length * 0.6));
    return headings.some((h) => w.filter((x) => h.w.has(x)).length >= need);
  };
  const live = new Set((site?.data.pages ?? []).map((p) => p.path));
  const mappedPhrases = new Set(Object.values(FOCUS_KEYWORDS).map(clean));
  const standing = new Map((gsc?.data.queries ?? []).map((q) => [clean(q.query), q]));
  const ranks = (phrase: string) => { const s = standing.get(phrase); return s && s.position <= 10; };

  // 1. The approved keyword map: pages promised but not live yet.
  for (const [path, kw] of Object.entries(FOCUS_KEYWORDS)) {
    if (site && !live.has(path)) cands.push({ phrase: clean(kw), score: 1000, why: `On the approved keyword map for ${path}, which is not live yet`, source: 'Keyword map', kind: path.startsWith('/blog/') ? 'Blog post' : 'Service or industry page' });
  }
  // 2. Keyword ideas: the newest lookup of every topic.
  let ideasSeen = 0;
  for (const { topic } of pastTopics(100)) {
    const r = lastResearch(topic);
    if (!r) continue;
    // Lookups stored before 9 Oct 2026 still hold Bing's broad matches
    // (brand names sharing one word with the topic); the same every-word
    // test the lookup now applies is applied here.
    const topicWords = topic.split(' ');
    for (const i of r.ideas) {
      ideasSeen++;
      if (i.mapped || ranks(i.phrase) || !topicWords.every((w) => i.phrase.includes(w))) continue;
      const parts: string[] = [];
      let score = 0;
      if (i.bing != null && i.bing > 0) { parts.push(`${i.bing.toLocaleString('en-US')} searches a month on Bing`); score += Math.min(i.bing, 3000) / 10; }
      if (i.google) { parts.push('Google suggests it'); score += 15; }
      if (i.impressions > 0) { parts.push(`shown ${i.impressions.toLocaleString('en-US')} times on Google at position ${Math.round(i.position ?? 0)}`); score += Math.min(i.impressions, 500) / 5; }
      if (!parts.length) continue;
      cands.push({ phrase: i.phrase, score, why: `${parts.join(', ')} (looked up "${topic}")`, source: 'Keyword ideas' });
    }
  }
  if (!ideasSeen) notes.push('No keyword ideas yet: the dashboard looks up the specialties by itself each week, or type a topic on the Keywords tab.');
  // 3. Questions people searched with no heading answering them.
  const asked = [
    ...(gsc?.data.queries ?? []).map((q) => ({ q: q.query, engine: 'Google', impressions: q.impressions, position: q.position })),
    ...(bing?.data.queries ?? []).map((q) => ({ q: q.query, engine: 'Bing', impressions: q.impressions, position: null as number | null })),
  ];
  for (const a of asked) {
    const phrase = clean(a.q);
    if (mappedPhrases.has(phrase) || ranks(phrase) || covered(phrase)) continue;
    if (QUESTION.test(phrase)) cands.push({ phrase, score: 20 + a.impressions * 2, why: `asked ${a.impressions.toLocaleString('en-US')} times on ${a.engine} and no heading on the site answers it`, source: 'Questions people searched' });
    else if (a.impressions >= 20 && (a.position == null || a.position > 20)) cands.push({ phrase, score: a.impressions, why: `${a.engine} showed us ${a.impressions.toLocaleString('en-US')} times${a.position ? ` at position ${Math.round(a.position)}` : ''} with no page about it`, source: `${a.engine} search data` });
  }
  if (!gsc && !bing) notes.push('Search data has not been read yet, so questions and phrases people searched are missing.');
  // 4. The newest uploaded keyword export.
  const imp = latestImport<KeywordRow>('keywords');
  if (imp) {
    for (const r of imp.rows) {
      const phrase = clean(r.keyword);
      if (!phrase || !r.volume || mappedPhrases.has(phrase) || ranks(phrase) || covered(phrase) || (r.position != null && r.position <= 20)) continue;
      cands.push({ phrase, score: Math.min(r.volume, 3000) / 10, why: `${r.volume.toLocaleString('en-US')} searches a month${r.position ? `, we sit at position ${r.position}` : ', we do not rank'} (${imp.meta.source} export of ${imp.meta.at.slice(0, 10)})`, source: 'Uploaded export' });
    }
  }

  // Group near-duplicates, drop noise and what the owner skipped.
  const skipped = skippedKeys();
  let leftOut = 0;
  const groups = new Map<string, { phrases: Map<string, number>; why: string[]; sources: Set<string>; score: number; kind?: Suggestion['kind'] }>();
  for (const c of cands) {
    if (NOISE.test(c.phrase)) { leftOut++; continue; }
    const key = groupKey(c.phrase);
    if (!key || skipped.has(key)) continue;
    const g = groups.get(key) ?? { phrases: new Map<string, number>(), why: [] as string[], sources: new Set<string>(), score: 0 };
    g.phrases.set(c.phrase, (g.phrases.get(c.phrase) ?? 0) + c.score);
    if (!g.why.some((w) => w === c.why)) g.why.push(c.why);
    g.sources.add(c.source);
    g.score += c.score;
    g.kind = g.kind ?? c.kind;
    groups.set(key, g);
  }
  if (leftOut) notes.push(`${leftOut} phrases about jobs, courses, sign-ins or other places were left out.`);
  const items: Suggestion[] = [...groups.entries()].map(([key, g]) => {
    const ordered = [...g.phrases.entries()].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length).map(([p]) => p);
    const keyword = ordered[0];
    const kind: Suggestion['kind'] = g.kind ?? (PAGE_INTENT.test(keyword) && !QUESTION.test(keyword) ? 'Service or industry page' : 'Blog post');
    return { keyword, kind, also: ordered.slice(1, 6), why: g.why.slice(0, 4), sources: [...g.sources], score: Math.round(g.score), key };
  }).sort((a, b) => b.score - a.score || a.keyword.localeCompare(b.keyword));
  return { items: items.slice(0, limit), notes, leftOut };
}
