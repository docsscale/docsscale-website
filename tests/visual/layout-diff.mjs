// Debug helper: finds the first elements whose layout box differs between the
// live build and the rebuild (sub-pixel differences explain "invisible" pixel diffs).
//   node tests/visual/layout-diff.mjs /services/ [width]
import { chromium } from 'playwright';
import { startServer } from './serve.mjs';

const [route = '/', width = '1440'] = process.argv.slice(2);
const browser = await chromium.launch();
async function boxes(root) {
  const server = await startServer(root);
  const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, reducedMotion: 'reduce' });
  await page.goto(`http://127.0.0.1:${server.address().port}${route}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const list = await page.evaluate(() =>
    Array.from(document.body.querySelectorAll('*'))
      .filter((el) => !['SCRIPT', 'STYLE', 'LINK', 'NEXT-ROUTE-ANNOUNCER'].includes(el.tagName))
      .map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 50),
          box: [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 1000) / 1000).join(','),
          style: [cs.fontSize, cs.lineHeight, cs.letterSpacing, cs.fontWeight, cs.padding, cs.gap, cs.whiteSpace].join('|'),
        };
      }),
  );
  await page.close();
  server.close();
  return list;
}
const a = await boxes('reference/live-2026-09-25');
const b = await boxes('web/out');
console.log(`elements: live ${a.length}, rebuild ${b.length}`);
let shown = 0;
for (let i = 0; i < Math.min(a.length, b.length) && shown < 8; i++) {
  if (a[i].box !== b[i].box || a[i].style !== b[i].style || a[i].tag !== b[i].tag) {
    console.log(`#${i} <${a[i].tag}> "${a[i].text}"\n   live:    ${a[i].box}  ${a[i].style}\n   rebuild: <${b[i].tag}> ${b[i].box}  ${b[i].style}`);
    shown++;
  }
}
await browser.close();
