import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { TERMS } from '@/content/legal';
import { LegalPage } from '@/features/legal/LegalPage';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';

export const metadata = pageMetadata({
  title: 'Terms of Service | DocsScale',
  description: 'The terms that apply to using docsscale.com and engaging DocsScale as a marketing agency.',
  path: '/terms/',
  robots: 'plain',
});

export default function TermsPage() {
  return (
    <>
      {STRUCTURED_DATA.terms.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <LegalPage doc={TERMS} />
    </>
  );
}
