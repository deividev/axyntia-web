import { defineConfig } from 'vitest/config';

// Configuración de tests: ruta protegida, solo se cambia con un trabajo test_config aprobado por David.
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
          hookTimeout: 120_000,
        },
      },
    ],
  },
});
