// The "Where to go next" row near the bottom of every page: three or four
// links to related pages, each with one plain line saying what the reader
// will find there. It gives every page links to other pages from its own
// text (menus and the footer are not counted by search engines the same way),
// and gives the pages nothing else linked to a way in. Edit the words here,
// not in the components.

export type RelatedLink = { label: string; blurb: string; href: string };

const PAGE = {
  how: {
    label: 'How it works',
    blurb: 'The four stages, from the first click to the booked appointment, and what happens in each.',
    href: '/how-it-works/',
  },
  services: {
    label: 'Services',
    blurb: 'Paid ads, local SEO, websites, lead follow-up, reviews and recall, by stage.',
    href: '/services/',
  },
  industries: {
    label: 'Industries',
    blurb: 'The clinic specialties we work with and what changes for each one.',
    href: '/industries/',
  },
  results: {
    label: 'Results',
    blurb: 'Case studies with the real figures from clinics we run marketing for.',
    href: '/results/',
  },
  about: {
    label: 'About DocsScale',
    blurb: "Who we are, how we work and the rules we don't break.",
    href: '/about/',
  },
  call: {
    label: 'Book a strategy call',
    blurb: 'Thirty minutes on your numbers and what would fill the schedule first.',
    href: '/book-a-call/',
  },
  blog: {
    label: 'Blog',
    blurb: 'Practical marketing guides for clinic owners, written from our own work.',
    href: '/blog/',
  },
  privacy: {
    label: 'Privacy Policy',
    blurb: 'How we collect, use and protect information for clinics and visitors.',
    href: '/privacy/',
  },
  terms: {
    label: 'Terms of Service',
    blurb: 'The terms that apply to using this site and working with us.',
    href: '/terms/',
  },
  freeSystem: {
    label: 'What the Free System includes',
    blurb: 'The pages, follow-up and booking flow set up for you, and who it is for.',
    href: '/free-system/',
  },
  freeSystemCall: {
    label: 'Book your free call',
    blurb: 'Pick a time and we will walk through the system with you.',
    href: '/free-system/book-a-call/',
  },
} satisfies Record<string, RelatedLink>;

export const RELATED_HEADING = 'Where to go next';

/** The links for each page, in display order. The page itself is never listed. */
export const RELATED_PAGES = {
  '/': [PAGE.how, PAGE.industries, PAGE.results, PAGE.about],
  '/how-it-works/': [PAGE.services, PAGE.industries, PAGE.results, PAGE.call],
  '/services/': [PAGE.how, PAGE.industries, PAGE.results, PAGE.call],
  '/industries/': [PAGE.how, PAGE.services, PAGE.results, PAGE.call],
  '/industries/[specialty]/': [PAGE.results, PAGE.services, PAGE.how, PAGE.industries],
  '/services/[service]/': [PAGE.industries, PAGE.results, PAGE.how, PAGE.call],
  '/results/': [PAGE.industries, PAGE.how, PAGE.services, PAGE.call],
  '/about/': [PAGE.how, PAGE.results, PAGE.industries, PAGE.call],
  '/book-a-call/': [PAGE.how, PAGE.results, PAGE.about, PAGE.industries],
  '/blog/': [PAGE.how, PAGE.industries, PAGE.results, PAGE.call],
  '/privacy/': [PAGE.terms, PAGE.about, PAGE.how, PAGE.call],
  '/terms/': [PAGE.privacy, PAGE.about, PAGE.how, PAGE.call],
  '/free-system/': [PAGE.freeSystemCall, PAGE.how, PAGE.results, PAGE.industries],
  '/free-system/book-a-call/': [PAGE.freeSystem, PAGE.how, PAGE.results],
} satisfies Record<string, RelatedLink[]>;

export type RelatedPageKey = keyof typeof RELATED_PAGES;
