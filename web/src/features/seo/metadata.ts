import type { Metadata } from 'next';
import { SITE } from '@/content/site';

type PageMeta = {
  title: string;
  description: string;
  /** Path with trailing slash, e.g. "/about/". Used for canonical and og:url. */
  path: string;
  /** Legal pages use plain "index,follow"; marketing pages allow large image previews. */
  robots?: 'marketing' | 'plain' | 'noindex';
};

const ROBOTS = {
  marketing: 'index,follow,max-image-preview:large',
  plain: 'index,follow',
  noindex: 'noindex',
} as const;

/** Builds the same <head> tags every page had on the live site. */
export function pageMetadata({ title, description, path, robots = 'marketing' }: PageMeta): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    robots: ROBOTS[robots],
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}
