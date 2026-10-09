import type { Check } from './lint';

// The same on-page checks the live-page linter makes, run on a post's content
// file before it is published (owner, 9 Oct 2026, automation plan item 3), so
// a post goes live with its keyword in the right places instead of turning up
// in the fix queue the morning after. Reads the fields the editing screen
// saves; the live-page linter stays the judge once the post is live.

export type PostDraft = {
  title: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  keyword: string;
  body: string;
  hasCover: boolean;
  coverAlt: string;
};

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const has = (text: string, kw: string) => clean(text).toLowerCase().includes(kw.toLowerCase());

/** Markdoc tags, code and markup taken out, so words and phrases are judged on what a reader sees. */
const readable = (body: string) =>
  body
    .replace(/\{%[\s\S]*?%\}/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#>*_`[\]|]/g, ' ');

export function lintPost(p: PostDraft): { score: number; checks: Check[] } {
  const title = clean(p.seoTitle || p.title);
  const h1 = clean(p.title);
  const description = clean(p.seoDescription || p.summary);
  const keyword = clean(p.keyword);
  const lines = p.body.split('\n');
  const headings = lines.map((l) => /^(#{1,6})\s+\S/.exec(l)).filter(Boolean).map((m) => m![1].length);
  const skipped = headings.some((l, i) => i > 0 && l > headings[i - 1] + 1);
  const paragraphs = readable(p.body).split(/\n\s*\n/).map(clean).filter((t) => t.length > 40);
  const intro = paragraphs.slice(0, 2).join(' ');
  const words = readable(p.body).split(/\s+/).filter((w) => /\w/.test(w)).length;
  const internal = new Set(
    [...p.body.matchAll(/\]\(([^)\s]+)\)/g)]
      .map((m) => m[1])
      .filter((h) => h.startsWith('/') || /^https?:\/\/(www\.)?docsscale\.com/.test(h))
      .map((h) => h.replace(/^https?:\/\/(www\.)?docsscale\.com/, '').split('#')[0]),
  );
  const images = [...p.body.matchAll(/!\[([^\]]*)\]\(/g)];
  const noAlt = images.filter((m) => !clean(m[1])).length + (p.hasCover && !clean(p.coverAlt) ? 1 : 0);
  const imageCount = images.length + (p.hasCover ? 1 : 0);
  const unknown = 'Unknown: give the post a focus keyword';

  const checks: Check[] = [
    { id: 'keyword', label: 'Has a focus keyword', weight: 5, pass: keyword.length > 0, detail: keyword || 'None: fill in "Focus keyword" under Search engines (SEO)' },
    { id: 'title', label: 'Has a page title', weight: 10, pass: title.length > 0, detail: title || 'No title' },
    { id: 'title-length', label: 'Title fits in search results (60 characters or fewer)', weight: 5, pass: title.length > 0 && title.length <= 60, detail: `${title.length} characters` },
    { id: 'description', label: 'Has a meta description', weight: 10, pass: description.length > 0, detail: description ? `${description.length} characters` : 'None' },
    { id: 'description-length', label: 'Description is 70 to 160 characters', weight: 5, pass: description.length >= 70 && description.length <= 160, detail: `${description.length} characters` },
    { id: 'headings', label: 'Has subheadings, with no level skipped', weight: 10, pass: headings.includes(2) && !skipped, detail: !headings.includes(2) ? 'No H2' : skipped ? 'A heading level is skipped' : `${headings.length} headings` },
    { id: 'kw-title', label: 'Focus keyword in the title', weight: 10, pass: keyword ? has(title, keyword) : null, detail: keyword || unknown },
    { id: 'kw-h1', label: 'Focus keyword in the main heading', weight: 10, pass: keyword ? has(h1, keyword) : null, detail: keyword || unknown },
    { id: 'kw-description', label: 'Focus keyword in the description', weight: 5, pass: keyword ? has(description, keyword) : null, detail: keyword || unknown },
    { id: 'kw-intro', label: 'Focus keyword in the opening paragraphs', weight: 5, pass: keyword ? has(intro, keyword) : null, detail: keyword || unknown },
    // Two in the text itself; the page adds its own related links and the call to action, so the live check's three is met.
    { id: 'internal-links', label: 'Links to at least two other pages of the site from the text', weight: 10, pass: internal.size >= 2, detail: `${internal.size} ${internal.size === 1 ? 'page' : 'pages'} linked` },
    { id: 'alt', label: 'Every image has alt text', weight: 10, pass: noAlt === 0, detail: imageCount ? `${noAlt} of ${imageCount} images without alt text` : 'No images' },
    { id: 'length', label: 'At least 600 words', weight: 5, pass: words >= 600, detail: `${words} words` },
  ];
  const counted = checks.filter((c) => c.pass !== null);
  const total = counted.reduce((s, c) => s + c.weight, 0);
  const score = total ? Math.round((counted.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0) / total) * 100) : 0;
  return { score, checks };
}
