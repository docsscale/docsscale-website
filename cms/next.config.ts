import path from 'node:path';
import type { NextConfig } from 'next';

// TRIAL. The editing screen is a separate app with a server; the public site
// (web/) stays a static export and contains nothing from here.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: path.resolve(__dirname) },
  // Never in search results: every response says so, not only the HTML pages.
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] }];
  },
};

export default nextConfig;
