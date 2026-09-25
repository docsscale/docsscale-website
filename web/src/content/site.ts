// Site-wide facts and navigation. Edit here, not in components: the nav, footer,
// forms and structured data all read from this file.

export const SITE = {
  name: 'DocsScale',
  url: 'https://docsscale.com',
  tagline:
    'Marketing agency for healthcare clinics. More patients on autopilot, from the first click to the booked appointment.',
  copyright: '© 2026 DocsScale · docsscale.com',
} as const;

/** Contact block in the footer, one line per entry, shown in this order. */
export const CONTACT_LINES = [
  '2100 S Lamar Blvd, Suite 210',
  'Austin, TX 78704',
  '(512) 555-0148',
  'hello@docsscale.com',
] as const;

/** Top navigation. `key` matches the `active` prop pages pass to <Nav>. */
export const NAV_LINKS = [
  { key: 'how', label: 'How it works', href: '/how-it-works' },
  { key: 'services', label: 'Services', href: '/services' },
  { key: 'results', label: 'Results', href: '/results' },
  { key: 'about', label: 'About', href: '/about' },
] as const;

export type NavKey = (typeof NAV_LINKS)[number]['key'] | 'home' | 'book';

export const FOOTER_COLUMNS = [
  {
    heading: 'Services',
    links: [
      { label: 'Paid advertising', href: '/services#attract' },
      { label: 'SEO', href: '/services#attract' },
      { label: 'Social media management', href: '/services#attract' },
      { label: 'Website & funnel design', href: '/services#capture' },
      { label: 'Follow-up & booking', href: '/services#convert' },
      { label: 'Reviews & reactivation', href: '/services#retain' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Results', href: '/results' },
      { label: 'About', href: '/about' },
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
