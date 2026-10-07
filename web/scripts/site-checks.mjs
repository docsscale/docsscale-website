// Checks the built site (web/out) before anything is deployed or published.
//   node scripts/site-checks.mjs
// Errors fail the build. Warnings are printed for a person to judge; they never
// fail it. Run after `next build`. docs/COMPLETION-PLAN.md, section 5, lists why
// each check exists.
import fs from 'node:fs';
import path from 'node:path';
import { loadPages, ORIGIN, OUT } from './site-pages.mjs';

const errors = [];
const warnings = [];
const error = (page, message) => errors.push(`${page}  ${message}`);
const warn = (page, message) => warnings.push(`${page}  ${message}`);

const pages = loadPages();
const indexable = pages.filter((p) => p.indexable);

// --- 1. Brand rules (CLAUDE.md, section 2) -----------------------------------
// Nothing public may suggest the site was built with AI, and the CRM platform is
// named only inside the Free System funnel. robots.txt is the one exception: it
// names AI crawlers to allow them.
const AI_WORDING = [
  /\bA\.?I\.?\b(?!\w)/, // "AI" as a word
  /artificial intelligence/i,
  /\b(?:machine|deep) learning\b/i,
  /\bLLMs?\b/,
  /\b(?:chat\s?gpt|openai|anthropic|claude|gemini|copilot|midjourney|dall[·-]?e|stable diffusion|perplexity)\b/i,
  /\b(?:ai|machine)[- ]generated\b/i,
  /generated (?:by|with|using) /i,
];
const CRM_NAME = /go\s?high\s?level|\bhighlevel\b|\bGHL\b|lead\s?connector/i;
const AGE_WORDING =
  /\b(?:start-?up|recently launched|newly launched|brand[- ]new (?:agency|company)|new agency)\b/i;
// Where the CRM platform may be named:
// - the Free System funnel (owner's decision, 27–28 Sep 2026);
// - the Privacy Policy and Terms, which must name the company that processes
//   form and booking data (wording approved by the owner with v1.3.0);
// - the one llms.txt line that describes the Free System.
const crmAllowed = (p) => p.startsWith('/free-system/') || p === '/privacy/' || p === '/terms/';

for (const page of pages) {
  for (const pattern of AI_WORDING) {
    const match =
      page.bodyText.match(pattern) ?? page.title.match(pattern) ?? page.description.match(pattern);
    if (match) error(page.path, `brand rule: AI wording or tool name in the page ("${match[0]}")`);
  }
  if (page.generator) error(page.path, `brand rule: generator tag ("${page.generator}")`);
  if (/<!--[^>]*(?:generated|created) (?:by|with)/i.test(page.html))
    error(page.path, 'brand rule: tool comment in the HTML');
  if (!crmAllowed(page.path)) {
    const visible = `${page.title} ${page.description} ${page.bodyText} ${page.images.map((i) => `${i.alt ?? ''} ${i.src}`).join(' ')}`;
    const match = visible.match(CRM_NAME);
    if (match)
      error(
        page.path,
        `brand rule: the CRM platform is named outside the Free System funnel ("${match[0]}")`,
      );
  }
  const age = page.bodyText.match(AGE_WORDING);
  if (age) error(page.path, `brand rule: wording that describes DocsScale as new ("${age[0]}")`);
}
// Other public text files (llms.txt, the manifest …), except robots.txt.
for (const name of fs.readdirSync(OUT)) {
  if (
    !/\.(txt|xml|webmanifest|json)$/.test(name) ||
    name === 'robots.txt' ||
    name.startsWith('__next') ||
    name === 'index.txt'
  )
    continue;
  const lines = fs.readFileSync(path.join(OUT, name), 'utf8').split('\n');
  for (const [i, line] of lines.entries()) {
    for (const pattern of AI_WORDING) {
      const match = line.match(pattern);
      if (match) error(`/${name}`, `brand rule: "${match[0]}" on line ${i + 1}`);
    }
    const crm = line.match(CRM_NAME);
    if (crm && !line.includes('/free-system/'))
      error(`/${name}`, `brand rule: the CRM platform is named on line ${i + 1} ("${crm[0]}")`);
  }
}

// --- 2. Titles, descriptions, canonicals -------------------------------------
const seen = { title: new Map(), description: new Map() };
for (const page of indexable) {
  if (!page.title) error(page.path, 'no <title>');
  if (!page.description) error(page.path, 'no meta description');
  for (const field of ['title', 'description']) {
    const value = page[field];
    if (!value) continue;
    if (seen[field].has(value)) error(page.path, `same ${field} as ${seen[field].get(value)}`);
    else seen[field].set(value, page.path);
  }
  if (page.title.length > 60)
    warn(page.path, `title is ${page.title.length} characters (search results cut off at about 60)`);
  if (page.description.length > 160)
    warn(page.path, `meta description is ${page.description.length} characters (limit about 160)`);
  if (page.canonical !== page.url)
    error(page.path, `canonical is "${page.canonical}", expected "${page.url}"`);
}

// --- 3. Headings and images ---------------------------------------------------
for (const page of pages) {
  const h1 = page.headings.filter((h) => h.level === 1).length;
  if (h1 !== 1) error(page.path, `${h1} <h1> headings (must be exactly one)`);
  let previous = 0;
  for (const heading of page.headings) {
    if (previous && heading.level > previous + 1) {
      error(
        page.path,
        `heading level skipped: h${previous} → h${heading.level} ("${heading.text.slice(0, 40)}")`,
      );
      break;
    }
    previous = heading.level;
  }
  // alt="" is fine (decorative); a missing alt attribute is not.
  for (const image of page.images)
    if (image.alt === undefined) error(page.path, `image without an alt attribute: ${image.src}`);
}

// --- 4. Links -----------------------------------------------------------------
// Served by the server, not part of the export.
const SERVER_PATHS = new Set(['/send-lead.php', '/free-system/send-lead.php']);
const exists = (urlPath) => {
  const clean = decodeURIComponent(urlPath);
  if (SERVER_PATHS.has(clean)) return true;
  const target = path.join(OUT, clean);
  return (
    (fs.existsSync(target) && fs.statSync(target).isFile()) ||
    fs.existsSync(path.join(target, 'index.html')) ||
    fs.existsSync(`${target}.html`)
  );
};
const byPath = new Map(pages.map((p) => [p.path, p]));
for (const page of pages) {
  for (const href of new Set(page.links)) {
    if (!href || /^(mailto:|tel:|https?:\/\/(?!docsscale\.com))/.test(href)) continue;
    const url = new URL(href, page.url);
    if (url.origin !== ORIGIN) continue;
    if (!exists(url.pathname)) {
      error(page.path, `broken link: ${href}`);
      continue;
    }
    // "#top" needs no matching element: browsers scroll to the top of the page.
    if (url.hash.length > 1 && url.hash !== '#top') {
      const targetPath = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
      const target = byPath.get(targetPath) ?? byPath.get(url.pathname);
      if (target && !target.ids.has(decodeURIComponent(url.hash.slice(1))))
        error(page.path, `link to a missing section: ${href}`);
    }
  }
}

// --- 5. Structured data -------------------------------------------------------
// Each type must carry the fields search engines require; a FAQPage may only
// describe questions that are visible on the page.
const need = (page, type, node, fields) => {
  for (const field of fields)
    if (node[field] === undefined || node[field] === '')
      error(page.path, `schema: ${type} has no "${field}"`);
};
const REQUIRED = {
  Organization: ['name', 'url'],
  Service: ['provider'],
  WebSite: ['name', 'url'],
  WebPage: ['name'],
  Person: ['name'],
  BlogPosting: ['headline', 'author', 'datePublished'],
  Article: ['headline', 'author', 'datePublished'],
};
for (const page of pages) {
  for (const raw of page.jsonLd) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      error(page.path, 'schema: a JSON-LD block does not parse');
      continue;
    }
    // A block is one thing, a list of things, or a @graph of things.
    const nodes = [data]
      .flat()
      .flatMap((d) => (d['@graph'] ? d['@graph'].map((n) => ({ '@context': d['@context'], ...n })) : [d]));
    for (const node of nodes) {
      const types = [node['@type']].flat();
      if (!node['@context'] || !types[0]) {
        error(page.path, 'schema: a block has no @context or @type');
        continue;
      }
      for (const type of types) if (REQUIRED[type]) need(page, type, node, REQUIRED[type]);
      if (types.includes('BreadcrumbList')) {
        const items = node.itemListElement ?? [];
        if (!items.length) error(page.path, 'schema: BreadcrumbList is empty');
        items.forEach((item, i) => {
          if (item.position !== i + 1 || !item.name || !item.item)
            error(page.path, `schema: breadcrumb ${i + 1} needs position, name and item`);
        });
      }
      if (types.includes('FAQPage')) {
        const questions = node.mainEntity ?? [];
        if (!questions.length) error(page.path, 'schema: FAQPage has no questions');
        const visible = page.bodyText.replace(/[’‘]/g, "'");
        for (const q of questions) {
          if (!q.name || !q.acceptedAnswer?.text)
            error(page.path, 'schema: an FAQ entry needs a question and an answer');
          else if (!visible.includes(q.name.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim()))
            error(page.path, `schema: FAQ question is not visible on the page ("${q.name.slice(0, 50)}")`);
        }
      }
    }
  }
}

// --- 6. Sitemap ---------------------------------------------------------------
const sitemapFile = path.join(OUT, 'sitemap.xml');
if (!fs.existsSync(sitemapFile)) error('/sitemap.xml', 'missing');
else {
  const listed = new Set(
    [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  );
  for (const page of indexable)
    if (!listed.has(page.url)) error(page.path, 'indexable but not in the sitemap');
  const indexableUrls = new Set(indexable.map((p) => p.url));
  for (const url of listed)
    if (!indexableUrls.has(url)) error(url.replace(ORIGIN, ''), 'in the sitemap but not an indexable page');
}

// --- 7. Thin and near-duplicate pages (warnings) ------------------------------
// Compared on five-word runs of each page's own copy.
const shingles = (words) => {
  const set = new Set();
  for (let i = 0; i + 5 <= words.length; i++) set.add(words.slice(i, i + 5).join(' '));
  return set;
};
const SIMILAR = 0.5;
const SHORT = 250;
const prepared = indexable
  .filter((p) => !['/privacy/', '/terms/'].includes(p.path))
  .map((p) => {
    const words = p.mainText
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    return { path: p.path, words: words.length, set: shingles(words) };
  });
for (const page of prepared)
  if (page.words < SHORT) warn(page.path, `short page: ${page.words} words of its own copy`);
for (let i = 0; i < prepared.length; i++) {
  for (let j = i + 1; j < prepared.length; j++) {
    const [a, b] = [prepared[i], prepared[j]];
    let shared = 0;
    for (const s of a.set) if (b.set.has(s)) shared++;
    const score = shared / (a.set.size + b.set.size - shared || 1);
    if (score >= SIMILAR) warn(a.path, `${Math.round(score * 100)}% the same wording as ${b.path}`);
  }
}

// --- Report -------------------------------------------------------------------
console.log(`site checks: ${pages.length} pages, ${indexable.length} indexable`);
if (warnings.length)
  console.log(`\n${warnings.length} warning(s), for a person to judge:\n  ${warnings.join('\n  ')}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('\nno errors.');
