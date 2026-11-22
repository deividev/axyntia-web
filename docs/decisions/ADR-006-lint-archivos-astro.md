---
tipo: adr
titulo: 'ADR-006: Lint de los archivos .astro: mantener el estado actual y añadir el plugin tras subir Node'
proyecto: 'axyntia-web'
cliente: 'interno'
estado: propuesta
fecha: '2026-11-22'
creado: '2026-11-22'
actualizado: '2026-11-22'
responsable: factory
decisores: [david]
consultados: []
informados: []
sensibilidad: interna
aprobado_por: ''
aprobado_el: ''
evidencia_aprobacion: ''
origen: interno
reemplaza: ''
tags: []
---

# ADR-006: Lint de los archivos .astro: mantener el estado actual y añadir el plugin tras subir Node

## Contexto y problema

Hoy ESLint solo revisa `.js` y `.ts` (`eslint.config.js`). Los `.astro` los revisan `astro check` (tipos, dentro de `pnpm run typecheck`) y Prettier (formato, con `prettier-plugin-astro`). `eslint-plugin-astro` 3.x exige Node 24.16 o superior, y el equipo de desarrollo tiene Node 24.15.0 con `engineStrict: true` en `pnpm-workspace.yaml`, así que instalarlo hoy haría fallar la instalación. Es la pregunta P1: ¿se acepta así de momento o se planifica la subida de Node?

## Factores de decisión

- RNF-011: gate en verde con las versiones de Node que usa el equipo.
- `engineStrict` está activo y `pnpm-workspace.yaml` es ruta protegida.
- Cualquier cambio de ESLint o de dependencias es un cambio de configuración de tests que aprueba David.
- Riesgo real de los `.astro`: la landing tendrá mucha estructura de HTML en ellos.

## Opciones consideradas

- Mantener el lint actual (ESLint para `.js` y `.ts`; `astro check` y Prettier para `.astro`) y añadir el plugin más adelante.
- Subir Node a 24.16 o superior ahora y añadir `eslint-plugin-astro` en este ciclo.
- Añadir una versión anterior del plugin compatible con Node 24.15.0.

## Decisión

Opción elegida: «mantener el estado actual y añadir el plugin más adelante». Hasta entonces los `.astro` quedan cubiertos por `astro check` y Prettier. Cuando el equipo suba a Node 24.16 o superior, añadir `eslint-plugin-astro` y su configuración será un trabajo `test_config` aparte, aprobado por David, porque toca `eslint.config.js`, `package.json` y el lockfile.

### Consecuencias

- Buena, porque el gate sigue en verde sin tocar `engineStrict` ni la configuración protegida.
- Buena, porque no se mezcla la construcción de la landing con un cambio de herramientas.
- Mala, porque mientras tanto no hay reglas de ESLint en los `.astro` (por ejemplo, accesibilidad estática de plantillas).
- Mala, porque exige que alguien decida cuándo se sube Node.

### Cómo se confirma

`pnpm run lint` sigue pasando sin tocar `eslint.config.js`. La subida de Node y el plugin quedan como tarea de David. El riesgo se compensa con las pruebas e2e de accesibilidad de la landing (RNF-001).

## Pros y contras de las opciones

### Mantener el estado actual

- A favor: cero cambios; coherente con `engineStrict`.
- En contra: los `.astro` sin reglas de ESLint.

### Subir Node ahora

- A favor: lint completo antes de escribir los `.astro`.
- En contra: cambia el entorno de todo el equipo y la CI, y requiere aprobación de David.

### Plugin anterior

- A favor: no hay que subir Node.
- En contra: versión antigua con riesgo de incompatibilidad con ESLint 10.15.0 y que acaba reemplazada.

## Más información

Issue #1 (P1), ARCHITECTURE sección 10 y sección 12, AI-AGENTS «Trampas conocidas».
