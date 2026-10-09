import { requireUser } from '../../../../lib/seo/auth';
import { latestImport, stamp, type BacklinkRow } from '../../../../lib/seo/imports';
import type { BingData } from '../../../../lib/seo/sources/bing';
import type { SiteData } from '../../../../lib/seo/sources/site';
import { latestSnapshot, store } from '../../../../lib/seo/store';
import { Badge, Empty, H1, Section, Source, T, Table, fmt, link, when } from '../../ui';

export const dynamic = 'force-dynamic';

// Links and authority (docs/SEO-DASHBOARD-PLAN.md, section 8, tab 9): the
// internal link map from our own crawl (links in each page's main text;
// menus and the footer are left out, since every page has those), orphan
// pages, Bing's inbound link counts, and any link export brought in through
// Imports. Backlink detail needs a paid connector, which is off.

const pathOf = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';

export default async function Links() {
  await requireUser('/seo/links', 'seo');
  const site = latestSnapshot<SiteData>('site');
  const bing = latestSnapshot<BingData>('bing');
  const pages = site?.data.pages ?? [];
  const hasLinks = pages.some((p) => Array.isArray(p.links));
  const inbound = new Map<string, string[]>();
  for (const p of pages) for (const l of p.links ?? []) inbound.set(l, [...(inbound.get(l) ?? []), p.path]);
  const bingIn = new Map((bing?.data.inbound ?? []).map((r) => [pathOf(r.url), r.count]));
  const back = latestImport<BacklinkRow>('backlinks');
  const domains = new Map<string, { n: number; authority: number | null }>();
  for (const r of back?.rows ?? []) { const d = domains.get(r.domain) ?? { n: 0, authority: null }; d.n++; d.authority = Math.max(d.authority ?? 0, r.authority ?? 0) || d.authority; domains.set(r.domain, d); }
  const perTarget = new Map<string, number>();
  for (const r of back?.rows ?? []) if (r.target) perTarget.set(pathOf(r.target), (perTarget.get(pathOf(r.target)) ?? 0) + 1);
  const linkImports = store().prepare("SELECT id, at, by, source, filename, rows FROM imports WHERE source LIKE '%link%' ORDER BY id DESC LIMIT 10").all() as { id: number; at: string; by: string; source: string; filename: string; rows: number }[];

  return (
    <>
      <H1>Links and authority</H1>
      {!site || !hasLinks ? (
        <Empty>{site ? 'The link map appears after the next daily check of the site (the last one was made before the dashboard kept links).' : 'The site has not been checked yet. See the Data sources tab.'}</Empty>
      ) : (
        <>
          <Section title="Internal links" note="Links from each page's main text. Pages with none coming in are orphans: search engines reach them only through the menu, and rank them lower.">
            <Table
              head={['Page', 'Links in (from text)', 'From', 'Links out', 'Bing: links from other sites']}
              rows={[...pages].sort((a, b) => (inbound.get(a.path)?.length ?? 0) - (inbound.get(b.path)?.length ?? 0)).map((p) => {
                const from = inbound.get(p.path) ?? [];
                return [
                  p.path,
                  from.length === 0 && !['/', '/privacy/', '/terms/'].includes(p.path) ? <Badge key="o" tone="bad">Orphan (0)</Badge> : fmt(from.length),
                  from.join(', ') || '—', fmt(p.links.length),
                  bing ? (bing.data.inbound ? fmt(bingIn.get(p.path) ?? 0) : 'Unknown (Bing did not answer)') : 'Unknown',
                ];
              })}
            />
            <Source>Live site, {site.data.site} · checked {when(site.taken)}{bing ? ` · Bing Webmaster inbound counts fetched ${when(bing.taken)}` : ''} · orphans are in the <a href="/seo/queue" style={link}>fix queue</a></Source>
          </Section>
          <Section title="Who links to whom" note="Each page and the pages its text links to.">
            <Table head={['Page', 'Links to']} rows={pages.map((p) => [p.path, p.links.join(', ') || '—'])} />
          </Section>
        </>
      )}
      <Section title="Backlinks from the uploaded export" note="A backlink export from Semrush, Ahrefs, Moz, Search Console or any tool, uploaded on the Imports tab; the newest one is shown.">
        {!back ? <Empty>No backlink export uploaded yet.</Empty> : (
          <>
            <p style={{ fontSize: 14, margin: '0 0 10px' }}>{fmt(back.rows.length)} backlinks from {fmt(domains.size)} referring domains.</p>
            <Table
              head={['Referring domain', 'Links', 'Authority (tool)']}
              rows={[...domains].sort((a, b) => (b[1].authority ?? 0) - (a[1].authority ?? 0) || b[1].n - a[1].n).slice(0, 100).map(([d, v]) => [d, fmt(v.n), v.authority == null ? 'Unknown' : fmt(v.authority)])}
            />
            {perTarget.size > 0 && <Table head={['Our page', 'Backlinks']} rows={[...perTarget].sort((a, b) => b[1] - a[1]).map(([p, n]) => [p, fmt(n)])} />}
            <Source>{stamp(back.meta)}</Source>
          </>
        )}
      </Section>
      <Section title="Link exports brought in" note="Search Console's links export or any tool's backlink export, uploaded on the Imports tab with a source containing the word “links”.">
        <Table head={['When', 'Source', 'File', 'Rows', 'By']} rows={linkImports.map((i) => [when(i.at), i.source, <a key="f" href={`/seo/imports?view=${i.id}`} style={link}>{i.filename}</a>, fmt(i.rows), i.by])} empty="No link export has been uploaded yet." />
      </Section>
      <p style={{ fontSize: 13, color: T.caption }}>Backlink detail comes from uploaded exports for now (owner, 9 Oct 2026); a paid connector would fetch it on its own and is off until the owner decides to buy one.</p>
    </>
  );
}
