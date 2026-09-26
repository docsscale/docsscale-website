// Makes a Playwright page or context deterministic for screenshots:
// - blocks every request that isn't to the local test server (the booking
//   iframe, analytics), so both builds see the same empty third-party frames;
// - pre-sets a cookie-consent choice, so the consent banner (shown only when a
//   GA4 Measurement ID is configured) never covers a capture.
export async function isolate(target) {
  await target.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await target.addInitScript(() => {
    try {
      localStorage.setItem('ds-consent', 'denied');
    } catch {}
  });
}
