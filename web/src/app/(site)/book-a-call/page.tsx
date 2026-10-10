import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { BookACallCover } from '@/features/book-a-call/BookACallCover';
import { BookACallHero } from '@/features/book-a-call/BookACallHero';
import { SiteMotion } from '@/features/motion/SiteMotion';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';
import { RelatedPages } from '@/features/site-chrome/RelatedPages';

export const metadata = pageMetadata({
  title: 'Book a Free Strategy Call | DocsScale',
  description:
    'Thirty minutes, no pitch, no deck. Bring your numbers, leave with a plan for growing your clinic, whether you hire us or not.',
  path: '/book-a-call/',
});

export default function BookACallPage() {
  return (
    <>
      {STRUCTURED_DATA.bookACall.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="call" specialties={SPECIALTY_LINKS} />
      <main>
        <BookACallHero />
        <BookACallCover />
        <RelatedPages page="/book-a-call/" />
      </main>
      <SiteMotion />
    </>
  );
}
