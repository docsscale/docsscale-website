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
};

export default nextConfig;
