// Builds side-by-side before/after images of changed sections for review.
//   node tests/visual/before-after.mjs <out dir>
// Before = the frozen live build, after = web/out. One PNG per item.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { startServer } from './serve.mjs';
import { settle } from './settle.mjs';
import { isolate } from './isolate.mjs';

const OUT = process.argv[2] ?? 'review/before-after';
// --only name1,name2 and --width N (default 1440) for focused reviews.
const argv = process.argv.slice(3);
const onlyArg = argv.includes('--only') ? new Set(argv[argv.indexOf('--only') + 1].split(',')) : null;
const WIDTH = argv.includes('--width') ? Number(argv[argv.indexOf('--width') + 1]) : 1440;
// --before <dir>: the build to compare against (default: the original live snapshot).
const BEFORE = argv.includes('--before') ? argv[argv.indexOf('--before') + 1] : 'reference/live-2026-09-25';
const ITEMS = [
  { name: '01-footer-contact', path: '/', selector: '[data-screen-label="Footer"]', title: 'Footer (every page): contact block' },
  { name: '02-home-faq-email', path: '/', selector: '[data-screen-label="FAQ"]', title: 'Homepage FAQ: email address', clipHeight: 420 },
  { name: '03-home-form-fallback', path: '/', selector: '#call', title: 'Homepage form: "Or call" line → email' },
  { name: '04-book-a-call-form', path: '/book-a-call/', selector: 'form', title: 'Book a call form: "Or call" line → email' },
  { name: '05-results-sample-note', path: '/results/', selector: '[data-screen-label="Hero"]', title: 'Results: "Sample figures" note removed (stats stay in place)' },
  { name: '06-about-hero-founded', path: '/about/', selector: '[data-screen-label="Hero"]', title: 'About: Founded 2025 · Houston, Texas' },
  { name: '07-about-team', path: '/about/', selector: '[data-screen-label="Team"]', title: 'About: team (initials until photos are added) and "Where" block' },
  { name: '08-privacy', path: '/privacy/', selector: '[data-screen-label="Content"]', title: 'Privacy Policy: final text (email only)' },
  { name: '10-logo-nav', clipWidth: 710, path: '/', selector: '[data-screen-label="Nav"]', title: 'Header logo (every main-site page)', keepNav: true },
  { name: '11-logo-footer', clipWidth: 710, path: '/', selector: '[data-screen-label="Footer"]', title: 'Footer logo (every main-site page)', clipHeight: 300 },
  { name: '12-logo-funnel-header', clipWidth: 710, path: '/free-system/', selector: 'div[style*="position:sticky"]', title: 'Funnel header logo', keepNav: true },
  { name: '13-logo-funnel-footer', clipWidth: 710, path: '/free-system/', selector: 'div:has(> div > span:text-is("© 2026 DocsScale"))', title: 'Funnel footer logo' },
  { name: '14-funnel-hero', path: '/free-system/', selector: 'main > *:first-child', title: 'Funnel: Click-to-Chair System headline and supporting line', clipHeight: 1400 },
  { name: '15-thank-you-hero', path: '/free-system/thank-you/', selector: 'main > *:first-child', title: 'Thank-you page: system name', clipHeight: 700 },
  { name: '16-home-hero', path: '/', selector: '[data-screen-label="Hero"]', title: 'Homepage hero: "Austin, TX" caption removed from the photo box' },
  { name: '09-terms', path: '/terms/', selector: '[data-screen-label="Content"]', title: 'Terms of Service: final text' },
];

const browser = await chromium.launch();
fs.mkdirSync(OUT, { recursive: true });

async function capture(root, item) {
  const server = await startServer(root);
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 }, reducedMotion: 'reduce' });
  await isolate(page);
  await page.goto(`http://127.0.0.1:${server.address().port}${item.path}`, { waitUntil: 'load' });
  // Scroll the whole page once so scroll-triggered content (counters, reveals)
  // runs to its final state before the capture.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 400) await page.evaluate((top) => window.scrollTo(0, top), y), await page.waitForTimeout(60);
  const el = page.locator(item.selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // counters take 1 s
  // Back to the top: sticky headers would otherwise sit over the captured area.
  if (!item.keepNav) await page.evaluate(() => window.scrollTo(0, 0)), await page.waitForTimeout(200);
  await settle(page);
  // The sticky nav would cover the top of sections; hide it for these crops.
  if (!item.keepNav) await page.addStyleTag({ content: '[data-screen-label="Nav"]{display:none!important}' });
  const box = await el.boundingBox();
  const buf = await page.screenshot({
    fullPage: true,
    clip: { x: 0, y: box.y + (await page.evaluate(() => scrollY)), width: Math.min(WIDTH, item.clipWidth ?? WIDTH), height: Math.min(box.height, item.clipHeight ?? 4000) },
  });
  await page.close();
  server.close();
  return buf.toString('base64');
}

for (const item of ITEMS) {
  if (onlyArg && !onlyArg.has(item.name)) continue;
  const before = await capture(BEFORE, item);
  const after = await capture('web/out', item);
  const page = await browser.newPage({ viewport: { width: 1480, height: 100 } });
  await page.setContent(`<!doctype html><html><body style="margin:0;padding:20px;background:#fff;font:600 18px system-ui">
    <div style="margin-bottom:12px">${item.title}</div>
    <div style="display:flex;gap:20px;align-items:flex-start">
      <figure style="margin:0;width:${Math.min(710, WIDTH)}px"><figcaption style="color:#B4432F;margin-bottom:6px">BEFORE (${BEFORE.includes('approved') ? 'v1.0' : 'live'})</figcaption>
        <img style="width:${Math.min(710, WIDTH)}px;border:1px solid #ddd" src="data:image/png;base64,${before}"></figure>
      <figure style="margin:0;width:${Math.min(710, WIDTH)}px"><figcaption style="color:#1F5A40;margin-bottom:6px">AFTER (staging)</figcaption>
        <img style="width:${Math.min(710, WIDTH)}px;border:1px solid #ddd" src="data:image/png;base64,${after}"></figure>
    </div></body></html>`);
  await page.screenshot({ path: path.join(OUT, `${item.name}${WIDTH === 1440 ? '' : `-${WIDTH}`}.png`), fullPage: true });
  await page.close();
  console.log(`  ${item.name}.png`);
}
await browser.close();
