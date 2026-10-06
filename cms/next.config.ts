import path from 'node:path';
import type { NextConfig } from 'next';

// TRIAL. The editing screen is a separate app with a server; the public site
// (web/) stays a static export and contains nothing from here.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
