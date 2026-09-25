import type { ReactNode } from 'react';
import { preload } from 'react-dom';
import '@/styles/funnel-fonts.css';
import '@/styles/funnel.css';

// The /free-system/ funnel was designed separately from the main site and has
// its own stylesheet, header and footer. Links from the funnel to the main site
// are plain <a> tags (full page loads) so the two stylesheets never mix.
export default function FunnelLayout({ children }: { children: ReactNode }) {
  preload('/fonts/plus-jakarta-sans-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  preload('/fonts/instrument-serif-italic-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  return children;
}
