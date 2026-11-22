import { expect, test, type Page } from '@playwright/test';

const snapshot = (page: Page) =>
  page.evaluate(
    () => document.querySelector<HTMLCanvasElement>('[data-hero-canvas]')?.toDataURL() ?? '',
  );

test('CA-30: con movimiento reducido el hero no se anima y todo es visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(1000);
  const a = await snapshot(page);
  await page.waitForTimeout(500);
  expect(await snapshot(page)).toBe(a);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
      .map((el) => {
        const cs = getComputedStyle(el);
        return { id: el.id, opacity: cs.opacity, transform: cs.transform };
      })
      .filter(
        (s) =>
          s.opacity !== '1' ||
          !(s.transform === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(s.transform)),
      ),
  );
  expect(hidden).toEqual([]);
});

test('CA-31: sin movimiento reducido el canvas del hero se anima', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const canvas = page.locator('canvas[data-hero-canvas]');
  await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  await page.waitForTimeout(500);
  const a = await snapshot(page);
  await page.waitForTimeout(500);
  const b = await snapshot(page);
  expect(a).not.toBe('');
  expect(b).not.toBe(a);
});

test('las secciones aparecen al hacer scroll sin movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('#por-que').scrollIntoViewIfNeeded();
  await expect(page.locator('#por-que')).toHaveClass(/is-visible/);
  await expect(page.locator('#por-que')).toHaveCSS('opacity', '1');
});
