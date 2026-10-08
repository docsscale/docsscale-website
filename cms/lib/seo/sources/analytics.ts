import { seoConfig } from '../config';
import { googleToken, periods, postJson } from '../http';

// GA4 Data API, read-only. Only visitors who accept cookies are counted, so
// GA4 undercounts; the CRM stays the lead count of record (docs/TRACKING.md).

// Team traffic: the owner's previews from the hosting panel and the team in
// Karachi. DocsScale sells to US practices, so these are never prospects.
const TEAM = {
  orGroup: {
    expressions: [
      { filter: { fieldName: 'sessionSource', stringFilter: { value: 'hpanel.hostinger.com' } } },
      { filter: { fieldName: 'city', stringFilter: { value: 'Karachi' } } },
    ],
  },
};

/** Visits from AI assistants are grouped here from the referring address;
 *  visits from the assistants' apps often have none, so this undercounts. */
const ASSISTANTS = /chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com/i;

/** The site's key events (docs/TRACKING.md): a form sent and a call booked. */
export const LEAD_EVENTS = ['generate_lead', 'book_call'];

type Metrics = { sessions: number; totalUsers: number; engagedSessions: number; keyEvents: number };
export type AnalyticsData = {
  property: string;
  current: readonly [string, string];
  previous: readonly [string, string];
  excluded: string;
  totals: { current: Metrics; previous: Metrics };
  leads: { current: number; previous: number };
  daily: { date: string; sessions: number; users: number }[];
  channels: { channel: string; sessions: number; previous: number; keyEvents: number }[];
  events: { event: string; count: number; keyEvents: number }[];
  landingPages: { page: string; sessions: number; keyEvents: number }[];
};

type Report = Record<string, string | number>;

async function report(range: readonly [string, string], dims: string[], metrics: string[], limit = 100): Promise<Report[]> {
  const token = await googleToken();
  const r = await postJson<{
    dimensionHeaders?: { name: string }[];
    metricHeaders: { name: string }[];
    rows?: { dimensionValues?: { value: string }[]; metricValues: { value: string }[] }[];
  }>(
    `https://analyticsdata.googleapis.com/v1beta/${seoConfig.ga4Property}:runReport`,
    {
      dateRanges: [{ startDate: range[0], endDate: range[1] }],
      dimensions: dims.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      dimensionFilter: { notExpression: TEAM },
      limit,
    },
    { Authorization: `Bearer ${token}` },
  );
  return (r.rows ?? []).map((row) => {
    const out: Report = {};
    (r.dimensionHeaders ?? []).forEach((h, i) => (out[h.name] = row.dimensionValues![i].value));
    r.metricHeaders.forEach((h, i) => (out[h.name] = Number(row.metricValues[i].value)));
    return out;
  });
}

const M = ['sessions', 'totalUsers', 'engagedSessions', 'keyEvents'];
const asMetrics = (r?: Report): Metrics => ({
  sessions: Number(r?.sessions ?? 0), totalUsers: Number(r?.totalUsers ?? 0),
  engagedSessions: Number(r?.engagedSessions ?? 0), keyEvents: Number(r?.keyEvents ?? 0),
});

/** Channel per GA4, except that assistant referrals get their own row. */
function channels(rows: Report[]) {
  const out = new Map<string, { sessions: number; keyEvents: number }>();
  for (const r of rows) {
    const name = ASSISTANTS.test(String(r.sessionSource)) ? 'AI assistants' : String(r.sessionDefaultChannelGroup);
    const c = out.get(name) ?? { sessions: 0, keyEvents: 0 };
    c.sessions += Number(r.sessions);
    c.keyEvents += Number(r.keyEvents);
    out.set(name, c);
  }
  return out;
}

export async function collectAnalytics(): Promise<AnalyticsData> {
  const { current, previous } = periods(1);
  const [tCur, tPrev, daily, chCur, chPrev, evCur, evPrev, landing] = await Promise.all([
    report(current, [], M),
    report(previous, [], M),
    report(current, ['date'], ['sessions', 'totalUsers']),
    report(current, ['sessionDefaultChannelGroup', 'sessionSource'], ['sessions', 'keyEvents'], 500),
    report(previous, ['sessionDefaultChannelGroup', 'sessionSource'], ['sessions', 'keyEvents'], 500),
    report(current, ['eventName'], ['eventCount', 'keyEvents']),
    report(previous, ['eventName'], ['eventCount']),
    report(current, ['landingPage'], ['sessions', 'keyEvents'], 50),
  ]);
  const leads = (rows: Report[]) => rows.filter((r) => LEAD_EVENTS.includes(String(r.eventName))).reduce((s, r) => s + Number(r.eventCount), 0);
  const cur = channels(chCur);
  const prev = channels(chPrev);
  return {
    property: seoConfig.ga4Property,
    current,
    previous,
    excluded: 'Team traffic (visits from the hosting panel, and from Karachi) is left out.',
    totals: { current: asMetrics(tCur[0]), previous: asMetrics(tPrev[0]) },
    leads: { current: leads(evCur), previous: leads(evPrev) },
    daily: daily
      .map((r) => ({ date: `${String(r.date).slice(0, 4)}-${String(r.date).slice(4, 6)}-${String(r.date).slice(6, 8)}`, sessions: Number(r.sessions), users: Number(r.totalUsers) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    channels: [...cur]
      .map(([channel, c]) => ({ channel, sessions: c.sessions, previous: prev.get(channel)?.sessions ?? 0, keyEvents: c.keyEvents }))
      .sort((a, b) => b.sessions - a.sessions),
    events: evCur.map((r) => ({ event: String(r.eventName), count: Number(r.eventCount), keyEvents: Number(r.keyEvents) })).sort((a, b) => b.count - a.count),
    landingPages: landing.map((r) => ({ page: String(r.landingPage), sessions: Number(r.sessions), keyEvents: Number(r.keyEvents) })).sort((a, b) => b.sessions - a.sessions),
  };
}
