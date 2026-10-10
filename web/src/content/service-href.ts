// Where each service links from the nav, footer and services page. A service
// with its own page (content/service-pages.ts) links there; the others still
// link to their stage's section on /services. Kept apart from service-pages.ts
// so the nav does not bundle every service page's copy (same reason as
// industry-href.ts).
const SERVICE_PAGE_HREFS: Record<string, string> = {
  'Paid ads (Meta & Google)': '/services/paid-ads/',
  'Reactivation & recall': '/services/patient-reactivation/',
  'Social media management': '/services/social-media-management/',
};

export const serviceHref = (stage: string, name?: string) =>
  (name && SERVICE_PAGE_HREFS[name]) || `/services#${stage}`;
