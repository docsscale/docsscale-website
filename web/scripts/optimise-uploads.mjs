// Makes fast versions of every picture uploaded through the editing screen
// (public/uploads/): AVIF and WebP at several widths, with location and camera
// data removed. Runs before every build; the results are not committed.
//   node scripts/optimise-uploads.mjs
// It also writes .uploads.json, which tells the templates each picture's size
// (so nothing jumps while it loads) and which versions exist.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC = path.resolve(import.meta.dirname, '../public');
const UPLOADS = path.join(PUBLIC, 'uploads');
const OUT = path.join(UPLOADS, '_fast');
const WIDTHS = [480, 800, 1200, 1600];
const SOURCE = /\.(jpe?g|png|webp)$/i;

function pictures(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '_fast' ? [] : pictures(full);
    return SOURCE.test(entry.name) ? [full] : [];
  });
}

const manifest = {};
for (const file of pictures(UPLOADS)) {
  const rel = path.relative(UPLOADS, file).split(path.sep).join('/');
  const { width, height } = await sharp(file).rotate().metadata();
  // Never larger than the upload itself; a small upload gets one version at its own width.
  const widths = WIDTHS.filter((w) => w < width).concat(width <= WIDTHS.at(-1) ? [width] : []);
  const base = rel.replace(/\.[a-z]+$/i, '');
  for (const w of widths)
    for (const [ext, options] of [
      ['avif', { quality: 55 }],
      ['webp', { quality: 78 }],
    ]) {
      const target = path.join(OUT, `${base}-${w}.${ext}`);
      // A picture that has not changed since its versions were made is skipped.
      if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(file).mtimeMs) continue;
      fs.mkdirSync(path.dirname(target), { recursive: true });
      await sharp(file).rotate().resize({ width: w })[ext](options).toFile(target);
    }
  manifest[`/uploads/${rel}`] = { width, height, widths, base: `/uploads/_fast/${base}` };
}
fs.writeFileSync(
  path.resolve(import.meta.dirname, '../.uploads.json'),
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(`uploads: ${Object.keys(manifest).length} pictures ready`);
