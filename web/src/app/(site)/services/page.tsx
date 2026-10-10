import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { ServicesAttract } from '@/features/services/ServicesAttract';
import { ServicesCapture } from '@/features/services/ServicesCapture';
import { ServicesConvert } from '@/features/services/ServicesConvert';
import { ServicesCTA } from '@/features/services/ServicesCTA';
import { ServicesHero } from '@/features/services/ServicesHero';
import { ServicesRetain } from '@/features/services/ServicesRetain';
import { ServicesSpecialtyLinks } from '@/features/services/ServicesSpecialtyLinks';
import { Nav } from '@/features/site-chrome/Nav';
import { RelatedPages } from '@/features/site-chrome/RelatedPages';

export const metadata = pageMetadata({
  title: 'Healthcare Marketing Services for Clinics | DocsScale',
  description:
    'Eight services, four stages, one team. See exactly what DocsScale does to get your clinic more booked, showed-up patients.',
  path: '/services/',
});

export default function ServicesPage() {
  return (
    <>
      {STRUCTURED_DATA.services.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="services" specialties={SPECIALTY_LINKS} />
      <main>
        <ServicesHero />
        <ServicesSpecialtyLinks />
        <ServicesAttract />
        <ServicesCapture />
        <ServicesConvert />
        <ServicesRetain />
        <ServicesCTA />
        <RelatedPages page="/services/" />
      </main>
      <SiteMotion />
    </>
  );
}
