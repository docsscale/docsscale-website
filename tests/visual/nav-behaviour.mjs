// Behaviour tests for the header dropdowns and the mobile menu (the v1.2 fix for
// the hover bug). Runs against the new build only; screenshots of the same states
// are compared with the approved build by interactions.mjs.
//   node tests/visual/nav-behaviour.mjs
import { chromium } from 'playwright';
import { startServer } from './serve.mjs';

const server = await startServer('web/out');
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
let pass = 0;
let fail = 0;
const expect = (name, got, want) => {
  if (got === want) pass++;
  else {
    fail++;
    console.log(`FAIL ${name}: got [${got}] want [${want}]`);
  }
};
const visible = (page, id) => page.locator(`#${id}`).isVisible();
const newPage = async (options) => {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.goto(base + '/', { waitUntil: 'load' });
  return page;
};

// --- Desktop, mouse
{
  const p = await newPage({ viewport: { width: 1440, height: 900 } });
  const services = p.locator('#nav-links').getByRole('button', { name: 'Services' });
  const box = await services.boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  expect('hover opens Services', await visible(p, 'nav-menu-services'), true);
  // Move straight down into the panel in small steps: must stay open all the way.
  let closedOnTheWay = false;
  for (let y = box.y + box.height / 2; y <= box.y + box.height + 60; y += 4) {
    await p.mouse.move(box.x + box.width / 2, y);
    if (!(await visible(p, 'nav-menu-services'))) closedOnTheWay = true;
  }
  expect('no hover gap between trigger and panel', closedOnTheWay, false);
  await p.mouse.move(box.x + box.width / 2, 700);
  await p.waitForTimeout(300);
  expect('leaving closes after the delay', await visible(p, 'nav-menu-services'), false);

  await services.hover();
  await services.click();
  expect('click after hover keeps it open', await visible(p, 'nav-menu-services'), true);
  await services.click();
  expect('second click closes', await visible(p, 'nav-menu-services'), false);

  await services.click();
  await p.locator('#nav-links').getByRole('button', { name: 'Industries' }).click();
  expect('only one open: Services closed', await visible(p, 'nav-menu-services'), false);
  expect('only one open: Industries open', await visible(p, 'nav-menu-industries'), true);
  await p.mouse.click(100, 700);
  expect('outside click closes', await visible(p, 'nav-menu-industries'), false);

  expect('Services menu: 7 services + All services', await p.locator('#nav-menu-services a').count(), 8);
  expect('Industries menu: 4 industries + All industries', await p.locator('#nav-menu-industries a').count(), 5);
  expect(
    'industry links point at /industries/',
    await p.locator('#nav-menu-industries a').first().getAttribute('href'),
    '/industries/dental/',
  );
}

// --- Desktop, keyboard
{
  const p = await newPage({ viewport: { width: 1440, height: 900 } });
  const services = p.locator('#nav-links').getByRole('button', { name: 'Services' });
  await services.focus();
  await p.keyboard.press('Enter');
  expect('Enter opens', await services.getAttribute('aria-expanded'), 'true');
  await p.keyboard.press('Tab');
  expect(
    'Tab moves into the panel',
    await p.evaluate(() => document.activeElement.closest('#nav-menu-services') !== null),
    true,
  );
  await p.keyboard.press('Escape');
  expect('Escape closes', await visible(p, 'nav-menu-services'), false);
  expect('Escape returns focus to the trigger', await p.evaluate(() => document.activeElement.textContent), 'Services▾');
  await p.keyboard.press('Enter');
  for (let i = 0; i < 9; i++) await p.keyboard.press('Tab'); // 8 links, then out
  expect('focus leaving closes it', await visible(p, 'nav-menu-services'), false);
}

// --- Touch (tablet width, desktop nav)
{
  const p = await newPage({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true });
  const services = p.locator('#nav-links').getByRole('button', { name: 'Services' });
  await services.tap();
  await p.waitForTimeout(400);
  expect('tap opens and it stays open', await visible(p, 'nav-menu-services'), true);
  await services.tap();
  expect('second tap closes', await visible(p, 'nav-menu-services'), false);
}

// --- Fits at the narrowest desktop width (just above the 900px burger breakpoint)
for (const width of [901, 960, 1024]) {
  const p = await newPage({ viewport: { width, height: 800 } });
  const links = await p.locator('#nav-links').boundingBox();
  const cta = await p.locator('#nav-cta').boundingBox();
  const logo = await p.locator('#nav-links').evaluate((el) => el.previousElementSibling.getBoundingClientRect().right);
  expect(`fits at ${width}px`, links.x >= logo && links.x + links.width <= cta.x, true);
}

// --- Mobile menu
{
  const p = await newPage({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  const burger = p.getByRole('button', { name: 'Menu' });
  await burger.tap();
  expect('burger opens the menu', await visible(p, 'nav-mobile'), true);
  expect('page scroll locked', await p.evaluate(() => document.body.style.overflow), 'hidden');
  await p.locator('#nav-mobile').getByRole('button', { name: 'Industries' }).tap();
  expect('Industries accordion opens', await visible(p, 'nav-mobile-industries'), true);
  const targets = await p.locator('#nav-mobile a, #nav-mobile button').evaluateAll((els) =>
    els.filter((el) => el.offsetParent).map((el) => el.getBoundingClientRect().height),
  );
  expect('tap targets at least 44px', Math.min(...targets) >= 44, true);
  await burger.focus();
  await p.keyboard.press('Shift+Tab');
  expect(
    'Shift+Tab from the burger wraps to the last menu link',
    await p.evaluate(() => document.activeElement.textContent),
    'Book a strategy call',
  );
  await p.keyboard.press('Escape');
  expect('Escape closes', await visible(p, 'nav-mobile'), false);
  expect('scroll unlocked', await p.evaluate(() => document.body.style.overflow), '');
  await burger.tap();
  expect('the open accordion is remembered', await visible(p, 'nav-mobile-industries'), true);
  await p.locator('#nav-mobile-industries').getByRole('link', { name: 'Dental' }).tap();
  await p.waitForURL('**/industries/dental/');
  expect('navigating closes the menu', await visible(p, 'nav-mobile'), false);
}

await browser.close();
server.close();
console.log(`nav behaviour: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
