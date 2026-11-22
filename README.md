# axyntia-web

Web de **Axyntia** (software a medida e IA). Sitio estático con [Astro](https://astro.build), Tailwind CSS v4 y TypeScript estricto.

Landing de una sola página (servicios, cómo trabajamos, por qué nosotros y contacto) más las páginas `/aviso-legal` y `/privacidad`, con una suite de tests de cada tipo.

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
- `siteUrl`: dominio público de la web (canónica, Open Graph, `sitemap.xml` y `robots.txt` salen de aquí).

Los valores actuales son marcadores.

### Cómo configurar el formulario, WhatsApp y el email

1. **Formspree:** crea el formulario en Formspree y pega su URL en `formEndpoint`, con el formato exacto `https://formspree.io/f/<id>`. Es público por diseño, no es un secreto. Cualquier otro valor (vacío, `http://`, otro dominio) se ignora.
2. **Plan B `mailto:`:** con `formEndpoint` vacío, el formulario abre el programa de correo con un mensaje a `contactEmail` ya redactado. Los mensajes muy largos pueden truncarse en algunos clientes de correo.
3. **WhatsApp:** cambia `whatsappNumber` (con prefijo de país, sin `+`) y `whatsappMessage`. Si el número no tiene dígitos, el build falla.
4. **Email:** cambia `contactEmail`. Se usa en el enlace de contacto, en el `mailto:` y en los datos estructurados.
5. **Textos legales:** completa los marcadores `[POR COMPLETAR: …]` de `src/pages/aviso-legal.astro` y `src/pages/privacidad.astro` antes de publicar.

No hay secretos en el repositorio. Si hiciera falta algo privado, iría en una variable `PUBLIC_…` documentada aquí y nunca comiteada.

## Notas de desarrollo

- Las fuentes (Space Grotesk, Inter y JetBrains Mono) van como primera opción de `font-family` con pilas del sistema de respaldo, sin archivos ni peticiones a terceros (ADR-009).
- `astro preview` se lanza en segundo plano en algunos entornos (agentes); `pnpm run preview stop` lo detiene.
