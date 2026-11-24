import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// ESLint no revisa los .astro (AI-AGENTS): se comprueba aquí el orden de imports (issue #8).
const file = path.resolve(import.meta.dirname, '../../src/components/ContactForm.astro');
const frontmatter = (fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('//'));

describe('ContactForm.astro', () => {
  it('declara todos los imports antes de cualquier otra sentencia', () => {
    const firstOther = frontmatter.findIndex((l) => !l.startsWith('import '));
    const lastImport = frontmatter.findLastIndex((l) => l.startsWith('import '));
    expect(lastImport).toBeGreaterThanOrEqual(0);
    expect(firstOther === -1 || lastImport < firstOther).toBe(true);
  });

  it('importa primero los módulos y después los componentes .astro', () => {
    const imports = frontmatter.filter((l) => l.startsWith('import '));
    const firstComponent = imports.findIndex((l) => l.includes('.astro'));
    expect(firstComponent).toBeGreaterThan(0);
    expect(imports.slice(firstComponent).every((l) => l.includes('.astro'))).toBe(true);
  });

  it('conserva los ids y atributos de los que depende el script del formulario', () => {
    const src = fs.readFileSync(file, 'utf8');
    for (const s of [
      'id="contact-form"',
      'data-endpoint={site.formEndpoint}',
      'id="contact-summary"',
      'id="contact-status"',
      'id="contact-alt"',
      'name="_gotcha"',
      "import '../scripts/contact-form'",
    ]) {
      expect(src).toContain(s);
    }
  });
});
