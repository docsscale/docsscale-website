import { notFound } from 'next/navigation';
import { SPECIALTIES, SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { SpecialtyPage } from '@/features/services/SpecialtyPage';
import { Nav } from '@/features/site-chrome/Nav';
import { RelatedPages } from '@/features/site-chrome/RelatedPages';

// One static page per industry: /industries/dental/, /industries/chiropractic/ …
// (the old /services/<slug>/ URLs 301 here; see server/public_html/.htaccess)
export const dynamicParams = false;
export function generateStaticParams() {
  return SPECIALTIES.map((s) => ({ specialty: s.slug }));
}

const STRUCTURED_DATA_KEY = {
  dental: 'industryDental',
  chiropractic: 'industryChiropractic',
  'physical-therapy': 'industryPhysicalTherapy',
  'med-spa': 'industryMedSpa',
} as const;

type Props = { params: Promise<{ specialty: string }> };

export async function generateMetadata({ params }: Props) {
  const { specialty: slug } = await params;
  const specialty = SPECIALTIES.find((s) => s.slug === slug);
  if (!specialty) return {};
  return pageMetadata({
    title: specialty.title,
    description: specialty.metaDescription,
    path: `/industries/${specialty.slug}/`,
  });
}

export default async function SpecialtyRoute({ params }: Props) {
  const { specialty: slug } = await params;
  const specialty = SPECIALTIES.find((s) => s.slug === slug);
  if (!specialty) notFound();
  const ldKey = STRUCTURED_DATA_KEY[specialty.slug as keyof typeof STRUCTURED_DATA_KEY];
  // FAQPage only when the page shows questions; built from the same list.
  const faqLd = specialty.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: specialty.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;
  return (
    <>
      {STRUCTURED_DATA[ldKey].map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <Nav active="industries" specialties={SPECIALTY_LINKS} />
      <main>
        <SpecialtyPage specialty={specialty} />
        <RelatedPages page="/industries/[specialty]/" />
      </main>
      <SiteMotion />
    </>
  );
}
