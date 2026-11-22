import { expect, test, type Page } from '@playwright/test';
import { site } from '../../src/config/site';

// El identificador `xtest000` es ficticio y solo vive en este test: src/config/site.ts mantiene
// `formEndpoint: ''`. Se inyecta en el atributo data-endpoint del formulario.
const FAKE_ENDPOINT = 'https://formspree.io/f/xtest000';

async function fillValid(page: Page, overrides: { email?: string; mensaje?: string } = {}) {
  await page.getByLabel('Nombre', { exact: true }).fill('Ana Pérez');
  await page.getByLabel('Email', { exact: true }).fill(overrides.email ?? 'ana@empresa.es');
  await page.getByLabel(/^Empresa/).fill('ACME');
  await page.getByLabel('Servicio de interés').selectOption('agentes-ia');
  await page
    .getByLabel('Mensaje', { exact: true })
    .fill(overrides.mensaje ?? 'Necesito un agente de IA');
  await page.getByLabel(/política de privacidad/).check();
}

async function watchMailto(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __mailto: string[] };
    w.__mailto = [];
    document
      .getElementById('contact-form')!
      .addEventListener('contactform:mailto', (e) =>
        w.__mailto.push((e as CustomEvent<{ url: string }>).detail.url),
      );
  });
  return () => page.evaluate(() => (window as unknown as { __mailto: string[] }).__mailto);
}

const useEndpoint = (page: Page) =>
  page.evaluate(
    (url) => document.getElementById('contact-form')!.setAttribute('data-endpoint', url),
    FAKE_ENDPOINT,
  );

const submit = (page: Page) => page.getByRole('button', { name: /Enviar mensaje|Enviando/ });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(submit(page)).toBeEnabled();
});

test('CA-16: el formulario tiene todos sus campos con etiqueta', async ({ page }) => {
  await expect(page.getByLabel('Nombre', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
  await expect(page.getByLabel(/^Empresa/)).toBeVisible();
  await expect(page.getByLabel('Mensaje', { exact: true })).toBeVisible();
  const options = page.getByLabel('Servicio de interés').locator('option');
  await expect(options).toHaveText([
    'Elige un servicio',
    'CRM personalizados en 3D',
    'Desarrollo de software a medida',
    'Agentes de IA personalizados',
    'Automatizaciones que reducen gastos en tu empresa',
    'Otro',
  ]);
  const check = page.getByLabel(/política de privacidad/);
  await expect(check).toBeVisible();
  await expect(page.locator('label[for="privacidad"] a')).toHaveAttribute('href', '/privacidad');
});

test('CA-17: enviar vacío no envía nada y anuncia los errores', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  const mailto = await watchMailto(page);
  await submit(page).click();
  for (const id of ['nombre', 'email', 'mensaje', 'privacidad']) {
    const field = page.locator(`#${id}`);
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAttribute('aria-describedby', `${id}-error`);
    await expect(page.locator(`#${id}-error`)).not.toBeEmpty();
  }
  await expect(page.locator('#contact-summary')).toHaveAttribute('aria-live', 'assertive');
  await expect(page.locator('#contact-summary li')).toHaveCount(4);
  expect(await mailto()).toEqual([]);
  expect(requests.filter((u) => u.includes('formspree'))).toEqual([]);
  expect(page.url()).not.toContain('mailto');
});

test('CA-18: un email inválido solo marca el campo Email', async ({ page }) => {
  await fillValid(page, { email: 'juan@' });
  await submit(page).click();
  await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#email-error')).toContainText('email');
  for (const id of ['nombre', 'mensaje', 'privacidad']) {
    await expect(page.locator(`#${id}`)).not.toHaveAttribute('aria-invalid', 'true');
  }
});

test('corregir el email quita el error al salir del campo', async ({ page }) => {
  await fillValid(page, { email: 'juan@' });
  await submit(page).click();
  await page.locator('#email').fill('juan@empresa.es');
  await page.locator('#email').blur();
  await expect(page.locator('#email')).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#email-error')).toBeEmpty();
  await expect(page.locator('#contact-summary li')).toHaveCount(0);
});

test('CA-21: con el honeypot relleno no se envía nada ni se explica', async ({ page }) => {
  await useEndpoint(page);
  const posts: string[] = [];
  page.on('request', (r) => r.method() === 'POST' && posts.push(r.url()));
  const mailto = await watchMailto(page);
  await fillValid(page);
  await page.locator('#gotcha').fill('soy un bot', { force: true });
  await submit(page).click();
  await expect(submit(page)).toBeEnabled();
  await expect(page.locator('#contact-status')).toBeEmpty();
  await page.waitForLoadState('networkidle');
  expect(posts).toEqual([]);
  expect(await mailto()).toEqual([]);
  const feedback = `${await page.locator('#contact-status').innerText()} ${await page.locator('#contact-summary').innerText()}`;
  expect(feedback).not.toMatch(/spam|oculto|bot|honeypot/i);
});

test('CA-23: con Formspree muestra «Enviando…», un solo POST y éxito con el formulario vacío', async ({
  page,
}) => {
  await useEndpoint(page);
  const posts: { accept: string; body: string }[] = [];
  await page.route(FAKE_ENDPOINT, async (route) => {
    const req = route.request();
    posts.push({ accept: req.headers()['accept'] ?? '', body: req.postData() ?? '' });
    await new Promise((r) => setTimeout(r, 500));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true }),
    });
  });
  await fillValid(page);
  await submit(page).dblclick();
  await expect(submit(page)).toHaveText('Enviando…');
  await expect(submit(page)).toBeDisabled();
  await expect(page.locator('#contact-status')).toHaveText(
    'Gracias, te respondemos en 24 h laborables',
  );
  expect(posts).toHaveLength(1);
  expect(posts[0]?.accept).toContain('application/json');
  for (const name of ['nombre', 'email', 'empresa', 'servicio', 'mensaje']) {
    expect(posts[0]?.body).toContain(`name="${name}"`);
  }
  for (const id of ['nombre', 'email', 'empresa', 'mensaje']) {
    await expect(page.locator(`#${id}`)).toHaveValue('');
  }
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  await expect(submit(page)).toBeEnabled();
});

for (const mode of ['500', 'red'] as const) {
  test(`CA-24: con Formspree y fallo (${mode}) muestra error con alternativas y conserva lo escrito`, async ({
    page,
  }) => {
    await useEndpoint(page);
    let posts = 0;
    await page.route(FAKE_ENDPOINT, async (route) => {
      posts++;
      if (mode === 'red') await route.abort('failed');
      else
        await route.fulfill({
          status: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: 'error',
        });
    });
    await fillValid(page);
    await submit(page).click();
    const alt = page.locator('#contact-alt');
    await expect(alt).toBeVisible();
    await expect(alt.locator('a[href*="wa.me"]')).toBeVisible();
    await expect(alt.locator(`a[href="mailto:${site.contactEmail}"]`)).toBeVisible();
    await expect(page.locator('#contact-status')).toContainText('No hemos podido enviar');
    await expect(page.locator('#nombre')).toHaveValue('Ana Pérez');
    await expect(page.locator('#mensaje')).toHaveValue('Necesito un agente de IA');
    await expect(submit(page)).toBeEnabled();
    await submit(page).click();
    await expect.poll(() => posts).toBe(2);
  });
}

test('CA-25: con endpoint vacío genera un mailto: con los datos y sin llamar a Formspree', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  const mailto = await watchMailto(page);
  await fillValid(page);
  await submit(page).click();
  await expect.poll(async () => (await mailto()).length).toBe(1);
  const [url = ''] = await mailto();
  expect(url.startsWith(`mailto:${site.contactEmail}?subject=`)).toBe(true);
  const body = decodeURIComponent(url.split('&body=')[1] ?? '');
  expect(body).toContain('Ana Pérez');
  expect(body).toContain('ana@empresa.es');
  expect(body).toContain('Necesito un agente de IA');
  expect(requests.filter((u) => u.includes('formspree.io'))).toEqual([]);
});
