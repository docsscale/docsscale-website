import { notFound } from 'next/navigation';
import { CASE_STUDIES } from '@/content/case-studies';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { CaseStudyPage } from '@/features/results/CaseStudyPage';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';
import { RelatedPages } from '@/features/site-chrome/RelatedPages';

// One static page per full case study: /results/central-clinic-of-chiropractic/ …
export const dynamicParams = false;
export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ case: c.slug }));
}

type Props = { params: Promise<{ case: string }> };

export async function generateMetadata({ params }: Props) {
  const { case: slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) return {};
  return pageMetadata({ title: cs.title, description: cs.metaDescription, path: `/results/${cs.slug}/` });
}

export default async function CaseStudyRoute({ params }: Props) {
  const { case: slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) notFound();
  // FAQPage from the same list the page shows, so the two match.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cs.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <>
      {STRUCTURED_DATA.caseStudy(cs).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonLd data={faqLd} />
      <Nav active="results" specialties={SPECIALTY_LINKS} />
      <main>
        <CaseStudyPage cs={cs} />
        <RelatedPages page="/results/[case]/" />
      </main>
      <SiteMotion />
    </>
  );
}
