import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { AboutHero } from '@/features/about/AboutHero';
import { AboutPrinciples } from '@/features/about/AboutPrinciples';
import { AboutTeam } from '@/features/about/AboutTeam';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';

export const metadata = pageMetadata({
  title: 'About DocsScale: We Only Work With Healthcare Clinics',
  description:
    "Why DocsScale exists, how the team works, and the four rules we don't break. Meet the people who'd run your account.",
  path: '/about/',
});

export default function AboutPage() {
  return (
    <>
      {STRUCTURED_DATA.about.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="about" specialties={SPECIALTY_LINKS} />
      <AboutHero />
      <AboutPrinciples />
      <AboutTeam />
      <SiteMotion />
    </>
  );
}
