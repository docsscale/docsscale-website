// Writes sitemap.xml from the pages that were actually built.
//   node scripts/generate-sitemap.mjs           update public/sitemap.xml, out/sitemap.xml and sitemap-state.json
//   node scripts/generate-sitemap.mjs --check   change nothing; fail if they are out of date (CI)
//
// A page is listed when it is indexable (no noindex, not the 404 page).
// `lastmod` is the day the page's own copy last changed: sitemap-state.json
// keeps a fingerprint of each page's main text, and the date moves only when
// the fingerprint does. A change to the header or footer moves no dates.
import fs from 'node:fs';
import path from 'node:path';
import { loadPages, OUT } from './site-pages.mjs';

const check = process.argv.includes('--check');
const webRoot = path.resolve(import.meta.dirname, '..');
const stateFile = path.join(webRoot, 'sitemap-state.json');
const publicFile = path.join(webRoot, 'public/sitemap.xml');
const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : {};
const today = new Date().toISOString().slice(0, 10);

const next = {};
for (const page of loadPages().filter((p) => p.indexable)) {
  const known = state[page.path];
  next[page.path] = {
    lastmod: known && known.hash === page.contentHash ? known.lastmod : today,
    hash: page.contentHash,
    // Kept from the hand-written sitemap so existing entries read as before.
    priority: known?.priority ?? '0.7',
  };
}

// Most important first, then alphabetical, so the file is stable between builds.
const order = Object.keys(next).sort(
  (a, b) => Number(next[b].priority) - Number(next[a].priority) || a.localeCompare(b),
);
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  order
    .map(
      (p) =>
        `<url>\n<loc>https://docsscale.com${p}</loc>\n<lastmod>${next[p].lastmod}</lastmod>\n<changefreq>monthly</changefreq>\n<priority>${next[p].priority}</priority>\n</url>\n`,
    )
    .join('') +
  '</urlset>\n';
const stateJson = JSON.stringify(Object.fromEntries(order.map((p) => [p, next[p]])), null, 2) + '\n';

if (check) {
  const stale = [];
  if (!fs.existsSync(publicFile) || fs.readFileSync(publicFile, 'utf8') !== xml)
    stale.push('public/sitemap.xml');
  if (!fs.existsSync(stateFile) || fs.readFileSync(stateFile, 'utf8') !== stateJson)
    stale.push('sitemap-state.json');
  if (stale.length) {
    const changed = order.filter((p) => state[p]?.hash !== next[p].hash);
    console.error(`sitemap: out of date (${stale.join(', ')}).`);
    console.error(
      `  pages whose copy changed or are new: ${changed.join(', ') || 'none (a page was removed)'}`,
    );
    console.error('  fix: cd web && npm run build && npm run sitemap, then commit both files.');
    process.exit(1);
  }
  console.log(`sitemap: up to date (${order.length} URLs).`);
} else {
  fs.writeFileSync(publicFile, xml);
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
  fs.writeFileSync(stateFile, stateJson);
  console.log(`sitemap: ${order.length} URLs written.`);
}
