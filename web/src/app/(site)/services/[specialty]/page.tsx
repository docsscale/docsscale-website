import { notFound } from 'next/navigation';
import { SPECIALTIES, SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { SpecialtyPage } from '@/features/services/SpecialtyPage';
import { Nav } from '@/features/site-chrome/Nav';

// One static page per specialty: /services/dental/, /services/chiropractic/ …
export const dynamicParams = false;
export function generateStaticParams() {
  return SPECIALTIES.map((s) => ({ specialty: s.slug }));
}

const STRUCTURED_DATA_KEY = {
  dental: 'servicesDental',
  chiropractic: 'servicesChiropractic',
  'physical-therapy': 'servicesPhysicalTherapy',
  'med-spa': 'servicesMedSpa',
} as const;

type Props = { params: Promise<{ specialty: string }> };

export async function generateMetadata({ params }: Props) {
  const { specialty: slug } = await params;
  const specialty = SPECIALTIES.find((s) => s.slug === slug);
  if (!specialty) return {};
  return pageMetadata({
    title: specialty.title,
    description: specialty.metaDescription,
    path: `/services/${specialty.slug}/`,
  });
}

export default async function SpecialtyRoute({ params }: Props) {
  const { specialty: slug } = await params;
  const specialty = SPECIALTIES.find((s) => s.slug === slug);
  if (!specialty) notFound();
  const ldKey = STRUCTURED_DATA_KEY[specialty.slug as keyof typeof STRUCTURED_DATA_KEY];
  return (
    <>
      {STRUCTURED_DATA[ldKey].map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="services" specialties={SPECIALTY_LINKS} />
      <SpecialtyPage specialty={specialty} />
      <SiteMotion />
    </>
  );
}
