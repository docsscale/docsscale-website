import Script from 'next/script';

// GoHighLevel booking calendar (white-labelled as booking.docsscale.com).
// form_embed.js resizes the iframe to fit the calendar.
export function BookingEmbed() {
  return (
    <div
      style={{ borderRadius: 24, overflow: 'hidden', border: '1.5px solid #E6E3DC', background: '#FFFFFF' }}
    >
      <iframe
        src="https://booking.docsscale.com/widget/booking/AxTHzUXPy6Nz6SmXjPZn"
        allow="payment"
        style={{ width: '100%', minHeight: 800, border: 'none', display: 'block' }}
        scrolling="no"
        id="AxTHzUXPy6Nz6SmXjPZn_1789680501110"
        title="Book a free strategy call"
      />
      <Script src="https://booking.docsscale.com/js/form_embed.js" strategy="afterInteractive" />
    </div>
  );
}
