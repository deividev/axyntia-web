---
tipo: adr
titulo: 'ADR-005: Fuentes woff2 autoalojadas en public/fonts, sin peticiones a Google'
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

# ADR-005: Fuentes woff2 autoalojadas en public/fonts, sin peticiones a Google

## Contexto y problema

La dirección visual usa Space Grotesk, Inter y JetBrains Mono, que se publican en Google Fonts. Cargarlas desde Google envía la IP del visitante a un tercero, lo que choca con RNF-006 (0 peticiones a terceros) y con el RGPD. ¿De dónde se sirven?

## Factores de decisión

- RNF-006: 0 peticiones a terceros al cargar.
- Rendimiento (RNF-004) y legibilidad con `font-display: swap`.
- Licencia de las fuentes: las tres se publican con licencia libre (SIL Open Font License); David debe confirmarlo al añadirlas.

## Opciones consideradas

- Autoalojar archivos woff2 en `public/fonts`.
- Cargar desde el CDN de Google Fonts.
- Usar solo fuentes del sistema.

## Decisión

Opción elegida: «autoalojar woff2 en `public/fonts`»: Space Grotesk 500 y 700 (titulares), Inter 400, 500 y 600 (texto) y JetBrains Mono 400 (etiquetas). Se usa `font-display: swap` y solo se precarga la del titular (Space Grotesk 700).

### Consecuencias

- Buena, porque no hay peticiones a Google y se controla la caché.
- Buena, porque el tamaño y los pesos están acotados.
- Mala, porque los archivos woff2 se guardan en el repositorio y hay que actualizarlos a mano.
- Mala, porque `public/` y los woff2 son archivos binarios que Prettier no revisa.

### Cómo se confirma

Prueba e2e de que no hay peticiones a dominios externos (INV-05) y búsqueda de `fonts.googleapis.com` y `fonts.gstatic.com` en el repositorio, que debe dar 0 resultados.

## Pros y contras de las opciones

### Autoalojar woff2

- A favor: privacidad y control.
- En contra: mantenimiento manual.

### CDN de Google Fonts

- A favor: sin archivos que mantener.
- En contra: petición a un tercero con la IP del visitante.

### Fuentes del sistema

- A favor: 0 bytes de fuentes.
- En contra: no se logra la dirección visual pedida.

## Más información

Issue #1 (A.5), DESIGN-SYSTEM sección 3.2, ARCHITECTURE sección 10.
