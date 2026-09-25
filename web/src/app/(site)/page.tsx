import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { Faq } from '@/features/home/Faq';
import { FinalCta } from '@/features/home/FinalCta';
import { Gaps } from '@/features/home/Gaps';
import { Hero } from '@/features/home/Hero';
import { HowItWorks } from '@/features/home/HowItWorks';
import { Results } from '@/features/home/Results';
import { Services } from '@/features/home/Services';
import { SpecialtyProvider } from '@/features/home/specialty-context';
import { System } from '@/features/home/System';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';

export const metadata = pageMetadata({
  title: 'Healthcare Clinic Marketing Agency | DocsScale',
  description:
    "DocsScale runs your clinic's marketing end to end, ads to booked appointment. One team, one system, reported in patients seen, not clicks.",
  path: '/',
});

export default function HomePage() {
  return (
    <>
      {STRUCTURED_DATA.home.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <SpecialtyProvider>
        <Hero />
        <Gaps />
        <System />
        <Services />
        <HowItWorks />
        <Results />
        <Faq />
        <FinalCta />
      </SpecialtyProvider>
      <SiteMotion />
    </>
  );
}
