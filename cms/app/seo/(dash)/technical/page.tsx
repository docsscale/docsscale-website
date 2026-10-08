import { requireUser } from '../../../../lib/seo/auth';
import type { SpeedData } from '../../../../lib/seo/sources/pagespeed';
import type { SiteData } from '../../../../lib/seo/sources/site';
import { latestSnapshot } from '../../../../lib/seo/store';
import { Badge, Empty, H1, Section, Source, Table, fmt, when } from '../../ui';

export const dynamic = 'force-dynamic';

const field = (f: { percentile: number; category: string } | null | undefined, unit: string) =>
  f ? `${unit === 'ms' ? fmt(f.percentile) + ' ms' : fmt(f.percentile, 2)} (${f.category.toLowerCase().replace('_', ' ')})` : 'Insufficient data';

export default async function Technical() {
  await requireUser('/seo/technical', 'seo');
  const site = latestSnapshot<SiteData>('site');
  const speed = latestSnapshot<SpeedData>('pagespeed');

  return (
    <>
      <H1>Technical health</H1>
      {!site ? (
        <Empty>The site has not been checked yet. See the Data sources tab.</Empty>
      ) : (
        <>
          <Section title="Site-wide checks">
            <Table head={['Check', 'Result', 'Detail']} rows={site.data.checks.map((c) => [c.name, <Badge key="b" tone={c.pass ? 'good' : 'bad'}>{c.pass ? 'Pass' : 'Fail'}</Badge>, c.detail])} />
            {site.data.failing.length > 0 && (
              <Table head={['Sitemap page', 'Answered', 'Goes to']} rows={site.data.failing.map((f) => [f.url, String(f.status), f.redirect ?? '—'])} />
            )}
            <Source>Live site, {site.data.site} · checked {when(site.taken)}</Source>
          </Section>

          <Section
            title="Page linter"
            note="Each page scored 0 to 100 on the on-page basics. Checks that can't be judged (no focus keyword on the keyword map) and findings the owner declined are left out of the score."
          >
            <Table
              head={['Page', 'Score', 'Failing checks']}
              rows={[...site.data.pages].sort((a, b) => a.score - b.score).map((p) => [
                p.path,
                <Badge key="s" tone={p.score >= 80 ? 'good' : p.score >= 60 ? 'neutral' : 'bad'}>{p.score}</Badge>,
                <ul key="c" style={{ margin: 0, paddingLeft: 16 }}>
                  {p.checks.filter((c) => c.pass === false).map((c) => (
                    <li key={c.id}>{c.label}: {c.detail}{c.declined ? ` (${c.declined}; not counted)` : ''}</li>
                  ))}
                  {p.checks.every((c) => c.pass !== false) && <li>None</li>}
                </ul>,
              ])}
            />
            <Source>Live pages from the sitemap · checked {when(site.taken)}</Source>
          </Section>
        </>
      )}

      <Section title="Speed" note="Lab scores are a simulated phone test. Real-visitor speed comes from Chrome users; Google only publishes it for sites with enough visitors.">
        {!speed ? (
          <Empty>PageSpeed has not run yet. It runs once a week.</Empty>
        ) : (
          <>
            <Table
              head={['Page', 'Performance', 'Accessibility', 'Best practices', 'SEO', 'Largest paint (lab)', 'Layout shift (lab)', 'Largest paint (real visitors)']}
              rows={speed.data.pages.map((p) => p.error
                ? [p.path, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', p.error.slice(0, 80)]
                : [p.path, fmt(p.performance), fmt(p.accessibility), fmt(p.bestPractices), fmt(p.seo), p.lcpMs == null ? 'Unknown' : `${fmt(p.lcpMs / 1000, 1)} s`, fmt(p.cls, 3), field(p.field?.lcp, 'ms')])}
            />
            <p style={{ fontSize: 14 }}>
              Whole site, real visitors: largest paint {field(speed.data.originField?.lcp, 'ms')}; response to taps {field(speed.data.originField?.inp, 'ms')}; layout shift {field(speed.data.originField?.cls, '')}.
            </p>
            <Source>PageSpeed Insights, phone · fetched {when(speed.taken)}</Source>
          </>
        )}
      </Section>
    </>
  );
}
