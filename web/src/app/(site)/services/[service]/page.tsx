import { notFound } from 'next/navigation';
import { SERVICE_PAGES } from '@/content/service-pages';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { pageMetadata } from '@/features/seo/metadata';
import { ServicePage } from '@/features/services/ServicePage';
import { Nav } from '@/features/site-chrome/Nav';

// One static page per service: /services/local-seo/ …
export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ service: s.slug }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props) {
  const { service: slug } = await params;
  const service = SERVICE_PAGES.find((s) => s.slug === slug);
  if (!service) return {};
  return pageMetadata({
    title: service.title,
    description: service.metaDescription,
    path: `/services/${service.slug}/`,
    // A layout sample holds filler text and must never be indexed.
    robots: service.sample ? 'noindex-nofollow' : 'marketing',
  });
}

export default async function ServiceRoute({ params }: Props) {
  const { service: slug } = await params;
  const service = SERVICE_PAGES.find((s) => s.slug === slug);
  if (!service) notFound();
  return (
    <>
      <Nav active="services" specialties={SPECIALTY_LINKS} />
      <main>
        <ServicePage service={service} />
      </main>
      <SiteMotion />
    </>
  );
}
