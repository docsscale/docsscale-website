import { canSee, requireUser } from '../../../../lib/seo/auth';
import { indexingLog, indexingRows } from '../../../../lib/seo/indexing';
import { sendAllPages, watchSitemapNow } from '../../actions';
import type { SpeedData } from '../../../../lib/seo/sources/pagespeed';
import type { SiteData } from '../../../../lib/seo/sources/site';
import { latestSnapshot } from '../../../../lib/seo/store';
import { Badge, Empty, H1, Section, Source, Table, button, day, fmt, quietButton, when } from '../../ui';

export const dynamic = 'force-dynamic';

const field = (f: { percentile: number; category: string } | null | undefined, unit: string) =>
  f ? `${unit === 'ms' ? fmt(f.percentile) + ' ms' : fmt(f.percentile, 2)} (${f.category.toLowerCase().replace('_', ' ')})` : 'Insufficient data';


export default async function Technical({ searchParams }: { searchParams: Promise<{ indexing?: string }> }) {
  const user = await requireUser('/seo/technical', 'seo');
  const { indexing } = await searchParams;
  const site = latestSnapshot<SiteData>('site');
  const speed = latestSnapshot<SpeedData>('pagespeed');
  const pages = indexingRows();
  const recent = indexingLog(12);
  const googleRefused = pages.some((p) => (p.sitemap_status ?? '').includes('403'));
  const waiting = pages.filter((p) => p.google_verdict && p.google_verdict !== 'PASS');

  return (
    <>
      <H1
        lede="Every page in the sitemap is watched every two hours. A new or changed page is sent to Bing and the other IndexNow engines at once, and Google is told by resubmitting the sitemap. What each engine shows for the page comes back with the daily run."
        actions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <form action={watchSitemapNow}><button type="submit" style={{ ...quietButton, padding: '7px 12px', fontSize: 13 }}>Look at the sitemap now</button></form>
            {canSee(user, 'admin') && <form action={sendAllPages}><button type="submit" style={{ ...button, padding: '7px 12px', fontSize: 13 }}>Send every page now</button></form>}
          </div>
        }
      >
        Technical health
      </H1>
      {indexing === 'watched' && <p><Badge tone="good">Sitemap read; new and changed pages were sent.</Badge></p>}
      {indexing === 'sent' && <p><Badge tone="good">Every page was sent to Bing and Google.</Badge></p>}
      {indexing && !['watched', 'sent'].includes(indexing) && <p><Badge tone="bad">{indexing}</Badge></p>}
      {googleRefused && <p><Badge tone="warn">Google refuses the sitemap resubmission: in Search Console, give the dashboard&rsquo;s Google account &ldquo;Full&rdquo; permission (Settings → Users and permissions). Bing is unaffected.</Badge></p>}

      <Section title="Indexing" note={pages.length ? `${pages.length} pages in the sitemap${waiting.length ? `; ${waiting.length} not yet in Google's index` : '; every page is in Google\'s index'}.` : 'The sitemap has not been read yet; it is read within ten minutes of the app starting, then every two hours.'}>
        <Table
          head={['Page', 'Changed', 'Told Bing', 'Told Google', 'Google', 'Google last crawl', 'Bing']}
          rows={pages.map((p) => [
            p.page,
            // The page's own date from the sitemap; the time the watch noticed it is in the tooltip.
            <span key="c" title={`Noticed ${when(p.changed_at)}`}>{day(p.lastmod ?? p.changed_at)}</span>,
            p.indexnow_at ? <span key="i" title={p.indexnow_status ?? ''}><Badge tone={(p.indexnow_status ?? '').startsWith('failed') ? 'bad' : 'good'}>{(p.indexnow_status ?? '').startsWith('failed') ? 'Failed' : 'Sent'}</Badge> {day(p.indexnow_at)}</span> : 'Not yet',
            p.sitemap_at ? <span key="g" title={p.sitemap_status ?? ''}><Badge tone={(p.sitemap_status ?? '').startsWith('failed') ? 'bad' : 'good'}>{(p.sitemap_status ?? '').startsWith('failed') ? 'Refused' : 'Sent'}</Badge> {day(p.sitemap_at)}</span> : 'Not yet',
            p.google_verdict ? <Badge key="v" tone={p.google_verdict === 'PASS' ? 'good' : p.google_verdict === 'Unknown' ? 'neutral' : 'warn'}>{p.google_verdict === 'PASS' ? 'Indexed' : p.google_coverage ?? p.google_verdict}</Badge> : 'Not checked yet',
            p.google_crawl ? day(p.google_crawl) : 'Never',
            p.bing_checked ? (p.bing_crawl ? `Crawled ${day(p.bing_crawl)}` : p.bing_status ?? 'Not crawled yet') : 'Not checked yet',
          ])}
          empty="No pages recorded yet."
        />
        <Source>Sitemap watch every two hours · Google from URL inspection with the daily run · Bing from its UrlInfo with the daily run</Source>
        {recent.length > 0 && (
          <Table head={['When', 'What', 'Pages', 'Result']} rows={recent.map((l) => [when(l.at), `${l.action} (${l.by})`, l.pages.split(' ').map((u) => u.replace(/^https?:\/\/[^/]+/, '') || '/').join(', '), l.result])} />
        )}
      </Section>
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
