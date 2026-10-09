import { seoConfig } from './config';
import { findings, type Finding } from './findings';
import { notifyAdmins } from './mail';
import type { AnalyticsData } from './sources/analytics';
import type { CrmData } from './sources/crm';
import type { SearchConsoleData } from './sources/search-console';
import type { SiteData } from './sources/site';
import { latestSnapshot, now, saveSetting, setting, store } from './store';

// The monthly report (owner, 9 Oct 2026, automation plan item 2): on the
// first Monday of each month, 28 days against the 28 before, what was done
// and what it changed. Written from the data alone, no judgement invented;
// kept on the History tab and emailed to the admins (switch on Settings).

const pathOf = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';

function trend(label: string, cur: number, prev: number, min = 0): string {
  if (min && (cur < min || prev < min)) return `${label}: ${cur} (not enough data for a trend; ${min} are needed in both 28-day periods, the previous had ${prev}).`;
  if (!prev && !cur) return `${label}: none in either period.`;
  if (!prev) return `${label}: ${cur}, none in the previous 28 days.`;
  const pct = Math.round(((cur - prev) / prev) * 100);
  return `${label}: ${cur}, ${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% on the previous 28 days (${prev}).`;
}

/** The report's text, from the latest snapshots and the queue. */
export function monthlyReportText(): string {
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  const ga = latestSnapshot<AnalyticsData>('analytics');
  const crm = latestSnapshot<CrmData>('crm');
  const site = latestSnapshot<SiteData>('site');
  const lines: string[] = [];
  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Chicago' });
  lines.push(`Monthly SEO report, ${month}`, '');

  lines.push('Google search');
  if (gsc) {
    const d = gsc.data;
    lines.push(`Periods compared: ${d.current[0]} to ${d.current[1]} against ${d.previous[0]} to ${d.previous[1]}.`);
    lines.push(trend('Clicks', d.totals.current.clicks, d.totals.previous.clicks));
    lines.push(trend('Impressions', d.totals.current.impressions, d.totals.previous.impressions, 100));
    if (d.totals.current.impressions >= 100 && d.totals.previous.impressions >= 100) lines.push(`Average position: ${d.totals.current.position} (was ${d.totals.previous.position}).`);
    const indexed = d.index.filter((i) => i.verdict === 'PASS').length;
    lines.push(`Pages in Google's index: ${indexed} of ${d.index.length} in the sitemap.`);
    const top = d.pages.slice().sort((a, b) => b.clicks - a.clicks).slice(0, 3).filter((p) => p.clicks > 0);
    if (top.length) lines.push(`Most clicked pages: ${top.map((p) => `${pathOf(p.page)} (${p.clicks})`).join(', ')}.`);
  } else lines.push('Search Console has not been read yet.');
  lines.push('');

  lines.push('Visitors and leads');
  if (ga) {
    lines.push(trend('Visitors who accepted cookies', ga.data.totals.current.totalUsers, ga.data.totals.previous.totalUsers));
    lines.push(trend('Leads recorded by GA4', ga.data.leads.current, ga.data.leads.previous));
  } else lines.push('GA4 has not been read yet.');
  if (crm) {
    lines.push(trend('Leads in the CRM', crm.data.totals.current, crm.data.totals.previous));
    lines.push(trend('Of them, from the website', crm.data.website.current, crm.data.website.previous));
    const ch = crm.data.byChannel.filter((c) => c.current).slice(0, 4);
    if (ch.length) lines.push(`By channel this period: ${ch.map((c) => `${c.channel} ${c.current}`).join(', ')}.`);
  } else lines.push('The CRM is not connected (Settings tab), so leads by source are not shown.');
  lines.push('');

  lines.push('Site health');
  if (site) {
    const failing = site.data.checks.filter((c) => !c.pass);
    lines.push(failing.length ? `Site-wide checks failing: ${failing.map((c) => c.name).join('; ')}.` : 'Every site-wide check passes.');
    lines.push(`Average on-page score: ${site.data.averageScore ?? 'Unknown'} of 100 over ${site.data.pages.length} pages.`);
  } else lines.push('The site has not been read yet.');
  lines.push('');

  const since = new Date(Date.now() - 28 * 86400_000).toISOString();
  const done = findings("status IN ('Done', 'Outcome measured') AND done_at >= ?", since);
  lines.push('Done in the last 28 days');
  if (done.length) for (const f of done) lines.push(`- ${f.what}${f.outcome ? ` (outcome: ${f.outcome}; ${f.outcome_detail ?? ''})` : ' (outcome checked 28 days after the change)'}`);
  else lines.push('Nothing was marked done.');
  lines.push('');

  const measured = findings("status = 'Outcome measured' AND check_date >= ?", since) as Finding[];
  if (measured.length) {
    lines.push('What earlier changes did');
    for (const f of measured) lines.push(`- ${f.what}: ${f.outcome}. ${f.outcome_detail ?? ''}`);
    lines.push('');
  }

  const open = findings("status IN ('Detected', 'Recommended', 'Approved', 'In progress')");
  lines.push(`Open in the fix queue: ${open.length}.`);
  for (const f of open.slice(0, 3)) lines.push(`- ${f.what} (${f.impact} impact, ${f.status})`);
  if (open.some((f) => f.status === 'Recommended')) lines.push('Items marked Recommended wait for your Approve on the fix queue.');
  return lines.join('\n');
}

/** The first Monday of the month, UTC. */
export function firstMondayOf(year: number, month: number): Date {
  const first = new Date(Date.UTC(year, month, 1));
  return new Date(Date.UTC(year, month, 1 + ((8 - first.getUTCDay()) % 7)));
}

/** Writes and sends the month's report once the first Monday has come, once
 *  a month, whichever run gets there first (a run that fails that morning
 *  does not lose the month). Returns true when a report was written. */
export async function sendMonthlyIfDue(): Promise<boolean> {
  const today = new Date();
  const stamp = today.toISOString().slice(0, 7);
  if (today < firstMondayOf(today.getUTCFullYear(), today.getUTCMonth())) return false;
  if (setting('monthly.sent', '') === stamp) return false;
  const text = monthlyReportText();
  store().prepare('INSERT INTO notes (kind, at, by, text, reason) VALUES (?, ?, ?, ?, ?)').run('monthly', now(), 'monthly report', text, '');
  saveSetting('monthly.sent', stamp, 'monthly report', 'Written by the run');
  await notifyAdmins('monthly', `Your monthly SEO report: ${today.toLocaleString('en-US', { month: 'long', timeZone: 'America/Chicago' })}`, text + `\n\nEvery number above is on the dashboard: ${seoConfig.publicUrl}/seo/history`);
  return true;
}

export const monthlyReports = () =>
  store().prepare("SELECT id, at, text FROM notes WHERE kind = 'monthly' AND removed IS NULL ORDER BY id DESC LIMIT 24").all() as { id: number; at: string; text: string }[];
