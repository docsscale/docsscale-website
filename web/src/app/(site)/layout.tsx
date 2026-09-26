import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { preload } from 'react-dom';
import { Footer } from '@/features/site-chrome/Footer';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import '@/styles/motion.css';
import '@/styles/layout.css';

// The funnel never had a favicon; the main site does.
export const metadata: Metadata = { icons: { icon: '/favicon.png' } };

// Main-site shell. Pages render their own <Nav active="…"> (the active tab is
// page-specific); the footer is identical everywhere, so it lives here.
export default function SiteLayout({ children }: { children: ReactNode }) {
  // Fetch the two fonts used above the fold as early as possible (same as live).
  preload('/fonts/plus-jakarta-sans-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  preload('/fonts/instrument-serif-italic-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
