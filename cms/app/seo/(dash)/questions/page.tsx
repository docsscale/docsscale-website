import { requireUser } from '../../../../lib/seo/auth';
import { FOCUS_KEYWORDS } from '../../../../lib/seo/keywords';
import type { BingData } from '../../../../lib/seo/sources/bing';
import type { SearchConsoleData } from '../../../../lib/seo/sources/search-console';
import type { SiteData } from '../../../../lib/seo/sources/site';
import { latestSnapshot } from '../../../../lib/seo/store';
import { Badge, Empty, H1, Section, Source, T, Table, fmt, link, when } from '../../ui';

export const dynamic = 'force-dynamic';

// Questions and content gaps (docs/SEO-DASHBOARD-PLAN.md, section 8, tab
// 10): questions people searched (Search Console, Bing) against our headings,
// and keyword-map rows with no page. A question counts as covered when a
// heading shares most of its meaningful words.

const QUESTION = /^(who|what|which|how|why|when|where|can|could|do|does|did|is|are|should|will|would)\b/i;
const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'for', 'in', 'on', 'and', 'or', 'is', 'are', 'do', 'does', 'how', 'what', 'why', 'when', 'where', 'which', 'who', 'can', 'should', 'my', 'your', 'i', 'it', 'with', 'you', 'be']);
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w));

export default async function Questions() {
  await requireUser('/seo/questions');
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  const bing = latestSnapshot<BingData>('bing');
  const site = latestSnapshot<SiteData>('site');
  const headings = (site?.data.pages ?? []).flatMap((p) => (p.headings ?? []).map((h) => ({ page: p.path, h, w: new Set(words(h)) })));
  const covered = (q: string) => {
    const w = words(q);
    if (!w.length) return null;
    const best = headings.map((h) => ({ ...h, n: w.filter((x) => h.w.has(x)).length })).sort((a, b) => b.n - a.n)[0];
    return best && best.n >= Math.max(2, Math.ceil(w.length * 0.6)) ? best : null;
  };
  const asked = [
    ...(gsc?.data.queries ?? []).filter((q) => QUESTION.test(q.query)).map((q) => ({ q: q.query, engine: 'Google', impressions: q.impressions, clicks: q.clicks })),
    ...(bing?.data.queries ?? []).filter((q) => QUESTION.test(q.query)).map((q) => ({ q: q.query, engine: 'Bing', impressions: q.impressions, clicks: q.clicks })),
  ].sort((a, b) => b.impressions - a.impressions);
  const live = new Set(site?.data.pages.map((p) => p.path) ?? []);
  const gaps = Object.entries(FOCUS_KEYWORDS).filter(([p]) => site && !live.has(p));

  return (
    <>
      <H1>Questions and content gaps</H1>
      <Section title="Questions people searched" note="Phrases that start like a question, from Google and Bing, and whether a heading on the site answers them. Google hides rare phrases, so this list grows slowly.">
        {!gsc && !bing ? <Empty>Search data has not been read yet.</Empty> : (
          <Table
            head={['Question', 'Engine', 'Impressions', 'Clicks', 'Covered by a heading']}
            rows={asked.map((a) => {
              const c = site?.data.pages.some((p) => p.headings) ? covered(a.q) : undefined;
              return [a.q, a.engine, fmt(a.impressions), fmt(a.clicks), c === undefined ? 'Unknown until the next site check' : c ? <span key="c"><Badge tone="good">Yes</Badge> {c.page}: “{c.h}”</span> : <Badge key="n" tone="bad">No</Badge>];
            })}
            empty="No question-shaped phrases were reported in this period."
          />
        )}
        <Source>Search Console{gsc ? ` ${gsc.data.current[0]} to ${gsc.data.current[1]}, fetched ${when(gsc.taken)}` : ' not read yet'} · Bing{bing ? ` fetched ${when(bing.taken)}` : ' not read yet'} · headings from the live site{site ? `, checked ${when(site.taken)}` : ''}</Source>
      </Section>
      <Section title="Keyword-map rows with no page" note="Mapped keywords whose page is not live yet. Each is also in the fix queue as a page to write.">
        <Table head={['Page to write', 'Primary keyword']} rows={gaps.map(([p, kw]) => [p, kw])} empty={site ? 'Every mapped keyword has a live page.' : 'Unknown until the site is checked.'} />
        <Source>Keyword map (approved 6 Oct 2026) · <a href="/seo/queue?rule=missing-page" style={link}>see them in the queue</a></Source>
      </Section>
      <p style={{ fontSize: 13, color: T.caption }}>Questions Google shows under &ldquo;People also ask&rdquo; are not available through any free API; the keyword map lists the ones noted by hand on 6 Oct 2026.</p>
    </>
  );
}
