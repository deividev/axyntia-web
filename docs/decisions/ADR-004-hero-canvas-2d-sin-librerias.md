---
tipo: adr
titulo: 'ADR-004: Animación del hero en canvas 2D sin librerías'
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

# ADR-004: Animación del hero en canvas 2D sin librerías

## Contexto y problema

El hero lleva una «constelación de datos» que evoca el CRM en 3D y la IA (RF-010). Debe cumplir RNF-005 (JavaScript ≤ 60 KB gzip), RNF-004 (Lighthouse móvil) y RNF-008 (movimiento reducido). ¿Con qué se dibuja?

## Factores de decisión

- Peso del JavaScript y rendimiento en móvil.
- Licencias permitidas por la factoría y uso de `factory-dep` para toda dependencia nueva.
- Dependencias mínimas.

## Opciones consideradas

- `<canvas>` 2D con código propio: 80 a 150 nodos en una esfera que gira, proyección en perspectiva, líneas entre nodos cercanos.
- GSAP.
- three.js (MIT).

## Decisión

Opción elegida: «canvas 2D sin librerías». Se limita el DPR a 2, se usan menos nodos en móvil, se pausa fuera de pantalla con `IntersectionObserver` y con la pestaña oculta (`visibilitychange`), y reacciona levemente al ratón. Con `prefers-reduced-motion: reduce` no se anima: se muestra un degradado o una imagen estática.

GSAP queda descartado por licencia y peso. three.js (MIT) solo se reconsideraría con un ADR nuevo que lo justifique y con la dependencia aprobada por `factory-dep`.

### Consecuencias

- Buena, porque no añade dependencias ni peso y encaja en el presupuesto de JavaScript.
- Buena, porque se controla la pausa y la reducción de nodos.
- Mala, porque la proyección y el dibujo se escriben a mano y hay que probarlos.
- Mala, porque no hay un 3D real: es una evocación en 2D.

### Cómo se confirma

Revisión de que `package.json` no contiene `gsap` ni `three`; prueba e2e con movimiento reducido emulado y medida del JavaScript de cliente en el trabajo de la landing.

## Pros y contras de las opciones

### canvas 2D propio

- A favor: sin dependencias, ligero.
- En contra: más código propio.

### GSAP

- A favor: animaciones potentes.
- En contra: licencia no incluida entre las permitidas y peso añadido.

### three.js

- A favor: 3D real.
- En contra: peso considerable, dependencia nueva y complejidad no justificada para un fondo decorativo.

## Más información

Issue #1 (A.6), PRD RF-010, RNF-004, RNF-005 y RNF-008; DESIGN-SYSTEM sección 3.3.
