import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';
import { buildWhatsAppUrl } from '../../src/lib/whatsapp';

test('CA-10: Servicios tiene 4 tarjetas con título exacto, icono y 3 beneficios', async ({
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
  const cards = page.locator('#servicios article');
  await expect(cards).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await expect(cards.nth(i).locator('svg')).toHaveCount(1);
    await expect(cards.nth(i).locator('ul > li')).toHaveCount(3);
  }
});

test('CA-11: Cómo trabajamos tiene 4 pasos en orden y la línea avanza con el scroll', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#como-trabajamos h3')).toHaveText([
    'Descubrimiento',
    'Diseño y prototipo',
    'Desarrollo por iteraciones',
    'Lanzamiento y mejora continua',
  ]);
  const progress = () =>
    page.evaluate(() => {
      const line = document.querySelector<HTMLElement>('[data-progress-line]');
      return Number(line?.style.getPropertyValue('--progress') || '0');
    });
  await page.evaluate(() => {
    const s = document.getElementById('como-trabajamos')!;
    window.scrollTo({ top: s.offsetTop - window.innerHeight + 1, behavior: 'instant' });
  });
  await expect.poll(progress).toBeLessThan(0.05);
  const start = await progress();
  await page.evaluate(() => {
    const s = document.getElementById('como-trabajamos')!;
    window.scrollTo({
      top: s.offsetTop + s.offsetHeight - window.innerHeight,
      behavior: 'instant',
    });
  });
  await expect.poll(progress).toBeGreaterThan(start + 0.3);
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
