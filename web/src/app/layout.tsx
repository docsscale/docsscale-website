import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE } from '@/content/site';
import { GoogleAnalytics } from '@/features/analytics/GoogleAnalytics';
import { LandingCapture } from '@/features/lead-form/LandingCapture';

// Root layout shared by the main site and the /free-system funnel. Each of those
// has its own layout (route groups (site) and (funnel)) with its own stylesheet,
// because the two were designed separately and define some classes differently.
// Favicon set (brand/ has the sources): every page, including the funnel and 404.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <LandingCapture />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
