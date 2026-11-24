import { expect, test, type Page } from '@playwright/test';

// Rediseño «libro de cuentas de la pyme» (issue #14, DESIGN-SYSTEM §1.1).
const menuButton = (page: Page) => page.locator('button[aria-controls="site-nav"]');
const hablemos = (page: Page) => page.locator('header').getByRole('link', { name: 'Hablemos' });
const servicesTable = (page: Page) => page.getByRole('table', { name: 'Servicios' });
const processTable = (page: Page) => page.getByRole('table', { name: 'Cómo trabajamos' });

test('CA-3: h1 entero sin énfasis y hero sin canvas ni imagen decorativa', async ({ page }) => {
  await page.goto('/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveText('Software a medida e IA que trabajan para tu empresa');
  await expect(h1.locator('*')).toHaveCount(0);
  const hero = page.locator('[data-hero]');
  await expect(hero.locator('canvas, img, svg, picture, video')).toHaveCount(0);
  const h1Color = await h1.evaluate((el) => getComputedStyle(el).color);
  expect(h1Color).toBe(await page.evaluate(() => getComputedStyle(document.body).color));
  expect(await h1.evaluate((el) => getComputedStyle(el).fontWeight)).toBe('700');
  expect(await h1.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/^system-ui/);
  // Sin etiqueta encima del título.
  expect(await h1.evaluate((el) => el.previousElementSibling)).toBeNull();
});

test('CA-4: a 1440 px Servicios y Cómo trabajamos son tablas alineadas con cabecera y nº serif', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const [table, headers] of [
    [servicesTable(page), ['Nº', 'Concepto', 'Para quién', 'Qué resuelve']],
    [processTable(page), ['Nº', 'Paso', 'Qué hacemos']],
  ] as const) {
    const heads = table.getByRole('columnheader');
    await expect(heads).toHaveText([...headers]);
    for (const h of await heads.all()) await expect(h).toBeVisible();
    const headX = await Promise.all(
      (await heads.all()).map(async (h) => (await h.boundingBox())!.x),
    );
    const rows = table.locator('[data-ledger-row]');
    await expect(rows).toHaveCount(4);
    for (const row of await rows.all()) {
      const cells = row.locator(':scope > *');
      const xs = await Promise.all(
        (await cells.all()).map(async (c) => (await c.boundingBox())!.x),
      );
      expect(xs.map(Math.round)).toEqual(headX.map(Math.round));
      await expect(row.locator('[data-ledger-label]').first()).toBeHidden();
    }
    const figure = table.locator('[data-ledger-figure]').first();
    expect(await figure.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/^ui-serif/);
    expect(await figure.evaluate((el) => getComputedStyle(el).fontVariantNumeric)).toContain(
      'tabular-nums',
    );
    const decorated = await table.evaluate(
      (el) =>
        [el, ...el.querySelectorAll('*')].filter((n) => {
          const cs = getComputedStyle(n);
          return (
            cs.boxShadow !== 'none' ||
            cs.backgroundImage !== 'none' ||
            parseFloat(cs.borderRadius) > 0 ||
            n.matches('svg, img')
          );
        }).length,
    );
    expect(decorated).toBe(0);
  }
});

test('nº de dos cifras: la columna del nº tiene el mismo ancho en todas las líneas', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const widths = await servicesTable(page)
    .locator('[data-ledger-figure]')
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  expect(new Set(widths).size).toBe(1);
});

for (const width of [360, 390]) {
  test(`CA-5: a ${width} px cada línea se apila con rótulos y la cabecera de columnas no se ve`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const table = servicesTable(page);
    for (const h of await table.getByRole('columnheader').all()) await expect(h).toBeHidden();
    for (const row of await table.locator('[data-ledger-row]').all()) {
      await expect(row.getByText('Para quién', { exact: true })).toBeVisible();
      await expect(row.getByText('Qué resuelve', { exact: true })).toBeVisible();
      const cells = await row
        .locator(':scope > :not(:first-child)')
        .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
      // Apiladas: cada celda empieza debajo de la anterior y todas comparten columna.
      for (let i = 1; i < cells.length; i++) {
        expect(cells[i]!.top).toBeGreaterThanOrEqual(cells[i - 1]!.bottom - 1);
        expect(Math.round(cells[i]!.left)).toBe(Math.round(cells[0]!.left));
      }
    }
    for (const h of await processTable(page).getByRole('columnheader').all()) {
      await expect(h).toBeHidden();
    }
  });
}

for (const width of [641, 768, 1023]) {
  test(`CA-6: a ${width} px la cabecera de columnas está oculta y las líneas llevan rótulos`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const h of await servicesTable(page).getByRole('columnheader').all()) {
      await expect(h).toBeHidden();
    }
    const row = servicesTable(page).locator('[data-ledger-row]').first();
    await expect(row.getByText('Para quién', { exact: true })).toBeVisible();
    await expect(row.getByText('Qué resuelve', { exact: true })).toBeVisible();
  });
}

test('CA-6: a 1024 px la cabecera aparece alineada en una sola fila', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');
  const tops = await servicesTable(page)
    .getByRole('columnheader')
    .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
});

for (const width of [320, 360, 390, 768, 1023, 1024, 1440]) {
  test(`CA-7: a ${width} px no hay scroll horizontal ni elementos que desborden`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const res = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      overflowing: [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 && r.height > 0 && r.right > window.innerWidth + 1 && !el.closest('.hp')
          );
        })
        .map((el) => el.outerHTML.slice(0, 80)),
    }));
    expect(res.scroll).toBeLessThanOrEqual(0);
    expect(res.overflowing).toEqual([]);
  });
}

test('CA-8: todas las peticiones de la landing van al mismo origen y no hay fuentes', async ({
  page,
  baseURL,
}) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const origin = new URL(baseURL!).origin;
  expect(requests.filter((u) => !u.startsWith(origin) && !u.startsWith('data:'))).toEqual([]);
  expect(requests.filter((u) => /\.(woff2?|ttf|otf)(\?|$)/.test(u))).toEqual([]);
});

// Contraste WCAG calculado con los estilos reales: color del texto contra el primer fondo opaco.
const contrastFailures = (page: Page) =>
  page.evaluate(() => {
    const parse = (c: string): number[] | null => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1]!
        .split(/[ ,/]+/)
        .filter(Boolean)
        .map(Number);
      return [p[0]!, p[1]!, p[2]!, p[3] ?? 1];
    };
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
    };
    const bgOf = (el: Element | null): number[] => {
      for (let n = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c && c[3]! >= 1) return c;
      }
      return [255, 255, 255, 1];
    };
    const out: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const el = t.parentElement;
      if (!el || !t.textContent?.trim()) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width === 0 || cs.visibility === 'hidden' || el.closest('.hp, [hidden], noscript'))
        continue;
      if (el.closest(':disabled')) continue; // WCAG 1.4.3: los controles deshabilitados no cuentan.
      const fg = parse(cs.color)!;
      const a = lum(fg) + 0.05;
      const b = lum(bgOf(el)) + 0.05;
      const ratio = Math.max(a, b) / Math.min(a, b);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
      if (ratio < (large ? 3 : 4.5))
        out.push(`${t.textContent.trim().slice(0, 30)}: ${ratio.toFixed(2)}`);
    }
    return out;
  });

for (const width of [390, 1440]) {
  test(`CA-11: a ${width} px el texto cumple el contraste AA, también con el menú abierto`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await contrastFailures(page)).toEqual([]);
    if (await menuButton(page).isVisible()) {
      await menuButton(page).click();
      expect(await contrastFailures(page)).toEqual([]);
    }
  });

  test(`CA-11: a ${width} px controles con nombre, campos con etiqueta y bordes de campo ≥ 3:1`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const el of await page.locator('a:visible, button:visible').all()) {
      expect((await el.innerText()).trim() || (await el.getAttribute('aria-label'))).toBeTruthy();
    }
    for (const id of ['nombre', 'email', 'empresa', 'servicio', 'mensaje', 'privacidad']) {
      await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
    }
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    await expect(page.locator('#nombre')).toHaveCSS('border-color', 'rgb(107, 116, 130)');
  });
}

test('CA-12: Tab recorre los controles con foco visible y en orden de lectura (1440 px)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  // Orden de lectura: hacia abajo, o subir solo para empezar una columna a la derecha de la
  // anterior (Contacto: datos a la izquierda y formulario a la derecha en escritorio).
  let last = -Infinity;
  let lastRight = -Infinity;
  let visited = 0;
  let lastName = '';
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    // Al salir del último control el foco vuelve al documento: fin del recorrido.
    if (await page.evaluate(() => document.activeElement === document.body)) break;
    visited++;
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const header = document.querySelector('header')!.getBoundingClientRect();
      // Tapado = bajo la franja de la cabecera y lo que se pinta en su borde superior es la
      // cabecera (el enlace de salto va por encima de ella con z-index y no cuenta como tapado).
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + 1);
      return {
        name: el.textContent?.trim() || el.id,
        outline: parseFloat(cs.outlineWidth) >= 2 && cs.outlineStyle !== 'none',
        docY: r.top + window.scrollY,
        left: r.left,
        right: r.right,
        inHeader: !!el.closest('header'),
        covered:
          !el.closest('header') &&
          r.top < header.bottom - 1 &&
          (!hit || (!el.contains(hit) && !!hit.closest('header'))),
        skip: el.classList.contains('skip-link'),
      };
    });
    expect(info.outline, `foco visible en ${info.name}`).toBe(true);
    expect(info.covered, `foco tapado por la cabecera en ${info.name}`).toBe(false);
    if (!info.inHeader && !info.skip) {
      const downward = info.docY >= last - 1;
      const newColumn = info.left >= lastRight;
      expect(downward || newColumn, `orden de foco en ${info.name}`).toBe(true);
      last = info.docY;
      lastRight = info.right;
    }
    lastName = info.name;
  }
  // El recorrido llega al final de la página: el último control es el último enlace del pie.
  expect(visited).toBeGreaterThan(20);
  expect(lastName).toBe('Política de privacidad');
});

test('CA-13: objetivos táctiles ≥ 24×24 px y controles principales ≥ 44 px de alto', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 640, height: 900 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/');
  for (const main of [
    menuButton(page),
    hablemos(page),
    page.locator('#contact-form [type=submit]'),
  ]) {
    expect((await main.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('a, button, input, select, textarea')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || el.closest('.hp')) return false;
        // Excepción WCAG 2.5.8: enlaces dentro de una frase.
        if (getComputedStyle(el).display === 'inline' && el.closest('p, label')) return false;
        return r.width < 24 || r.height < 24;
      })
      .map((el) => el.outerHTML.slice(0, 80)),
  );
  expect(small).toEqual([]);
  await context.close();
});

for (const width of [640, 768, 1023]) {
  test(`CA-17: a ${width} px «Hablemos» queda a la derecha, junto al botón del menú`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const h = (await hablemos(page).boundingBox())!;
    const b = (await menuButton(page).boundingBox())!;
    const logo = (await page.getByRole('link', { name: 'Axyntia, inicio' }).boundingBox())!;
    expect(h.x).toBeGreaterThan(logo.x + logo.width);
    expect(b.x).toBeGreaterThan(h.x + h.width);
    expect(b.x - (h.x + h.width)).toBeLessThanOrEqual(24);
    expect(Math.abs(h.y + h.height / 2 - (b.y + b.height / 2))).toBeLessThanOrEqual(2);
    const right = await page.evaluate(() => {
      const c = document.querySelector('header > div')!;
      return c.getBoundingClientRect().right - parseFloat(getComputedStyle(c).paddingRight);
    });
    expect(Math.abs(b.x + b.width - right)).toBeLessThanOrEqual(1);
  });
}

test('CA-18: a 768 px el orden de foco es logotipo, menú, enlaces de nav y «Hablemos»', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Axyntia, inicio' }).focus();
  await page.keyboard.press('Tab');
  await expect(menuButton(page)).toBeFocused();
  await page.keyboard.press('Enter');
  const order = [];
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    order.push(await page.evaluate(() => document.activeElement?.textContent?.trim()));
  }
  expect(order).toEqual([
    'Servicios',
    'Cómo trabajamos',
    'Por qué nosotros',
    'Contacto',
    'Hablemos',
  ]);
});

test('aviso legal y privacidad usan el papel y el texto nuevos', async ({ page }) => {
  for (const route of ['/aviso-legal', '/privacidad']) {
    await page.goto(route);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(244, 246, 248)');
    expect(await contrastFailures(page)).toEqual([]);
  }
});
