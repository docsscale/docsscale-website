import { requireUser } from '../../../../lib/seo/auth';
import { FOCUS_KEYWORDS } from '../../../../lib/seo/keywords';
import type { ContentData } from '../../../../lib/seo/sources/content';
import type { SearchConsoleData } from '../../../../lib/seo/sources/search-console';
import type { SiteData } from '../../../../lib/seo/sources/site';
import { latestSnapshot, store } from '../../../../lib/seo/store';
import { Empty, H1, Section, Source, when } from '../../ui';
import { SortableTable, type Cell } from './sortable';

export const dynamic = 'force-dynamic';

const HEAD = ['Page', 'Kind', 'Status', 'Created', 'Last changed', 'Edits', 'Words', 'SEO score', 'Focus keyword', 'Structured data', 'In Google', 'Google clicks (28 days)'];

export default async function ContentHistory() {
  await requireUser('/seo/content');
  const content = latestSnapshot<ContentData>('content');
  const site = latestSnapshot<SiteData>('site');
  const gsc = latestSnapshot<SearchConsoleData>('search-console');
  if (!content && !site) return (<><H1>Content history</H1><Empty>Nothing collected yet. See the Data sources tab.</Empty></>);

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
      l?.score ?? null, FOCUS_KEYWORDS[p.path] ?? null, l?.schemaTypes.join(', ') || null,
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

  return (
    <>
      <H1>Content history</H1>
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
