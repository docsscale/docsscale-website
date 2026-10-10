import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { ResultsHero } from '@/features/results/ResultsHero';
import { ResultsCases } from '@/features/results/ResultsCases';
import { ResultsCTA } from '@/features/results/ResultsCTA';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';
import { RelatedPages } from '@/features/site-chrome/RelatedPages';

export const metadata = pageMetadata({
  title: 'Client Results: Real Numbers From Real Clinics | DocsScale',
  description:
    'Dental, med spa, PT, and chiropractic case studies. Every number here has a clinic and a date behind it.',
  path: '/results/',
});

export default function ResultsPage() {
  return (
    <>
      {STRUCTURED_DATA.results.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="results" specialties={SPECIALTY_LINKS} />
      <main>
        <ResultsHero />
        <ResultsCases />
        <ResultsCTA />
        <RelatedPages page="/results/" />
      </main>
      <SiteMotion />
    </>
  );
}
