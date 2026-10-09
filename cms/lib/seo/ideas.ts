import { bingKey, seoConfig } from './config';
import { getJson, isoDay, daysAgo } from './http';
import { FOCUS_KEYWORDS } from './keywords';
import type { SearchConsoleData } from './sources/search-console';
import { latestSnapshot, now, store } from './store';

// Keyword ideas (owner, 9 Oct 2026: "can we also connect a keyword planner?").
// Free and without a new account: Bing Webmaster's keyword research gives
// how often a phrase and its relatives were searched on Bing in the last
// month, and Google's own suggestion box gives the phrases Google completes
// a topic to. Each phrase is matched with what Search Console already shows
// us for it and with the keyword map, so the owner sees at once what we
// rank for and what is untouched. Google Keyword Planner itself needs a
// Google Ads account and API token, which is the owner's call (section 15).

export type Idea = {
  phrase: string;
  /** Searches on Bing in the last 30 days, or null when Bing gave none. */
  bing: number | null;
  /** True when Google's suggestion box completes the topic to this phrase. */
  google: boolean;
  /** Our standing for the phrase in Search Console, when it has shown us. */
  position: number | null;
  impressions: number;
  clicks: number;
  /** The page the keyword map gives this exact phrase, if any. */
  mapped: string | null;
};
export type Research = { topic: string; at: string; by: string; bingTopic: number | null; ideas: Idea[]; notes: string[] };

const clean = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

/** Bing keyword research: the phrase's own searches and its relatives, last 30 days. */
async function bingIdeas(topic: string): Promise<{ topic: number | null; related: { phrase: string; n: number }[]; note: string | null }> {
  if (!bingKey()) return { topic: null, related: [], note: 'No Bing key is set, so Bing volumes are missing.' };
  const base = 'https://ssl.bing.com/webmaster/api.svc/json/';
  const q = `q=${encodeURIComponent(topic)}&country=us&language=en-US&startDate=${isoDay(daysAgo(31))}&endDate=${isoDay(daysAgo(1))}&apikey=${encodeURIComponent(bingKey())}`;
  type Row = { Query?: string; Impressions?: number; Broad?: boolean };
  let own: number | null = null;
  const related: { phrase: string; n: number }[] = [];
  const notes: string[] = [];
  try {
    const d = (await getJson<{ d?: Row | Row[] }>(`${base}GetKeyword?${q}`)).d;
    const row = Array.isArray(d) ? d[0] : d;
    own = row?.Impressions == null ? null : Number(row.Impressions);
  } catch (e) { notes.push(`Bing did not answer for the topic itself (${(e as Error).message.slice(0, 80)}).`); }
  try {
    const d = (await getJson<{ d?: Row[] }>(`${base}GetRelatedKeywords?${q}`)).d ?? [];
    for (const r of d) if (r.Query) related.push({ phrase: clean(r.Query), n: Number(r.Impressions ?? 0) });
  } catch (e) { notes.push(`Bing gave no related phrases (${(e as Error).message.slice(0, 80)}).`); }
  return { topic: own, related, note: notes.join(' ') || null };
}

/** Google's suggestion box for the topic and a few natural variants. */
async function googleIdeas(topic: string): Promise<{ phrases: string[]; note: string | null }> {
  const seeds = [topic, `${topic} for`, `how to ${topic}`, `best ${topic}`, `${topic} cost`];
  const out = new Set<string>();
  let failed = 0;
  for (const s of seeds) {
    try {
      const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(s)}`, { signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) { failed++; continue; }
      const data = (await res.json()) as [string, string[]];
      for (const p of data[1] ?? []) out.add(clean(p));
    } catch { failed++; }
  }
  return { phrases: [...out], note: failed === seeds.length ? 'Google suggestions could not be read.' : null };
}

/** Looks a topic up, saves the result and returns it. */
export async function research(topic: string, by: string): Promise<Research> {
  const t = clean(topic);
  if (t.length < 2) throw new Error('Type a topic first.');
  const [b, g] = await Promise.all([bingIdeas(t), googleIdeas(t)]);
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  const seen = new Map((gsc?.data.queries ?? []).map((q) => [clean(q.query), q]));
  const mapped = new Map(Object.entries(FOCUS_KEYWORDS).map(([p, k]) => [clean(k), p]));
  const all = new Map<string, Idea>();
  const add = (phrase: string, bing: number | null, google: boolean) => {
    const cur = all.get(phrase);
    if (cur) { cur.bing = cur.bing ?? bing; cur.google = cur.google || google; return; }
    const s = seen.get(phrase);
    all.set(phrase, { phrase, bing, google, position: s?.position ?? null, impressions: s?.impressions ?? 0, clicks: s?.clicks ?? 0, mapped: mapped.get(phrase) ?? null });
  };
  // Bing's "related" list is a broad match: for "dental marketing" it leads
  // with insurers and brand names that merely contain "dental". Only phrases
  // carrying every word of the topic are ideas for it; the rest is counted
  // in a note so the owner knows it was seen and left out.
  const words = t.split(' ');
  const onTopic = (p: string) => words.every((w) => p.includes(w));
  const offTopic = b.related.filter((r) => r.phrase !== t && !onTopic(r.phrase));
  for (const r of b.related) if (r.phrase !== t && onTopic(r.phrase)) add(r.phrase, r.n, false);
  for (const p of g.phrases) if (p !== t) add(p, null, true);
  const ideas = [...all.values()].sort((x, y) => (y.bing ?? -1) - (x.bing ?? -1) || Number(y.google) - Number(x.google) || x.phrase.localeCompare(y.phrase));
  const notes = [b.note, g.note].filter((n): n is string => !!n);
  if (offTopic.length) notes.push(`Bing also listed ${offTopic.length} phrases that only share a word with the topic, such as "${offTopic[0].phrase}"; they are left out.`);
  if (!gsc) notes.push('Search Console has not been read yet, so "we rank" is unknown.');
  const r: Research = { topic: t, at: now(), by, bingTopic: b.topic, ideas, notes };
  store().prepare('INSERT INTO keyword_ideas (topic, at, by, data) VALUES (?, ?, ?, ?)').run(t, r.at, by, JSON.stringify(r));
  return r;
}

export const lastResearch = (topic: string): Research | null => {
  const row = store().prepare('SELECT data FROM keyword_ideas WHERE topic = ? ORDER BY id DESC LIMIT 1').get(clean(topic)) as { data: string } | undefined;
  return row ? (JSON.parse(row.data) as Research) : null;
};
/** Topics looked up before, newest first, one row per topic. */
export const pastTopics = (n = 20) =>
  (store().prepare('SELECT topic, MAX(at) AS at FROM keyword_ideas GROUP BY topic ORDER BY at DESC LIMIT ?').all(n) as { topic: string; at: string }[]);
