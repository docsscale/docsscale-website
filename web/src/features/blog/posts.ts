// Reads blog posts from /content (the files the editing screen writes) at build
// time, with the CMS's own reader, and turns each into what the templates need.
import path from 'node:path';
import Markdoc, { type Node, type RenderableTreeNode } from '@markdoc/markdoc';
import { createReader } from '@keystatic/core/reader';
import schema from '@/content/cms-schema';
import type { Stage } from '@/styles/tokens';

// `next build` runs in web/; the content folder is one level up.
const reader = createReader(path.resolve(process.cwd(), '..'), schema);

/** The preview site builds drafts too; the live site only what is published. */
export const INCLUDE_DRAFTS = process.env.CONTENT_PREVIEW === '1';

export type Post = {
  slug: string;
  title: string;
  summary: string;
  category: { name: string; stage: Stage } | null;
  author: { name: string; role: string; bio: string } | null;
  published: string | null;
  updated: string | null;
  /** The same two dates as written in the file (2026-01-31), for search engines. */
  publishedIso: string | null;
  updatedIso: string | null;
  reviewed: string | null;
  minutes: number;
  takeaways: string[];
  faqs: { question: string; answer: string }[];
  seo: { title: string; description: string; noindex: boolean };
  cover: { src: string; alt: string; caption: string } | null;
  headings: { id: string; text: string }[];
  body: RenderableTreeNode;
  /** Publication date as written in the file, for ordering; drafts without one come first. */
  sort: string;
};

// Each kind of block in a post's body is drawn by the component of the same
// name in BlogPost.tsx, so the look is fixed in code and not by the editor.
const node = (render: string, attributes = {}) => ({ ...attributes, render });
const MARKDOC = {
  nodes: {
    paragraph: node('Paragraph', Markdoc.nodes.paragraph),
    heading: node('Heading', Markdoc.nodes.heading),
    list: node('List', Markdoc.nodes.list),
    blockquote: node('Blockquote', Markdoc.nodes.blockquote),
    table: node('Table', Markdoc.nodes.table),
    th: node('Th', Markdoc.nodes.th),
    td: node('Td', Markdoc.nodes.td),
  },
  tags: {
    cta: { render: 'Cta', selfClosing: true, attributes: { kind: { type: String, default: 'call' } } },
  },
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function textOf(node: Node): string {
  if (node.type === 'text') return String(node.attributes.content ?? '');
  return node.children.map(textOf).join(node.type === 'paragraph' || node.type === 'item' ? ' ' : '');
}

/** "2026-01-31" → "31 January 2026", without the time-zone shifts of Date parsing. */
function longDate(iso: string | null) {
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  const names = 'January February March April May June July August September October November December';
  return `${day} ${names.split(' ')[(month ?? 1) - 1]} ${year}`;
}

export async function getPosts(): Promise<Post[]> {
  const entries = await reader.collections.posts.all();
  const posts = await Promise.all(
    entries
      .filter(({ entry }) => INCLUDE_DRAFTS || entry.status === 'published')
      .map(async ({ slug, entry }) => {
        const { node } = await entry.body();
        const headings: Post['headings'] = [];
        // Section headings get an id for the "On this page" list.
        for (const child of node.walk()) {
          if (child.type === 'heading' && child.attributes.level === 2) {
            const text = textOf(child);
            const id = slugify(text);
            child.attributes.id = id;
            headings.push({ id, text });
          }
        }
        const category = entry.category ? await reader.collections.categories.read(entry.category) : null;
        const author = entry.author ? await reader.collections.team.read(entry.author) : null;
        const words = textOf(node).split(/\s+/).filter(Boolean).length;
        return {
          slug,
          title: entry.title,
          summary: entry.summary,
          category: category && { name: category.name, stage: category.stage },
          author: author && { name: author.name, role: author.role, bio: author.bio },
          published: longDate(entry.published),
          updated: longDate(entry.updated),
          publishedIso: entry.published,
          updatedIso: entry.updated,
          reviewed: longDate(entry.reviewed),
          minutes: Math.max(1, Math.round(words / 220)),
          takeaways: [...entry.takeaways],
          faqs: entry.faqs.map((faq) => ({ ...faq })),
          cover: entry.cover ? { src: entry.cover, alt: entry.coverAlt, caption: entry.coverCaption } : null,
          seo: { ...entry.seo },
          headings,
          body: Markdoc.transform(node, MARKDOC),
          sort: entry.published ?? '9999',
        };
      }),
  );
  // Newest first; posts without a date (drafts) lead on the preview site.
  return posts.sort((a, b) => b.sort.localeCompare(a.sort));
}

export type Offer = {
  slug: string;
  title: string;
  badge: string;
  figure: string;
  text: string;
  image: { src: string; alt: string } | null;
  buttonLabel: string;
  link: string;
  colour: Stage;
};

/** The offers beside every post and the blog list, in the order the editor set. */
export async function getOffers(): Promise<Offer[]> {
  const entries = await reader.collections.offers.all();
  return entries
    .filter(({ entry }) => entry.active)
    .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0))
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      badge: entry.badge,
      figure: entry.figure,
      text: entry.text,
      image: entry.image ? { src: entry.image, alt: entry.imageAlt } : null,
      buttonLabel: entry.buttonLabel,
      link: entry.link,
      colour: entry.colour,
    }));
}
