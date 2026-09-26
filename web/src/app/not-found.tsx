import type { Metadata } from 'next';
import { preload } from 'react-dom';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { NotFound } from '@/features/not-found/NotFound';
import { Footer } from '@/features/site-chrome/Footer';
import { Nav } from '@/features/site-chrome/Nav';
import '@/styles/fonts.css';
import '@/styles/globals.css';

// The site-wide 404 (exported as out/404.html; Hostinger serves it for every
// missing URL, funnel included). It sits outside the (site) route group, so it
// brings the main-site shell — styles, nav, footer — itself.
export const metadata: Metadata = {
  title: 'Page Not Found | DocsScale',
  description:
    "This page doesn't exist or has moved. From here you can find DocsScale's services, client results, and how to book a free strategy call.",
  robots: 'noindex',
};

export default function NotFoundPage() {
  preload('/fonts/plus-jakarta-sans-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  preload('/fonts/instrument-serif-italic-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  return (
    <>
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <main>
        <NotFound />
      </main>
      <Footer />
    </>
  );
}
