import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.PROTOTYPE_URL ?? 'http://127.0.0.1:4321';
const output = path.resolve(process.argv[2] ?? 'screenshots');
await mkdir(output, { recursive: true });
const fixture = JSON.parse(await readFile(new URL('../src/data/menu-snapshot.json', import.meta.url), 'utf8'));
const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
const results = { engine: browser.version(), viewportHeight: 812, deviceScaleFactor: 2, snapshots: [], interactionChecks: [], consoleErrors: [], externalRequests: [] };
function passed(name) { results.interactionChecks.push(name); }
async function geometry(page) {
  return page.evaluate(() => {
    const panel = document.querySelector('[data-panel]:not([hidden])');
    const sections = [...panel.querySelectorAll('.mess')];
    const items = [...panel.querySelectorAll('.dishes:not([hidden]) li')];
    return {
      viewportWidth: innerWidth,
      pageHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      firstDishTop: items[0]?.getBoundingClientRect().top,
      fullyVisibleDishes: items.filter(x => { const r = x.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }).length,
      sections: sections.map(x => ({ mess: x.dataset.mess, top: x.getBoundingClientRect().top })),
      menuColumnWidth: panel.querySelector('.dishes')?.getBoundingClientRect().width,
      stickyHeight: document.querySelector('.meal-bar').getBoundingClientRect().height,
      nestedScrollContainers: [...document.querySelectorAll('body *')].filter(x => { const s = getComputedStyle(x); return ['auto','scroll'].includes(s.overflowY) && x.scrollHeight > x.clientHeight + 1; }).map(x => x.className),
      bodyFont: getComputedStyle(items[0]).fontFamily,
      bodySize: getComputedStyle(items[0]).fontSize,
      fontLoaded: document.fonts.check('400 16px "IBM Plex Sans"'),
      interactiveTargets: [...document.querySelectorAll('.meal-switch a,.mess-jumps a')].map(x => ({ text: x.textContent.trim(), height: x.getBoundingClientRect().height })),
    };
  });
}
try {
  for (const width of [320, 375, 430]) {
    const context = await browser.newContext({
      viewport: { width, height: 812 }, deviceScaleFactor: 2,
      isMobile: true, hasTouch: true, colorScheme: 'light',
      userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',
    });
    const page = await context.newPage();
    page.on('pageerror', error => results.consoleErrors.push(error.message));
    page.on('request', request => { if (!request.url().startsWith(baseURL)) results.externalRequests.push(request.url()); });
    for (const meal of ['lunch', 'dinner']) {
      await page.goto(baseURL + '/' + meal + '/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole('tab', { name: meal === 'lunch' ? 'Lunch' : 'Dinner', exact: true })).toHaveAttribute('aria-selected', 'true');
      const panel = page.locator('[data-panel="' + meal + '"]');
      await expect(panel.locator('.mess h2')).toHaveText(['FC1', 'FC2', 'Sindhi']);
      for (const mess of ['fc1', 'fc2', 'sindhi']) {
        await expect(panel.locator('[data-mess="' + mess + '"] .dishes li')).toHaveText(fixture[mess].meals[meal].items);
      }
      const metrics = await geometry(page);
      expect(metrics.horizontalOverflow).toBe(false);
      expect(metrics.nestedScrollContainers).toEqual([]);
      expect(metrics.fontLoaded).toBe(true);
      expect(metrics.interactiveTargets.every(x => x.height >= 44)).toBe(true);
      const filename = meal + '-full-' + width + '.png';
      await page.screenshot({ path: path.join(output, filename), fullPage: true });
      if (width === 375) await page.screenshot({ path: path.join(output, meal + '-viewport-375.png'), fullPage: false });
      results.snapshots.push({ file: filename, meal, ...metrics });
      // The skip link must be safe beneath the sticky meal strip too.
      await page.getByRole('link', { name: 'Skip to menus', exact: true }).focus();
      await page.keyboard.press('Enter');
      const firstHeading = await panel.locator('h2').first().boundingBox();
      const mealStrip = await page.locator('.meal-bar').boundingBox();
      expect(firstHeading.y).toBeGreaterThanOrEqual(mealStrip.y + mealStrip.height);
      passed('Keyboard skip link clears sticky switcher: ' + meal + ' at ' + width + 'px.');
    }
    if (width === 375) {
      await page.goto(baseURL + '/lunch/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.getByRole('link', { name: 'Sindhi', exact: true }).tap();
      const anchor = await page.locator('#lunch-sindhi').boundingBox();
      const sticky = await page.locator('.meal-bar').boundingBox();
      expect(anchor.y).toBeGreaterThanOrEqual(sticky.y + sticky.height);
      expect(sticky.y).toBeCloseTo(0, 0);
      await page.screenshot({ path: path.join(output, 'sticky-375.png') });
      await page.getByRole('tab', { name: 'Dinner', exact: true }).tap();
      expect(await page.evaluate(() => scrollY)).toBe(0);
      await expect(page.locator('#panel-dinner')).toBeVisible();
      await expect(page.locator('#dinner-sindhi .dishes')).toContainText('Gobi Manchurian');
      await expect(page.locator('#dinner-sindhi .dishes')).not.toContainText('Paneer Butter masala');
      passed('Jump links keep menus open and clear the sticky bar; switching from Sindhi returns to the start.');
      await page.getByRole('tab', { name: 'Dinner', exact: true }).focus();
      await page.keyboard.press('ArrowLeft');
      await expect(page.getByRole('tab', { name: 'Lunch', exact: true })).toBeFocused();
      await expect(page.locator('#panel-lunch')).toBeVisible();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#panel-dinner')).toBeVisible();
      passed('Shared meal tabs support keyboard arrows, focus, and selection.');
      await page.goto(baseURL + '/lunch/?scenario=mixed', { waitUntil: 'networkidle' });
      await expect(page.locator('#lunch-fc1 .source-warning')).toBeVisible();
      await expect(page.locator('#lunch-fc1 .dishes li')).toHaveCount(10);
      await expect(page.locator('#lunch-fc2 .unavailable')).toBeVisible();
      await expect(page.locator('#lunch-fc2 .dishes')).toBeHidden();
      await expect(page.locator('#lunch-sindhi .dishes li')).toHaveCount(6);
      await page.screenshot({ path: path.join(output, 'mixed-full-375.png'), fullPage: true });
      await page.screenshot({ path: path.join(output, 'mixed-viewport-375.png') });
      await page.getByRole('link', { name: 'Skip to menus', exact: true }).focus();
      await page.keyboard.press('Enter');
      const mixedHeading = await page.locator('#lunch-fc1 h2').boundingBox();
      const mixedStrip = await page.locator('.meal-bar').boundingBox();
      expect(mixedHeading.y).toBeGreaterThanOrEqual(mixedStrip.y + mixedStrip.height);
      passed('Keyboard skip link clears the sticky bar in the mixed failure state.');
      await page.getByRole('link', { name: 'Sindhi', exact: true }).tap();
      await page.getByRole('tab', { name: 'Dinner', exact: true }).tap();
      expect(await page.evaluate(() => scrollY)).toBe(0);
      await expect(page.locator('#dinner-fc2 .unavailable')).toBeVisible();
      await expect(page.locator('#dinner-fc1 .dishes li')).toHaveCount(9);
      await expect(page.locator('#dinner-sindhi .dishes li')).toHaveCount(6);
      await page.goBack();
      await expect(page.locator('#panel-lunch')).toBeVisible();
      passed('FC1 cached and FC2 missing states stay independent, persist between meals, and survive browser Back.');
    }
    await page.goto(baseURL + '/lunch/', { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: ':root{font-size:200%}' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    passed('200% text at ' + width + 'px has no horizontal overflow.');
    await context.close();
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const fallback = await noJS.newPage();
  await fallback.goto(baseURL + '/lunch/');
  await fallback.getByRole('tab', { name: 'Dinner', exact: true }).click();
  await expect(fallback.locator('#panel-dinner')).toBeVisible();
  await expect(fallback.locator('#panel-dinner .mess h2')).toHaveText(['FC1', 'FC2', 'Sindhi']);
  passed('Without JavaScript, the real meal links navigate to complete static meal pages.');
  await noJS.close();
  expect(results.consoleErrors).toEqual([]);
  expect(results.externalRequests).toEqual([]);
  passed('No page exceptions or external data/font requests during capture.');
  await writeFile(path.join(output, 'verification.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}

