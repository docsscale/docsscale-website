import { SPECIALTY_LINKS } from '@/content/specialties';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { PRIVACY } from '@/content/legal';
import { LegalPage } from '@/features/legal/LegalPage';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';

export const metadata = pageMetadata({
  title: 'Privacy Policy | DocsScale',
  description: 'How DocsScale collects, uses, and protects information for clinics and website visitors.',
  path: '/privacy/',
  robots: 'plain',
});

export default function PrivacyPage() {
  return (
    <>
      {STRUCTURED_DATA.privacy.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <LegalPage doc={PRIVACY} />
    </>
  );
}
