import { parse, type HTMLElement } from 'node-html-parser';
import { DECLINED, FOCUS_KEYWORDS } from './keywords';

// The page linter: scores each live page 0 to 100 on the on-page basics. It
// replaces the page scores a WordPress plugin gives on the reference
// dashboard. Every check says why it passed or failed; a check that can't be
// judged (no focus keyword on the keyword map) is "Unknown" and left out of
// the score rather than counted as a pass or a fail.

export type Check = { id: string; label: string; weight: number; pass: boolean | null; detail: string; declined?: string };
export type PageLint = {
  url: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  words: number;
  internalLinks: number;
  /** Paths this page links to from its main text (menus and footer left out). */
  links: string[];
  /** Every heading on the page, for question coverage. */
  headings: string[];
  schemaTypes: string[];
  keyword: string | null;
  noindex: boolean;
  score: number;
  checks: Check[];
};

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const has = (text: string, kw: string) => clean(text).toLowerCase().includes(kw.toLowerCase());

function schemaTypes(root: HTMLElement): { types: string[]; broken: number } {
  const types: string[] = [];
  let broken = 0;
  const visit = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (node && typeof node === 'object') {
      const o = node as Record<string, unknown>;
      if (o['@type']) types.push(...([] as unknown[]).concat(o['@type']).map(String));
      if (o['@graph']) visit(o['@graph']);
    }
  };
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try { visit(JSON.parse(s.textContent)); } catch { broken++; }
  }
  return { types: [...new Set(types)], broken };
}

/** `postKeyword` is the focus keyword an editor gave a post in the editing
 *  screen; the keyword map wins for the pages it names. */
export function lintPage(url: string, html: string, siteUrl: string, postKeyword: string | null = null): PageLint {
  const root = parse(html);
  const path = new URL(url).pathname;
  const title = clean(root.querySelector('title')?.textContent ?? '');
  const description = clean(root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '');
  const h1s = root.querySelectorAll('h1').map((h) => clean(h.textContent));
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const robots = (root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '').toLowerCase();
  const keyword = FOCUS_KEYWORDS[path] ?? postKeyword ?? null;

  const main = root.querySelector('main') ?? root.querySelector('body') ?? root;
  const text = main.clone() as HTMLElement;
  text.querySelectorAll('script, style, noscript, svg, nav, header, footer').forEach((n) => n.remove());
  const words = clean(text.textContent).split(' ').filter((w) => /\w/.test(w)).length;

  const links = main.querySelectorAll('a[href]').map((a) => a.getAttribute('href') ?? '');
  const internal = new Set(
    links
      .filter((h) => h.startsWith('/') || h.startsWith(siteUrl))
      .map((h) => h.replace(siteUrl, '').split('#')[0])
      .filter((h) => h && h !== path),
  );
  const images = main.querySelectorAll('img');
  const noAlt = images.filter((i) => i.getAttribute('alt') === undefined).length;
  const headingNodes = main.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const levels = headingNodes.map((h) => Number(h.tagName.slice(1)));
  const headings = headingNodes.map((h) => clean(h.textContent)).filter(Boolean);
  const skipped = levels.some((l, i) => i > 0 && l > levels[i - 1] + 1);
  const schema = schemaTypes(root);
  const intro = clean(main.querySelectorAll('p').slice(0, 2).map((p) => p.textContent).join(' '));

  const checks: Check[] = [
    { id: 'title', label: 'Has a page title', weight: 10, pass: title.length > 0, detail: title || 'No title' },
    { id: 'title-length', label: 'Title fits in search results (60 characters or fewer)', weight: 5, pass: title.length > 0 && title.length <= 60, detail: `${title.length} characters` },
    { id: 'description', label: 'Has a meta description', weight: 10, pass: description.length > 0, detail: description ? `${description.length} characters` : 'None' },
    { id: 'description-length', label: 'Description is 70 to 160 characters', weight: 5, pass: description.length >= 70 && description.length <= 160, detail: `${description.length} characters` },
    { id: 'h1', label: 'Exactly one main heading (H1)', weight: 10, pass: h1s.length === 1, detail: h1s.length === 1 ? h1s[0] : `${h1s.length} found` },
    { id: 'headings', label: 'Has subheadings, with no level skipped', weight: 10, pass: levels.includes(2) && !skipped, detail: !levels.includes(2) ? 'No H2' : skipped ? 'A heading level is skipped' : `${levels.length} headings` },
    { id: 'kw-title', label: 'Focus keyword in the title', weight: 10, pass: keyword ? has(title, keyword) : null, detail: keyword ?? 'Unknown: no keyword on the keyword map or in the post' },
    { id: 'kw-h1', label: 'Focus keyword in the main heading', weight: 10, pass: keyword ? has(h1s.join(' '), keyword) : null, detail: keyword ?? 'Unknown: no keyword on the keyword map or in the post' },
    { id: 'kw-description', label: 'Focus keyword in the description', weight: 5, pass: keyword ? has(description, keyword) : null, detail: keyword ?? 'Unknown: no keyword on the keyword map or in the post' },
    { id: 'kw-intro', label: 'Focus keyword in the opening paragraphs', weight: 5, pass: keyword ? has(intro, keyword) : null, detail: keyword ?? 'Unknown: no keyword on the keyword map or in the post' },
    { id: 'internal-links', label: 'Links to at least three other pages of the site', weight: 10, pass: internal.size >= 3, detail: `${internal.size} ${internal.size === 1 ? 'page' : 'pages'} linked` },
    { id: 'alt', label: 'Every image has alt text', weight: 10, pass: noAlt === 0, detail: images.length ? `${noAlt} of ${images.length} images without alt text` : 'No images' },
    { id: 'schema', label: 'Structured data present and readable', weight: 10, pass: schema.types.length > 0 && schema.broken === 0, detail: schema.broken ? `${schema.broken} block(s) could not be read` : schema.types.join(', ') || 'None' },
    { id: 'canonical', label: 'Canonical address points to this page', weight: 5, pass: canonical.replace(/\/$/, '') === url.replace(/\/$/, ''), detail: canonical || 'None' },
    { id: 'indexable', label: 'Not set to noindex', weight: 5, pass: !robots.includes('noindex'), detail: robots || 'No robots tag' },
  ];

  for (const d of DECLINED) {
    const c = checks.find((x) => x.id === d.check);
    if (d.path === path && c && c.pass === false) c.declined = d.note;
  }
  const counted = checks.filter((c) => c.pass !== null && !c.declined);
  const total = counted.reduce((s, c) => s + c.weight, 0);
  const score = total ? Math.round((counted.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0) / total) * 100) : 0;

  return {
    url, path, title, h1: h1s[0] ?? '', description, words, internalLinks: internal.size,
    links: [...internal].map((h) => (h.endsWith('/') || h.includes('.') ? h : h + '/')), headings,
    schemaTypes: schema.types, keyword, noindex: robots.includes('noindex'), score, checks,
  };
}
