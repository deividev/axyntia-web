---
tipo: guia-agentes
titulo: 'Guía para agentes de axyntia-web'
proyecto: 'axyntia-web'
cliente: 'interno'
estado: propuesta
version: 0.1.0
fecha: '2026-11-22'
creado: '2026-11-22'
actualizado: '2026-11-22'
responsable: factory
sensibilidad: interna
aprobado_por: ''
aprobado_el: ''
evidencia_aprobacion: ''
origen: interno
reemplaza: ''
tags: []
---

# Guía para agentes de axyntia-web

> Las normas de la factoría están en tu documento de rol; aquí solo va lo propio de este proyecto.

## Qué es

Web de una sola página de Axyntia (software a medida e IA) para que pymes españolas entiendan sus servicios y contacten por formulario o WhatsApp. Hoy es el esqueleto «web en construcción»; la landing se construye en trabajos posteriores. Detalle en `docs/PRODUCT-REQUIREMENTS.md`.

## Comandos

| Para                   | Orden                                                                       |
| ---------------------- | --------------------------------------------------------------------------- |
| Instalar               | `pnpm install --frozen-lockfile --ignore-scripts`                           |
| Desarrollo             | `pnpm run dev`                                                              |
| Build / vista previa   | `pnpm run build` · `pnpm run preview`                                       |
| Tipos / lint           | `pnpm run typecheck` · `pnpm run lint`                                      |
| Formato                | `pnpm run format` (escribe) · `pnpm run format:check` (solo comprueba)      |
| Tests unitarios        | `pnpm test:unit`                                                            |
| Tests de integración   | `pnpm test:integration`                                                     |
| Tests e2e (Playwright) | `pnpm test:e2e` · uno solo: `pnpm exec playwright test tests/e2e/<archivo>` |

El gate y la CI ejecutan lint, formato, tipos, build y las tres suites. El e2e usa el puerto de `PORT` (por defecto 3000). La primera vez en local: `pnpm exec playwright install chromium`. Usa `ASTRO_TELEMETRY_DISABLED=1` en todos los comandos de Astro.

## Estructura

| Ruta                                              | Qué contiene                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/config/`                                     | `site.ts`: datos públicos de contacto; sin secretos                                  |
| `src/lib/`                                        | Lógica pura sin DOM (`whatsapp.ts`: `buildWhatsAppUrl`)                              |
| `src/pages/`                                      | Páginas por ruta (hoy `index.astro`)                                                 |
| `src/styles/`                                     | `global.css`: Tailwind y tokens en `@theme`                                          |
| `tests/unit/`, `tests/integration/`, `tests/e2e/` | Los tres tipos de tests                                                              |
| `.github/`                                        | CI (`workflows/ci.yml`)                                                              |
| `docs/`                                           | PRODUCT-REQUIREMENTS, ARCHITECTURE, DESIGN-SYSTEM, este archivo y `decisions/` (ADR) |

Propuestas para la landing, aún sin crear: `src/components/`, `src/scripts/` y `public/`. Mapa completo en `docs/ARCHITECTURE.md` sección 4.

## Documentos del proyecto: cuál leer según la tarea

| Si vas a...                                     | Lee primero                                                                         | Para                                   |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------- |
| Entender qué se pide o el alcance               | [PRD](PRODUCT-REQUIREMENTS.md) (sección 3 no-objetivos, 5 historias, 6 requisitos)  | No ampliar alcance; citar RF-xxx       |
| Decidir dónde va el código o tocar varias capas | [ARCHITECTURE](ARCHITECTURE.md) (sección 4 mapa, 6 invariantes) y [ADR](decisions/) | Respetar fronteras e invariantes       |
| Tocar interfaz (componentes, estilos, textos)   | [DESIGN-SYSTEM](DESIGN-SYSTEM.md) (sección 3 tokens, 5 componentes, 7 reglas)       | Usar tokens y cubrir todos los estados |
| Añadir una dependencia                          | [ARCHITECTURE](ARCHITECTURE.md) sección 3 pila                                      | No duplicar lo que ya hay              |
| Cambiar formulario, sitemap, lint o telemetría  | [ADR](decisions/) 003, 008, 006 y 007                                               | No contradecir lo decidido             |

## Convenciones reales

- Comillas simples, `trailingComma: all`, `printWidth: 100` (`.prettierrc.json`); los `.astro` con `prettier-plugin-astro`.
- Comentarios y textos en español; código en inglés (`buildWhatsAppUrl`, `site`).
- Versiones exactas en `package.json` (`saveExact`); solo `pnpm`, nunca `npm` ni `npx`.
- Tests: `tests/unit/*.test.ts` y `tests/integration/*.test.ts` con Vitest; `tests/e2e/*.spec.ts` con Playwright usando `getByRole`.
- Los datos de contacto se leen siempre de `site` en `src/config/site.ts`; no se escriben en páginas ni componentes.
- Estilos con clases de Tailwind y tokens del `@theme`; los tokens y sus reglas están en `docs/DESIGN-SYSTEM.md`.

## Reglas propias del proyecto

1. Sin secretos ni datos reales: solo los marcadores de `src/config/site.ts` y `https://formspree.io/f/<id>`.
2. Sin analítica, cookies, GSAP ni three.js; el hero es canvas 2D sin librerías (ADR-004).
3. Textos legales: solo plantilla con marcadores; no inventes titular, NIF ni domicilio.
4. Nada de cifras, clientes, logos ni testimonios inventados.

## Rutas protegidas del proyecto

- `astro.config.*` (por ejemplo `astro.config.ts`): su cambio es un trabajo `test_config` que aprueba David.
- `.github/workflows/ci.yml`, `.npmrc`, `pnpm-workspace.yaml`, `vitest.config.ts` y `playwright.config.ts`: marcadas como protegidas en sus comentarios.
- `[POR ACLARAR: resto de protected_paths en el factory.yaml de la factoría]`.
- Los documentos de `docs/` (este incluido) y los ADR existentes, salvo que la spec lo pida.

## Trampas conocidas

- El build falla con `EXDEV` si el directorio de salida está en `/tmp` → Astro mueve archivos con `rename` y en el contenedor `/tmp` es otro sistema de archivos → compila dentro del proyecto, como `tests/integration/build.test.ts` (`.tmp-build-*`, ignorado por git).
- Astro envía telemetría anónima en local → es el comportamiento por defecto y el gate y la CI ponen la variable → exporta `ASTRO_TELEMETRY_DISABLED=1` o ejecuta `astro telemetry disable` (ADR-007).
- `pnpm install` falla con «Unsupported engine» al añadir un plugin → hay Node 24.15.0 y el plugin exige 24.16 o superior, con `engineStrict: true` → no instales el plugin ni cambies Node; es una decisión de David (ADR-006).
- `pnpm run lint` pasa pero un `.astro` tiene problemas → ESLint solo revisa `.js` y `.ts` (`eslint.config.js`) → ejecuta también `pnpm run typecheck` y `pnpm run format:check`.
