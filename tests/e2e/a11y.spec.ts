import { expect, test, type Page } from '@playwright/test';

type Failure = { selector: string; fg: string; bg: string; ratio: number; required: number };

// Contraste par a par con la fórmula de WCAG 2.x (DESIGN-SYSTEM §3.1), sobre el texto visible.
async function contrastFailures(page: Page): Promise<Failure[]> {
  return page.evaluate(() => {
    type RGBA = [number, number, number, number];
    const parse = (c: string): RGBA => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      const p = (m?.[1] ?? '0,0,0,0')
        .split(/[ ,/]+/)
        .filter(Boolean)
        .map(Number);
      return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0, p[3] ?? 1];
    };
    const lum = ([r, g, b]: RGBA): number => {
      const f = (v: number): number => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a: RGBA, b: RGBA): number => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
      return (hi + 0.05) / (lo + 0.05);
    };
    const bgOf = (el: Element): RGBA => {
      for (let n: Element | null = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c[3] === 1) return c;
      }
      return parse(getComputedStyle(document.body).backgroundColor);
    };
    const out: Failure[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set<Element>();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!el || seen.has(el) || !n.textContent?.trim()) continue;
      seen.add(el);
      if (el.closest('.hp, noscript, script, style, :disabled, [aria-hidden="true"]')) continue;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (
        cs.visibility === 'hidden' ||
        cs.display === 'none' ||
        rect.width === 0 ||
        rect.height === 0
      )
        continue;
      if (cs.position === 'absolute' && rect.width <= 1) continue;
      const fg = parse(cs.color);
      const bg = bgOf(el);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
      const required = large ? 3 : 4.5;
      const r = ratio(fg, bg);
      if (r < required) {
        out.push({
          selector:
            el.tagName.toLowerCase() +
            (el.className ? '.' + String(el.className).split(' ')[0] : ''),
          fg: cs.color,
          bg: `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`,
          ratio: Math.round(r * 100) / 100,
          required,
        });
      }
    }
    return out;
  });
}

test('CA-27: contraste de texto ≥ 4,5:1 (3:1 si es grande) a 390 y 1440 px', async ({ page }) => {
  for (const [width, height] of [
    [390, 844],
    [1440, 900],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    expect(await contrastFailures(page), `${width}px`).toEqual([]);
  }
});

test('CA-27: contraste con el menú móvil abierto', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menú' }).click();
  await expect(page.locator('#site-nav').getByRole('link', { name: 'Contacto' })).toBeVisible();
  expect(await contrastFailures(page)).toEqual([]);
});

test('CA-27: el borde de los campos del formulario contrasta ≥ 3:1 con su fondo', async ({
  page,
}) => {
  await page.goto('/');
  const results = await page.evaluate(() => {
    const parse = (c: string): number[] => (c.match(/[\d.]+/g) ?? []).map(Number);
    const lum = (rgb: number[]): number => {
      const f = (v: number): number => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(rgb[0] ?? 0) + 0.7152 * f(rgb[1] ?? 0) + 0.0722 * f(rgb[2] ?? 0);
    };
    return ['nombre', 'email', 'empresa', 'servicio', 'mensaje'].map((id) => {
      const el = document.getElementById(id)!;
      const border = parse(getComputedStyle(el).borderTopColor);
      let bg = [244, 246, 248];
      for (let n: Element | null = el.parentElement; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c.length === 3 || c[3] === 1) {
          bg = c;
          break;
        }
      }
      const [hi, lo] = [lum(border), lum(bg)].sort((a, b) => b - a) as [number, number];
      return { id, ratio: (hi + 0.05) / (lo + 0.05) };
    });
  });
  for (const r of results) expect(r.ratio, r.id).toBeGreaterThanOrEqual(3);
});

test('foco en «Hablemos» y WhatsApp: anillo rgb(20, 24, 31) de 2 px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const target of [
    page.locator('header').getByRole('link', { name: 'Hablemos' }),
    page.locator('[data-hero]').getByRole('link', { name: 'Escríbenos por WhatsApp' }),
  ]) {
    await target.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(target).toBeFocused();
    const o = await target.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { color: cs.outlineColor, width: cs.outlineWidth, style: cs.outlineStyle };
    });
    expect(o.color).toBe('rgb(20, 24, 31)');
    expect(parseFloat(o.width)).toBeGreaterThanOrEqual(2);
    expect(o.style).not.toBe('none');
  }
});

test('zoom al 200 % (320 px CSS): sin scroll horizontal', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 320, height: 640 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await context.close();
});
