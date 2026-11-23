import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Reglas de código sobre los archivos fuente (DESIGN-SYSTEM §7, ADR-009, ADR-010, issues #8 y #9).
const root = path.resolve(import.meta.dirname, '../..');
const SKIP = new Set(['node_modules', 'dist', '.astro']);

function walk(dir: string): string[] {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
    if (SKIP.has(e.name) || e.name.startsWith('.tmp-build-')) return [];
    const rel = path.join(dir, e.name);
    return e.isDirectory() ? walk(rel) : [rel];
  });
}
const text = (rel: string): string => fs.readFileSync(path.join(root, rel), 'utf8');
const textFiles = (dir: string): string[] =>
  walk(dir).filter((f) => /\.(astro|ts|css|md|json|svg|txt|html|js|mjs)$/.test(f));
const matches = (files: string[], re: RegExp): string[] =>
  files.filter((f) => re.test(text(f))).map((f) => `${f}`);

describe('reglas de código', () => {
  it('CA-4: sin canvas ni requestAnimationFrame en src', () => {
    expect(matches(textFiles('src'), /canvas|requestAnimationFrame/)).toEqual([]);
  });

  it('CA-15: sin @font-face ni fuentes de Google en src y public', () => {
    const files = [...textFiles('src'), ...textFiles('public')];
    expect(matches(files, /@font-face|fonts\.(googleapis|gstatic)\.com/)).toEqual([]);
  });

  it('CA-22: los import de ContactForm.astro van juntos y antes de MESSAGE_SLACK', () => {
    const front = text('src/components/ContactForm.astro').split('---')[1] ?? '';
    const lines = front.split('\n');
    const imports = lines.flatMap((l, i) => (l.startsWith('import ') ? [i] : []));
    const slack = lines.findIndex((l) => l.startsWith('const MESSAGE_SLACK'));
    expect(imports.length).toBeGreaterThan(0);
    const first = imports[0] ?? 0;
    imports.forEach((idx, n) => expect(idx).toBe(first + n));
    expect(slack).toBeGreaterThan(imports[imports.length - 1] ?? 0);
  });

  it('CA-31: ADR-009 aceptado con la evidencia de la issue #3 y sin marcadores en docs', () => {
    expect(matches(textFiles('docs'), /APROBACIÓN DAVID/)).toEqual([]);
    const adr = text('docs/decisions/ADR-009-fuentes-del-sistema-hasta-tener-woff2.md');
    expect(adr).toMatch(/^estado: aceptado$/m);
    expect(adr).toMatch(/^evidencia_aprobacion:.*[Ii]ssue #3/m);
  });

  it('CA-32: sin hex, rgb, hsl, valores entre corchetes ni ref- en src (salvo global.css)', () => {
    const files = textFiles('src').filter((f) => !f.endsWith('global.css'));
    expect(matches(files, /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\[[0-9.]+(px|rem|ms|s)\]/)).toEqual(
      [],
    );
    expect(matches(files, /ref-/)).toEqual([]);
  });
});
