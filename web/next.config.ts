import fs from 'node:fs';
import path from 'node:path';
import type { NextConfig } from 'next';

// Static export: `next build` writes plain files to out/, which are uploaded to
// Hostinger's public_html. trailingSlash keeps every URL exactly as it was
// (/about/, /services/dental/ …).
// The blog's pages (page.blog.tsx) are part of the build only when there is a
// post to show: a static export cannot contain a route with no pages. The live
// site counts published posts; the preview site (CONTENT_PREVIEW=1) counts all.
const postsDir = path.resolve(__dirname, '../content/posts');
const hasPosts =
  fs.existsSync(postsDir) &&
  fs.readdirSync(postsDir).some((slug) => {
    const file = path.join(postsDir, slug, 'index.mdoc');
    if (!fs.existsSync(file)) return false;
    return process.env.CONTENT_PREVIEW === '1' || /^status: published$/m.test(fs.readFileSync(file, 'utf8'));
  });

const nextConfig: NextConfig = {
  pageExtensions: ['tsx', 'ts', ...(hasPosts ? ['blog.tsx'] : [])],
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // The repo root has its own package.json (test tools); build from web/ only.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
