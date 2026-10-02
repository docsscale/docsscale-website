// Microsoft Clarity loads only after "Accept", only on docsscale.com, never for
// team-marked browsers, and forms are masked. The local build is served under
// https://docsscale.com (requests intercepted), and clarity.ms is blocked, so
// nothing reaches Microsoft or Google.
//   node tests/visual/clarity.mjs
import { chromium } from 'playwright';
import { startServer } from './serve.mjs';

const server = await startServer('web/out');
const local = `http://127.0.0.1:${server.address().port}`;
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

async function visit({ host, consent, team = false, path = '/' }) {
  const context = await browser.newContext();
  await context.addInitScript(
    ([c, t]) => {
      if (c) localStorage.setItem('ds-consent', c);
      if (t) localStorage.setItem('ds-team', '1');
    },
    [consent, team],
  );
  const clarityRequests = [];
  await context.route(/clarity\.ms|google/, (r) => {
    if (r.request().url().includes('clarity.ms')) clarityRequests.push(r.request().url());
    return r.abort();
  });
  await context.route('https://docsscale.com/**', async (r) => {
    const res = await fetch(local + new URL(r.request().url()).pathname);
    r.fulfill({ status: res.status, headers: Object.fromEntries(res.headers), body: Buffer.from(await res.arrayBuffer()) });
  });
  const page = await context.newPage();
  await page.goto((host === 'production' ? 'https://docsscale.com' : local) + path, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const queue = await page.evaluate(() => JSON.stringify((window.clarity && window.clarity.q) || []));
  const masked = await page.evaluate(() => [...document.forms].filter((f) => !f.hasAttribute('data-website-trap')).every((f) => f.dataset.clarityMask === 'true'));
  await context.close();
  return { requested: clarityRequests.length > 0, queue, masked };
}

const accepted = await visit({ host: 'production', consent: 'granted' });
expect('accepted on docsscale.com: Clarity requested', accepted.requested, true);
expect('accepted: consent signalled to Clarity', accepted.queue.includes('"consent"'), true);
expect('no choice yet: not loaded', (await visit({ host: 'production', consent: null })).requested, false);
expect('declined: not loaded', (await visit({ host: 'production', consent: 'denied' })).requested, false);
expect('team browser: not loaded', (await visit({ host: 'production', consent: 'granted', team: true })).requested, false);
expect('not docsscale.com (staging/local): not loaded', (await visit({ host: 'local', consent: 'granted' })).requested, false);
for (const path of ['/', '/book-a-call/', '/free-system/']) {
  expect(`${path}: forms masked`, (await visit({ host: 'local', consent: null, path })).masked, true);
}

await browser.close();
server.close();
console.log(`clarity: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
