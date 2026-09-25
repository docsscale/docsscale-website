// Every public URL of the site. The visual and behaviour tests both use this
// list, so adding a page here is what brings it under test.
export const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services/' },
  { name: 'services-dental', path: '/services/dental/' },
  { name: 'services-chiropractic', path: '/services/chiropractic/' },
  { name: 'services-physical-therapy', path: '/services/physical-therapy/' },
  { name: 'services-med-spa', path: '/services/med-spa/' },
  { name: 'how-it-works', path: '/how-it-works/' },
  { name: 'results', path: '/results/' },
  { name: 'about', path: '/about/' },
  { name: 'book-a-call', path: '/book-a-call/' },
  { name: 'privacy', path: '/privacy/' },
  { name: 'terms', path: '/terms/' },
  { name: 'not-found', path: '/this-page-does-not-exist/' },
  { name: 'free-system', path: '/free-system/' },
  { name: 'free-system-book-a-call', path: '/free-system/book-a-call/' },
  { name: 'free-system-thank-you', path: '/free-system/thank-you/' },
  { name: 'free-system-not-found', path: '/free-system/this-page-does-not-exist/' },
];

export const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
