import { expect, test, type Page } from '@playwright/test';

const menuButton = (page: Page) => page.locator('button[aria-controls="site-nav"]');

test('CA-3: la cabecera de escritorio muestra wordmark, enlaces y «Hablemos»', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const header = page.locator('header');
  await expect(header.getByText('Axyntia').first()).toBeVisible();
  const links: Record<string, string> = {
    Servicios: '#servicios',
    'Cómo trabajamos': '#como-trabajamos',
    'Por qué nosotros': '#por-que',
    Contacto: '#contacto',
  };
  for (const [name, href] of Object.entries(links)) {
    const link = header.getByRole('link', { name, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', href);
  }
  const hablemos = header.getByRole('link', { name: 'Hablemos' });
  await expect(hablemos).toBeVisible();
  await expect(hablemos).toHaveAttribute('href', '#contacto');
});

test('CA-4: el menú móvil se abre con Enter y Escape lo cierra devolviendo el foco', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  const button = menuButton(page);
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#site-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#site-nav')).toBeHidden();
  await expect(button).toBeFocused();
});

test('CA-5: elegir «Contacto» en el menú móvil lo cierra y va a #contacto', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  await menuButton(page).click();
  await page.locator('#site-nav').getByRole('link', { name: 'Contacto' }).click();
  await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#contacto$/);
});

test('CA-6: sin scroll horizontal a 320, 360, 768, 1024 y 1440 px', async ({ page }) => {
  for (const width of [320, 360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const button = menuButton(page);
    if (await button.isVisible()) await button.click();
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth, `ancho ${width}`).toBeLessThanOrEqual(clientWidth);
  }
});

test('redimensionar con el menú abierto deja los enlaces visibles y sin scroll horizontal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  await menuButton(page).click();
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#site-nav').getByRole('link', { name: 'Servicios' })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('CA-7: la cabecera, el h1 y los botones del hero no se solapan', async ({ page }) => {
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const boxes = [
      await page.locator('header').boundingBox(),
      await page.locator('h1').boundingBox(),
      await page.getByRole('link', { name: 'Solicita una propuesta' }).boundingBox(),
      await page
        .locator('[data-hero]')
        .getByRole('link', { name: /WhatsApp/ })
        .boundingBox(),
    ];
    boxes.forEach((a, i) => {
      expect(a, `caja ${i} a ${width}`).not.toBeNull();
      boxes.slice(i + 1).forEach((b) => {
        const overlap =
          a!.x < b!.x + b!.width &&
          b!.x < a!.x + a!.width &&
          a!.y < b!.y + b!.height &&
          b!.y < a!.y + a!.height;
        expect(overlap, `solape a ${width}`).toBe(false);
      });
    });
    const overflowing = await page.evaluate(
      () =>
        [...document.querySelectorAll('main *')].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.right > window.innerWidth + 1;
        }).length,
    );
    expect(overflowing, `desbordes a ${width}`).toBe(0);
  }
});

test('CA-8: h1, subtítulo y botón principal caben en la primera pantalla', async ({ page }) => {
  for (const [width, height] of [
    [360, 740],
    [1440, 900],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('h1')).toBeInViewport();
    await expect(page.getByText('Diseñamos CRM visuales en 3D')).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Solicita una propuesta' })).toBeInViewport();
  }
});

test('CA-9: «Solicita una propuesta» lleva a Contacto sin taparlo la cabecera', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Solicita una propuesta' }).click();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(page.locator('#contacto')).toBeInViewport();
  await expect
    .poll(async () => {
      const h2 = await page.locator('#contacto h2').boundingBox();
      const header = await page.locator('header').boundingBox();
      return h2 && header ? h2.y >= header.y + header.height - 1 : false;
    })
    .toBe(true);
});

test('CA-14: Tab lleva al enlace «Saltar al contenido» y Enter al contenido', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('CA-15: todo es operable con teclado, el foco se ve y el honeypot no recibe foco', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const seen = new Set<string>();
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const cs = getComputedStyle(el);
      return {
        id: el.id || el.getAttribute('href') || el.textContent?.trim() || el.tagName,
        name: el.getAttribute('name'),
        outline: parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none',
      };
    });
    expect(info.name).not.toBe('_gotcha');
    expect(info.outline, `foco visible en ${info.id}`).toBe(true);
    seen.add(info.id);
  }
  for (const id of ['nombre', 'email', 'empresa', 'servicio', 'mensaje', 'privacidad']) {
    expect(seen.has(id), `${id} recibe foco`).toBe(true);
  }
  expect(seen.has('/aviso-legal') && seen.has('/privacidad')).toBe(true);
});
