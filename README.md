# axyntia-web

Web de **Axyntia** (software a medida e IA). Sitio estático con [Astro](https://astro.build), Tailwind CSS v4 y TypeScript estricto.

Ahora mismo es solo el **esqueleto (A-1)**: una página «web en construcción» y una suite de tests de cada tipo. La landing de verdad la construye la factoría de software en trabajos posteriores.

## Requisitos

- Node 24 o posterior.
- pnpm 12.10.1 (campo `packageManager`). Nunca npm ni npx.

## Uso

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm run dev        # servidor de desarrollo
pnpm run build      # genera el sitio estático en dist/
pnpm run preview    # sirve dist/
```

## Checks y tests

| Orden                   | Qué hace                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm run lint`         | ESLint sobre los `.js` y `.ts`                                                               |
| `pnpm run format:check` | Prettier (también los `.astro`)                                                              |
| `pnpm run typecheck`    | `astro check` (archivos `.astro`) y `tsc --noEmit`                                           |
| `pnpm test:unit`        | Vitest, proyecto `unit` (`tests/unit/`)                                                      |
| `pnpm test:integration` | Vitest, proyecto `integration` (`tests/integration/`): compila el sitio y revisa el HTML/CSS |
| `pnpm test:e2e`         | Playwright con Chromium (`tests/e2e/`): compila, levanta `astro preview` y prueba la página  |

El e2e usa el puerto de la variable `PORT` (por defecto 3000). La primera vez en local hace falta el navegador: `pnpm exec playwright install chromium`.

Para que Astro no envíe telemetría anónima: `ASTRO_TELEMETRY_DISABLED=1` (la CI y el gate ya la ponen).

Las reglas del gate de la factoría (comandos exactos, rutas protegidas y dependencias conocidas) viven en el repo de la factoría, en `factory/config/proyectos/axyntia-web/factory.yaml`. La CI (`.github/workflows/ci.yml`) ejecuta los mismos comandos.

## Datos de contacto

Todo en [`src/config/site.ts`](src/config/site.ts), sin secretos (acaba en el HTML público):

- `contactEmail`: correo de contacto.
- `whatsappNumber` y `whatsappMessage`: número con prefijo de país (sin `+` ni espacios) y mensaje inicial. El enlace lo construye `buildWhatsAppUrl` de `src/lib/whatsapp.ts`.
- `formEndpoint`: URL del formulario de Formspree (`https://formspree.io/f/…`). Vacío hasta tenerla.
- `siteUrl`: dominio público de la web.

Los valores actuales son marcadores.
