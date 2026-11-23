---
tipo: adr
titulo: 'ADR-009: Solo fuentes del sistema, sin archivos de fuentes ni peticiones a terceros'
proyecto: 'axyntia-web'
cliente: 'interno'
estado: aceptado
fecha: '2026-11-22'
creado: '2026-11-22'
actualizado: '2026-11-23'
responsable: factory
decisores: [david]
consultados: []
informados: []
sensibilidad: interna
aprobado_por: 'david'
aprobado_el: '2026-11-22'
evidencia_aprobacion: 'Issue #3 de deividev/axyntia-web, sección «Decisión sobre las tipografías (22 nov, 15:10)»'
origen: interno
reemplaza: ''
tags: []
---

# ADR-009: Solo fuentes del sistema, sin archivos de fuentes ni peticiones a terceros

> El nombre del archivo no cambia para no romper enlaces; el título recoge la decisión vigente.

## Contexto y problema

ADR-005 proponía autoalojar archivos woff2 en `public/fonts`. La issue #3 recoge la decisión de David (22 nov, 15:10): no añadir archivos de fuentes. La nueva dirección visual (DESIGN-SYSTEM §1.1) está pensada para funcionar solo con las fuentes del sistema. ¿Qué tipografía usa la web?

## Factores de decisión

- RNF-006: 0 peticiones a terceros al cargar, y RGPD.
- Rendimiento en móvil (RNF-004): 0 bytes de fuentes y sin cambio de letra al cargar.
- Decisión expresa de David de no añadir archivos de fuentes.

## Opciones consideradas

- Pilas de fuentes del sistema (serif para titulares y sans para el texto).
- Autoalojar archivos woff2 en `public/fonts` (ADR-005).
- Cargar desde el CDN de Google Fonts.

## Decisión

Opción elegida: «pilas de fuentes del sistema», aceptada por David en la issue #3.

- `--font-serif` (titulares) y `--font-sans` (texto) de `src/styles/global.css` usan solo pilas del sistema, tal como define DESIGN-SYSTEM §3 (`ui-serif, Georgia, 'Times New Roman', serif` y `system-ui, sans-serif`). No hay familia monoespaciada.
- Sin `@font-face`, sin precarga, sin archivos de fuentes y sin peticiones a terceros ni a Google.
- La voz tipográfica sale del contraste entre serif y sans, de la escala y del interlineado, no de una fuente descargada.

### Consecuencias

- Buena, porque hay 0 bytes de fuentes y 0 peticiones externas.
- Buena, porque no hay que mantener archivos binarios en el repositorio.
- Mala, porque el aspecto tipográfico depende de lo instalado en el equipo del visitante; se compensa con una escala y un interlineado que funcionan con cualquiera de las pilas.

### Cómo se confirma

`grep -rnE '@font-face|fonts\.(googleapis|gstatic)\.com' src public` sin resultados (regla 9 de DESIGN-SYSTEM) y la prueba e2e de 0 peticiones a terceros (INV-05).

## Pros y contras de las opciones

### Pilas de fuentes del sistema

- A favor: rendimiento, privacidad y decisión de David.
- En contra: la letra varía entre equipos.

### Autoalojar woff2

- A favor: aspecto idéntico en todos los equipos.
- En contra: archivos binarios que mantener y peso añadido; David decidió no añadirlos.

### CDN de Google Fonts

- A favor: sin archivos que mantener.
- En contra: petición a un tercero con la IP del visitante.

## Más información

Issue #3 (sección «Decisión sobre las tipografías (22 nov, 15:10)»), [ADR-005](ADR-005-fuentes-autoalojadas-woff2.md), DESIGN-SYSTEM §3.2 y regla 9 de §7.
