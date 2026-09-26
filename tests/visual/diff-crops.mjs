// Finds every changed area between two sets of full-page captures and writes a
// BEFORE / AFTER crop of each one plus an index.html showing them side by side, so a change that touches many small
// spots (a colour, a font size) can be reviewed without scanning whole pages.
//   node tests/visual/diff-crops.mjs <before dir> <after dir> <out dir> [name,name]
// Capture the two dirs with capture.mjs first. Needs ImageMagick (magick) for cropping.
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [beforeDir, afterDir, outDir, onlyArg] = process.argv.slice(2);
const only = onlyArg ? new Set(onlyArg.split(',')) : null;
const PAD = 24;
const GAP = 60; // changed rows closer than this are one area
fs.mkdirSync(outDir, { recursive: true });
const index = [];

for (const file of fs.readdirSync(afterDir).filter((f) => f.endsWith('.png')).sort()) {
  const name = file.replace(/\.png$/, '');
  if (only && !only.has(name) && !only.has(name.split('--')[0])) continue;
  const a = PNG.sync.read(fs.readFileSync(path.join(beforeDir, file)));
  const b = PNG.sync.read(fs.readFileSync(path.join(afterDir, file)));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`${name}: page size changed (${a.width}x${a.height} → ${b.width}x${b.height}), crops skipped`);
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  if (!pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0, includeAA: true })) continue;

  // Changed pixels are drawn red in the diff image; collect the rows and columns.
  const rows = [];
  for (let y = 0; y < a.height; y++) {
    let x0 = Infinity, x1 = -1;
    for (let x = 0; x < a.width; x++) {
      const i = (y * a.width + x) * 4;
      if (diff.data[i] > 200 && diff.data[i + 1] < 80) (x0 = Math.min(x0, x)), (x1 = x);
    }
    if (x1 >= 0) rows.push({ y, x0, x1 });
  }
  const areas = [];
  for (const r of rows) {
    const last = areas.at(-1);
    if (last && r.y - last.y1 <= GAP) Object.assign(last, { y1: r.y, x0: Math.min(last.x0, r.x0), x1: Math.max(last.x1, r.x1) });
    else areas.push({ y0: r.y, y1: r.y, x0: r.x0, x1: r.x1 });
  }
  areas.forEach((r, n) => {
    const x = Math.max(0, r.x0 - PAD), y = Math.max(0, r.y0 - PAD);
    const w = Math.min(a.width, r.x1 + PAD) - x, h = Math.min(a.height, r.y1 + PAD, y + 700) - y;
    const id = `${name}--${String(n + 1).padStart(2, '0')}`;
    for (const [dir, side] of [[beforeDir, 'before'], [afterDir, 'after']])
      execFileSync('magick', [path.join(dir, file), '-crop', `${w}x${h}+${x}+${y}`, '+repage', path.join(outDir, `${id}-${side}.png`)]);
    index.push({ id, page: name, n: n + 1, of: areas.length, y, w });
  });
  console.log(`${name}: ${areas.length} changed area(s)`);
}

// index.html: every changed area, before and after side by side, enlarged 1.5×.
fs.writeFileSync(
  path.join(outDir, 'index.html'),
  `<!doctype html><meta charset="utf-8"><title>Changed areas</title>
<style>body{font:14px system-ui;margin:24px;color:#1A1A1A}figure{margin:0 0 28px}figcaption{font-weight:600;margin-bottom:6px}
.pair{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}.pair div{font-size:12px;color:#666}img{border:1px solid #ddd;display:block;margin-top:3px;image-rendering:auto}</style>
${index
  .map(
    (i) => `<figure data-page="${i.page}"><figcaption>${i.page} · area ${i.n} of ${i.of} · y=${i.y}</figcaption><div class="pair">
<div>BEFORE<img src="${i.id}-before.png" width="${Math.round(i.w * 1.5)}"></div><div>AFTER<img src="${i.id}-after.png" width="${Math.round(i.w * 1.5)}"></div></div></figure>`,
  )
  .join('\n')}`,
);
console.log(`${index.length} areas → ${path.join(outDir, 'index.html')}`);
