---
tipo: adr
titulo: 'ADR-007: Telemetría de Astro desactivada por variable de entorno en el gate y la CI'
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

# ADR-007: Telemetría de Astro desactivada por variable de entorno en el gate y la CI

## Contexto y problema

Astro envía datos anónimos de uso. Hoy se desactiva con `ASTRO_TELEMETRY_DISABLED=1` en cada comprobación del gate y en la CI (`.github/workflows/ci.yml`). Es la pregunta P2: ¿basta con eso o hay que desactivarla también de forma global en los equipos de desarrollo?

## Factores de decisión

- Privacidad y coherencia con «sin analítica» (PRD sección 3).
- La telemetría no forma parte de la web publicada: es del comando de desarrollo.
- No tocar configuración protegida ni máquinas fuera del repositorio.

## Opciones consideradas

- Basta la variable de entorno en el gate y la CI; en los equipos de desarrollo, recomendación personal.
- Desactivarla de forma global en los equipos con `astro telemetry disable`.
- Añadir la variable a un archivo del repositorio (por ejemplo, un script de `package.json`).

## Decisión

Opción elegida: «basta la variable de entorno en el gate y la CI». Para los equipos de desarrollo se recomienda, como acción personal y fuera del repositorio, ejecutar `astro telemetry disable` o exportar `ASTRO_TELEMETRY_DISABLED=1` en el perfil de la terminal. El README ya lo cita. No se cambia ningún archivo del repositorio por este motivo.

### Consecuencias

- Buena, porque no hay cambios de código ni de configuración protegida.
- Buena, porque la CI y el gate, que son lo que se controla, ya la tienen desactivada.
- Mala, porque la protección de los equipos depende de que cada persona lo haga.
- Mala, porque un comando que alguien ejecute sin la variable puede enviar datos anónimos.

### Cómo se confirma

Revisión de que `ci.yml` define `ASTRO_TELEMETRY_DISABLED: '1'` y de que el gate la pone en cada orden. La parte de los equipos no se puede comprobar desde el repositorio; es una acción de David en cada máquina.

## Pros y contras de las opciones

### Variable en el gate y la CI, recomendación en los equipos

- A favor: sin cambios en el repositorio.
- En contra: depende de cada persona en local.

### Desactivación global en los equipos

- A favor: cubre todos los comandos de Astro.
- En contra: actúa fuera del repositorio y no es verificable aquí.

### Variable en un archivo del repositorio

- A favor: se aplica sola.
- En contra: toca `package.json` o la configuración, que son rutas controladas.

## Más información

Issue #1 (P2), README, AI-AGENTS «Trampas conocidas».
