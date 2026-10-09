import { requireUser } from '../../../../lib/seo/auth';
import { FOCUS_KEYWORDS } from '../../../../lib/seo/keywords';
import type { ContentData } from '../../../../lib/seo/sources/content';
import type { SearchConsoleData } from '../../../../lib/seo/sources/search-console';
import type { SiteData } from '../../../../lib/seo/sources/site';
import { latestSnapshot, store } from '../../../../lib/seo/store';
import { whatToWriteNext } from '../../../../lib/seo/write-next';
import { planSuggestion, refreshContent, skipSuggestion } from '../../actions';
import { Badge, Empty, H1, Section, Source, T, button, quietButton, when } from '../../ui';
import { SortableTable, type Cell } from './sortable';

export const dynamic = 'force-dynamic';

const HEAD = ['Page', 'Kind', 'Status', 'Created', 'Last changed', 'Edits', 'Words', 'SEO score', 'Focus keyword', 'Structured data', 'In Google', 'Google clicks (28 days)'];

export default async function ContentHistory({ searchParams }: { searchParams: Promise<{ checked?: string; planned?: string }> }) {
  const user = await requireUser('/seo/content');
  const { checked, planned } = await searchParams;
  const next = whatToWriteNext(12);
  const content = latestSnapshot<ContentData>('content');
  const site = latestSnapshot<SiteData>('site');
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  if (!content && !site) return (<><H1>Content inventory</H1><Empty>Nothing collected yet. See the Data sources tab.</Empty></>);

  const edits = new Map(
    (store().prepare("SELECT file, COUNT(DISTINCT sha) AS n, MIN(at) AS first, MAX(at) AS last FROM edits GROUP BY file").all() as { file: string; n: number; first: string; last: string }[])
      .map((r) => [r.file, r]),
  );
  const pathOf = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';
  const clicks = new Map((gsc?.data.pages ?? []).map((p) => [pathOf(p.page), p.clicks]));
  const indexed = new Map((gsc?.data.index ?? []).map((i) => [pathOf(i.url), i.verdict === 'PASS' ? 'Yes' : 'No']));
  const lint = new Map((site?.data.pages ?? []).map((p) => [p.path, p]));
  const d10 = (s: string | null | undefined) => (s ? s.slice(0, 10) : null);

  const rows: Cell[][] = [];
  const posts = new Set<string>();
  for (const p of content?.data.posts ?? []) {
    posts.add(p.path);
    const e = edits.get(`content/posts/${p.slug}/index.mdoc`);
    const l = lint.get(p.path);
    rows.push([
      p.path, 'Post', p.live ? 'Live' : p.status === 'published' ? 'Published, not live yet' : 'Draft',
      d10(e?.first) ?? p.published, d10([p.updated, d10(e?.last)].filter(Boolean).sort().pop()), e?.n ?? 0, p.words,
      l?.score ?? (p.live ? null : p.score ?? null), FOCUS_KEYWORDS[p.path] ?? (p.keyword || null), l?.schemaTypes.join(', ') || null,
      indexed.get(p.path) ?? null, clicks.get(p.path) ?? (gsc ? 0 : null),
    ]);
  }
  for (const l of site?.data.pages ?? []) {
    if (posts.has(l.path)) continue;
    rows.push([
      l.path, 'Page', 'Live', null, d10(l.lastmod), null, l.words, l.score, l.keyword, l.schemaTypes.join(', ') || null,
      indexed.get(l.path) ?? null, clicks.get(l.path) ?? (gsc ? 0 : null),
    ]);
  }

  // Posts not live yet, or edited since: the pre-publish checks (plan item 3).
  // Snapshots from before 9 Oct 2026 have no checks on a post; "Check my drafts now" fills them in.
  const drafts = (content?.data.posts ?? []).filter((p) => !p.live).map((p) => ({ ...p, checks: p.checks ?? [], score: p.score ?? 0 }));
  const checkNow = (
    <form action={refreshContent}><button type="submit" style={{ ...button, padding: '7px 12px', fontSize: 13 }}>Check my drafts now</button></form>
  );

  return (
    <>
      <H1 actions={checkNow}>Content inventory</H1>
      {checked === '1' && <p><Badge tone="good">Checked just now against the editing screen's latest saves.</Badge></p>}
      {checked === 'error' && <p><Badge tone="bad">The content files could not be read; see the Data sources tab.</Badge></p>}
      <Section
        title="What to write next"
        note="Pages and posts worth writing, strongest first, from the keyword map, keyword ideas, questions people searched with no answer on the site, Search Console and your uploaded exports. Each line is one piece of writing; the phrases under it are what the same piece would cover. Add to plan puts it on the 30-day plan; Not for us hides the topic for good."
        style={{ scrollMarginTop: 80 }}
      >
        <div id="write-next" />
        {planned && <p style={{ margin: '0 0 10px' }}><Badge tone="good">Added to the 30-day plan: {planned}</Badge></p>}
        {next.items.length === 0 ? <Empty>{next.notes[0] ?? 'Nothing to suggest yet. The list fills from the weekly keyword lookups and the search data.'}</Empty> : (
          <ol style={{ margin: 0, paddingLeft: 24, display: 'grid', gap: 12, fontSize: 14 }}>
            {next.items.map((s) => (
              <li key={s.key} style={{ paddingLeft: 4 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <strong style={{ fontSize: 15 }}>{s.keyword}</strong>
                  <Badge tone={s.kind === 'Blog post' ? 'info' : 'neutral'}>{s.kind}</Badge>
                  {user.role !== 'editor' && (
                    <span style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                      <form action={planSuggestion}><input type="hidden" name="phrase" value={s.keyword} /><input type="hidden" name="kind" value={s.kind} /><button type="submit" style={{ ...button, padding: '4px 10px', fontSize: 12 }}>Add to plan</button></form>
                      <form action={skipSuggestion}><input type="hidden" name="phrase" value={s.keyword} /><button type="submit" style={{ ...quietButton, padding: '4px 10px', fontSize: 12 }}>Not for us</button></form>
                    </span>
                  )}
                </div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: T.body, display: 'grid', gap: 2 }}>
                  {s.why.map((w) => <li key={w}>{w.charAt(0).toUpperCase() + w.slice(1)}.</li>)}
                </ul>
                {s.also.length > 0 && <div style={{ marginTop: 4, fontSize: 13, color: T.caption }}>Also covers: {s.also.join(' · ')}</div>}
              </li>
            ))}
          </ol>
        )}
        <Source>{next.notes.join(' ')}{next.notes.length ? ' · ' : ''}Keyword map · keyword ideas (Bing, Google) · Search Console · Bing · uploaded exports · phrases the site already answers or ranks in the top 10 for are left out</Source>
      </Section>
      <Section
        title="Before you publish"
        note="The same checks the live pages get, run on each post that is not live yet, from what the editing screen last saved. Fix them in the editor and press Check my drafts now; a post with every check passing goes live without turning up in the fix queue."
      >
        {drafts.length === 0 ? <Empty>No drafts or unpublished posts. Posts set to Published and live are checked on the live site instead.</Empty> : (
          <div style={{ display: 'grid', gap: 10 }}>
            {drafts.map((p) => {
              const failing = p.checks.filter((c) => c.pass === false);
              const unknown = p.checks.filter((c) => c.pass === null);
              return (
                <details key={p.slug} open={failing.length > 0} className="sx-finding" style={{ borderLeft: `4px solid ${failing.length ? T.amberFg : T.sageFg}`, borderRadius: '6px 12px 12px 6px' }}>
                  <summary style={{ cursor: 'pointer', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontWeight: 500 }}>
                    <span style={{ flex: '1 1 320px' }}>{p.title || p.slug}</span>
                    <Badge tone="neutral">{p.status === 'published' ? 'Published, not live yet' : p.status === 'review' ? 'Ready for review' : 'Draft'}</Badge>
                    <Badge tone={failing.length ? 'warn' : 'good'}>{failing.length ? `${failing.length} to fix` : 'All checks pass'}</Badge>
                    <Badge tone="info">{p.score} / 100</Badge>
                  </summary>
                  <ul style={{ margin: '10px 0 0', paddingLeft: 20, fontSize: 14, color: T.body, display: 'grid', gap: 4 }}>
                    {failing.map((c) => <li key={c.id}><strong>{c.label}.</strong> {c.detail}</li>)}
                    {unknown.map((c) => <li key={c.id} style={{ color: T.caption }}>{c.label}: {c.detail}</li>)}
                    {failing.length === 0 && unknown.length === 0 && <li>Nothing to fix.</li>}
                  </ul>
                </details>
              );
            })}
          </div>
        )}
        <Source>Content files on GitHub (the working copy the editing screen saves to){content ? `, read ${when(content.taken)}` : ''}</Source>
      </Section>
      <Section
        title="Every page and post"
        note="Posts come from the content files and their history; site pages from the live site. Pages built in code have no edit history here, so their Created and Edits read Unknown. Words count the page's main text only."
      >
        <SortableTable head={HEAD} rows={rows} filterLabel="Filter:" />
        <Source>
          Content files on GitHub{content ? `, fetched ${when(content.taken)}` : ' (not read yet)'} · Live site and linter{site ? `, ${when(site.taken)}` : ' (not read yet)'} · Search
          Console{gsc ? `, ${gsc.data.current[0]} to ${gsc.data.current[1]}` : ' (not read yet)'} · Focus keywords from the approved keyword map
        </Source>
      </Section>
    </>
  );
}
