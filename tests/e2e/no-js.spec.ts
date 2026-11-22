import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';

test.use({ javaScriptEnabled: false });

test('CA-27: sin JavaScript hay aviso con email y WhatsApp, y el formulario no envía', async ({
  page,
}) => {
  const requests: { method: string; url: string }[] = [];
  page.on('request', (r) => requests.push({ method: r.method(), url: r.url() }));
  await page.goto('/');
  const contact = page.locator('#contacto');
  await expect(contact.locator(`a[href="mailto:${site.contactEmail}"]`).first()).toBeVisible();
  await expect(contact.locator('a[href*="wa.me"]').first()).toBeVisible();
  // El aviso es un <p> dentro de <noscript>; el motor de texto de Playwright lo ignora, así que se
  // comprueba su visibilidad con el enlace que contiene.
  await expect(contact.locator('noscript p a').first()).toBeVisible();

  const button = contact.locator('button[type="submit"]');
  await expect(button).toBeDisabled();
  await button.click({ force: true });
  await contact.locator('#nombre').fill('Ana');
  await contact.locator('#nombre').press('Enter');
  await page.waitForTimeout(300);
  expect(new URL(page.url()).pathname).toBe('/');
  expect(new URL(page.url()).search).toBe('');
  expect(requests.filter((r) => r.method === 'POST')).toEqual([]);
});
