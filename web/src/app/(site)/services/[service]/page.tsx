import { notFound } from 'next/navigation';
import { SERVICE_PAGES } from '@/content/service-pages';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { ServicePage } from '@/features/services/ServicePage';
import { Nav } from '@/features/site-chrome/Nav';
import { RelatedPages } from '@/features/site-chrome/RelatedPages';

// One static page per service that has been written: /services/paid-ads/ …
// (the industry slugs under /services/ 301 to /industries/; see .htaccess)
export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ service: s.slug }));
}

const STRUCTURED_DATA_KEY = {
  'paid-ads': 'servicePaidAds',
} as const;

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props) {
  const { service: slug } = await params;
  const page = SERVICE_PAGES.find((s) => s.slug === slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/services/${page.slug}/`,
  });
}

export default async function ServiceRoute({ params }: Props) {
  const { service: slug } = await params;
  const page = SERVICE_PAGES.find((s) => s.slug === slug);
  if (!page) notFound();
  const ldKey = STRUCTURED_DATA_KEY[page.slug as keyof typeof STRUCTURED_DATA_KEY];
  // FAQPage from the same list the page shows, so the two match.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <>
      {STRUCTURED_DATA[ldKey].map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonLd data={faqLd} />
      <Nav active="services" specialties={SPECIALTY_LINKS} />
      <main>
        <ServicePage page={page} />
        <RelatedPages page="/services/[service]/" />
      </main>
      <SiteMotion />
    </>
  );
}
