---
tipo: adr
titulo: 'ADR-003: Envío del formulario con Formspree y plan B mailto: cuando no hay destino'
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

# ADR-003: Envío del formulario con Formspree y plan B mailto: cuando no hay destino

## Contexto y problema

El formulario debe llegar a Axyntia sin backend propio (RF-019 a RF-023, PRD sección 3). ¿Cómo se envían los datos y qué pasa mientras David no ha creado el formulario en el servicio externo?

## Factores de decisión

- Sin servidor propio, sin base de datos y sin secretos en el repositorio.
- El visitante nunca debe quedarse sin forma de contactar.
- Los datos personales (nombre, email, empresa, mensaje) salen a un tercero: requiere aprobación de David y mención en la política de privacidad.

## Opciones consideradas

- Formspree con `POST` a la URL configurada en `formEndpoint` y, si está vacía, plan B `mailto:` al `contactEmail`.
- Solo `mailto:`, sin servicio externo.
- Backend propio que envíe los correos.

## Decisión

Opción elegida: «Formspree con plan B `mailto:`», decisión de David recogida en la issue #1. Con `formEndpoint` configurado (`https://formspree.io/f/<id>`), el cliente envía un `POST` con `Accept: application/json` y muestra los estados «Enviando…», éxito y error. Con `formEndpoint` vacío (valor actual), abre un `mailto:` a `contactEmail` con asunto y cuerpo codificados con `encodeURIComponent`. [APROBACIÓN DAVID]: el envío de datos personales a Formspree.

### Consecuencias

- Buena, porque no hay servidor que mantener y el endpoint es público por diseño, sin secretos.
- Buena, porque mientras no exista el formulario sigue habiendo contacto.
- Mala, porque Formspree trata datos personales y la política de privacidad debe mencionarlo (pregunta abierta 2 del PRD).
- Mala, porque `mailto:` depende de que el visitante tenga un cliente de correo configurado.

### Cómo se confirma

En el trabajo de la landing: prueba e2e con respuesta 200 simulada, con respuesta de error y con endpoint vacío (que comprueba el `mailto:`), y prueba de que el honeypot relleno no envía. Revisión de Security sobre el flujo de datos.

## Pros y contras de las opciones

### Formspree con plan B `mailto:`

- A favor: sin backend, configurable, con alternativa.
- Neutral: el servicio externo puede cambiar de condiciones.
- En contra: tercero que trata datos personales.

### Solo `mailto:`

- A favor: ningún tercero.
- En contra: peor conversión y sin confirmación de envío.

### Backend propio

- A favor: control total.
- En contra: contradice el alcance (sin backend), añade hosting, mantenimiento y seguridad.

## Más información

Issue #1 (A.4), ARCHITECTURE sección 5 y sección 7, PRD RF-019 a RF-023 y pregunta abierta 2.
