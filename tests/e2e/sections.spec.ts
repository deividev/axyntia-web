import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';
import { buildWhatsAppUrl } from '../../src/lib/whatsapp';

test('CA-10: Servicios tiene 4 líneas de albarán con título exacto, sin icono y con 3 beneficios', async ({
  page,
}) => {
  await page.goto('/');
  const titles = page.locator('#servicios h3');
  await expect(titles).toHaveText([
    'CRM personalizados en 3D',
    'Desarrollo de software a medida',
    'Agentes de IA personalizados',
    'Automatizaciones que reducen gastos en tu empresa',
  ]);
  const rows = page.locator('#servicios [data-ledger-row]');
  await expect(rows).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await expect(rows.nth(i).locator('svg, img')).toHaveCount(0);
    await expect(rows.nth(i).locator('ul > li')).toHaveCount(3);
  }
});

test('CA-11: Cómo trabajamos tiene 4 pasos numerados en orden y sin línea de progreso', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#como-trabajamos h3')).toHaveText([
    'Descubrimiento',
    'Diseño y prototipo',
    'Desarrollo por iteraciones',
    'Lanzamiento y mejora continua',
  ]);
  await expect(page.locator('#como-trabajamos [data-ledger-figure]')).toHaveText([
    '01',
    '02',
    '03',
    '04',
  ]);
  await expect(page.locator('#como-trabajamos [data-progress-line]')).toHaveCount(0);
});

test('CA-12: Por qué nosotros tiene 4 razones y ningún dígito', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#por-que [data-reason]')).toHaveCount(4);
  const text = await page.locator('#por-que').innerText();
  expect(text).not.toMatch(/\d/);
});

test('CA-13: el pie tiene wordmark, enlaces, avisos legales y el año actual', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.getByText('Axyntia').first()).toBeVisible();
  for (const href of ['#servicios', '#como-trabajamos', '#por-que', '#contacto']) {
    await expect(footer.locator(`a[href="${href}"]`)).toHaveCount(1);
  }
  await expect(footer.getByRole('link', { name: 'Aviso legal' })).toHaveAttribute(
    'href',
    '/aviso-legal',
  );
  await expect(footer.getByRole('link', { name: 'Política de privacidad' })).toHaveAttribute(
    'href',
    '/privacidad',
  );
  await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
});

test('CA-28: todos los enlaces de WhatsApp usan la configuración y abren en pestaña nueva', async ({
  page,
}) => {
  await page.goto('/');
  const links = page.locator('a[href*="wa.me"]');
  expect(await links.count()).toBeGreaterThanOrEqual(2);
  const expected = buildWhatsAppUrl(site.whatsappNumber, site.whatsappMessage);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', expected);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('CA-29: Contacto reúne formulario, WhatsApp y el email', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#contacto');
  await expect(section.locator('form')).toHaveCount(1);
  await expect(section.locator('a[href*="wa.me"]:visible').first()).toBeVisible();
  await expect(section.getByRole('link', { name: site.contactEmail })).toHaveAttribute(
    'href',
    `mailto:${site.contactEmail}`,
  );
});

test('las páginas legales cargan con un h1 y marcadores', async ({ page }) => {
  for (const [route, h1] of [
    ['/aviso-legal', 'Aviso legal'],
    ['/privacidad', 'Política de privacidad'],
  ]) {
    await page.goto(route!);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1!);
    await expect(page.getByText('[POR COMPLETAR: NIF]')).toBeVisible();
  }
});
