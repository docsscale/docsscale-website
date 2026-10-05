// The homepage hero graphic (features/home/HeroJourney.tsx): the owner's rules.
// - complete on first paint, with no script needed
// - static for visitors who prefer reduced motion
// - motion starts only after load, pauses off-screen, and never moves the page
// - the full rotation of five examples takes about 30-40 seconds
// - labelled as an example; never names the software behind it
//   node tests/visual/hero-journey.mjs      (takes about a minute)
import { chromium } from 'playwright';
import fs from 'node:fs';
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
const NAMES = ['Maya', 'Leo', 'Nina', 'Ben', 'Ruth'];
const FIRST = ['Tapped your ad', 'Replied automatically', 'Booked Thu 9:30', 'Showed up'];

// 1. The built HTML already holds the complete first example.
const html = fs.readFileSync('web/out/index.html', 'utf8');
const tile = html.slice(html.indexOf('id="hero-journey-tile"'), html.indexOf('id="hero-journey-tile"') + 9000);
for (const text of [...FIRST, 'Maya', 'Example', 'Every step runs on its own. Times vary by clinic.']) {
  expect(`first paint has "${text}"`, tile.includes(text), true);
}
expect('first paint: all four steps done', (tile.match(/data-state="done"/g) || []).length, 4);
expect('no software name on the homepage', /gohighlevel|highlevel|leadconnector|\bGHL\b|\bCRM\b/i.test(html), false);
expect('no placeholder left in the hero', html.includes('Clinic photo: real team'), false);

const open = async (options) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  await context.addInitScript(() => localStorage.setItem('ds-consent', 'denied'));
  const page = await context.newPage();
  await page.goto(base + '/', { waitUntil: 'load' });
  return { context, page };
};
const state = (page) =>
  page.evaluate(() => {
    const hj = document.querySelector('.hj');
    const box = document.getElementById('hero-journey-tile').getBoundingClientRect();
    return {
      text: hj.innerText,
      name: hj.querySelector('.hj-name').textContent,
      live: hj.hasAttribute('data-live'),
      done: hj.querySelectorAll('[data-state="done"]').length,
      box: [box.x, box.y, box.width, box.height].map(Math.round).join(','),
      page: document.documentElement.scrollHeight,
    };
  });

// 2. Reduced motion: nothing ever changes.
{
  const { context, page } = await open({ reducedMotion: 'reduce' });
  const before = await state(page);
  await page.waitForTimeout(6000);
  const after = await state(page);
  expect('reduced motion: unchanged after 6 s', after.text, before.text);
  expect('reduced motion: animations never switched on', after.live, false);
  expect('screen readers: one fixed description', await page.locator('.hj[role="img"][aria-label]').count(), 1);
  expect('screen readers: moving part hidden', await page.locator('.hj > [aria-hidden="true"]').count(), 1);
  await context.close();
}

// 3. With motion: starts after load, shows all five, never moves the page.
{
  const { context, page } = await open({ reducedMotion: 'no-preference' });
  await page.evaluate(() => {
    window.__shift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__shift += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const atLoad = await state(page);
  await page.waitForTimeout(900); // the hero's own entrance (older than this graphic) settles
  const first = await state(page);
  expect('after the entrance: still not moving', first.live, false);
  expect('at load: still the complete first example', atLoad.name, 'Maya');
  expect('at load: not moving yet', atLoad.live, false);

  const seen = new Set();
  let firstToPlay = '';
  const boxes = new Set([first.box]);
  const pages = new Set([first.page]);
  let sending = false;
  const starts = {}; // when each example first appeared
  let rotation = 0;
  const began = Date.now();
  while (Date.now() - began < 60000 && !rotation) {
    const now = await state(page);
    boxes.add(now.box);
    pages.add(now.page);
    if (now.text.includes('Sending')) sending = true;
    if (now.live && !firstToPlay) firstToPlay = `${now.name}, ${now.done} steps done`;
    if (now.live && !seen.has(now.name)) {
      seen.add(now.name);
      starts[now.name] = Date.now();
    } else if (now.live && now.name === 'Leo' && seen.size === 5 && Date.now() - starts.Leo > 5000) {
      rotation = Date.now() - starts.Leo;
    }
    await page.waitForTimeout(100);
  }
  expect('the first example is played through first', firstToPlay, 'Maya, 0 steps done');
  expect('all five examples shown', NAMES.every((n) => seen.has(n)), true);
  expect('"Sending" shown before automated replies', sending, true);
  expect(`full rotation takes 30-40 s (took ${(rotation / 1000).toFixed(1)} s)`, rotation >= 30000 && rotation <= 40000, true);
  expect('the tile never moves or resizes', boxes.size, 1);
  expect('the page never changes height', pages.size, 1);
  expect('no layout shift during the rotation', await page.evaluate(() => window.__shift), 0);

  // 4. Off-screen: it waits. Back in view: it carries on.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(2500); // lets the step in progress finish
  const parked = await state(page);
  await page.waitForTimeout(5000);
  expect('off-screen: paused', (await state(page)).text, parked.text);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(3000);
  expect('back in view: moving again', (await state(page)).text !== parked.text, true);
  await context.close();
}

// 5. Phones: the graphic sits right under the headline card, and fits.
{
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(base + '/', { waitUntil: 'load' });
  const phone = await page.evaluate(() => {
    const grid = document.getElementById('hero-grid');
    const byTop = [...grid.children].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    const clipped = [...document.querySelectorAll('.hj-title,.hj-line,.hj-eyebrow')].filter(
      (el) => el.scrollWidth > el.clientWidth + 1,
    );
    return {
      second: byTop[1].id,
      clipped: clipped.length,
      sideways: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  expect('phone: graphic is second, under the headline card', phone.second, 'hero-journey-tile');
  expect('phone: no text cut off', phone.clipped, 0);
  expect('phone: no sideways scroll', phone.sideways, false);
  await context.close();
}

await browser.close();
server.close();
console.log(`hero-journey: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
