---
tipo: adr
titulo: 'ADR-008: sitemap.xml y robots.txt como endpoints estáticos que leen siteUrl'
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

# ADR-008: sitemap.xml y robots.txt como endpoints estáticos que leen siteUrl

## Contexto y problema

La web debe publicar `sitemap.xml` y `robots.txt` (RF-042, RF-043). La integración oficial `@astrojs/sitemap` se activa en `astro.config.ts`, que es ruta protegida: cambiarlo es un cambio de configuración de tests que aprueba David. Es la pregunta P3: ¿cómo se generan ambos archivos sin tocar la configuración?

## Factores de decisión

- No tocar `astro.config.ts` ni añadir dependencias.
- Ambos archivos necesitan la dirección absoluta del sitio (`siteUrl`), que hoy es un marcador y cambiará.
- El `robots.txt` incluye la línea `Sitemap:` con URL absoluta.

## Opciones consideradas

- Endpoints estáticos `src/pages/sitemap.xml.ts` y `src/pages/robots.txt.ts` que leen `site.siteUrl`.
- Archivos escritos a mano en `public/`.
- Integración `@astrojs/sitemap`.

## Decisión

Opción elegida: «endpoints estáticos para los dos archivos». Cada endpoint genera su contenido en la compilación a partir de `site.siteUrl` de `src/config/site.ts`. No se crean en este trabajo: los construye el trabajo de la landing.

### Consecuencias

- Buena, porque el dominio se escribe una sola vez, en `siteUrl`, y los dos archivos lo siguen.
- Buena, porque no hay dependencia nueva ni cambio de configuración protegida.
- Mala, porque la lista de páginas del mapa se mantiene a mano en el endpoint.
- Mala, porque hay que probar los dos endpoints con un test de integración.

### Cómo se confirma

Test de integración del trabajo de la landing que compila el sitio y comprueba que `sitemap.xml` y `robots.txt` existen y usan la dirección configurada. `package.json` no debe contener `@astrojs/sitemap`.

## Pros y contras de las opciones

### Endpoints estáticos

- A favor: una sola fuente para el dominio; sin dependencias.
- En contra: lista de páginas manual.

### Archivos en `public/`

- A favor: lo más simple.
- En contra: el dominio, hoy un marcador, queda escrito a mano en dos sitios y se puede olvidar al cambiarlo.

### `@astrojs/sitemap`

- A favor: genera la lista de páginas sola.
- En contra: exige tocar `astro.config.ts` (ruta protegida) y añadir una dependencia. Descartada.

## Más información

Issue #1 (P3), ARCHITECTURE sección 10, ADR-002.
