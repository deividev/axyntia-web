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

test('CA-1: cabecera fija, hero, cuatro secciones en orden y pie', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header')).toHaveCSS('position', 'fixed');
  await expect(page.locator('footer')).toHaveCount(1);
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll('main > section')].map((s) => s.id),
  );
  expect(ids).toEqual(['', 'servicios', 'como-trabajamos', 'por-que', 'contacto']);
  await expect(page.locator('main > section').first()).toHaveAttribute('data-hero', '');
});

test('CA-2: el h1 no tiene elementos hijos con otro estilo', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText(
    'Software a medida e IA que trabajan para tu empresa',
  );
  await expect(page.locator('h1 *')).toHaveCount(0);
});

test('CA-3: el hero muestra el subtítulo y los dos botones', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('[data-hero]');
  await expect(
    hero.getByText(
      'Diseñamos CRM visuales en 3D, agentes de IA y automatizaciones que ahorran horas y costes a pymes como la tuya.',
    ),
  ).toBeVisible();
  await expect(hero.getByRole('link', { name: 'Solicita una propuesta' })).toHaveAttribute(
    'href',
    '#contacto',
  );
  await expect(hero.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('CA-5: ninguna etiqueta con prefijo «//» en el texto visible', async ({ page }) => {
  await page.goto('/');
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/(^|\s)\/\/\s/m);
  for (const label of [
    '// Servicios',
    '// Software a medida e IA',
    '// Cómo trabajamos',
    '// Por qué nosotros',
    '// Contacto',
  ]) {
    expect(text).not.toContain(label);
  }
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

test('CA-13: fondo de papel claro y texto en tinta', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(244, 246, 248)');
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(20, 24, 31)');
  await expect(page.locator('h1')).toHaveCSS('color', 'rgb(20, 24, 31)');
});
