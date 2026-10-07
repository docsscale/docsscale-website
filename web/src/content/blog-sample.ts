// SAMPLE CONTENT for the blog design review only. Every word here is filler,
// labelled as such on the page, and none of it may be published. Real posts
// will be files written through the CMS (docs/COMPLETION-PLAN.md, section 4).
import type { Stage } from '@/styles/tokens';

export type PostBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'image'; caption: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'cta'; kind: 'call' | 'free-system' };

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  stage: Stage;
  author: { name: string; role: string; bio: string };
  published: string;
  updated?: string;
  reviewed?: string;
  minutes: number;
  takeaways: string[];
  body: PostBlock[];
  faqs: { q: string; a: string }[];
};

const P =
  'Sample paragraph. Real text replaces this before anything is published. It runs to about three lines at the reading width so the line length, spacing and colour can be judged on a phone and on a wide screen.';

const AUTHOR = {
  name: 'Sample Author',
  role: 'Sample role, DocsScale',
  bio: 'Sample bio. Two or three sentences about the real team member who wrote the post: what they do for clinics and how long they have done it.',
};

export const SAMPLE_POSTS: BlogPost[] = [
  {
    slug: 'sample-post',
    title: 'Sample post title that runs to about sixty characters',
    summary:
      'Sample summary. One or two sentences that say what the reader will be able to do after reading the post.',
    category: 'Sample category',
    stage: 'attract',
    author: AUTHOR,
    published: '1 January 2026',
    updated: '1 February 2026',
    reviewed: '1 February 2026',
    minutes: 7,
    takeaways: [
      'Sample takeaway one: the single most useful point of the post.',
      'Sample takeaway two: what to check first.',
      'Sample takeaway three: what to do next.',
    ],
    body: [
      { type: 'p', text: P },
      { type: 'h2', id: 'first-section', text: 'Sample first section heading' },
      { type: 'p', text: P },
      { type: 'ul', items: ['Sample list item one', 'Sample list item two', 'Sample list item three'] },
      { type: 'image', caption: 'Sample caption. Says what the image shows and where it comes from.' },
      { type: 'h2', id: 'second-section', text: 'Sample second section heading' },
      { type: 'p', text: P },
      { type: 'h3', text: 'Sample sub-heading' },
      { type: 'ol', items: ['Sample step one', 'Sample step two', 'Sample step three'] },
      { type: 'quote', text: 'Sample quote. A sentence from a real person, with their permission.' },
      { type: 'cta', kind: 'free-system' },
      { type: 'h2', id: 'third-section', text: 'Sample third section heading' },
      { type: 'p', text: P },
      {
        type: 'table',
        head: ['Sample column', 'Sample column', 'Sample column'],
        rows: [
          ['Sample row', 'Sample value', 'Sample value'],
          ['Sample row', 'Sample value', 'Sample value'],
          ['Sample row', 'Sample value', 'Sample value'],
        ],
      },
      { type: 'p', text: P },
      { type: 'cta', kind: 'call' },
    ],
    faqs: [
      {
        q: 'Sample question one?',
        a: 'Sample answer. Two or three plain sentences that answer the question directly.',
      },
      {
        q: 'Sample question two?',
        a: 'Sample answer. Two or three plain sentences that answer the question directly.',
      },
      {
        q: 'Sample question three?',
        a: 'Sample answer. Two or three plain sentences that answer the question directly.',
      },
    ],
  },
  ...(['capture', 'convert', 'retain', 'attract'] as const).map((stage, i) => ({
    slug: `sample-post-${i + 2}`,
    title: `Sample post title number ${['two', 'three', 'four', 'five'][i]} for the list`,
    summary:
      'Sample summary. One or two sentences that say what the reader will be able to do after reading.',
    category: 'Sample category',
    stage,
    author: AUTHOR,
    published: '1 January 2026',
    minutes: 5,
    takeaways: [],
    body: [],
    faqs: [],
  })),
];
