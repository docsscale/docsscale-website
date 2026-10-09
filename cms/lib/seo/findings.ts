import { FOCUS_KEYWORDS } from './keywords';
import type { AnalyticsData } from './sources/analytics';
import type { BingData } from './sources/bing';
import type { ContentData } from './sources/content';
import type { CrmData } from './sources/crm';
import type { SearchConsoleData } from './sources/search-console';
import type { SiteData } from './sources/site';
import { latestSnapshot, now, setting, snapshotBefore, store } from './store';

// The fix queue (docs/SEO-DASHBOARD-PLAN.md, section 7). Rule-based findings
// are detected on the server after every daily run and added as "Detected",
// each with its evidence. People move them on: the owner (or the SEO role,
// when the admin allows it in Settings) approves, saves for later or
// rejects; anyone with the SEO role notes progress. Nothing here publishes
// anything; the dashboard holds no credential that could.

export type Impact = 'High' | 'Medium' | 'Low';
export type Effort = 'Small' | 'Medium' | 'Large';
export type Who = 'Editor in the CMS' | 'Developer, with your OK' | 'You';
export type Status = 'Detected' | 'Recommended' | 'Approved' | 'Saved for later' | 'Rejected' | 'In progress' | 'Done' | 'Outcome measured';
export const STATUSES: Status[] = ['Detected', 'Recommended', 'Approved', 'Saved for later', 'Rejected', 'In progress', 'Done', 'Outcome measured'];

export type Finding = {
  id: number; key: string; rule: string; page: string | null; what: string; evidence: string; impact: Impact; impact_reason: string;
  effort: Effort; who: Who; status: Status; note: string; horizon: number | null; created: string; last_seen: string;
  decided_by: string | null; decided_at: string | null; done_at: string | null; check_date: string | null; outcome: string | null; outcome_detail: string | null;
};
export type Detected = Omit<Finding, 'id' | 'status' | 'note' | 'horizon' | 'created' | 'last_seen' | 'decided_by' | 'decided_at' | 'done_at' | 'check_date' | 'outcome' | 'outcome_detail'>;

const pathOf = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';
const isPost = (p: string) => p.startsWith('/blog/') && p !== '/blog/';
/** Linter checks a visitor cannot see; the weekly run may approve these on its own. */
const TECHNICAL_CHECKS = new Set(['schema', 'canonical', 'indexable']);
const whoFor = (p: string): Who => (isPost(p) ? 'Editor in the CMS' : 'Developer, with your OK');

/** The thresholds of SEO-OS section 6, changeable in Settings. */
export const thresholds = () => ({
  minImpressions: Number(setting('threshold.minImpressions', '20')),
  lostClicksPct: Number(setting('threshold.lostClicksPct', '50')),
  staleDays: Number(setting('threshold.staleDays', '180')),
});

/** Every rule, run against the latest snapshots. Pure: returns what it finds. */
export function detect(): Detected[] {
  const out: Detected[] = [];
  const site = latestSnapshot<SiteData>('site');
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  const bing = latestSnapshot<BingData>('bing');
  const content = latestSnapshot<ContentData>('content');
  const t = thresholds();
  const add = (f: Detected) => out.push(f);

  if (site) {
    const stamp = `Live site, checked ${site.taken.slice(0, 10)}`;
    for (const c of site.data.checks.filter((c) => !c.pass)) {
      add({ key: `site-check:${c.name}`, rule: 'site-check', page: null, what: `Fix the site-wide check "${c.name}"`, evidence: `${stamp}. ${c.detail}`, impact: 'High', impact_reason: 'A site-wide fault affects every page.', effort: 'Small', who: 'Developer, with your OK' });
    }
    for (const f of site.data.failing) {
      add({ key: `page-status:${pathOf(f.url)}`, rule: 'page-status', page: pathOf(f.url), what: `Make ${pathOf(f.url)} answer 200 or take it out of the sitemap`, evidence: `${stamp}. The sitemap lists it but it answered ${f.status}${f.redirect ? `, going to ${f.redirect}` : ''}.`, impact: 'High', impact_reason: 'Search engines drop pages that do not answer.', effort: 'Small', who: 'Developer, with your OK' });
    }
    // One item per page, not one per check, so the queue stays readable
    // (9 Oct 2026: 30 single-check items hid the few that mattered). The
    // technical checks (structured data, canonical, noindex) are a separate
    // item because the weekly run may approve those on its own.
    for (const p of site.data.pages) {
      const failing = p.checks.filter((c) => c.pass === false && !c.declined);
      for (const [kind, checks] of [['technical', failing.filter((c) => TECHNICAL_CHECKS.has(c.id))], ['wording', failing.filter((c) => !TECHNICAL_CHECKS.has(c.id))]] as const) {
        if (!checks.length) continue;
        const labels = checks.map((c) => c.label.toLowerCase());
        const what = checks.length === 1 ? `${p.path}: ${labels[0]}` : `${p.path}: ${checks.length} ${kind === 'technical' ? 'technical' : 'on-page'} checks to fix (${labels.join('; ')})`;
        const important = checks.some((c) => c.weight >= 10);
        add({ key: `lint:${p.path}:${kind}`, rule: 'lint', page: p.path, what, evidence: `${stamp}, page linter. ${checks.map((c) => `${c.label}: ${c.detail}`).join('. ')}.`, impact: important ? 'Medium' : 'Low', impact_reason: important ? 'Among them one of the on-page basics search engines read first.' : 'Small on-page points; worth doing when the page is next edited.', effort: checks.length > 3 ? 'Medium' : 'Small', who: whoFor(p.path) });
      }
    }
    // Orphans: pages no other page links to from its main text.
    const inbound = new Map<string, number>();
    for (const p of site.data.pages) for (const l of p.links) inbound.set(l, (inbound.get(l) ?? 0) + 1);
    for (const p of site.data.pages) {
      if (['/', '/privacy/', '/terms/'].includes(p.path) || inbound.get(p.path)) continue;
      add({ key: `orphan:${p.path}`, rule: 'orphan', page: p.path, what: `Link to ${p.path} from the text of at least one related page`, evidence: `${stamp}. No page links to it from its main text (menus and the footer are not counted).`, impact: 'Medium', impact_reason: 'Pages with no links from other pages are crawled less and rank worse.', effort: 'Small', who: 'Editor in the CMS' });
    }
    // Keyword map rows whose page is not live yet.
    const live = new Set(site.data.pages.map((p) => p.path));
    for (const [path, kw] of Object.entries(FOCUS_KEYWORDS)) {
      if (!live.has(path)) add({ key: `missing-page:${path}`, rule: 'missing-page', page: path, what: `Write the page ${path} for "${kw}"`, evidence: `Keyword map (approved 6 Oct 2026) gives ${path} the keyword "${kw}"; ${stamp}, it is not in the sitemap.`, impact: 'Medium', impact_reason: 'A mapped keyword with no page cannot rank.', effort: 'Large', who: 'You' });
    }
  }

  if (gsc) {
    const d = gsc.data;
    const stamp = `Search Console, ${d.current[0]} to ${d.current[1]}`;
    for (const i of d.index.filter((i) => i.verdict !== 'PASS' && i.verdict !== 'Unknown')) {
      const p = pathOf(i.url);
      add({ key: `not-indexed:${p}`, rule: 'not-indexed', page: p, what: `Get ${p} into Google's index`, evidence: `${stamp}, URL inspection on ${gsc.taken.slice(0, 10)}: "${i.coverage}"${i.lastCrawl ? `, last crawled ${i.lastCrawl.slice(0, 10)}` : ', never crawled'}. Usually time and links from other pages fix it; a request in Search Console speeds it up.`, impact: 'Medium', impact_reason: 'A page Google has not indexed cannot earn clicks.', effort: 'Small', who: 'You' });
    }
    for (const q of d.pageOneNoClicks.filter((q) => q.impressions >= t.minImpressions)) {
      const pages = d.cannibalization.find((c) => c.query === q.query)?.pages ?? [];
      const page = pages.length === 1 ? pathOf(pages[0].page) : null;
      add({ key: `no-clicks:${q.query}`, rule: 'no-clicks', page, what: `Rewrite the title and description that show for "${q.query}"`, evidence: `${stamp}: shown ${q.impressions} times at average position ${q.position}, no clicks.${page ? ` The page shown is ${page}.` : ''} Uncertain: Google's averages hide where each impression appeared.`, impact: 'Medium', impact_reason: 'Page one with no clicks is the cheapest click to win.', effort: 'Small', who: page ? whoFor(page) : 'Editor in the CMS' });
    }
    for (const q of d.positions11to20.filter((q) => q.impressions >= t.minImpressions)) {
      add({ key: `near-page-one:${q.query}`, rule: 'near-page-one', page: null, what: `Strengthen the page that ranks for "${q.query}" (more depth, links from other pages)`, evidence: `${stamp}: average position ${q.position}, ${q.impressions} impressions, ${q.clicks} clicks.`, impact: 'Medium', impact_reason: 'Just off page one; a modest improvement can move it on.', effort: 'Medium', who: 'Editor in the CMS' });
    }
    for (const c of d.cannibalization.filter((c) => c.pages.reduce((s, p) => s + p.impressions, 0) >= t.minImpressions)) {
      add({ key: `cannibal:${c.query}`, rule: 'cannibalization', page: null, what: `Decide which page should rank for "${c.query}" and point the others at it`, evidence: `${stamp}: ${c.pages.map((p) => `${pathOf(p.page)} (position ${p.position}, ${p.impressions} impressions)`).join('; ')}.`, impact: 'Medium', impact_reason: 'Two pages on one phrase split its strength.', effort: 'Medium', who: 'Editor in the CMS' });
    }
    // Lost clicks: a page whose clicks fell by the threshold against the snapshot 28 days earlier.
    const earlier = snapshotBefore<SearchConsoleData>('search-console', new Date(Date.parse(gsc.taken) - 28 * 86400_000).toISOString());
    if (earlier && earlier.id !== gsc.id) {
      const before = new Map(earlier.data.pages.map((p) => [pathOf(p.page), p.clicks]));
      for (const p of d.pages) {
        const was = before.get(pathOf(p.page)) ?? 0;
        if (was >= 10 && p.clicks <= was * (1 - t.lostClicksPct / 100)) {
          add({ key: `lost-clicks:${pathOf(p.page)}`, rule: 'lost-clicks', page: pathOf(p.page), what: `Find out why ${pathOf(p.page)} lost clicks`, evidence: `Search Console: ${p.clicks} clicks in ${d.current[0]} to ${d.current[1]}, against ${was} in ${earlier.data.current[0]} to ${earlier.data.current[1]} (${t.lostClicksPct}% threshold).`, impact: 'High', impact_reason: 'Clicks already earned are the cheapest to keep.', effort: 'Medium', who: 'Developer, with your OK' });
        }
      }
    }
  }

  if (bing) {
    for (const i of bing.data.crawlIssues.filter((i) => !/redirect/i.test(i.issue))) {
      const p = pathOf(i.url);
      add({ key: `bing-issue:${p}:${i.issue}`, rule: 'bing-issue', page: p, what: `Fix what Bing reports on ${p}: ${i.issue.toLowerCase()}`, evidence: `Bing Webmaster crawl issues, fetched ${bing.taken.slice(0, 10)}${i.httpCode ? `, HTTP ${i.httpCode}` : ''}.`, impact: 'Medium', impact_reason: 'A crawl error keeps the page out of Bing and the assistants that use it.', effort: 'Small', who: 'Developer, with your OK' });
    }
  }

  if (content) {
    for (const p of content.data.posts.filter((p) => p.live)) {
      const last = [p.updated, p.published].filter(Boolean).sort().pop();
      if (!last) continue;
      const age = Math.floor((Date.now() - Date.parse(last)) / 86400_000);
      if (age >= t.staleDays) add({ key: `stale:${p.path}`, rule: 'stale', page: p.path, what: `Review and refresh ${p.path}`, evidence: `Content files on GitHub: last updated ${last.slice(0, 10)}, ${age} days ago (threshold ${t.staleDays}).`, impact: 'Low', impact_reason: 'Older guides slowly lose rankings to fresher ones.', effort: 'Medium', who: 'Editor in the CMS' });
    }
  }
  return out;
}

/** Writes what detect() found into the queue: new items as Detected, known
 *  ones refreshed (evidence and last seen). A Done item seen again a week or
 *  more after it was done reopens, with the reason logged. Returns counts. */
export function recordFindings(): { found: number; added: number; reopened: number } {
  const db = store();
  const t = now();
  let added = 0, reopened = 0;
  const found = detect();
  for (const f of found) {
    const row = db.prepare('SELECT id, status, done_at FROM findings WHERE key = ?').get(f.key) as { id: number; status: Status; done_at: string | null } | undefined;
    if (!row) {
      db.prepare('INSERT INTO findings (key, rule, page, what, evidence, impact, impact_reason, effort, who, status, created, last_seen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(f.key, f.rule, f.page, f.what, f.evidence, f.impact, f.impact_reason, f.effort, f.who, 'Detected', t, t);
      added++;
      continue;
    }
    db.prepare('UPDATE findings SET evidence = ?, last_seen = ? WHERE id = ?').run(f.evidence, t, row.id);
    if ((row.status === 'Done' || row.status === 'Outcome measured') && row.done_at && Date.now() - Date.parse(row.done_at) > 7 * 86400_000) {
      db.prepare('UPDATE findings SET status = ?, done_at = NULL, check_date = NULL, outcome = NULL, outcome_detail = NULL WHERE id = ?').run('Detected', row.id);
      db.prepare('INSERT INTO finding_log (finding, at, by, from_status, to_status, note) VALUES (?, ?, ?, ?, ?, ?)').run(row.id, t, 'detection', row.status, 'Detected', 'Detected again a week or more after it was marked done.');
      reopened++;
    }
  }
  measureOutcomes();
  return { found: found.length, added, reopened };
}

/** Done items whose check date has come: before and after over equal 28-day
 *  periods, from the Search Console snapshots nearest the change and the
 *  check date (plan, section 7). Site-wide when the item has no page. */
export function measureOutcomes() {
  const db = store();
  const due = db.prepare("SELECT * FROM findings WHERE status = 'Done' AND check_date IS NOT NULL AND check_date <= ?").all(now()) as Finding[];
  for (const f of due) {
    const r = outcomeOf(f);
    if (!r) continue;
    db.prepare('UPDATE findings SET status = ?, outcome = ?, outcome_detail = ? WHERE id = ?').run('Outcome measured', r.outcome, r.detail, f.id);
    db.prepare('INSERT INTO finding_log (finding, at, by, from_status, to_status, note) VALUES (?, ?, ?, ?, ?, ?)').run(f.id, now(), 'outcome check', 'Done', 'Outcome measured', `${r.outcome}: ${r.detail}`);
  }
}

export function outcomeOf(f: Finding): { outcome: 'worked' | 'no effect' | 'hurt' | 'too early'; detail: string } | null {
  if (!f.done_at || !f.check_date) return null;
  if (f.check_date > now()) return { outcome: 'too early', detail: `The check is due on ${f.check_date.slice(0, 10)}.` };
  const before = snapshotBefore<SearchConsoleData>('search-console', f.done_at);
  const after = latestSnapshot<SearchConsoleData>('search-console');
  if (!before || !after || before.id === after.id) return { outcome: 'too early', detail: 'Not enough Search Console snapshots on both sides of the change yet.' };
  const pick = (s: SearchConsoleData) => {
    if (!f.page) return { clicks: s.totals.current.clicks, impressions: s.totals.current.impressions };
    const p = s.pages.find((x) => pathOf(x.page) === f.page);
    return { clicks: p?.clicks ?? 0, impressions: p?.impressions ?? 0 };
  };
  const b = pick(before.data), a = pick(after.data);
  const scope = f.page ? f.page : 'the whole site';
  const detail = `${scope}: ${b.clicks} clicks and ${b.impressions} impressions in ${before.data.current[0]} to ${before.data.current[1]}; ${a.clicks} clicks and ${a.impressions} impressions in ${after.data.current[0]} to ${after.data.current[1]}.`;
  if (b.impressions < 100 && a.impressions < 100) return { outcome: 'no effect', detail: `Insufficient data for a judgement (under 100 impressions in both periods). ${detail}` };
  const ratio = (a.clicks + a.impressions / 10) / Math.max(1, b.clicks + b.impressions / 10);
  return { outcome: ratio >= 1.15 ? 'worked' : ratio <= 0.85 ? 'hurt' : 'no effect', detail };
}

export const findings = (where = '1=1', ...args: (string | number)[]) =>
  store().prepare(`SELECT * FROM findings WHERE ${where} ORDER BY CASE impact WHEN 'High' THEN 0 WHEN 'Medium' THEN 1 ELSE 2 END, created DESC`).all(...args) as Finding[];

export const findingLog = (id: number) =>
  store().prepare('SELECT * FROM finding_log WHERE finding = ? ORDER BY rowid').all(id) as { at: string; by: string; from_status: string; to_status: string; note: string }[];

/** Who may approve: the owner (admin) only, unless the admin extended it to
 *  the SEO role in Settings (owner's decision 3, 6 Oct 2026). */
export const approverRole = () => (setting('approvers', 'admin') === 'seo' ? 'seo' : 'admin');

const HORIZON: Record<Effort, number> = { Small: 30, Medium: 60, Large: 90 };

/** Findings the weekly run may approve on its own (owner, 9 Oct 2026: "yes"
 *  to self-approving the small invisible fixes). Only changes a visitor
 *  cannot see: site-wide checks, pages that do not answer, Bing crawl
 *  errors, and the linter's structured-data, canonical and noindex checks.
 *  Anything with words on it (titles, descriptions, headings, links, new
 *  pages) still waits for the owner's Approve. */
export function selfApprovable(f: Pick<Finding, 'rule' | 'key'>): boolean {
  if (['site-check', 'page-status', 'bing-issue'].includes(f.rule)) return true;
  return f.rule === 'lint' && f.key.endsWith(':technical');
}

/** Moves an item on and logs it. Returns false when the move is not allowed. */
export function moveFinding(id: number, to: Status, by: string, note: string, reopenReason = ''): boolean {
  const db = store();
  const f = db.prepare('SELECT * FROM findings WHERE id = ?').get(id) as Finding | undefined;
  if (!f) return false;
  const from = f.status;
  if ((from === 'Done' || from === 'Outcome measured') && !reopenReason) return false; // reopening needs a written reason
  const t = now();
  const sets: string[] = ['status = ?'];
  const vals: (string | number | null)[] = [to];
  if (to === 'Approved' || to === 'Saved for later' || to === 'Rejected') { sets.push('decided_by = ?', 'decided_at = ?'); vals.push(by, t); }
  if (to === 'Approved' && f.horizon == null) { sets.push('horizon = ?'); vals.push(HORIZON[f.effort]); }
  if (to === 'Done') {
    const days = f.rule === 'missing-page' ? 60 : 28;
    sets.push('done_at = ?', 'check_date = ?'); vals.push(t, new Date(Date.now() + days * 86400_000).toISOString());
  }
  if (to !== 'Done' && to !== 'Outcome measured') { sets.push('done_at = NULL', 'check_date = NULL', 'outcome = NULL', 'outcome_detail = NULL'); }
  vals.push(id);
  db.prepare(`UPDATE findings SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  db.prepare('INSERT INTO finding_log (finding, at, by, from_status, to_status, note) VALUES (?, ?, ?, ?, ?, ?)').run(id, t, by, from, to, reopenReason ? `Reopened: ${reopenReason}` : note);
  return true;
}

export function noteFinding(id: number, note: string, by: string, horizon: number | null) {
  const db = store();
  const f = db.prepare('SELECT status, note FROM findings WHERE id = ?').get(id) as { status: Status; note: string } | undefined;
  if (!f) return;
  db.prepare('UPDATE findings SET note = ?, horizon = COALESCE(?, horizon) WHERE id = ?').run(note, horizon, id);
  if (note !== f.note) db.prepare('INSERT INTO finding_log (finding, at, by, from_status, to_status, note) VALUES (?, ?, ?, ?, ?, ?)').run(id, now(), by, f.status, f.status, `Instruction note changed: ${note.slice(0, 300)}`);
}

/** The automatic part of the Overview: what moved, what matters most, what
 *  to ignore and the risks, from the data alone (plan, section 6). The
 *  written judgement is the weekly note beside it. */
export function autoSummary() {
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  const ga = latestSnapshot<AnalyticsData>('analytics');
  const site = latestSnapshot<SiteData>('site');
  const moved: string[] = [];
  const trend = (label: string, cur: number, prev: number, min = 0) => {
    if (min && (cur < min || prev < min)) return `${label}: ${cur} (insufficient data for a trend; a trend needs ${min} in both 28-day periods, the previous had ${prev}).`;
    if (!prev && !cur) return `${label}: none in either period.`;
    if (!prev) return `${label}: ${cur}, none in the previous 28 days.`;
    const pct = Math.round(((cur - prev) / prev) * 100);
    return `${label}: ${cur}, ${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% on the previous 28 days (${prev}).`;
  };
  if (gsc) {
    moved.push(trend('Google clicks', gsc.data.totals.current.clicks, gsc.data.totals.previous.clicks));
    moved.push(trend('Google impressions', gsc.data.totals.current.impressions, gsc.data.totals.previous.impressions, 100));
    const indexed = gsc.data.index.filter((i) => i.verdict === 'PASS').length;
    moved.push(`${indexed} of ${gsc.data.index.length} sitemap pages are in Google's index.`);
  }
  if (ga) {
    moved.push(trend('Visitors who accepted cookies', ga.data.totals.current.totalUsers, ga.data.totals.previous.totalUsers));
    moved.push(trend('Leads recorded by GA4', ga.data.leads.current, ga.data.leads.previous));
  }
  const crm = latestSnapshot<CrmData>('crm');
  if (crm) moved.push(trend('Leads in the CRM (the count of record)', crm.data.totals.current, crm.data.totals.previous) + (crm.data.website.current ? ` ${crm.data.website.current} came through the website.` : ''));
  const open = findings("status IN ('Detected', 'Recommended', 'Approved', 'In progress')");
  const top = open.slice(0, 3);
  const risks: string[] = [];
  for (const c of site?.data.checks.filter((c) => !c.pass) ?? []) risks.push(`Site-wide check failing: ${c.name} (${c.detail}).`);
  for (const i of gsc?.data.index.filter((i) => i.verdict !== 'PASS' && i.verdict !== 'Unknown') ?? []) risks.push(`${pathOf(i.url)} is not in Google's index: ${i.coverage}.`);
  const sources = store().prepare("SELECT name, status, message FROM sources WHERE status != 'ok'").all() as { name: string; status: string; message: string }[];
  for (const s of sources) risks.push(`Data source "${s.name}" is ${s.status}: ${s.message}`);
  const ignore = (store().prepare("SELECT text, reason, at FROM notes WHERE kind = 'ignore' AND removed IS NULL ORDER BY id").all() as { text: string; reason: string; at: string }[]);
  const auto: string[] = [];
  if (gsc && gsc.data.totals.current.impressions < 100) auto.push('Percentage trends on the Google tiles: with under 100 impressions in a period they mean nothing yet.');
  return { moved, top, openCount: open.length, risks, ignore, auto, dataAsOf: [gsc?.taken, ga?.taken, site?.taken].filter(Boolean).sort().pop() ?? null };
}
