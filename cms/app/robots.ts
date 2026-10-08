import type { MetadataRoute } from 'next';

// The editing screen and the SEO dashboard are private: nothing here is for
// search engines. Every response also carries noindex (next.config.ts).
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
