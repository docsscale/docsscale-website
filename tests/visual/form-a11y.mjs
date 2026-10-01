// Screen-reader behaviour of the lead forms (WCAG 4.1.3 Status Messages):
// "Sending…" is announced, errors are alerts, and after a successful send focus
// moves to the confirmation. Runs against the new build; the lead endpoint is
// mocked, so nothing is sent anywhere.
//   node tests/visual/form-a11y.mjs
import { chromium } from 'playwright';
import { startServer } from './serve.mjs';

const server = await startServer('web/out');
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
let pass = 0;
let fail = 0;
const expect = (name, got, want) => {
  if (got === want) pass++;
  else {
    fail++;
    console.log(`FAIL ${name}: got [${got}] want [${want}]`);
  }
};

async function open(path, reply) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => localStorage.setItem('ds-consent', 'denied'));
  let release;
  const held = new Promise((r) => (release = r));
  await context.route('**/send-lead.php', async (route) => {
    await held; // keep the request pending until the test lets it go
    await route.fulfill({ status: reply.status, contentType: 'application/json', body: JSON.stringify(reply.body) });
  });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: 'load' });
  return { page, release };
}

async function fillMain(page, scope) {
  const f = page.locator(scope);
  await f.locator('[name=name]').fill('QA');
  await f.locator('[name=clinicName]').fill('Clinic');
  await f.locator('[name=email]').fill('qa@example.com');
  await f.locator('[name=specialty]').selectOption('Dental');
  await f.locator('[name=locations]').selectOption({ index: 1 });
}
const statusText = (page, scope) => page.locator(`${scope} [role=status]`).textContent();
const focused = (page) => page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');

for (const { name, path, scope, success } of [
  { name: 'home', path: '/', scope: '#call form', success: "Got it, we'll be in touch." },
  { name: 'book-a-call', path: '/book-a-call/', scope: 'form', success: "Got it. We'll reply within one business day." },
]) {
  // success
  {
    const { page, release } = await open(path, { status: 200, body: { ok: true } });
    await fillMain(page, scope);
    await page.locator(`${scope} button[type=submit]`).click();
    expect(`${name}: "Sending…" announced`, await statusText(page, scope), 'Sending…');
    release();
    await page.getByText(success).waitFor();
    expect(`${name}: focus on the confirmation`, await focused(page), success);
    await page.context().close();
  }
  // error
  {
    const { page, release } = await open(path, { status: 502, body: { ok: false, error: 'Something went wrong.' } });
    await fillMain(page, scope);
    await page.locator(`${scope} button[type=submit]`).click();
    release();
    const alert = page.locator(`${scope} [role=alert]`);
    await alert.waitFor();
    expect(`${name}: error is an alert`, (await alert.textContent()).trim(), 'Something went wrong.');
    expect(`${name}: status cleared after error`, await statusText(page, scope), '');
    await page.context().close();
  }
}

// funnel: success navigates to the thank-you page (Next announces the new page); errors are alerts
{
  const { page, release } = await open('/free-system/', { status: 502, body: { ok: false, error: 'Please try again.' } });
  const form = page.locator('#form form');
  await form.locator('input[placeholder="Full name"]').fill('QA');
  await form.locator('input[placeholder="Work email"]').fill('qa@example.com');
  await form.locator('select').selectOption('Dental');
  await form.locator('button[type=submit]').click();
  expect('funnel: "Sending…" announced', await form.locator('[role=status]').textContent(), 'Sending…');
  release();
  const alert = form.locator('[role=alert]');
  await alert.waitFor();
  expect('funnel: error is an alert', (await alert.textContent()).trim(), 'Please try again.');
  await page.context().close();
}

await browser.close();
server.close();
console.log(`form a11y: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
