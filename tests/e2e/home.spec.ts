import { expect, test } from '@playwright/test';

test('la página de inicio carga con su título y su h1', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('Axyntia · Software a medida e IA para pymes');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Software a medida e IA que trabajan para tu empresa',
  );
});

test('a 360 px de ancho no hay scroll horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test('Tailwind aplica el fondo papel y el color del texto', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(244, 246, 248)');
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(20, 24, 31)');
});
