import { STRUCTURED_DATA } from '@/content/structured-data';
import { BookedConfirmation } from '@/features/funnel/booking/BookedConfirmation';
import { BookingSwitch } from '@/features/funnel/booking/BookingSwitch';
import { BookingView } from '@/features/funnel/booking/BookingView';
import { FunnelFooter } from '@/features/funnel/FunnelFooter';
import { FunnelHeader } from '@/features/funnel/FunnelHeader';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';

export const metadata = pageMetadata({
  title: 'Book a Free 30-Minute Strategy Call — DocsScale',
  description:
    "Book a free 30-minute strategy call. We review your clinic's patient numbers, find your biggest growth lever and tell you honestly whether we're a fit.",
  path: '/free-system/book-a-call/',
  robots: 'none',
  social: {
    ogDescription:
      '30 minutes. Your clinic numbers. An honest answer. No pitch, no pressure — just clarity on what is leaking in your patient pipeline.',
    twitterTitle: 'Book a Free Strategy Call — DocsScale',
    twitterDescription:
      '30 minutes with DocsScale. We review your clinic, pick the one growth lever, and tell you honestly if we can help.',
  },
});

export default function FunnelBookACallPage() {
  return (
    <>
      {STRUCTURED_DATA.freeSystemBookACall.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <FunnelHeader />
      <main>
        <BookingSwitch booking={<BookingView />} confirmation={<BookedConfirmation />} />
      </main>
      <FunnelFooter />
    </>
  );
}
