// Captures a full-page screenshot of every route at every viewport.
//   node tests/visual/capture.mjs --site <export dir> --out <png dir> [--only name,name]
// Rendering is made deterministic: reduced motion, CSS animations frozen,
// fonts loaded, lazy content scrolled into view, third-party requests
// (the GHL booking iframe) blocked so both runs see the same empty frame.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { startServer } from './serve.mjs';
import { ROUTES, VIEWPORTS } from './routes.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const site = args.site ?? 'reference/live-2026-09-25';
const out = args.out ?? 'tests/visual/baseline';
const only = args.only ? new Set(args.only.split(',')) : null;

const server = await startServer(site);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
fs.mkdirSync(out, { recursive: true });

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
  const page = await context.newPage();
  for (const route of ROUTES) {
    if (only && !only.has(route.name)) continue;
    // Fake clock: timers, requestAnimationFrame and Date are driven only by
    // clock.runFor(), so counters and rotators land on the same frame every run.
    await page.clock.install({ time: new Date('2026-09-25T12:00:00Z') });
    const response = await page.goto(base + route.path, { waitUntil: 'load' });
    // Skip pages the rebuild doesn't have yet (served as the 404 page instead).
    if (process.argv.includes('--skip-missing') && response.status() === 404 && !route.name.includes('not-found')) continue;
    await page.evaluate(() => document.fonts.ready);
    await autoScroll(page);
    await page.clock.runFor(10_000);
    await page.addStyleTag({
      content: '*,*::before,*::after{animation-play-state:paused!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}',
    });
    await page.clock.runFor(1_000);
    const file = path.join(out, `${route.name}--${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
    process.stdout.write(`  ${path.basename(file)}\n`);
  }
  await context.close();
}

await browser.close();
server.close();

// Scroll the whole page once so IntersectionObserver-driven content settles.
async function autoScroll(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = (await page.evaluate(() => window.innerHeight)) / 2;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.clock.runFor(50);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.clock.runFor(200);
}
