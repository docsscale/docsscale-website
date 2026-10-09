import { classify, parseBacklinks, type BacklinkRow, type ImportRow } from './imports';
import { now, store } from './store';

// Links and off-page work (owner, 9 Oct 2026: "will need help in off page
// SEO, backlinking etc"). Without a paid backlink tool, the dashboard works
// from three things it can hold for free: an outreach list of sites to be
// listed on or ask for a link (kept here, moved along by hand), the
// backlink exports the owner uploads (the newest two of ours are compared
// to spot links that disappeared), and a competitor's backlink export
// (uploaded with the source "Competitor backlinks"), whose referring sites
// that do not link to us are the shortlist to approach. Nothing is invented:
// the starter list names only free directories and the three profiles in
// the project's directory-listings copy.

export type OutreachStatus = 'To do' | 'Contacted' | 'Live' | 'Declined';
export const OUTREACH_STATUSES: OutreachStatus[] = ['To do', 'Contacted', 'Live', 'Declined'];
export type OutreachKind = 'Directory' | 'Guest post' | 'Partner' | 'Local' | 'Other';
export const OUTREACH_KINDS: OutreachKind[] = ['Directory', 'Guest post', 'Partner', 'Local', 'Other'];
export type Outreach = { id: number; site: string; url: string; kind: OutreachKind; status: OutreachStatus; target: string; note: string; added_by: string; added_at: string; updated_at: string };

/** Free listings worth having for a Houston healthcare marketing agency; each
 *  is a real directory with a free tier. The three the owner already has copy
 *  for come first (project files, marketing/directory-listings.md). */
export const STARTER_OUTREACH: { site: string; url: string; kind: OutreachKind; note: string }[] = [
  { site: 'LinkedIn company page', url: 'https://www.linkedin.com/company/', kind: 'Directory', note: 'Copy ready in marketing/directory-listings.md' },
  { site: 'Clutch', url: 'https://clutch.co/', kind: 'Directory', note: 'Free profile; copy ready in marketing/directory-listings.md' },
  { site: 'DesignRush', url: 'https://www.designrush.com/', kind: 'Directory', note: 'Free agency listing; copy ready in marketing/directory-listings.md' },
  { site: 'GoodFirms', url: 'https://www.goodfirms.co/', kind: 'Directory', note: 'Free agency listing' },
  { site: 'UpCity', url: 'https://upcity.com/', kind: 'Directory', note: 'Free agency listing' },
  { site: 'Crunchbase', url: 'https://www.crunchbase.com/', kind: 'Directory', note: 'Free company profile' },
  { site: 'Bing Places', url: 'https://www.bingplaces.com/', kind: 'Local', note: 'Free; Bing shows it beside the search results' },
  { site: 'Yelp for Business', url: 'https://biz.yelp.com/', kind: 'Local', note: 'Free listing' },
  { site: 'Better Business Bureau', url: 'https://www.bbb.org/', kind: 'Local', note: 'Free profile; accreditation costs money, so skip that' },
];

export function outreachRows(): Outreach[] {
  return store().prepare("SELECT * FROM outreach ORDER BY CASE status WHEN 'To do' THEN 0 WHEN 'Contacted' THEN 1 WHEN 'Live' THEN 2 ELSE 3 END, id").all() as Outreach[];
}

/** Adds the starter list once, when the table is empty. */
export function seedOutreach() {
  const db = store();
  const n = (db.prepare('SELECT COUNT(*) AS n FROM outreach').get() as { n: number }).n;
  if (n) return 0;
  const ins = db.prepare('INSERT INTO outreach (site, url, kind, status, target, note, added_by, added_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const s of STARTER_OUTREACH) ins.run(s.site, s.url, s.kind, 'To do', '/', s.note, 'Starter list', now(), now());
  return STARTER_OUTREACH.length;
}

export function addOutreach(o: { site: string; url: string; kind: OutreachKind; target: string; note: string }, by: string) {
  store().prepare('INSERT INTO outreach (site, url, kind, status, target, note, added_by, added_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(o.site, o.url, o.kind, 'To do', o.target, o.note, by, now(), now());
}

export function moveOutreach(id: number, status: OutreachStatus) {
  store().prepare('UPDATE outreach SET status = ?, updated_at = ? WHERE id = ?').run(status, now(), id);
}

const isCompetitor = (m: ImportRow) => /competitor/i.test(m.source) || /competitor/i.test(m.note);

/** Backlink exports in upload order, newest first: ours and competitors' apart. */
function backlinkImports(): { meta: ImportRow; rows: BacklinkRow[] }[] {
  const list = store().prepare('SELECT id, at, by, source, filename, note, rows, columns FROM imports ORDER BY id DESC LIMIT 200').all() as ImportRow[];
  const out: { meta: ImportRow; rows: BacklinkRow[] }[] = [];
  for (const meta of list) {
    const columns = JSON.parse(meta.columns) as string[];
    if (classify(columns) !== 'backlinks') continue;
    const data = (store().prepare('SELECT data FROM imports WHERE id = ?').get(meta.id) as { data: string }).data;
    out.push({ meta, rows: parseBacklinks(columns, JSON.parse(data) as string[][]) });
  }
  return out;
}

export type LostLink = { domain: string; links: number; authority: number | null; target: string | null };

/** Referring domains in the previous backlink export of ours that are
 *  missing from the newest one. Null until there are two exports. */
export function lostLinks(): { lost: LostLink[]; newest: ImportRow; previous: ImportRow } | null {
  const ours = backlinkImports().filter((i) => !isCompetitor(i.meta));
  if (ours.length < 2) return null;
  const [newest, previous] = ours;
  const have = new Set(newest.rows.map((r) => r.domain));
  const lost = new Map<string, LostLink>();
  for (const r of previous.rows) {
    if (have.has(r.domain)) continue;
    const l = lost.get(r.domain) ?? { domain: r.domain, links: 0, authority: null, target: r.target };
    l.links++;
    l.authority = Math.max(l.authority ?? 0, r.authority ?? 0) || l.authority;
    lost.set(r.domain, l);
  }
  return { lost: [...lost.values()].sort((a, b) => (b.authority ?? 0) - (a.authority ?? 0) || b.links - a.links), newest: newest.meta, previous: previous.meta };
}

export type Gap = { domain: string; links: number; authority: number | null; example: string };

/** Sites in the newest competitor export that do not link to us (by the
 *  newest export of ours), strongest first. Null until a competitor export exists. */
export function competitorGaps(): { gaps: Gap[]; competitor: ImportRow; ours: ImportRow | null } | null {
  const all = backlinkImports();
  const comp = all.find((i) => isCompetitor(i.meta));
  if (!comp) return null;
  const mine = all.find((i) => !isCompetitor(i.meta)) ?? null;
  const have = new Set(mine?.rows.map((r) => r.domain) ?? []);
  const listed = new Set(outreachRows().map((o) => o.site.toLowerCase()));
  const gaps = new Map<string, Gap>();
  for (const r of comp.rows) {
    if (have.has(r.domain) || listed.has(r.domain)) continue;
    const g = gaps.get(r.domain) ?? { domain: r.domain, links: 0, authority: null, example: r.source };
    g.links++;
    g.authority = Math.max(g.authority ?? 0, r.authority ?? 0) || g.authority;
    gaps.set(r.domain, g);
  }
  return { gaps: [...gaps.values()].sort((a, b) => (b.authority ?? 0) - (a.authority ?? 0) || b.links - a.links), competitor: comp.meta, ours: mine?.meta ?? null };
}
