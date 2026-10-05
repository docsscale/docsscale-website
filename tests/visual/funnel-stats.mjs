// The /free-system/ stat cards: the real numbers must be in the HTML (no
// JavaScript needed), with the count-up as an extra on top.
//   node tests/visual/funnel-stats.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import { startServer } from './serve.mjs';

const WANT = '6 17 $0 24/7 100%';
const server = await startServer('web/out');
const url = `http://127.0.0.1:${server.address().port}/free-system/`;
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
const numbers = (page) =>
  page.evaluate(() => [...document.querySelector('.stats-grid').children].map((card) => card.firstChild.textContent).join(' '));

// 1. In the built HTML, in order.
const html = fs.readFileSync('web/out/free-system/index.html', 'utf8');
const strip = html.slice(html.indexOf('stats-grid'), html.indexOf('stats-grid') + 6000);
expect('real numbers in the HTML', [...strip.matchAll(/letter-spacing:-\.05em[^>]*>([^<]*)</g)].map((m) => m[1].replace(/<!-- -->/g, '')).join(' '), WANT);

// 2. JavaScript off: the real numbers show.
{
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  expect('JavaScript off: real numbers', (await page.locator('.stats-grid').innerText()).split('\n').filter((line) => /^[\d$]/.test(line)).join(' '), WANT);
  await context.close();
}

// 3. JavaScript on: off-screen they wait at 0, then count up to the real numbers.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  expect('off-screen: waiting at 0', await numbers(page), '0 0 $0 24/7 0%');
  await page.locator('.stats-grid').scrollIntoViewIfNeeded();
  const seen = new Set();
  for (let i = 0; i < 18; i++) {
    seen.add(await numbers(page));
    await page.waitForTimeout(100);
  }
  expect('counts up through in-between values', seen.size > 3, true);
  expect('ends on the real numbers', await numbers(page), WANT);
  await context.close();
}

// 4. Reduced motion: the real numbers, no count-up.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  expect('reduced motion: real numbers before scrolling', await numbers(page), WANT);
  await page.locator('.stats-grid').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  expect('reduced motion: unchanged in view', await numbers(page), WANT);
  await context.close();
}

await browser.close();
server.close();
console.log(`funnel stats: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
