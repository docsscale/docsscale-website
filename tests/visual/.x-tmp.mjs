import { chromium } from 'playwright';
import { startServer } from './serve.mjs';
const browser = await chromium.launch();
for (const [dir, id] of [['reference/approved', 'hero-photo-tile'], ['web/out', 'hero-journey-tile']]) {
  const server = await startServer(dir);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    window.__s = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__s.push([Math.round(e.startTime), e.value, e.sources.map((s) => (s.node?.id || s.node?.className || s.node?.nodeName) + ' ' + JSON.stringify(s.previousRect) + '>' + JSON.stringify(s.currentRect))]); }).observe({ type: 'layout-shift', buffered: true });
  });
  await p.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'load' });
  const boxes = [];
  const t0 = Date.now();
  while (Date.now() - t0 < 12000) {
    const b = await p.evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((n) => n.toFixed(1)).join(','); }, id);
    if (boxes.at(-1)?.[1] !== b) boxes.push([Date.now() - t0, b]);
    await p.waitForTimeout(100);
  }
  console.log(dir, JSON.stringify(boxes), JSON.stringify(await p.evaluate(() => window.__s)));
  await ctx.close(); server.close();
}
await browser.close();
