import { preload } from 'react-dom';
import { STRUCTURED_DATA } from '@/content/structured-data';
import { FunnelAutomations } from '@/features/funnel/FunnelAutomations';
import { FunnelEligibility } from '@/features/funnel/FunnelEligibility';
import { FunnelFooter } from '@/features/funnel/FunnelFooter';
import { FunnelFormSection } from '@/features/funnel/FunnelFormSection';
import { FunnelHeader } from '@/features/funnel/FunnelHeader';
import { FunnelHero } from '@/features/funnel/FunnelHero';
import { FunnelInside } from '@/features/funnel/FunnelInside';
import { FunnelObjections } from '@/features/funnel/FunnelObjections';
import { FunnelProblem } from '@/features/funnel/FunnelProblem';
import { FunnelProof } from '@/features/funnel/FunnelProof';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';

export const metadata = pageMetadata({
  title: 'Free GoHighLevel Patient-Getting System for Healthcare Clinics — DocsScale',
  description:
    'Get a free, ready-to-use patient-getting system for your clinic: 6 funnels, 17 automations and a full patient CRM, built in GoHighLevel. Yours to keep.',
  path: '/free-system/',
  robots: 'none',
  social: {
    ogDescription:
      '6 pre-built funnels, 17 automations, and a full patient CRM — free to download and keep. Built for clinics that want more patients without more manual work.',
    twitterTitle: 'Free GoHighLevel Patient-Getting System — DocsScale',
    twitterDescription:
      '6 funnels, 17 automations, full patient CRM — free for healthcare clinics. No credit card, no strings.',
  },
});

export default function FreeSystemPage() {
  preload('/free-system/images/hero-mockup.jpg', { as: 'image' });
  return (
    <>
      {STRUCTURED_DATA.freeSystem.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <FunnelHeader cta={{ label: 'Claim the free system', href: '#form' }} />
      <main>
        <FunnelHero />
        <FunnelProblem />
        <FunnelInside />
        <FunnelAutomations />
        <FunnelEligibility />
        <FunnelProof />
        <FunnelObjections />
        <FunnelFormSection />
      </main>
      <FunnelFooter />
    </>
  );
}
