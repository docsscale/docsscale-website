// Proves a section differs from the live build only inside an expected area.
//   node tests/visual/section-diff.mjs <route> <section selector> <allowed selector in live> [--motion]
// Screenshots the section in both builds (after animations settle), diffs them,
// and reports whether every changed pixel lies inside the live build's
// "allowed" element (e.g. a removed note).
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { startServer } from './serve.mjs';
import { settle } from './settle.mjs';
import { VIEWPORTS } from './routes.mjs';

const [route, sectionSel, allowedSel] = process.argv.slice(2);
const motion = process.argv.includes('--motion');
const browser = await chromium.launch();

async function shoot(site, vp, withAllowed) {
  const server = await startServer(site);
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: motion ? 'no-preference' : 'reduce',
  });
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}${route}`, { waitUntil: 'load' });
  await page.mouse.move(vp.width - 1, vp.height - 1);
  if (motion) await page.waitForTimeout(3000); // GSAP (live) is JS-driven
  await settle(page);
  await page.addStyleTag({ content: '*{will-change:auto!important}[data-screen-label="Nav"]{display:none!important}' });
  await page.waitForTimeout(150);
  const section = page.locator(sectionSel).first();
  const box = await section.boundingBox();
  let allowed = null;
  if (withAllowed) {
    const a = await page.locator(allowedSel).first().boundingBox();
    allowed = { x: a.x - box.x, y: a.y - box.y, w: a.width, h: a.height };
  }
  const png = PNG.sync.read(await section.screenshot({ animations: 'disabled' }));
  await page.close();
  server.close();
  return { png, allowed };
}

let ok = true;
for (const vp of VIEWPORTS) {
  const live = await shoot('reference/live-2026-09-25', vp, true);
  const rebuild = await shoot('web/out', vp, false);
  const A = live.png, B = rebuild.png;
  if (A.width !== B.width || A.height !== B.height) {
    console.log(`FAIL ${vp.name}: size ${A.width}x${A.height} vs ${B.width}x${B.height}`);
    ok = false;
    continue;
  }
  const diff = new PNG({ width: A.width, height: A.height });
  pixelmatch(A.data, B.data, diff.data, A.width, A.height, { threshold: 0, includeAA: true });
  const r = live.allowed;
  let inside = 0, outside = 0, maxDelta = 0;
  const where = [];
  for (let y = 0; y < A.height; y++)
    for (let x = 0; x < A.width; x++) {
      const i = (y * A.width + x) * 4;
      if (diff.data[i] > 200 && diff.data[i + 1] < 80) {
        if (x >= r.x - 1 && x <= r.x + r.w + 1 && y >= r.y - 1 && y <= r.y + r.h + 1) inside++;
        else {
          outside++;
          if (where.length < 4) where.push(`${x},${y}`);
          for (let k = 0; k < 3; k++) maxDelta = Math.max(maxDelta, Math.abs(A.data[i + k] - B.data[i + k]));
        }
      }
    }
  if (outside) ok = false;
  console.log(
    `${outside ? 'FAIL' : 'PASS'} ${vp.name.padEnd(8)} changed pixels inside the allowed area: ${inside}, elsewhere: ${outside}` +
      (outside ? ` (e.g. at ${where.join(' ')}; max colour difference ${maxDelta}/255)` : ''),
  );
}
await browser.close();
process.exit(ok ? 0 : 1);
