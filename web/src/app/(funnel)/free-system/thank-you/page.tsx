import { preload } from 'react-dom';
import { FunnelFooter } from '@/features/funnel/FunnelFooter';
import { FunnelHeader } from '@/features/funnel/FunnelHeader';
import { ThankYouHero } from '@/features/funnel/ThankYouHero';
import { ThankYouNextStep } from '@/features/funnel/ThankYouNextStep';
import { ThankYouOffer } from '@/features/funnel/ThankYouOffer';
import { pageMetadata } from '@/features/seo/metadata';

export const metadata = pageMetadata({
  title: 'Check Your Email — Your System Is on Its Way | DocsScale',
  description:
    'Your patient-getting system is on its way: 6 funnels, 17 automations and a full patient CRM. Check your inbox, or book a free call to have it installed.',
  path: '/free-system/thank-you/',
  robots: 'noindex-nofollow',
  social: {
    ogTitle: "You're in — Check Your Email | DocsScale",
    ogDescription:
      'Your free GoHighLevel patient-getting system is on its way. 6 funnels, 17 automations, full CRM — all yours. Want it installed? Book a free call.',
    twitterCard: 'summary',
    twitterTitle: "You're in — DocsScale",
    twitterDescription: 'Your free GoHighLevel patient-getting system is on its way. Check your inbox.',
  },
});

export default function ThankYouPage() {
  // The live page preloads the hero mockup too (it reuses the landing page's head).
  preload('/free-system/images/hero-mockup.jpg', { as: 'image' });
  return (
    <>
      <FunnelHeader cta={{ label: 'Book a free call', href: '/free-system/book-a-call/' }} />
      <main>
        <ThankYouHero />
        <ThankYouNextStep />
        <ThankYouOffer />
      </main>
      <FunnelFooter />
    </>
  );
}
