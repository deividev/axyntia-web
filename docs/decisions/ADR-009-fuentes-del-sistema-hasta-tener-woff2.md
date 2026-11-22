---
tipo: adr
titulo: 'ADR-009: Pilas de fuentes del sistema hasta tener los woff2 (aplaza ADR-005)'
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

# ADR-009: Pilas de fuentes del sistema hasta tener los woff2 (aplaza ADR-005)

## Contexto y problema

ADR-005 manda autoalojar los woff2 de Space Grotesk, Inter y JetBrains Mono en `public/fonts`. Esos archivos no están disponibles todavía. La issue #3 recoge la decisión de David (22 nov, 15:10): no añadir archivos de fuentes en esta versión.

## Decisión

- `font-family` usa primero la familia de la marca y después una pila del sistema (sans-serif para titulares y texto, monospace para las etiquetas), definida en `--font-display`, `--font-sans` y `--font-mono` de `src/styles/global.css`.
- Sin `@font-face`, sin precarga y sin peticiones a terceros ni a Google.
- ADR-005 sigue siendo el destino: cuando haya woff2, se añaden a `public/fonts` y se retira este aplazamiento.

## Consecuencias

- Mejor rendimiento y cero peticiones externas; el aspecto tipográfico depende de lo instalado en el equipo del visitante.
- La regla 9 de DESIGN-SYSTEM sigue valiendo: no hay fuentes de terceros.
