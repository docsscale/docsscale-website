import type { Metadata } from 'next';
import { SITE } from '@/content/site';

type PageMeta = {
  title: string;
  description: string;
  /** Path with trailing slash, e.g. "/about/". Used for canonical and og:url. */
  path: string;
  /** Legal pages use plain "index,follow"; marketing pages allow large image previews. */
  robots?: 'marketing' | 'plain' | 'noindex' | 'none' | 'noindex-nofollow';
  /** Social-card wording when it differs from the page title/description (the funnel). */
  social?: {
    ogTitle?: string;
    ogDescription?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    twitterTitle?: string;
    twitterDescription?: string;
  };
};

// Link-preview image for every page (1200×630; source in brand/originals).
const SOCIAL_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'DocsScale — marketing agency for healthcare clinics',
};

const ROBOTS = {
  marketing: 'index,follow,max-image-preview:large',
  plain: 'index,follow',
  noindex: 'noindex',
  'noindex-nofollow': 'noindex, nofollow',
  none: undefined, // no robots tag at all (the funnel pages)
} as const;

/** Builds the same <head> tags every page had on the live site. */
export function pageMetadata({
  title,
  description,
  path,
  robots = 'marketing',
  social = {},
}: PageMeta): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    robots: ROBOTS[robots],
    alternates: { canonical: url },
    openGraph: {
      title: social.ogTitle ?? title,
      description: social.ogDescription ?? description,
      url,
      siteName: SITE.name,
      type: 'website',
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: social.twitterCard ?? 'summary_large_image',
      title: social.twitterTitle ?? title,
      description: social.twitterDescription ?? description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
