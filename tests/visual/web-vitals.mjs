// Real-user Web Vitals events (LCP, INP, CLS) on the new build. Google is never
// contacted: GA is switched on locally with window.dsAnalyticsTest and every
// request to Google is blocked; the test reads the gtag queue (window.dataLayer).
//   node tests/visual/web-vitals.mjs
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

async function visit(path, consent) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript((c) => {
    window.dsAnalyticsTest = true;
    localStorage.setItem('ds-consent', c);
  }, consent);
  const googleRequests = [];
  await context.route(/google/, (route) => {
    googleRequests.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.mouse.click(640, 600); // an interaction, so INP has something to measure
  await page.waitForTimeout(300);
  // Leaving the page is when web-vitals reports final values.
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(300);
  const events = await page.evaluate(() =>
    (window.dataLayer || [])
      .filter((e) => e[0] === 'event' && ['LCP', 'INP', 'CLS'].includes(e[1]))
      .map((e) => ({ name: e[1], ...e[2] })),
  );
  await context.close();
  return { events, googleRequests };
}

for (const path of ['/', '/free-system/']) {
  const { events } = await visit(path, 'granted');
  const names = [...new Set(events.map((e) => e.name))].sort().join(',');
  expect(`${path}: LCP, INP and CLS reported`, names, 'CLS,INP,LCP');
  for (const e of events) {
    expect(`${path}: ${e.name} value is an integer`, Number.isInteger(e.value), true);
    expect(`${path}: ${e.name} has a rating`, ['good', 'needs-improvement', 'poor'].includes(e.metric_rating), true);
    expect(`${path}: ${e.name} page path`, e.page_path, path);
  }
}

// Declined: nothing is requested from Google (the events stay in the local queue).
{
  const { googleRequests } = await visit('/', 'denied');
  expect('declined: no request to Google', googleRequests.length, 0);
}

await browser.close();
server.close();
console.log(`web vitals: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
