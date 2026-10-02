// Tracking events and lead attribution on the new build. Google is never
// contacted: GA runs in local test mode (window.dsAnalyticsTest) with every
// Google request blocked; the test reads the gtag queue and the lead payload.
//   node tests/visual/tracking.mjs
import { chromium } from 'playwright';
import { startServer } from './serve.mjs';

const server = await startServer('web/out');
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
let pass = 0;
let fail = 0;
const expect = (name, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else {
    fail++;
    console.log(`FAIL ${name}: got [${JSON.stringify(got)}] want [${JSON.stringify(want)}]`);
  }
};

async function open(path, consent, viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript((c) => {
    window.dsAnalyticsTest = true;
    if (c) localStorage.setItem('ds-consent', c);
  }, consent);
  await context.route(/google/, (r) => r.abort());
  let lead = null;
  await context.route('**/send-lead.php', (r) => {
    lead = JSON.parse(r.request().postData());
    return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  const page = await context.newPage();
  // Keep clicks on the page: links are only tracked, never followed.
  await page.addInitScript(() =>
    document.addEventListener('click', (e) => e.target.closest?.('a[href]') && e.preventDefault()),
  );
  await page.goto(base + path, { waitUntil: 'load' });
  return { page, lead: () => lead };
}
const events = (page, name) =>
  page.evaluate((n) => (window.dataLayer || []).filter((e) => e[0] === 'event' && e[1] === n).map((e) => e[2]), name);

// cta_click: header, hero, footer on the homepage
{
  const { page } = await open('/', 'granted');
  await page.locator('#nav-cta').click();
  await page.locator('[data-screen-label="Hero"] a[href^="/book-a-call"]').first().click();
  await page.locator('[data-screen-label="Footer"] a[href^="/book-a-call"]').click();
  await page.locator(`a[href^="mailto:"]`).first().click();
  const ctas = (await events(page, 'cta_click')).map((e) => `${e.cta}@${e.location}`);
  expect('cta_click: header, hero, footer', ctas, ['book_a_call@header', 'book_a_call@hero', 'book_a_call@footer']);
  expect('email_link_click: faq, no address sent', await events(page, 'email_link_click'), [{ location: 'faq', page: '/' }]);
  await page.context().close();
}
// cta_click: the funnel's "Claim" buttons
{
  const { page } = await open('/free-system/', 'granted');
  await page.locator('a[href="#form"][data-cta-location="hero"]').click();
  const ctas = (await events(page, 'cta_click')).map((e) => `${e.cta}@${e.location}`);
  expect('cta_click: funnel claim (hero)', ctas, ['free_system@hero']);
  await page.context().close();
}
// form_error: required fields (browser check), then an invalid phone (our check)
{
  const { page } = await open('/book-a-call/', 'granted');
  await page.locator('form button[type=submit]').click();
  const fields = (await events(page, 'form_error')).map((e) => e.field);
  expect('form_error: required fields', fields, ['name', 'clinicName', 'email', 'phone', 'specialty']);
  const f = page.locator('form');
  await f.locator('[name=name]').fill('QA');
  await f.locator('[name=clinicName]').fill('Clinic');
  await f.locator('[name=email]').fill('qa@example.com');
  await f.locator('[name=specialty]').selectOption('Dental');
  await f.locator('input[type=tel]').fill('0322 5351511');
  await f.locator('button[type=submit]').click();
  await page.waitForTimeout(500);
  const last = (await events(page, 'form_error')).at(-1);
  expect('form_error: invalid phone', last, { form: 'book-a-call', field: 'phone', page: '/book-a-call/' });
  await page.context().close();
}
// attribution: sent with the lead after consent, not without
for (const consent of ['granted', 'denied']) {
  const { page, lead } = await open('/?utm_source=facebook&utm_medium=paid-social&utm_campaign=free-system-tx-hou-202610', consent);
  const f = page.locator('#call form');
  await f.locator('[name=name]').fill('QA');
  await f.locator('[name=clinicName]').fill('Clinic');
  await f.locator('[name=email]').fill('qa@example.com');
  await f.locator('input[type=tel]').fill('713 555 0100');
  await f.locator('[name=specialty]').selectOption('Dental');
  await f.locator('button[type=submit]').click();
  await page.waitForTimeout(800);
  const got = lead();
  const attribution = got && {
    utmSource: got.utmSource,
    utmMedium: got.utmMedium,
    utmCampaign: got.utmCampaign,
    landingPage: got.landingPage,
  };
  expect(
    `attribution with consent ${consent}`,
    attribution,
    consent === 'granted'
      ? { utmSource: 'facebook', utmMedium: 'paid-social', utmCampaign: 'free-system-tx-hou-202610', landingPage: `${base}/` }
      : { utmSource: undefined, utmMedium: undefined, utmCampaign: undefined, landingPage: undefined },
  );
  await page.context().close();
}

await browser.close();
server.close();
console.log(`tracking: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
