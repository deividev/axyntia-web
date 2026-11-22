---
tipo: adr
titulo: 'ADR-001: Sitio estático con Astro, Tailwind CSS v4 y TypeScript, sin framework de componentes'
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

# ADR-001: Sitio estático con Astro, Tailwind CSS v4 y TypeScript, sin framework de componentes

## Contexto y problema

La landing es una sola página sin cuentas, sin base de datos y sin backend (PRD, sección 3). Hay que elegir con qué pila se construye para cumplir RNF-004 (Lighthouse), RNF-005 (JavaScript de cliente ≤ 60 KB gzip) y RNF-006 (0 peticiones a terceros). ¿Qué es lo más simple que cumple esos números?

## Factores de decisión

- Poco JavaScript de cliente y salida que se pueda servir desde cualquier alojamiento estático.
- Dependencias mínimas, con versiones exactas y licencias permitidas por la factoría.
- Tres tipos de tests: unitarios, de integración y e2e.
- El esqueleto ya existe en el repositorio.

## Opciones consideradas

- Astro (salida estática) con Tailwind CSS v4 y TypeScript, y JavaScript de cliente en módulos TypeScript.
- Astro con una librería de componentes de interfaz para las partes interactivas.
- Una aplicación de página única con un framework de componentes.

## Decisión

Opción elegida: «Astro estático con Tailwind CSS v4 y TypeScript, sin framework de componentes», porque genera HTML y CSS sin JavaScript por defecto, el esqueleto ya lo usa y las partes interactivas (menú, formulario, animación) caben en módulos pequeños.

### Consecuencias

- Buena, porque el JavaScript de cliente se limita a lo que se escribe a propósito y el presupuesto de 60 KB es alcanzable.
- Buena, porque `output: 'static'` no necesita servidor.
- Mala, porque sin framework de componentes la interactividad se escribe a mano con el DOM y hay que probarla con e2e.
- Mala, porque `astro.config.ts` es ruta protegida y cualquier integración que lo toque exige un cambio de configuración de tests aprobado por David (ver ADR-008).
- Aceptado: `astro.config.ts` usa `passthroughImageService()`, que no transforma imágenes. `sharp` aparece en el árbol solo como dependencia opcional de Astro y no se usa; `onlyBuiltDependencies` sigue vacío.

### Cómo se confirma

`pnpm run build` genera el sitio estático; `tests/integration/build.test.ts` compila de verdad y revisa el HTML y el CSS; RNF-005 se mide sobre la compilación en el trabajo de la landing.

## Pros y contras de las opciones

### Astro estático con Tailwind v4 y TypeScript

- A favor: poco JavaScript, build simple, el esqueleto ya funciona.
- Neutral: la interactividad se escribe a mano.
- En contra: sin componentes reactivos, la lógica de estado del formulario es manual.

### Astro con librería de componentes de interfaz

- A favor: estado reactivo más cómodo en el formulario.
- En contra: añade una dependencia, JavaScript de cliente y superficie de seguridad para un solo formulario.

### Aplicación de página única con framework

- A favor: ecosistema amplio.
- En contra: peor rendimiento inicial y más JavaScript, contrario a RNF-005.

## Más información

Issue #1, ARCHITECTURE sección 3 y sección 12, PRD RNF-004 a RNF-006.
