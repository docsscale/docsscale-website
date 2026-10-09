// Link to one industry page. Kept apart from specialties.ts so client
// components (the nav) can build these links without bundling every industry
// page's copy into the JavaScript that loads on every page.
export const industryHref = (slug: string) => `/industries/${slug}`;
