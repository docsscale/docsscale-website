// Compares candidate screenshots against the baseline, pixel by pixel.
//   node tests/visual/compare.mjs [--baseline dir] [--candidate dir] [--only name,name]
// Writes diff images to tests/visual/diff/ and a summary to
// tests/visual/diff/report.json. Exit code 1 if any page differs.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const baselineDir = args.baseline ?? 'tests/visual/baseline';
const candidateDir = args.candidate ?? 'tests/visual/candidate';
const diffDir = 'tests/visual/diff';
const only = args.only ? new Set(args.only.split(',')) : null;
fs.mkdirSync(diffDir, { recursive: true });

const results = [];
for (const file of fs.readdirSync(baselineDir).filter((f) => f.endsWith('.png')).sort()) {
  const route = file.split('--')[0];
  if (only && !only.has(route)) continue;
  const candidatePath = path.join(candidateDir, file);
  if (!fs.existsSync(candidatePath)) {
    results.push({ file, status: 'missing' });
    continue;
  }
  const a = PNG.sync.read(fs.readFileSync(path.join(baselineDir, file)));
  const b = PNG.sync.read(fs.readFileSync(candidatePath));
  if (a.width !== b.width || a.height !== b.height) {
    results.push({ file, status: 'size-mismatch', baseline: `${a.width}x${a.height}`, candidate: `${b.width}x${b.height}` });
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  // threshold 0 + includeAA: any changed pixel counts, anti-aliasing included.
  const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0, includeAA: true });
  if (changed > 0) fs.writeFileSync(path.join(diffDir, file), PNG.sync.write(diff));
  results.push({ file, status: changed === 0 ? 'identical' : 'different', changedPixels: changed, size: `${a.width}x${a.height}` });
}

fs.writeFileSync(path.join(diffDir, 'report.json'), JSON.stringify(results, null, 2));
const bad = results.filter((r) => r.status !== 'identical');
for (const r of results) {
  const mark = r.status === 'identical' ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${r.file.padEnd(44)} ${r.status}${r.changedPixels ? ` (${r.changedPixels} px)` : ''}${r.baseline ? ` ${r.baseline} vs ${r.candidate}` : ''}`);
}
console.log(`\n${results.length - bad.length}/${results.length} identical`);
process.exit(bad.length ? 1 : 0);
