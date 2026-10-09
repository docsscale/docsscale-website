import { crmLocationId, crmToken } from '../config';
import { getJson, periods, postJson } from '../http';
import { latestSnapshot } from '../store';
import type { SearchConsoleData } from './search-console';

// Leads from the CRM, matched with where they came from (owner, 9 Oct 2026,
// automation plan item 5). The lead handler saves each website lead with its
// UTM tags and landing page (docs/SERVER.md, docs/TRACKING.md); this reads
// those back with a read-only token and keeps COUNTS ONLY. No name, email,
// phone or message ever leaves the CRM: the snapshot holds dates, sources and
// pages, nothing that identifies a person. Google never tells which phrase a
// visitor searched, so a lead's landing page is matched with the phrases
// Search Console shows that page for: the nearest an honest match gets.

const API = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';
const PAGE_LIMIT = 100;
const MAX_PAGES = 30; // 3,000 contacts in 56 days would be a very good problem

type CustomField = { id: string; fieldKey?: string; name?: string };
type Contact = { dateAdded?: string; source?: string | null; customFields?: { id: string; value?: unknown }[] };

export type CrmData = {
  current: readonly [string, string];
  previous: readonly [string, string];
  totals: { current: number; previous: number };
  /** Leads the website's forms sent (the CRM "source" the lead handler pins). */
  website: { current: number; previous: number };
  bySource: { source: string; current: number; previous: number }[];
  byChannel: { channel: string; current: number; previous: number }[];
  byLandingPage: { page: string; current: number; previous: number; channels: string[]; queries: { query: string; clicks: number; impressions: number; position: number }[] }[];
  byCampaign: { campaign: string; current: number; previous: number }[];
  /** Attribution fields found in the CRM, by their key; a missing one reads Unknown on the tab. */
  fieldsFound: string[];
  note: string;
};

const headers = () => ({ Authorization: `Bearer ${crmToken()}`, Version: VERSION });
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const WANTED = ['utm_source', 'utm_medium', 'utm_campaign', 'landing_page'] as const;
type Wanted = (typeof WANTED)[number];

/** The ids of the four attribution fields, found by key or by name. */
async function attributionFieldIds(): Promise<Partial<Record<Wanted, string>>> {
  const r = await getJson<{ customFields?: CustomField[] }>(`${API}/locations/${encodeURIComponent(crmLocationId())}/customFields?model=contact`, { headers: headers() });
  const ids: Partial<Record<Wanted, string>> = {};
  for (const f of r.customFields ?? []) {
    const key = norm((f.fieldKey ?? '').replace(/^contact\./, ''));
    const name = norm(f.name ?? '');
    for (const w of WANTED) if (!ids[w] && (key === norm(w) || name === norm(w))) ids[w] = f.id;
  }
  return ids;
}

/** Contacts added since `since`, newest first, page by page. */
async function contactsSince(since: string): Promise<Contact[]> {
  const out: Contact[] = [];
  let searchAfter: unknown[] | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const r = await postJson<{ contacts?: Contact[]; searchAfter?: unknown[] }>(
      `${API}/contacts/search`,
      { locationId: crmLocationId(), pageLimit: PAGE_LIMIT, sort: [{ field: 'dateAdded', direction: 'desc' }], filters: [{ field: 'dateAdded', operator: 'range', value: { gte: since } }], ...(searchAfter ? { searchAfter } : {}) },
      headers(),
    );
    const batch = r.contacts ?? [];
    out.push(...batch);
    const last = batch[batch.length - 1];
    searchAfter = last && batch.length === PAGE_LIMIT ? r.searchAfter ?? (last as { searchAfter?: unknown[] }).searchAfter : undefined;
    if (!searchAfter) break;
  }
  return out;
}

/** Marketing channel from the UTM tags, in the words the Analytics tab uses. */
export function channelOf(source: string, medium: string, landingPage: string, fromWebsite: boolean): string {
  const s = source.toLowerCase(), m = medium.toLowerCase();
  if (/^(cpc|ppc|paid|paidsearch|paid_search|sem)$/.test(m) || (s.includes('google') && /ad/.test(m))) return 'Paid search';
  if (/social/.test(m) || /^(facebook|instagram|meta|fb|ig|linkedin|tiktok|youtube)$/.test(s)) return /paid|cpc|ads?/.test(m) ? 'Paid social' : 'Social';
  if (m === 'organic' || (s === 'google' && !m) || s === 'bing') return 'Organic search';
  if (m === 'email' || s === 'email') return 'Email';
  if (m === 'referral') return 'Referral';
  if (s || m) return `Other tagged (${[s, m].filter(Boolean).join(' / ')})`;
  if (landingPage) return 'Direct or untagged visit';
  return fromWebsite ? 'Website form, no tags recorded' : 'Added in the CRM, not from the website';
}

const pathOf = (u: string) => {
  try { return new URL(u, 'https://docsscale.com').pathname || '/'; } catch { return u || ''; }
};

export async function collectCrm(): Promise<CrmData> {
  if (!crmToken() || !crmLocationId()) throw new Error('The CRM token and location are not set on the Settings tab.');
  const { current, previous } = periods(0);
  const ids = await attributionFieldIds();
  const contacts = await contactsSince(`${previous[0]}T00:00:00.000Z`);
  const byId = new Map(Object.entries(ids).map(([k, v]) => [v, k as Wanted]));

  type Lead = { day: string; source: string; website: boolean; utmSource: string; utmMedium: string; campaign: string; landing: string; channel: string };
  const leads: Lead[] = [];
  for (const c of contacts) {
    const day = (c.dateAdded ?? '').slice(0, 10);
    if (!day) continue;
    const attr: Partial<Record<Wanted, string>> = {};
    for (const f of c.customFields ?? []) {
      const w = byId.get(f.id);
      if (w && f.value != null && f.value !== '') attr[w] = String(f.value);
    }
    const source = (c.source ?? '').trim() || 'No source recorded';
    const website = /^(website|funnel)/i.test(source);
    const landing = attr.landing_page ? pathOf(attr.landing_page) : '';
    leads.push({ day, source, website, utmSource: attr.utm_source ?? '', utmMedium: attr.utm_medium ?? '', campaign: attr.utm_campaign ?? '', landing, channel: channelOf(attr.utm_source ?? '', attr.utm_medium ?? '', landing, website) });
  }
  const inCur = (l: Lead) => l.day >= current[0] && l.day <= current[1];
  const inPrev = (l: Lead) => l.day >= previous[0] && l.day <= previous[1];
  const count = <K extends string>(key: (l: Lead) => K) => {
    const m = new Map<K, { current: number; previous: number }>();
    for (const l of leads) {
      const k = key(l);
      const row = m.get(k) ?? { current: 0, previous: 0 };
      if (inCur(l)) row.current++;
      else if (inPrev(l)) row.previous++;
      m.set(k, row);
    }
    return [...m].filter(([, v]) => v.current || v.previous).sort((a, b) => b[1].current - a[1].current || b[1].previous - a[1].previous);
  };

  const gsc = latestSnapshot<SearchConsoleData>('search-console')?.data;
  const queriesFor = (page: string) =>
    (gsc?.pageQueries ?? [])
      .filter((q) => pathOf(q.page) === page)
      .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
      .slice(0, 5)
      .map(({ query, clicks, impressions, position }) => ({ query, clicks, impressions, position }));

  const landing = count((l) => l.landing || '(no landing page recorded)');
  const missing = WANTED.filter((w) => !ids[w]);
  return {
    current,
    previous,
    totals: { current: leads.filter(inCur).length, previous: leads.filter(inPrev).length },
    website: { current: leads.filter((l) => l.website && inCur(l)).length, previous: leads.filter((l) => l.website && inPrev(l)).length },
    bySource: count((l) => l.source).map(([source, v]) => ({ source, ...v })),
    byChannel: count((l) => l.channel).map(([channel, v]) => ({ channel, ...v })),
    byLandingPage: landing.map(([page, v]) => ({ page, ...v, channels: [...new Set(leads.filter((l) => (l.landing || '(no landing page recorded)') === page).map((l) => l.channel))], queries: page.startsWith('/') ? queriesFor(page) : [] })),
    byCampaign: count((l) => l.campaign || '(no campaign)').map(([campaign, v]) => ({ campaign, ...v })),
    fieldsFound: WANTED.filter((w) => ids[w]),
    note: missing.length ? `The CRM has no custom field for ${missing.join(', ')}; leads cannot be matched on it until the lead handler's fields exist there.` : 'Counts only; no name or contact detail is stored here.',
  };
}
