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
  /** Key takeaways and questions answered (the editor's Takeaways and FAQs lists). */
  takeaways: string[];
  faqs: { question: string; answer: string }[];
  /** The editor's "Only DocsScale could say" note (CLAUDE.md, content quality rules). */
  onlyDocsScale: string;
  /** Focus keywords already taken by other pages and posts, so two pieces do not chase one phrase. */
  taken?: { path: string; keyword: string }[];
};

// Wording that makes a post read machine-written or like filler (owner: no AI
// tone in anything public). Plain phrases only, matched as whole words; add to
// the list rather than loosening it.
const STOCK_PHRASES = [
  "in today's", 'fast-paced', 'digital landscape', 'ever-evolving', 'ever-changing', 'game-changer', 'game changer',
  'unlock the', 'unlock your', 'elevate your', 'delve', 'dive into', 'deep dive', 'it is important to note', "it's important to note",
  'in conclusion', 'seamless', 'seamlessly', 'leverage', 'navigate the', 'robust', 'tapestry', 'embark', 'look no further',
  'harness the', 'supercharge', 'revolutionize', 'cutting-edge', 'in the world of', 'in the realm of', 'when it comes to',
  'take your practice to the next level', 'next level', 'unleash', 'empower', 'synergy', 'holistic approach', 'testament to',
  "let's dive", 'without further ado', 'at the end of the day', 'treasure trove', 'paradigm',
];

/** A figure a reader would want proof of: a percentage, money, or a count of patients, leads and the like. */
const FIGURE = /\b\d[\d,.]*\s?(?:%|percent\b)|\$\s?\d|\b\d[\d,]*\+?\s+(?:new\s+|more\s+|qualified\s+)?(?:patients|leads|calls|bookings|clicks|reviews|visits|visitors|appointments|consultations|sales)\b|\b\d+x\b/i;

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

  // Paragraphs of running text as written (lists, headings, tables and tags left out),
  // each with what a reader sees, for the opening, the figures and the sentence rhythm.
  const prose = p.body
    .split(/\n\s*\n/)
    .map((raw) => raw.trim())
    .filter((raw) => raw && !/^(#|\{%|[-*+] |\d+[.)] |\||>|!\[|```)/.test(raw))
    .map((raw) => ({ raw, text: clean(readable(raw)) }))
    .filter((x) => x.text.length > 0);
  const opening = prose[0]?.text ?? '';
  const openingWords = opening.split(/\s+/).filter((w) => /\w/.test(w)).length;

  // Everything a reader sees, for the wording checks.
  const allText = clean([title, h1, description, p.summary, readable(p.body.replace(/^\s*([-*+]|\d+[.)])\s+/gm, '')), ...p.takeaways, ...p.faqs.flatMap((f) => [f.question, f.answer])].join('\n'));
  const dashes = allText.match(/[\u2013\u2014]|\s--?\s|\w--\w/g) ?? [];
  const stock = STOCK_PHRASES.filter((ph) => new RegExp(`(^|[^\\w])${ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\w])`, 'i').test(allText));

  // Every sentence of running text and its length in words; machine-like text runs at one even length.
  const sentences = prose.flatMap((x) => x.text.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)).map((t) => t.split(/\s+/).filter((w) => /\w/.test(w)).length).filter((n) => n > 0);
  const mean = sentences.reduce((a, b) => a + b, 0) / (sentences.length || 1);
  const spread = Math.sqrt(sentences.reduce((a, n) => a + (n - mean) ** 2, 0) / (sentences.length || 1));

  // Figures in a section (the text under one heading) with no link anywhere in it:
  // each one must point at its source or at our own results page.
  const unsourced = p.body
    .split(/^(?=#{1,6}\s)/m)
    .filter((section) => !/\]\(([^)\s]+)\)/.test(section))
    .flatMap((section) => readable(section.replace(/^#{1,6}\s.*$/m, '')).match(new RegExp(FIGURE.source, 'gi')) ?? []);

  const only = clean(p.onlyDocsScale);
  const clash = keyword ? (p.taken ?? []).filter((t) => t.keyword.toLowerCase() === keyword.toLowerCase()) : [];

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
    // Our own standards on top of the search basics (owner, 12 Oct 2026): ideas taken from open-source blog checkers, rebuilt here.
    { id: 'only-docsscale', label: 'Says something only DocsScale could say', weight: 10, pass: only.length > 0 && !/^sample\b/i.test(only), detail: only ? only.slice(0, 120) : 'Empty: fill in "Only DocsScale could say" with the real client example, numbers or process the post uses' },
    { id: 'figures-sourced', label: 'Every number has a source linked near it', weight: 10, pass: unsourced.length === 0, detail: unsourced.length ? `No link in the same section as: ${[...new Set(unsourced)].slice(0, 5).join(', ')}. Link the study or our results page there, or take the figure out` : 'No unlinked figures' },
    { id: 'answer-first', label: 'Opens with a short, direct answer', weight: 5, pass: openingWords > 0 && openingWords <= 60, detail: openingWords ? `First paragraph: ${openingWords} words (60 or fewer)` : 'No opening paragraph' },
    { id: 'takeaways', label: 'Has at least two key takeaways', weight: 5, pass: p.takeaways.filter((t) => clean(t)).length >= 2, detail: `${p.takeaways.filter((t) => clean(t)).length} filled in` },
    { id: 'faqs', label: 'Answers at least two common questions', weight: 5, pass: p.faqs.filter((f) => clean(f.question) && clean(f.answer)).length >= 2, detail: `${p.faqs.filter((f) => clean(f.question) && clean(f.answer)).length} questions with answers` },
    { id: 'stock-phrases', label: 'No filler or machine-sounding phrases', weight: 10, pass: stock.length === 0, detail: stock.length ? `Found: ${stock.map((w) => `"${w}"`).join(', ')}` : 'None found' },
    { id: 'dashes', label: 'No long dashes in the text', weight: 5, pass: dashes.length === 0, detail: dashes.length ? `${dashes.length} found: use a comma, a colon or a full stop instead` : 'None found' },
    { id: 'rhythm', label: 'Sentences vary in length', weight: 5, pass: sentences.length < 8 ? null : spread >= 5, detail: sentences.length < 8 ? 'Unknown: fewer than eight sentences of running text' : `Lengths vary by ${spread.toFixed(1)} words on average (5 or more reads natural); mix short sentences with longer ones` },
    { id: 'keyword-free', label: 'No other page targets the same focus keyword', weight: 10, pass: keyword ? clash.length === 0 : null, detail: !keyword ? unknown : clash.length ? `Also the focus keyword of ${clash.map((c) => c.path).join(', ')}: pick another phrase or improve that page instead` : 'Not used elsewhere' },
  ];
  const counted = checks.filter((c) => c.pass !== null);
  const total = counted.reduce((s, c) => s + c.weight, 0);
  const score = total ? Math.round((counted.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0) / total) * 100) : 0;
  return { score, checks };
}
