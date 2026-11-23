import { expect, test } from '@playwright/test';

test('CA-32: la carga de la portada no hace peticiones a otros orígenes', async ({
  page,
  baseURL,
}) => {
  const urls: string[] = [];
  const fonts: string[] = [];
  page.on('request', (r) => {
    urls.push(r.url());
    if (r.resourceType() === 'font') fonts.push(r.url());
  });
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
  const origin = new URL(baseURL!).origin;
  const external = urls.filter((u) => !u.startsWith('data:') && new URL(u).origin !== origin);
  expect(external).toEqual([]);
  expect(fonts).toEqual([]);
  expect(urls.some((u) => /fonts\.(googleapis|gstatic)\.com/.test(u))).toBe(false);
});

test('CA-37: ninguna página usa cookies', async ({ page, context }) => {
  for (const route of ['/', '/aviso-legal', '/privacidad']) {
    await page.goto(route, { waitUntil: 'networkidle' });
    expect(await page.evaluate(() => document.cookie), route).toBe('');
    expect(await context.cookies(), route).toHaveLength(0);
  }
});
