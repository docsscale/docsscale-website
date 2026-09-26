// Final-frame check for the hero entrance animation: loads each animated page
// with motion ON, lets the entrance animations finish (real time, no scrolling,
// so scroll-triggered sections below stay out of it) and screenshots only the
// hero. Compares two builds pixel by pixel.
//   node tests/visual/hero-final.mjs <buildA> <buildB>
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import { startServer } from './serve.mjs';
import { VIEWPORTS } from './routes.mjs';

const [siteA, siteB] = process.argv.slice(2);
const PAGES = ['/', '/services/', '/services/dental/', '/services/chiropractic/', '/services/physical-therapy/', '/services/med-spa/', '/how-it-works/', '/results/', '/about/', '/book-a-call/'];
const browser = await chromium.launch();
fs.mkdirSync('tests/visual/diff', { recursive: true });

async function shoot(site, route, vp) {
  const server = await startServer(site);
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}${route}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(vp.width - 1, vp.height - 1); // away from any [data-lift] card
  await page.waitForTimeout(3000); // longest entrance: 0.1s + 0.05s × words + 0.9s
  // GSAP leaves will-change:transform on each word; composited layers anti-alias
  // differently run to run, so drop the hint once the animations are done.
  await page.addStyleTag({ content: '*{will-change:auto!important}' });
  await page.waitForTimeout(200);
  const hero = page.locator('[data-screen-label="Hero"]');
  const png = PNG.sync.read(await hero.screenshot({ animations: 'disabled' }));
  await page.close();
  server.close();
  return png;
}

let fails = 0;
for (const route of PAGES) {
  for (const vp of VIEWPORTS) {
    const a = await shoot(siteA, route, vp);
    const b = await shoot(siteB, route, vp);
    let status;
    if (a.width !== b.width || a.height !== b.height) status = `size ${a.width}x${a.height} vs ${b.width}x${b.height}`;
    else {
      const diff = new PNG({ width: a.width, height: a.height });
      const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0, includeAA: true });
      status = n === 0 ? 'identical' : `${n} px differ`;
      if (n) fs.writeFileSync(`tests/visual/diff/hero-${route.replace(/\//g, '_')}-${vp.name}.png`, PNG.sync.write(diff));
    }
    if (status !== 'identical') fails++;
    console.log(`${status === 'identical' ? 'PASS' : 'FAIL'}  ${(route + ' ' + vp.name).padEnd(40)} ${status}`);
  }
}
await browser.close();
process.exit(fails ? 1 : 0);
