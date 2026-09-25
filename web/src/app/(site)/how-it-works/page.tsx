import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { HowItWorksHero } from '@/features/how-it-works/HowItWorksHero';
import { HowItWorksSteps } from '@/features/how-it-works/HowItWorksSteps';
import { HowItWorksPromises } from '@/features/how-it-works/HowItWorksPromises';
import { HowItWorksCTA } from '@/features/how-it-works/HowItWorksCTA';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';

export const metadata = pageMetadata({
  title: 'How DocsScale Works: From Strategy Call to Booked Patients',
  description:
    'A 30-minute call, a build phase you approve, then a weekly report. See exactly what happens before you sign anything.',
  path: '/how-it-works/',
});

export default function HowItWorksPage() {
  return (
    <>
      {STRUCTURED_DATA.howItWorks.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="how" specialties={SPECIALTY_LINKS} />
      <HowItWorksHero />
      <HowItWorksSteps />
      <HowItWorksPromises />
      <HowItWorksCTA />
      <SiteMotion />
    </>
  );
}
