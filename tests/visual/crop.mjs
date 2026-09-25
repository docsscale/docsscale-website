// Debug helper: writes baseline | candidate | diff side by side for a region.
//   node tests/visual/crop.mjs <file.png> <y> <height> [out.png]
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [file, y0, h, out = 'tests/visual/diff/crop.png'] = process.argv.slice(2);
const load = (d) => PNG.sync.read(fs.readFileSync(`tests/visual/${d}/${file}`));
const imgs = [load('baseline'), load('candidate')];
if (fs.existsSync(`tests/visual/diff/${file}`)) imgs.push(load('diff'));
const w = imgs[0].width, top = Number(y0), height = Math.min(Number(h), imgs[0].height - top);
const res = new PNG({ width: w * imgs.length + 10 * (imgs.length - 1), height });
res.data.fill(255);
imgs.forEach((img, k) => {
  for (let y = 0; y < height; y++)
    for (let x = 0; x < w; x++) {
      const s = ((top + y) * img.width + x) * 4, d = (y * res.width + k * (w + 10) + x) * 4;
      img.data.copy(res.data, d, s, s + 4);
    }
});
fs.writeFileSync(out, PNG.sync.write(res));
console.log(out);
