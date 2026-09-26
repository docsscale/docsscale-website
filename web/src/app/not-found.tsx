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
  title: 'DocsScale — Marketing Agency for Healthcare Clinics',
  description:
    'DocsScale gets healthcare clinics more patients on autopilot, from the first click to the booked appointment: ads, SEO, websites, funnels, follow-up and recall. Counted in booked appointments, never clicks.',
  robots: 'noindex',
};

export default function NotFoundPage() {
  preload('/fonts/plus-jakarta-sans-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  preload('/fonts/instrument-serif-italic-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  return (
    <>
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <NotFound />
      <Footer />
    </>
  );
}
