// Copy for the blog index (/blog/). Posts themselves are files in /content.
export type BlogIndexCopy = { heading: string; intro: string; title: string; description: string };

// Wording chosen by the developer on the owner's instruction (8 Oct 2026: "use
// the SEO optimized title that you think is best"). The page is not public
// until the first post is published.
export const BLOG_INDEX: BlogIndexCopy = {
  heading: 'How clinics get found, booked and re-booked',
  intro:
    'Short, practical guides for dental, chiropractic, physical therapy and med spa owners, from the work we do for clinics every day. No jargon.',
  title: 'Healthcare Marketing Blog for Clinic Owners | DocsScale',
  description:
    'Practical marketing guides for dental, chiropractic, physical therapy and med spa practices: local SEO, ads, follow-up, reviews and patient recall.',
};
