---
tipo: adr
titulo: 'ADR-010: Hero tipográfico sin canvas ni animación continua (sustituye a ADR-004)'
proyecto: 'axyntia-web'
cliente: 'interno'
estado: propuesta
fecha: '2026-11-23'
creado: '2026-11-23'
actualizado: '2026-11-23'
responsable: factory
decisores: [david]
consultados: []
informados: []
sensibilidad: interna
aprobado_por: ''
aprobado_el: ''
evidencia_aprobacion: ''
origen: interno
reemplaza: 'ADR-004'
tags: []
---

# ADR-010: Hero tipográfico sin canvas ni animación continua (sustituye a ADR-004)

## Contexto y problema

ADR-004 eligió un `<canvas>` 2D con una «constelación de datos» como fondo del hero. La prueba 01 de la factoría midió esa solución: la constelación en canvas gastaba el 52,5 % del hilo principal con la CPU 4× más lenta, justo el caso del público de Axyntia (dueños y gerentes de pymes que leen en el móvil). Además, el diagnóstico de la prueba la señaló, junto con el fondo casi negro con degradado cian-violeta, como un rasgo de «web hecha con IA». La nueva dirección visual (DESIGN-SYSTEM §1.1) pide otra cosa. ¿Con qué se resuelve el hero?

## Factores de decisión

- Rendimiento medido en móvil: el gate de la factoría mide `factory-perf` y Lighthouse con los umbrales de `global.yaml` (RNF-004).
- Dirección visual propia (DESIGN-SYSTEM §1.1) y público no técnico.
- RNF-005: JavaScript de cliente ≤ 60 KB gzip, y RNF-008: movimiento reducido.
- Dependencias mínimas.

## Opciones consideradas

- Mantener el canvas 2D de ADR-004, con menos nodos y más pausas.
- Hero tipográfico: titular en serif del sistema a gran tamaño sobre papel liso, sin canvas, imagen decorativa ni animación.
- Imagen o vídeo decorativo de fondo.

## Decisión

Opción elegida: «hero tipográfico». El hero es el titular (`sys.type.display`) con la palabra clave subrayada con una línea estática, el subtítulo y los dos botones, sobre el fondo `bg` liso. No hay canvas, ni animación continua, ni reacción al ratón. El movimiento de toda la web se limita a `transform` y `opacity`, de corta duración, y nunca es continuo (DESIGN-SYSTEM §1.1 y §3.3). GSAP y three.js siguen sin usarse.

### Consecuencias

- Buena, porque se elimina el coste de CPU medido y el hero pinta con el primer HTML.
- Buena, porque quita código de cliente (el módulo del canvas) y su presupuesto de JavaScript.
- Buena, porque el hero ya no depende de una preferencia de movimiento reducido.
- Mala, porque el hero depende de la calidad de la composición tipográfica y no de un efecto llamativo.
- Mala, porque el código actual (`Hero.astro`, `hero-canvas.ts`) y el test e2e CA-31 del canvas contradicen este ADR hasta que se haga la issue #10; no se tocan en este trabajo.

### Cómo se confirma

En el trabajo de la landing (issue #10): `grep -rnE 'canvas|requestAnimationFrame' src` sin resultados, prueba e2e con movimiento reducido emulado, y `factory-perf` y Lighthouse móvil del gate en verde con los umbrales de `global.yaml`.

## Pros y contras de las opciones

### Mantener el canvas 2D

- A favor: sin dependencias y ya escrito.
- En contra: 52,5 % del hilo principal con la CPU 4× más lenta, y es uno de los rasgos de «hecha con IA».

### Hero tipográfico

- A favor: coste de CPU nulo, texto visible desde la carga, identidad propia.
- En contra: sin efecto visual; la calidad depende de la tipografía y el espacio.

### Imagen o vídeo decorativo

- A favor: impacto visual.
- En contra: peso, y las imágenes de stock o generadas quedan fuera de alcance (PRD §3).

## Más información

Sustituye a [ADR-004](ADR-004-hero-canvas-2d-sin-librerias.md). Issue #11 (docs), issue #10 (landing), DESIGN-SYSTEM §1.1, §3.3 y §5, PRD RF-010, RNF-004 y RNF-008.
