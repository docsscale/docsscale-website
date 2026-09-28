import { preloadResponsiveImage } from '@/components/ui/ResponsiveImage';
import { HERO_SIZES } from '@/content/images';
import { FunnelFooter } from '@/features/funnel/FunnelFooter';
import { FunnelHeader } from '@/features/funnel/FunnelHeader';
import { ThankYouHero } from '@/features/funnel/ThankYouHero';
import { ThankYouNextStep } from '@/features/funnel/ThankYouNextStep';
import { ThankYouOffer } from '@/features/funnel/ThankYouOffer';
import { pageMetadata } from '@/features/seo/metadata';

export const metadata = pageMetadata({
  title: 'Check Your Email — Your System Is on Its Way | DocsScale',
  description:
    'Your Click-to-Chair System is on its way: 6 funnels, 17 automations and a full patient CRM. Check your inbox, or book a free call to have it installed.',
  path: '/free-system/thank-you/',
  robots: 'noindex-nofollow',
  social: {
    ogTitle: "You're in — Check Your Email | DocsScale",
    ogDescription:
      'Your free Click-to-Chair System is on its way. 6 funnels, 17 automations, full CRM — all yours. Want it installed? Book a free call.',
    twitterCard: 'summary',
    twitterTitle: "You're in — DocsScale",
    twitterDescription: 'Your free Click-to-Chair System is on its way. Check your inbox.',
  },
});

export default function ThankYouPage() {
  preloadResponsiveImage('/free-system/images/hero-mockup.jpg', HERO_SIZES);
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
