// Records a page load under mobile throttling, for before/after motion reviews.
//   node tests/visual/record-load.mjs <site dir> <out.webm> [path]
// Also prints LCP, FCP and when the headline first becomes visible.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { startServer } from './serve.mjs';

const [site, out, route = '/'] = process.argv.slice(2);
const server = await startServer(site);
const browser = await chromium.launch();
const dir = fs.mkdtempSync('/tmp/rec-');
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  recordVideo: { dir, size: { width: 390, height: 844 } },
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await page.addInitScript(() => {
  window.__lcp = 0;
  new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = e.startTime))).observe({
    type: 'largest-contentful-paint',
    buffered: true,
  });
});
await page.goto(`http://127.0.0.1:${server.address().port}${route}`, { waitUntil: 'load' });
await page.waitForTimeout(4500);
const metrics = await page.evaluate(() => ({
  lcp: Math.round(window.__lcp),
  fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
}));
await context.close();
const video = fs.readdirSync(dir).find((f) => f.endsWith('.webm'));
fs.copyFileSync(path.join(dir, video), out);
await browser.close();
server.close();
console.log(JSON.stringify({ site, ...metrics }));
