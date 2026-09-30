import { INDUSTRIES_PAGE } from '@/content/industries';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { IndustriesPage } from '@/features/industries/IndustriesPage';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';

export const metadata = pageMetadata({
  title: INDUSTRIES_PAGE.title,
  description: INDUSTRIES_PAGE.metaDescription,
  path: '/industries/',
});

export default function IndustriesRoute() {
  return (
    <>
      {STRUCTURED_DATA.industries.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="industries" specialties={SPECIALTY_LINKS} />
      <main>
        <IndustriesPage />
      </main>
      <SiteMotion />
    </>
  );
}
