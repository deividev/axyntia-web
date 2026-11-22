import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

// Lint de los archivos .js y .ts. Los .astro los comprueba `astro check` (script typecheck).
export default defineConfig(
  {
    ignores: ['dist/', '.astro/', 'coverage/', 'playwright-report/', 'test-results/', 'gate-out/'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
);
