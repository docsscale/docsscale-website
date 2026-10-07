// Copy for the blog index (/blog/). Posts themselves are files in /content.
export type BlogIndexCopy = { heading: string; intro: string; title: string; description: string };

// The heading, introduction and search-result wording are the owner's to
// supply before the blog goes live; until then the page is built only on the
// preview site (see next.config.ts).
export const BLOG_INDEX: BlogIndexCopy = {
  heading: 'Blog',
  intro: '',
  title: 'Blog | DocsScale',
  description: '',
};
