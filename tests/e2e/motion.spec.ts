import { expect, test } from '@playwright/test';

test('CA-11: no hay línea de progreso, apariciones ni brillo de tarjetas', async ({ page }) => {
  await page.goto('/');
  for (const selector of ['[data-progress-line]', '[data-reveal]', '[data-card]']) {
    await expect(page.locator(selector), selector).toHaveCount(0);
  }
});

test('CA-25: con movimiento reducido no hay transiciones ni animaciones y todo es visible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('button[aria-controls="site-nav"]').click();
  await expect(page.locator('#site-nav')).toBeVisible();

  const longest = await page.evaluate(() => {
    const max = (value: string) => Math.max(...value.split(',').map((v) => parseFloat(v) || 0));
    let worst = 0;
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      worst = Math.max(worst, max(cs.transitionDuration), max(cs.animationDuration));
    }
    return worst;
  });
  expect(longest).toBe(0);

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('main section')]
      .map((el) => ({ id: el.id, opacity: getComputedStyle(el).opacity }))
      .filter((s) => s.opacity !== '1'),
  );
  expect(hidden).toEqual([]);
});

test('la pulsación de un botón no escala con movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const button = page.getByRole('link', { name: 'Solicita una propuesta' });
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(button).toHaveCSS('transform', 'none');
  await page.mouse.up();
});

test('CA-26: sin preferencia de movimiento no hay animaciones en curso ni infinitas', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.waitForTimeout(1000);
  const state = await page.evaluate(() => ({
    running: document.getAnimations().filter((a) => a.playState === 'running').length,
    infinite: [...document.querySelectorAll('*')].filter(
      (el) => getComputedStyle(el).animationIterationCount === 'infinite',
    ).length,
  }));
  expect(state).toEqual({ running: 0, infinite: 0 });
});
