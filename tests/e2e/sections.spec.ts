import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';
import { SERVICES } from '../../src/lib/services';
import { buildWhatsAppUrl } from '../../src/lib/whatsapp';

test('CA-6: Servicios tiene 4 filas de albarán con título, número, descripción y 3 beneficios', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#servicios h3')).toHaveText(SERVICES.map((s) => s.title));
  const rows = page.locator('#servicios [data-service-row]');
  await expect(rows).toHaveCount(4);
  for (const [i, service] of SERVICES.entries()) {
    const row = rows.nth(i);
    await expect(row.locator('[data-line-number]')).toHaveText(new RegExp(`${i + 1}$`));
    await expect(row).toContainText(service.description);
    await expect(row.locator('ul > li')).toHaveCount(3);
    for (const [j, benefit] of service.benefits.entries()) {
      await expect(row.locator('ul > li').nth(j)).toContainText(benefit);
    }
  }
});

test('CA-7: las filas de servicios no tienen icono, sombra ni caja redondeada', async ({
  page,
}) => {
  await page.goto('/');
  const rows = page.locator('#servicios [data-service-row]');
  for (let i = 0; i < 4; i++) {
    const row = rows.nth(i);
    await expect(row.locator('svg')).toHaveCount(0);
    await expect(row).toHaveCSS('box-shadow', 'none');
    await expect(row).toHaveCSS('border-radius', '0px');
  }
});

test('CA-8: el número de línea usa serif del sistema con cifras de ancho fijo', async ({
  page,
}) => {
  await page.goto('/');
  const number = page.locator('#servicios [data-line-number]').first();
  const family = await number.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toMatch(/^(ui-serif|Georgia)/);
  const numeric = await number.evaluate((el) => getComputedStyle(el).fontVariantNumeric);
  expect(numeric).toContain('tabular-nums');
});

test('CA-9: a 390 px las columnas de una fila se apilan con su rótulo visible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const row = page.locator('#servicios [data-service-row]').first();
  await expect(row.getByText('Qué resuelve', { exact: true })).toBeVisible();
  await expect(row.getByText('Qué consigues', { exact: true })).toBeVisible();
  const cells = await row.locator(':scope > div').evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom };
    }),
  );
  expect(cells).toHaveLength(3);
  cells.slice(1).forEach((c, i) => {
    expect(c.top).toBeGreaterThanOrEqual(cells[i]!.bottom - 1);
  });
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
});

test('un título largo se parte a 768 px sin desbordar su celda', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  const title = page.locator('#servicios h3').last();
  const fits = await title.evaluate((el) => el.scrollWidth <= el.clientWidth);
  expect(fits).toBe(true);
  const overflowing = await page.evaluate(
    () =>
      [...document.querySelectorAll('#servicios *')].filter(
        (el) => el.getBoundingClientRect().right > window.innerWidth,
      ).length,
  );
  expect(overflowing).toBe(0);
});

test('CA-10: Cómo trabajamos tiene 4 pasos en orden con su número visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#como-trabajamos h3')).toHaveText([
    'Descubrimiento',
    'Diseño y prototipo',
    'Desarrollo por iteraciones',
    'Lanzamiento y mejora continua',
  ]);
  const numbers = page.locator('#como-trabajamos [data-step-number]');
  await expect(numbers).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await expect(numbers.nth(i)).toBeVisible();
    await expect(numbers.nth(i)).toHaveText(new RegExp(`${i + 1}$`));
  }
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
