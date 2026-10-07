// Performance budget for the built site (web/out). A lab test on a simulated
// phone (Lighthouse's mobile settings: slow 4G, 4x slower processor), not real
// visitors; real-user numbers are in GA4 (docs/TRACKING.md).
//   node tests/performance/budget.mjs                    test every page
//   node tests/performance/budget.mjs --record <file>    rewrite the "today" record from a results file
//
// Two rules (docs/COMPLETION-PLAN.md, section 5, item 11; limits in budget.json):
// - A page listed under "baseline" is held to "no worse than today": its
//   recorded numbers plus the allowance.
// - Any other page is new and must meet "target". So a new template (blog,
//   service pages) is held to the target simply by not being in the record.
//
// The record is machine-dependent: take it from a CI run (the "performance-results"
// file the job uploads), never from a laptop. Re-recording loosens or tightens
// the budget, so it is its own reviewed change.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { startServer } from '../visual/serve.mjs';

const OUT = 'web/out';
const BUDGET_FILE = path.join(import.meta.dirname, 'budget.json');
const RESULTS_FILE = path.join(import.meta.dirname, 'results.json');
const budget = JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8'));

const recordFrom = process.argv.includes('--record') && process.argv[process.argv.indexOf('--record') + 1];
if (recordFrom) {
  const results = JSON.parse(fs.readFileSync(recordFrom, 'utf8'));
  budget.baseline = Object.fromEntries(
    results.pages.map(({ page, score, lcp, cls, bytes }) => [page, { score, lcp, cls, bytes }]),
  );
  budget.recorded = results.date;
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(budget, null, 2) + '\n');
  console.log(`Recorded ${results.pages.length} pages from ${recordFrom} into budget.json`);
  process.exit(0);
}

// Every page in the build is tested, so a new page can't be left out.
// Next.js writes 404 and _not-found for its own use; they are not pages.
function builtPages(dir = OUT) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return ['_next', '404', '_not-found'].includes(entry.name) ? [] : builtPages(full);
    if (entry.name !== 'index.html') return [];
    const rel = path.relative(OUT, dir).split(path.sep).join('/');
    return [rel ? `/${rel}/` : '/'];
  });
}


const server = await startServer(OUT);
const base = `http://127.0.0.1:${server.address().port}`;
const port = 9333;
// Only this build is measured: every other host is unreachable, so a slow or
// changed outside service can't fail the test. The one page this affects is
// /free-system/book-a-call/, whose embedded booking calendar is not counted.
const browser = await chromium.launch({
  args: [`--remote-debugging-port=${port}`, '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'],
});

const pages = [];
const failures = [];
for (const page of builtPages().sort()) {
  const runs = [];
  for (let i = 0; i < budget.runs; i++) {
    const { lhr } = await lighthouse(base + page, { port, onlyCategories: ['performance'], logLevel: 'error' });
    const audit = (id) => lhr.audits[id].numericValue;
    runs.push({
      score: Math.round(lhr.categories.performance.score * 100),
      lcp: Math.round(audit('largest-contentful-paint')),
      cls: Math.round(audit('cumulative-layout-shift') * 1000) / 1000,
      bytes: audit('total-byte-weight'),
    });
  }
  // The best run of each number. Noise only ever makes a run slower, and some
  // pages (the industry pages) flip between two paint times from run to run,
  // about 2.7 and 3.3 seconds, on an unchanged build (8 result sets, 7 Oct 2026).
  // A real slowdown shifts every run, so it still fails.
  const best = { score: Math.max, lcp: Math.min, cls: Math.min, bytes: Math.min };
  const got = Object.fromEntries(Object.entries(best).map(([key, pick]) => [key, pick(...runs.map((r) => r[key]))]));
  pages.push({ page, ...got, runs });

  const today = budget.baseline[page];
  const { allowance, target } = budget;
  const limit = today
    ? {
        score: today.score - allowance.score,
        lcp: Math.round(today.lcp * (1 + allowance.lcpPercent / 100)),
        cls: Math.round((today.cls + allowance.cls) * 1000) / 1000,
        bytes: Math.round(today.bytes * (1 + allowance.bytesPercent / 100)),
      }
    : target;
  const rule = today ? 'no worse than today' : 'target for new pages';
  const kb = (n) => `${Math.round(n / 1024)} KB`;
  const over = [];
  if (got.score < limit.score) over.push(`score ${got.score}, must be at least ${limit.score}`);
  if (got.lcp > limit.lcp) over.push(`main content painted at ${got.lcp} ms, limit ${limit.lcp} ms`);
  if (got.cls > limit.cls) over.push(`layout shift ${got.cls}, limit ${limit.cls}`);
  // The weight limit for new pages is set from the first real posts (null until then).
  if (limit.bytes != null && got.bytes > limit.bytes)
    over.push(`page weight ${kb(got.bytes)}, limit ${kb(limit.bytes)}`);
  for (const message of over) failures.push(`${page}  ${message} (${rule})`);
  console.log(
    `${over.length ? 'FAIL' : 'ok  '} ${page.padEnd(34)} score ${String(got.score).padStart(3)}  LCP ${String(got.lcp).padStart(5)} ms  CLS ${got.cls.toFixed(3)}  ${kb(got.bytes).padStart(7)}  (${rule})`,
  );
}

await browser.close();
server.close();

fs.writeFileSync(RESULTS_FILE, JSON.stringify({ date: new Date().toISOString().slice(0, 10), pages }, null, 2) + '\n');
for (const page of Object.keys(budget.baseline))
  if (!pages.some((p) => p.page === page)) console.log(`note: ${page} is in budget.json but no longer in the build`);
if (failures.length) {
  console.log(`\n${failures.length} over budget:`);
  for (const failure of failures) console.log(`  ${failure}`);
}
console.log(`\nperformance budget: ${pages.length} pages, ${failures.length} over budget`);
process.exit(failures.length ? 1 : 0);
