import { seoConfig } from '../config';
import { getText } from '../http';
import { lintPage, type PageLint } from '../lint';
import { latestSnapshot } from '../store';
import type { ContentData } from './content';

// Reads our own public site, slowly, one page at a time: robots.txt, the
// sitemap, llms.txt, and every page in the sitemap. It never crawls other sites.

export type SiteCheck = { name: string; pass: boolean; detail: string };
export type SitePage = PageLint & { status: number; lastmod: string | null; headerNoindex: boolean };
export type SiteData = {
  site: string;
  checks: SiteCheck[];
  pages: SitePage[];
  /** Pages that answered with something other than 200. */
  failing: { url: string; status: number; redirect: string | null }[];
  averageScore: number | null;
};

export async function collectSite(): Promise<SiteData> {
  const site = seoConfig.siteUrl;
  const [robots, sitemap, llms] = await Promise.all([getText(`${site}/robots.txt`), getText(`${site}/sitemap.xml`), getText(`${site}/llms.txt`)]);

  const entries = [...sitemap.text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: /<loc>\s*(.*?)\s*<\/loc>/.exec(m[1])?.[1] ?? '',
    lastmod: /<lastmod>\s*(.*?)\s*<\/lastmod>/.exec(m[1])?.[1] ?? null,
  })).filter((e) => e.loc);

  const disallowAll = /^\s*Disallow:\s*\/\s*$/im.test(robots.text);
  const checks: SiteCheck[] = [
    { name: 'robots.txt answers', pass: robots.status === 200, detail: `HTTP ${robots.status}` },
    { name: 'robots.txt does not block the whole site', pass: robots.status === 200 && !disallowAll, detail: disallowAll ? 'Contains "Disallow: /"' : 'OK' },
    { name: 'robots.txt points to the sitemap', pass: /^\s*Sitemap:/im.test(robots.text), detail: /^\s*Sitemap:\s*(.*)$/im.exec(robots.text)?.[1] ?? 'No Sitemap line' },
    { name: 'Sitemap answers and lists pages', pass: sitemap.status === 200 && entries.length > 0, detail: `HTTP ${sitemap.status}, ${entries.length} pages` },
    { name: 'llms.txt answers', pass: llms.status === 200, detail: `HTTP ${llms.status}` },
  ];

  // A post's focus keyword comes from the editing screen (the content files
  // read on the previous run); the keyword map still names the site's pages.
  const postKeywords = new Map((latestSnapshot<ContentData>('content')?.data.posts ?? []).filter((p) => p.keyword).map((p) => [p.path, p.keyword]));
  const pages: SitePage[] = [];
  const failing: SiteData['failing'] = [];
  for (const e of entries) {
    const r = await getText(e.loc);
    if (r.status !== 200) {
      failing.push({ url: e.loc, status: r.status, redirect: r.location });
      continue;
    }
    pages.push({ ...lintPage(e.loc, r.text, site, postKeywords.get(new URL(e.loc).pathname) ?? null), status: r.status, lastmod: e.lastmod, headerNoindex: (r.robots ?? '').includes('noindex') });
  }
  checks.push({ name: 'Every sitemap page answers 200', pass: failing.length === 0, detail: failing.length ? `${failing.length} do not` : `${pages.length} of ${entries.length}` });
  const noindexed = pages.filter((p) => p.noindex || p.headerNoindex);
  checks.push({ name: 'No sitemap page is set to noindex', pass: noindexed.length === 0, detail: noindexed.map((p) => p.path).join(', ') || 'None' });

  return {
    site,
    checks,
    pages,
    failing,
    averageScore: pages.length ? Math.round(pages.reduce((s, p) => s + p.score, 0) / pages.length) : null,
  };
}
