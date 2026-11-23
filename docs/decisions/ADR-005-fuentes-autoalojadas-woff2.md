---
tipo: adr
titulo: 'ADR-005: Fuentes woff2 autoalojadas en public/fonts, sin peticiones a Google'
proyecto: 'axyntia-web'
cliente: 'interno'
estado: sustituido
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

> **Decisión vigente sobre fuentes:** [ADR-009](ADR-009-fuentes-del-sistema-hasta-tener-woff2.md) (solo fuentes del sistema, aceptado). Este ADR queda como alternativa por si David decide algún día añadir archivos woff2; mientras tanto no se aplica.

## Contexto y problema

Una dirección visual con fuentes propias obliga a servirlas. Si se cargan desde Google Fonts, se envía la IP del visitante a un tercero, lo que choca con RNF-006 (0 peticiones a terceros) y con el RGPD. ¿De dónde se sirven?

## Factores de decisión

- RNF-006: 0 peticiones a terceros al cargar.
- Rendimiento (RNF-004) y legibilidad con `font-display: swap`.
- Licencia de las fuentes: habría que comprobar que sea libre (por ejemplo SIL Open Font License) y que David lo confirme al añadirlas.

## Opciones consideradas

- Autoalojar archivos woff2 en `public/fonts`.
- Cargar desde el CDN de Google Fonts.
- Usar solo fuentes del sistema.

## Decisión

Opción valorada: «autoalojar woff2 en `public/fonts`», con `font-display: swap` y precarga solo de la fuente del titular. Con la dirección visual vigente (DESIGN-SYSTEM §1.1) no se aplica: manda ADR-009.

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
- En contra: la letra varía según el equipo. Es la opción que adopta ADR-009.

## Más información

Issue #1 (A.5), DESIGN-SYSTEM sección 3.2, ARCHITECTURE sección 10.
