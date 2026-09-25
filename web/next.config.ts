import path from 'node:path';
import type { NextConfig } from 'next';

// Static export: `next build` writes plain files to out/, which are uploaded to
// Hostinger's public_html. trailingSlash keeps every URL exactly as it was
// (/about/, /services/dental/ …).
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // The repo root has its own package.json (test tools); build from web/ only.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
