// Copy for the blog index (/blog/). Posts themselves are files in /content.
export type BlogIndexCopy = { heading: string; intro: string; title: string; description: string };

// Wording chosen by the developer on the owner's instruction (8 Oct 2026: "use
// the SEO optimized title that you think is best"). The heading was shortened
// the same day at the owner's request ("more general, short and better"; he chose
// this wording from seven options); it is
// also the heading of "From the blog" on the home page.
export const BLOG_INDEX: BlogIndexCopy = {
  heading: 'Grow your practice: practical marketing guides',
  intro:
    'Short, practical guides for dental, chiropractic, physical therapy and med spa owners, from the work we do for clinics every day. No jargon.',
  title: 'Healthcare Marketing Blog for Clinic Owners | DocsScale',
  description:
    'Practical marketing guides for dental, chiropractic, physical therapy and med spa practices: local SEO, ads, follow-up, reviews and patient recall.',
};
