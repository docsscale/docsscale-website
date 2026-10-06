// Reads the built site (web/out) into one record per page, for the sitemap
// generator and the site checks. Run after `next build`.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

export const OUT = path.resolve(import.meta.dirname, '../out');
export const ORIGIN = 'https://docsscale.com';

// Next.js writes these for its own use; they are not pages of the site.
const SKIP = new Set(['/404/', '/_not-found/']);

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '_next' ? [] : htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

const text = (node) => node.structuredText.replace(/\s+/g, ' ').trim();

export function loadPages() {
  return htmlFiles(OUT)
    .map((file) => {
      const rel = path.relative(OUT, file).split(path.sep).join('/');
      const urlPath =
        rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? `/${rel.slice(0, -10)}` : `/${rel}`;
      if (SKIP.has(urlPath)) return null;
      const root = parse(fs.readFileSync(file, 'utf8'), { blockTextElements: { script: true, style: true } });
      const meta = (name) => root.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? '';
      const robots = meta('robots');
      const main = root.querySelector('main') ?? root.querySelector('body');
      // Scripts and styles are not page copy.
      const copy = parse(main.toString());
      copy.querySelectorAll('script, style, noscript').forEach((node) => node.remove());
      const mainText = text(copy);
      return {
        file: rel,
        path: urlPath,
        url: ORIGIN + urlPath,
        isErrorPage: urlPath === '/404.html',
        title: root.querySelector('title')?.text.trim() ?? '',
        description: meta('description'),
        robots,
        indexable: !/noindex/.test(robots) && urlPath !== '/404.html',
        canonical: root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
        headings: root
          .querySelectorAll('h1, h2, h3, h4, h5, h6')
          .map((h) => ({ level: Number(h.tagName[1]), text: text(h) })),
        images: root
          .querySelectorAll('img')
          .map((img) => ({ src: img.getAttribute('src') ?? '', alt: img.getAttribute('alt') })),
        links: root.querySelectorAll('a[href]').map((a) => a.getAttribute('href')),
        ids: new Set(root.querySelectorAll('[id]').map((node) => node.getAttribute('id'))),
        jsonLd: root.querySelectorAll('script[type="application/ld+json"]').map((s) => s.text),
        generator: root.querySelector('meta[name="generator"]')?.getAttribute('content') ?? '',
        html: root.toString(),
        bodyText: text(root.querySelector('body')),
        mainText,
        // Changes only when the page's own copy changes, not the header or footer.
        contentHash: crypto.createHash('sha256').update(mainText).digest('hex').slice(0, 16),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.path.localeCompare(b.path));
}
