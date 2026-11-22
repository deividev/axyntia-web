import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { site } from '../../src/config/site';
import { absoluteUrl } from '../../src/lib/seo';

// Integración real: compila el sitio con `astro build` (Astro y Tailwind de verdad) en una carpeta
// temporal propia, para no depender de que se haya ejecutado antes el build ni tocar dist/.
// La carpeta está dentro del proyecto (.tmp-build-*, ignorada por git): Astro mueve archivos con rename y,
// en el contenedor de la CI y del gate, /tmp está en otro sistema de archivos (EXDEV).
const root = path.resolve(import.meta.dirname, '../..');
const astroBin = path.join(
  path.dirname(createRequire(import.meta.url).resolve('astro/package.json')),
  'bin/astro.mjs',
);
let outDir = '';
let html = '';
let css = '';

beforeAll(() => {
  outDir = fs.mkdtempSync(path.join(root, '.tmp-build-'));
  const r = spawnSync(process.execPath, [astroBin, 'build', '--outDir', outDir, '--silent'], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) throw new Error(`astro build falló (${r.status}):\n${r.stdout}\n${r.stderr}`);

  html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
  // CSS en línea (<style>) y hojas enlazadas (<link rel="stylesheet" href="/_astro/….css">).
  const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  const linked = [...html.matchAll(/<link[^>]+href="(\/[^"]+\.css)"/g)].map((m) =>
    fs.readFileSync(path.join(outDir, m[1] ?? ''), 'utf8'),
  );
  css = [...inline, ...linked].join('\n');
});

afterAll(() => {
  if (outDir) fs.rmSync(outDir, { recursive: true, force: true });
});

const read = (rel: string): string => fs.readFileSync(path.join(outDir, rel), 'utf8');
const pages = (): Record<string, string> => ({
  '/': html,
  '/aviso-legal': read('aviso-legal/index.html'),
  '/privacidad': read('privacidad/index.html'),
});
const meta = (doc: string, attr: 'name' | 'property', key: string): string | undefined =>
  doc.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];

describe('estructura de la landing (CA-1, CA-2)', () => {
  it('CA-1: cabecera, hero y secciones en orden, y pie al final', () => {
    const marks = [
      '<header',
      'data-hero',
      'id="servicios"',
      'id="como-trabajamos"',
      'id="por-que"',
      'id="contacto"',
      '<footer',
    ].map((m) => html.indexOf(m));
    expect(marks.every((i) => i >= 0)).toBe(true);
    expect([...marks].sort((a, b) => a - b)).toEqual(marks);
    expect(new Set(marks).size).toBe(marks.length);
  });

  it('CA-2: un h1 por página y sin saltos de nivel de encabezado', () => {
    for (const [route, doc] of Object.entries(pages())) {
      const levels = [...doc.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
      expect(levels.filter((l) => l === 1), route).toHaveLength(1);
      levels.forEach((l, i) => {
        expect(l - (levels[i - 1] ?? 0), `${route} h${l}`).toBeLessThanOrEqual(1);
      });
    }
  });
});

describe('SEO y recursos (CA-33 a CA-38)', () => {
  it('CA-33: el JS de la portada pesa ≤ 60 KB con gzip', () => {
    const dir = path.join(outDir, '_astro');
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.js')) : [];
    const inline = [...html.matchAll(/<script(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g)].map(
      (m) => m[1] ?? '',
    );
    const total = [...files.map((f) => fs.readFileSync(path.join(dir, f))), ...inline].reduce(
      (sum, c) => sum + gzipSync(c).length,
      0,
    );
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThanOrEqual(61_440);
  });

  it('CA-34: head con título, descripción, canónica, OG, Twitter, JSON-LD y favicon', () => {
    expect(html).toMatch(/<title>(?!Axyntia — web en construcción)[^<]+<\/title>/);
    expect(meta(html, 'name', 'description')).toBeTruthy();
    expect(html).toContain(`<link rel="canonical" href="${absoluteUrl(site.siteUrl, '/')}"`);
    expect(meta(html, 'property', 'og:title')).toBeTruthy();
    expect(meta(html, 'property', 'og:description')).toBeTruthy();
    expect(meta(html, 'property', 'og:image')).toMatch(/^https:\/\//);
    expect(meta(html, 'property', 'og:image:width')).toBe('1200');
    expect(meta(html, 'property', 'og:image:height')).toBe('630');
    expect(meta(html, 'name', 'twitter:card')).toBe('summary_large_image');
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '';
    expect(JSON.stringify(JSON.parse(ld)['@type'])).toMatch(/Organization|ProfessionalService/);
    expect(html).toMatch(/<link rel="icon" type="image\/svg\+xml"/);
    const png = fs.readFileSync(path.join(outDir, 'og-image.png'));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });

  it('CA-35: sitemap.xml y robots.txt con URLs absolutas, sin @astrojs/sitemap', () => {
    const sitemap = read('sitemap.xml');
    expect(sitemap.startsWith('<?xml')).toBe(true);
    for (const p of ['/', '/aviso-legal', '/privacidad']) {
      expect(sitemap).toContain(`<loc>${absoluteUrl(site.siteUrl, p)}</loc>`);
    }
    expect(read('robots.txt')).toContain(`Sitemap: ${site.siteUrl}/sitemap.xml`);
    expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).not.toContain(
      '@astrojs/sitemap',
    );
  });

  it('CA-36: páginas legales en español con marcadores; privacidad cita Formspree', () => {
    const { '/aviso-legal': legal = '', '/privacidad': privacy = '' } = pages();
    for (const doc of [legal, privacy]) {
      expect(doc).toMatch(/<html[^>]*\blang="es"/);
      for (const f of ['titular', 'NIF', 'domicilio', 'email']) {
        expect(doc).toContain(`[POR COMPLETAR: ${f}]`);
      }
    }
    expect(privacy).toContain('Formspree');
  });

  it('CA-38: todas las imágenes tienen alt, dimensiones y formato permitido (0 imágenes también vale)', () => {
    for (const [route, doc] of Object.entries(pages())) {
      for (const [tag] of doc.matchAll(/<img\b[^>]*>/g)) {
        expect(tag, route).toMatch(/\balt=/);
        expect(tag, route).toMatch(/\bwidth=/);
        expect(tag, route).toMatch(/\bheight=/);
        expect(tag, route).toMatch(/src="[^"]+\.(avif|webp|svg)"/);
      }
    }
  });
});

describe('astro build de la página de inicio', () => {
  it('genera index.html en español', () => {
    expect(html).toMatch(/<html[^>]*\blang="es"/);
  });

  it('tiene un único h1', () => {
    expect(html.match(/<h1[\s>]/g) ?? []).toHaveLength(1);
  });

  it('el CSS generado por Tailwind incluye las clases y los colores de la página', () => {
    expect(html).toContain('bg-axyntia-dark');
    expect(css).toContain('.bg-axyntia-dark');
    expect(css).toContain('.text-axyntia-light');
    expect(css.toLowerCase()).toContain('#07080c');
    expect(css.toLowerCase()).toContain('#e8ecf4');
  });
});
