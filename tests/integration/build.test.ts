import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Integración real: compila el sitio con `astro build` (Astro y Tailwind de verdad) en una carpeta
// temporal propia, para no depender de que se haya ejecutado antes el build ni tocar dist/.
const root = path.resolve(import.meta.dirname, '../..');
const astroBin = path.join(
  path.dirname(createRequire(import.meta.url).resolve('astro/package.json')),
  'bin/astro.mjs',
);
let outDir = '';
let html = '';
let css = '';

beforeAll(() => {
  outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'axyntia-build-'));
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
