// Site-wide facts and navigation. Edit here, not in components: the nav, footer,
// forms and structured data all read from this file.

export const SITE = {
  name: 'DocsScale',
  url: 'https://docsscale.com',
  tagline:
    'Marketing agency for healthcare clinics. More patients on autopilot, from the first click to the booked appointment.',
  copyright: '© 2026 DocsScale · docsscale.com',
  email: 'info@docsscale.com',
  location: 'Houston, Texas, US',
  founded: '2023',
} as const;

/** Contact block in the footer, one line per entry, shown in this order.
 *  No phone number or street address: DocsScale has neither publicly. */
export const CONTACT_LINES = ['Houston, Texas, US', 'info@docsscale.com'] as const;

/** Top navigation. `key` matches the `active` prop pages pass to <Nav>.
 *  `menu` items open a dropdown (Services, Industries) instead of linking directly. */
export const NAV_LINKS = [
  { key: 'how', label: 'How it works', href: '/how-it-works' },
  { key: 'services', label: 'Services', href: '/services', menu: true },
  { key: 'industries', label: 'Industries', href: '/industries', menu: true },
  { key: 'results', label: 'Results', href: '/results' },
  { key: 'about', label: 'About', href: '/about' },
] as const;

/** The seven services (confirmed 28 Sep 2026), by stage. Until each has its own
 *  page (with the SEO work, 5C), they link to their stage's section on /services. */
export const SERVICE_STAGES = [
  {
    stage: 'attract',
    label: 'Attract',
    services: [
      { name: 'Paid ads (Meta & Google)', blurb: 'Campaigns reported in booked appointments.' },
      { name: 'Local SEO & Google Business Profile', blurb: 'Rank for the treatments you want more of.' },
      { name: 'Social media management', blurb: 'A month of posts, approved in ten minutes.' },
    ],
  },
  {
    stage: 'capture',
    label: 'Capture',
    services: [
      { name: 'Websites & landing pages', blurb: 'Mobile-first pages that turn a click into a request.' },
    ],
  },
  {
    stage: 'convert',
    label: 'Convert',
    services: [{ name: 'Lead follow-up & booking', blurb: 'Every inquiry answered in minutes.' }],
  },
  {
    stage: 'retain',
    label: 'Retain',
    services: [
      { name: 'Reviews & reputation', blurb: 'Review requests after every visit.' },
      { name: 'Reactivation & recall', blurb: 'Past patients invited back at the right time.' },
    ],
  },
] as const;

export const serviceHref = (stage: string) => `/services#${stage}`;

export type NavKey = (typeof NAV_LINKS)[number]['key'] | 'home' | 'call';

/** Footer columns. Industries are added by the footer from content/specialties.ts. */
export const FOOTER_COLUMNS = [
  {
    heading: 'Services',
    links: SERVICE_STAGES.flatMap(({ stage, services }) =>
      services.map(({ name }) => ({ label: name, href: serviceHref(stage) })),
    ),
  },
  {
    heading: 'Company',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Results', href: '/results' },
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Book a strategy call', href: '/book-a-call' },
    ],
  },
] as const;

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Patient data', href: '/privacy#patient-data' },
] as const;
