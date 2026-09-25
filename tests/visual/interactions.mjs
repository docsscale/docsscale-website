// Behaviour parity: runs the same interaction script against the live build
// (baseline) and the rebuild (candidate), screenshots the resulting state, and
// compares pixels. Form scenarios also compare the exact JSON posted to
// send-lead.php. Exit code 1 on any difference.
//   node tests/visual/interactions.mjs [--only scenario,scenario]
import { chromium } from 'playwright';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { startServer } from './serve.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const only = args.only ? new Set(args.only.split(',')) : null;
const SITES = { baseline: 'reference/live-2026-09-25', candidate: 'web/out' };
const OUT = 'tests/visual/interactions';

const fillMainForm = async (page, scope) => {
  const f = page.locator(scope);
  await f.locator('[name=name]').fill('QA Parity');
  await f.locator('[name=clinicName]').fill('Parity Clinic');
  await f.locator('[name=email]').fill('parity@example.com');
  await f.locator('[name=phone]').fill('+1 713 000 0000');
  await f.locator('[name=specialty]').selectOption('Dental');
  await f.locator('[name=locations]').selectOption('3–5');
  await f.locator('[name=message]').fill('Parity test');
};

// Each scenario: page path, viewport, steps, and what to screenshot.
export const SCENARIOS = [
  {
    name: 'nav-services-dropdown',
    path: '/',
    viewport: { width: 1440, height: 900 },
    steps: async (p) => p.getByRole('button', { name: 'Toggle services menu' }).click(),
    shot: { clip: { x: 0, y: 0, width: 1440, height: 420 } },
  },
  {
    name: 'nav-mobile-menu',
    path: '/',
    viewport: { width: 375, height: 812 },
    steps: async (p) => {
      await p.getByRole('button', { name: 'Menu' }).click();
      await p.getByRole('button', { name: 'Toggle services submenu' }).click();
    },
    shot: { fullViewport: true },
  },
  ...[
    ['Dental', 'dental implants'],
    ['Chiropractic', 'back pain relief'],
    ['Med spa', 'injectables'],
    ['Physical therapy', 'post-op rehab'],
  ].map(([label, proof]) => ({
    name: `home-specialty-${label.toLowerCase().replace(/\s+/g, '-')}`,
    path: '/',
    viewport: { width: 1440, height: 900 },
    steps: async (p) => {
      await p.getByRole('button', { name: label, exact: true }).first().click();
      await p.clock.runFor(2000);
      // proof the click took effect (the hero text changes with the specialty)
      await p.getByText(`new patient inquiries for ${proof}`).waitFor();
    },
    shot: { fullPage: true },
  })),
  ...['Attract', 'Capture', 'Convert', 'Retain'].map((label) => ({
    name: `home-services-filter-${label.toLowerCase()}`,
    path: '/',
    viewport: { width: 1440, height: 900 },
    steps: async (p) => {
      await p.locator('#services').getByRole('button', { name: label, exact: true }).click();
      await p.clock.runFor(1000);
      // proof the filter applied: fewer than all eight cards remain
      const cards = await p.locator('#services [data-lift]').count();
      if (cards >= 8) throw new Error(`filter ${label} did not apply (${cards} cards)`);
    },
    shot: { selector: '#services' },
  })),
  {
    name: 'home-form-success',
    path: '/',
    viewport: { width: 1440, height: 900 },
    steps: async (p) => {
      await fillMainForm(p, '#call form');
      await p.locator('#call button[type=submit]').click();
      await p.locator('#call').getByText('Replies within one business day.').waitFor();
    },
    shot: { selector: '#call' },
    captureLead: true,
  },
  {
    name: 'home-form-error',
    path: '/',
    viewport: { width: 1440, height: 900 },
    leadResponse: { status: 400, body: '{"ok":false,"error":"Please enter a valid email address."}' },
    steps: async (p) => {
      await fillMainForm(p, '#call form');
      await p.locator('#call button[type=submit]').click();
      await p.locator('#call').getByText('Please enter a valid email address.').waitFor();
    },
    shot: { selector: '#call' },
  },
  {
    name: 'book-form-success',
    path: '/book-a-call/',
    viewport: { width: 1440, height: 900 },
    steps: async (p) => {
      await fillMainForm(p, 'form');
      await p.locator('form button[type=submit]').click();
      await p.getByText('Check your inbox for a note from Sam').waitFor();
    },
    shot: { selector: 'form' },
    captureLead: true,
  },
  {
    name: 'book-form-error',
    path: '/book-a-call/',
    viewport: { width: 375, height: 812 },
    leadResponse: { status: 502, body: '{"ok":false,"error":"Something went wrong. Please try again."}' },
    steps: async (p) => {
      await fillMainForm(p, 'form');
      await p.locator('form button[type=submit]').click();
      await p.getByText('Something went wrong. Please try again.').waitFor();
    },
    shot: { selector: 'form' },
  },

  {
    name: 'funnel-lightbox',
    path: '/free-system/',
    viewport: { width: 1440, height: 900 },
    steps: async (p) => {
      await p.locator('.funnel-thumb').first().scrollIntoViewIfNeeded();
      await p.clock.runFor(2500);
      await p.locator('.funnel-thumb').first().click();
      await p.locator('img[alt="Get New Patients"]').nth(1).waitFor();
    },
    shot: { fullViewport: true },
  },
  {
    name: 'funnel-form-success',
    path: '/free-system/',
    viewport: { width: 1440, height: 900 },
    steps: async (p) => {
      const f = p.locator('#form form');
      await f.locator('input[placeholder="Full name"]').fill('QA Parity');
      await f.locator('input[placeholder="Work email"]').fill('parity@example.com');
      await f.locator('input[placeholder="Mobile number"]').fill('+1 713 000 0000');
      await f.locator('input[placeholder="Clinic name"]').fill('Parity Clinic');
      await f.locator('select').selectOption('Dental');
      await f.locator('button[type=submit]').click();
      await p.waitForURL('**/free-system/thank-you/');
      await p.clock.runFor(3000);
    },
    // Screenshot intentionally not compared: after this client-side redirect the
    // live build shows the stale "DELIVERY GRAPHIC" placeholder, the rebuild the
    // same hero image as a direct visit (docs/CONTENT-CHANGES.md, B6). The
    // thank-you page itself is pixel-verified by the visual suite.
    shot: { fullPage: true, skipCompare: true },
    captureLead: true,
  },
  {
    name: 'funnel-form-error',
    path: '/free-system/',
    viewport: { width: 375, height: 812 },
    leadResponse: { status: 400, body: '{"ok":false,"error":"Please enter a valid email address."}' },
    steps: async (p) => {
      const f = p.locator('#form form');
      await f.locator('input[placeholder="Full name"]').fill('QA Parity');
      await f.locator('input[placeholder="Work email"]').fill('parity@example.com');
      await f.locator('button[type=submit]').click();
      await p.getByText('Please enter a valid email address.').waitFor();
    },
    shot: { selector: '#form' },
  },
  {
    name: 'funnel-booked-confirmation',
    path: '/free-system/book-a-call/?booked=1',
    viewport: { width: 768, height: 1024 },
    steps: async (p) => {
      await p.getByText('You are on the calendar.').waitFor();
      await p.clock.runFor(3000);
    },
    shot: { fullPage: true },
  },
  {
    name: 'specialty-nav-mobile',
    path: '/services/dental/',
    viewport: { width: 375, height: 812 },
    steps: async (p) => {
      await p.getByRole('button', { name: 'Menu' }).click();
    },
    shot: { fullViewport: true },
  },
];

async function run(siteKey, scenario, browser) {
  const server = await startServer(SITES[siteKey]);
  const base = `http://127.0.0.1:${server.address().port}`;
  let lead = null;
  server.on('lead', (l) => (lead = l));
  const context = await browser.newContext({ viewport: scenario.viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  if (scenario.leadResponse) {
    await context.route('**/send-lead.php', (r) =>
      r.fulfill({ status: scenario.leadResponse.status, contentType: 'application/json', body: scenario.leadResponse.body }),
    );
  }
  const page = await context.newPage();
  await page.clock.install({ time: new Date('2026-09-25T12:00:00Z') });
  await page.goto(base + scenario.path, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(2000);
  await scenario.steps(page);
  await page.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}[data-lift]{will-change:auto!important}' });
  await page.clock.runFor(500);
  const opts = { animations: 'disabled' };
  let buf;
  if (scenario.shot.selector) buf = await page.locator(scenario.shot.selector).screenshot(opts);
  else if (scenario.shot.clip) buf = await page.screenshot({ ...opts, clip: scenario.shot.clip });
  else buf = await page.screenshot({ ...opts, fullPage: !!scenario.shot.fullPage });
  await context.close();
  server.close();
  return { png: buf, lead: lead ? JSON.parse(lead.body) : null };
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
let failures = 0;
for (const scenario of SCENARIOS) {
  if (only && !only.has(scenario.name)) continue;
  const a = await run('baseline', scenario, browser);
  const b = await run('candidate', scenario, browser);
  const A = PNG.sync.read(a.png), B = PNG.sync.read(b.png);
  let status;
  if (scenario.shot.skipCompare) status = 'identical (screenshot not compared, see scenario)';
  else if (A.width !== B.width || A.height !== B.height) status = `size ${A.width}x${A.height} vs ${B.width}x${B.height}`;
  else {
    const diff = new PNG({ width: A.width, height: A.height });
    const changed = pixelmatch(A.data, B.data, diff.data, A.width, A.height, { threshold: 0, includeAA: true });
    status = changed === 0 ? 'identical' : `${changed} px differ`;
    if (changed) {
      fs.writeFileSync(`${OUT}/${scenario.name}--baseline.png`, a.png);
      fs.writeFileSync(`${OUT}/${scenario.name}--candidate.png`, b.png);
      fs.writeFileSync(`${OUT}/${scenario.name}--diff.png`, PNG.sync.write(diff));
    }
  }
  if (scenario.captureLead) {
    const same = JSON.stringify(a.lead) === JSON.stringify(b.lead);
    status += same ? ' · payload identical' : ` · PAYLOAD DIFFERS ${JSON.stringify(a.lead)} vs ${JSON.stringify(b.lead)}`;
    if (!same || !a.lead) failures++;
  }
  const ok = status.startsWith('identical');
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${scenario.name.padEnd(40)} ${status}`);
}
await browser.close();
process.exit(failures ? 1 : 0);
