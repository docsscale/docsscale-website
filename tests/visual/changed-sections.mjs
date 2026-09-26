// For an intentional content change: lists which page sections differ between
// the live build and the rebuild, so "only the footer and the About team
// changed" can be proven rather than eyeballed.
//   node tests/visual/changed-sections.mjs [route,...]
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { startServer } from './serve.mjs';
import { ROUTES } from './routes.mjs';
import { isolate } from './isolate.mjs';

const only = process.argv[2] ? new Set(process.argv[2].split(',')) : null;
const browser = await chromium.launch();

async function shoot(root, path) {
  const server = await startServer(root);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.clock.install({ time: new Date('2026-09-25T12:00:00Z') });
  await isolate(page);
  await page.goto(`http://127.0.0.1:${server.address().port}${path}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.clock.runFor(10_000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.addStyleTag({ content: '*{animation-play-state:paused!important;transition:none!important}[data-lift]{will-change:auto!important}' });
  // Section boxes: labelled blocks, else top-level children of <body>'s main wrapper.
  const sections = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-screen-label], body > div > [id], body > [id]')).map((el) => {
      const r = el.getBoundingClientRect();
      return { name: el.getAttribute('data-screen-label') || `#${el.id}`, top: r.top + scrollY, bottom: r.bottom + scrollY };
    }),
  );
  const png = PNG.sync.read(await page.screenshot({ fullPage: true, animations: 'disabled' }));
  await page.close();
  server.close();
  return { png, sections };
}

for (const route of ROUTES) {
  if (only && !only.has(route.name)) continue;
  const a = await shoot('reference/live-2026-09-25', route.path);
  const b = await shoot('web/out', route.path);
  // Compare row by row from the top until heights diverge, then from the bottom.
  const changedRows = new Set();
  const rowDiff = (A, yA, B, yB) => {
    const w = A.width;
    const ra = A.data.subarray(yA * w * 4, (yA + 1) * w * 4);
    const rb = B.data.subarray(yB * w * 4, (yB + 1) * w * 4);
    return Buffer.compare(ra, rb) !== 0;
  };
  const top = Math.min(a.png.height, b.png.height);
  let firstTop = -1;
  for (let y = 0; y < top; y++) if (rowDiff(a.png, y, b.png, y)) { firstTop = y; break; }
  let firstBottom = -1; // distance from the bottom
  for (let d = 1; d <= top; d++) if (rowDiff(a.png, a.png.height - d, b.png, b.png.height - d)) { firstBottom = d; break; }
  if (firstTop < 0 && a.png.height === b.png.height) { console.log(`${route.name.padEnd(26)} unchanged`); continue; }
  // Differences lie between firstTop (from the top) and firstBottom (from the bottom) in the live layout.
  const from = firstTop, to = a.png.height - firstBottom;
  const hit = a.sections.filter((s) => s.bottom > from && s.top < to).map((s) => s.name);
  const sizeNote = a.png.height === b.png.height ? '' : ` (height ${a.png.height} → ${b.png.height})`;
  console.log(`${route.name.padEnd(26)} changed in: ${[...new Set(hit)].join(', ') || 'n/a'}${sizeNote}`);
}
await browser.close();
