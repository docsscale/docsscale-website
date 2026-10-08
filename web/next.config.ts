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
// The category of every post that will be built.
const builtCategories = (fs.existsSync(postsDir) ? fs.readdirSync(postsDir) : []).flatMap((slug) => {
  const file = path.join(postsDir, slug, 'index.mdoc');
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  if (process.env.CONTENT_PREVIEW !== '1' && !/^status: published$/m.test(text)) return [];
  return [text.match(/^category: (.+)$/m)?.[1] ?? ''];
});
const hasPosts = builtCategories.length > 0;
// A topic gets its own page only once it has three posts, so there are no thin
// pages (page.topic.tsx; the same number is in features/blog/posts.ts).
const hasTopicPages = [...new Set(builtCategories)].some(
  (category) => category && builtCategories.filter((c) => c === category).length >= 3,
);

const nextConfig: NextConfig = {
  // Preview builds keep one build name, so a page whose content did not change
  // is the same file as last time and need not be uploaded again.
  ...(process.env.CONTENT_PREVIEW === '1' ? { generateBuildId: async () => 'preview' } : {}),
  pageExtensions: [
    'tsx',
    'ts',
    ...(hasPosts ? ['blog.tsx', 'blog.ts'] : []),
    ...(hasTopicPages ? ['topic.tsx'] : []),
  ],
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // The repo root has its own package.json (test tools); build from web/ only.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
