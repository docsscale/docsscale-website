import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE } from '@/content/site';

// Root layout shared by the main site and the /free-system funnel. Each of those
// has its own layout (route groups (site) and (funnel)) with its own stylesheet,
// because the two were designed separately and define some classes differently.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
