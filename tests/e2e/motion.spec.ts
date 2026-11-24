import { expect, test, type Page } from '@playwright/test';

const menuButton = (page: Page) => page.locator('button[aria-controls="site-nav"]');
const transitions = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const cs = getComputedStyle(document.querySelector(sel)!);
    return {
      property: cs.transitionProperty,
      durations: cs.transitionDuration.split(',').map((d) => parseFloat(d)),
      animation: cs.animationName,
    };
  }, selector);

test('CA-14: con movimiento reducido el menú y los botones no tienen transiciones ni animaciones', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const nav = page.locator('#site-nav');

  expect((await transitions(page, '#site-nav')).durations.every((d) => d === 0)).toBe(true);
  await menuButton(page).click();
  await expect(nav).toBeVisible();
  // Sin transición: el menú abierto ya está opaco y en su sitio en el primer fotograma.
  const open = await nav.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { opacity: cs.opacity, transform: cs.transform };
  });
  expect(open.opacity).toBe('1');
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(open.transform);
  expect((await transitions(page, '#site-nav')).durations.every((d) => d === 0)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();

  const btn = await transitions(page, '[data-hero] .btn-primary');
  expect(btn.durations.every((d) => d === 0)).toBe(true);
  expect(btn.animation).toBe('none');
  const cta = page.getByRole('link', { name: 'Solicita una propuesta' });
  await cta.hover();
  await page.mouse.down();
  expect(await cta.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  await page.mouse.up();
});

test('CA-14: con y sin movimiento reducido el contenido es el mismo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const normal = await page.locator('main').innerText();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('main').innerText()).toBe(normal);
});

test('sin movimiento reducido solo se animan transform y opacity, en menos de 300 ms', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await menuButton(page).click();
  const nav = await transitions(page, '#site-nav');
  expect(nav.property.split(',').map((p) => p.trim())).toEqual(['opacity', 'transform']);
  expect(nav.durations.every((d) => d > 0 && d < 0.3)).toBe(true);
  const btn = await transitions(page, '[data-hero] .btn-primary');
  expect(btn.property).toBe('transform');
  expect(btn.durations.every((d) => d < 0.3)).toBe(true);
});

test('el hero no tiene canvas, las secciones no se animan al entrar y no hay scroll suave', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
  for (const id of ['#servicios', '#como-trabajamos', '#por-que', '#contacto']) {
    await expect(page.locator(id)).toHaveCSS('opacity', '1');
    await expect(page.locator(id)).toHaveCSS('transform', 'none');
  }
  const animated = await page.evaluate(() => document.getAnimations().length);
  expect(animated).toBe(0);
});
