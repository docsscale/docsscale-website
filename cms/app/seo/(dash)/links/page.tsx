import { requireUser } from '../../../../lib/seo/auth';
import { latestImport, stamp, type BacklinkRow } from '../../../../lib/seo/imports';
import type { BingData } from '../../../../lib/seo/sources/bing';
import type { SiteData } from '../../../../lib/seo/sources/site';
import { OUTREACH_KINDS, competitorGaps, lostLinks, outreachRows, seedOutreach } from '../../../../lib/seo/links';
import { latestSnapshot, store } from '../../../../lib/seo/store';
import { addOutreachSite, moveOutreachSite } from '../../actions';
import { Badge, Empty, H1, Section, Source, T, Table, button, fmt, input, link, quietButton, when } from '../../ui';

export const dynamic = 'force-dynamic';

// Links and authority (docs/SEO-DASHBOARD-PLAN.md, section 8, tab 9): the
// internal link map from our own crawl (links in each page's main text;
// menus and the footer are left out, since every page has those), orphan
// pages, Bing's inbound link counts, and any link export brought in through
// Imports. Backlink detail needs a paid connector, which is off.

const pathOf = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';

export default async function Links() {
  const user = await requireUser('/seo/links', 'seo');
  seedOutreach();
  const outreach = outreachRows();
  const lost = lostLinks();
  const gaps = competitorGaps();
  const canEdit = user.role !== 'editor';
  const small = { padding: '4px 10px', fontSize: 12 } as const;
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
      <Section title="Link building" note="Sites to be listed on or to ask for a link, and where each one stands. The starter rows are free directories and the three profiles with copy ready in the project files. Move a row along as you go; Live means the link is up." style={{ scrollMarginTop: 80 }}>
        <div id="outreach" />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: T.caption, marginBottom: 10 }}>
          {(['To do', 'Contacted', 'Live', 'Declined'] as const).map((st) => <span key={st}><strong style={{ color: T.ink }}>{outreach.filter((o) => o.status === st).length}</strong> {st.toLowerCase()}</span>)}
        </div>
        <Table
          head={['Site', 'Kind', 'Points to', 'Status', 'Note', canEdit ? 'Move to' : 'Updated']}
          rows={outreach.map((o) => [
            o.url ? <a key="u" href={o.url} target="_blank" rel="noreferrer" style={link}>{o.site}</a> : o.site,
            o.kind, o.target,
            <Badge key="s" tone={o.status === 'Live' ? 'good' : o.status === 'Declined' ? 'bad' : o.status === 'Contacted' ? 'info' : 'warn'}>{o.status}</Badge>,
            o.note || '—',
            canEdit ? (
              <span key="m" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {(['To do', 'Contacted', 'Live', 'Declined'] as const).filter((st) => st !== o.status).map((st) => (
                  <form key={st} action={moveOutreachSite}><input type="hidden" name="id" value={o.id} /><input type="hidden" name="status" value={st} /><button type="submit" style={{ ...quietButton, ...small }}>{st}</button></form>
                ))}
              </span>
            ) : when(o.updated_at),
          ])}
          empty="Nothing on the list yet."
        />
        {canEdit && (
          <form action={addOutreachSite} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginTop: 12, alignItems: 'end' }}>
            <label style={{ fontSize: 13 }}>Site<input name="site" required placeholder="Houston dental society" style={{ ...input, marginTop: 2 }} /></label>
            <label style={{ fontSize: 13 }}>Address<input name="url" placeholder="https://" style={{ ...input, marginTop: 2 }} /></label>
            <label style={{ fontSize: 13 }}>Kind<select name="kind" style={{ ...input, marginTop: 2 }}>{OUTREACH_KINDS.map((k) => <option key={k}>{k}</option>)}</select></label>
            <label style={{ fontSize: 13 }}>Points to<input name="target" defaultValue="/" style={{ ...input, marginTop: 2 }} /></label>
            <label style={{ fontSize: 13 }}>Note<input name="note" style={{ ...input, marginTop: 2 }} /></label>
            <button type="submit" style={{ ...button, padding: '9px 14px' }}>Add site</button>
          </form>
        )}
        <Source>Kept in the dashboard · sites in a competitor's backlink export that do not link to us can be added from the list below</Source>
      </Section>
      <Section title="Links that disappeared" note="Referring sites in your previous backlink export that are missing from the newest one. Each is also in the fix queue as a link to ask for back.">
        {!lost ? <Empty>Needs two backlink exports of ours on the Imports tab; the newest two are compared.</Empty> : (
          <>
            <Table head={['Site', 'Links before', 'Authority (tool)', 'Pointed to']} rows={lost.lost.slice(0, 50).map((l) => [l.domain, fmt(l.links), l.authority == null ? 'Unknown' : fmt(l.authority), l.target ? pathOf(l.target) : '—'])} empty="Every referring site in the previous export is still there." />
            <Source>{lost.previous.source} export of {lost.previous.at.slice(0, 10)} against {lost.newest.source} export of {lost.newest.at.slice(0, 10)} · the queue rule is <a href="/seo/queue?rule=lost-link" style={link}>lost-link</a></Source>
          </>
        )}
      </Section>
      <Section title="Sites linking to a competitor but not to us" note="Upload a competitor's backlink export on the Imports tab with the source “Competitor backlinks”. Sites here link to them and not to us (by our newest export) and are not on the list above yet.">
        {!gaps ? <Empty>No competitor backlink export uploaded yet.</Empty> : (
          <>
            <Table
              head={['Site', 'Links to them', 'Authority (tool)', 'Example page', canEdit ? '' : 'Note']}
              rows={gaps.gaps.slice(0, 100).map((g) => [
                g.domain, fmt(g.links), g.authority == null ? 'Unknown' : fmt(g.authority),
                <a key="e" href={g.example.startsWith('http') ? g.example : `https://${g.example}`} target="_blank" rel="noreferrer" style={link}>{g.example.replace(/^https?:\/\//, '').slice(0, 60)}</a>,
                canEdit ? <form key="a" action={addOutreachSite}><input type="hidden" name="site" value={g.domain} /><input type="hidden" name="url" value={g.example.startsWith('http') ? g.example : `https://${g.example}`} /><input type="hidden" name="kind" value="Other" /><input type="hidden" name="target" value="/" /><input type="hidden" name="note" value={`Links to a competitor (${gaps.competitor.filename})`} /><button type="submit" style={{ ...button, ...small }}>Add to list</button></form> : '—',
              ])}
              empty="Every site in the competitor export already links to us or is on the list."
            />
            <Source>{gaps.competitor.source}, {gaps.competitor.filename}, uploaded {gaps.competitor.at.slice(0, 10)}{gaps.ours ? ` · compared with our ${gaps.ours.source} export of ${gaps.ours.at.slice(0, 10)}` : ' · no export of ours yet, so every site is listed'}</Source>
          </>
        )}
      </Section>
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
      <p style={{ fontSize: 13, color: T.caption }}>Backlink detail comes from uploaded exports for now (owner, 9 Oct 2026); a paid connector would fetch it on its own and is off until the owner decides to buy one. Upload a fresh export of ours each month and the dashboard spots the links that disappeared.</p>
    </>
  );
}
