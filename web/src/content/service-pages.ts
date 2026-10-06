// The service pages (/services/<slug>/), one entry per confirmed service.
// Layout lives in features/services/ServicePage.tsx; all copy is here until the
// CMS takes these entries over (docs/COMPLETION-PLAN.md, section 10, stage B).
//
// LAYOUT SAMPLE: the one entry below exists to review the layout. Lines taken
// from the live /services page are real, approved copy. Everything marked
// "Sample" is filler and must be replaced with the owner's material before the
// page can be published. `sample: true` keeps it out of search engines.
import type { Stage } from '@/styles/tokens';

export type ServicePage = {
  slug: string;
  stage: Stage;
  stageLabel: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  h1Accent: string;
  /** 40–60 words that answer "what is this and what do I get" on their own. */
  directAnswer: string;
  glance: { label: string; value: string }[];
  included: { title: string; body: string }[];
  process: { title: string; body: string }[];
  /** A real client result, with permission. Left out entirely when there is none. */
  example?: {
    context: string;
    period: string;
    summary: string;
    results: { value: string; label: string }[];
    quote?: { text: string; by: string };
  };
  fit: { good: string[]; notFor: string[] };
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
  sample?: boolean;
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'local-seo',
    stage: 'attract',
    stageLabel: 'Attract',
    name: 'Local SEO & Google Business Profile',
    title: 'Sample title for the layout review | DocsScale',
    metaDescription:
      'Sample description for the layout review. The real one is written from the keyword map.',
    h1: 'Rank for the treatments you want more of,',
    h1Accent: 'where you serve.',
    directAnswer:
      'Sample direct answer. This block holds 40 to 60 words that say, in plain language, what the service is, who it is for and what a clinic gets from it, so a reader or a search engine can lift it out and it still makes sense without the rest of the page.',
    glance: [
      { label: 'Counted in', value: 'Calls and bookings from search, not positions.' },
      { label: 'Traction in', value: '3–6 months.' },
    ],
    included: [
      { title: 'Google Business Profile management', body: 'Sample line: what we do here and how often.' },
      { title: 'A page per treatment and neighborhood', body: 'Sample line: what we do here and how often.' },
      { title: 'Review velocity', body: 'Sample line: what we do here and how often.' },
      { title: 'Monthly rank report', body: 'Sample line: what the clinic sees each month.' },
    ],
    process: [
      { title: 'Sample step one', body: 'What happens in the first week, and what we ask the clinic for.' },
      { title: 'Sample step two', body: 'What happens in the first month.' },
      { title: 'Sample step three', body: 'What happens every month after that.' },
      { title: 'Sample step four', body: 'How the result is reported.' },
    ],
    example: {
      context: 'Sample · Specialty · City, State',
      period: 'Sample period',
      summary:
        'Sample summary. Two or three sentences on what the clinic needed, what we changed and what happened, in the clinic’s real numbers.',
      results: [
        { value: '00', label: 'Sample result one' },
        { value: '00', label: 'Sample result two' },
        { value: '00', label: 'Sample result three' },
      ],
      quote: { text: 'Sample quote from the client, used with permission.', by: 'Sample name, role' },
    },
    fit: {
      good: ['Sample: a clinic this suits', 'Sample: a second kind of clinic', 'Sample: a third'],
      notFor: ['Sample: a clinic this does not suit', 'Sample: a second case'],
    },
    faqs: [
      { q: 'Sample question a clinic owner asks?', a: 'Sample answer, in two or three plain sentences.' },
      { q: 'Sample second question?', a: 'Sample answer, in two or three plain sentences.' },
      { q: 'Sample third question?', a: 'Sample answer, in two or three plain sentences.' },
      { q: 'Sample fourth question?', a: 'Sample answer, in two or three plain sentences.' },
    ],
    related: [
      { label: 'Paid ads (Meta & Google)', href: '/services#attract' },
      { label: 'Reviews & reputation', href: '/services#retain' },
      { label: 'Dental', href: '/industries/dental' },
      { label: 'Chiropractic', href: '/industries/chiropractic' },
    ],
    sample: true,
  },
];
