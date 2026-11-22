---
tipo: adr
titulo: 'ADR-002: Configuración pública centralizada en un único archivo, sin secretos'
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

# ADR-002: Configuración pública centralizada en un único archivo, sin secretos

## Contexto y problema

El número de WhatsApp, el email, el mensaje predefinido, la dirección del sitio y el destino del formulario cambian cuando David sustituye los marcadores (RF-028, RNF-009). ¿Dónde viven esos valores para que haya un solo sitio que cambiar y ningún secreto en el repositorio?

## Factores de decisión

- Un único punto de cambio, documentado en el README.
- Ningún secreto en el repositorio; todo acaba en el HTML público.
- Que los usen a la vez el código de la página, `astro.config.ts` y los endpoints de `sitemap.xml` y `robots.txt`.

## Opciones consideradas

- Un archivo `src/config/site.ts` con un objeto exportado `site` y valores de marcador.
- Variables de entorno `PUBLIC_…` para todos los valores.
- Valores repartidos en cada página o componente.

## Decisión

Opción elegida: «`src/config/site.ts` con un objeto `site`», porque ya existe, se importa desde `astro.config.ts` y desde cualquier módulo, y se puede probar y revisar con una búsqueda. Los campos son `companyName`, `siteUrl`, `contactEmail`, `whatsappNumber`, `whatsappMessage` y `formEndpoint` (vacío por defecto). Las variables `PUBLIC_…` de Astro se incrustan en el HTML y el JavaScript que recibe el navegador, así que solo valen para valores públicos que cambian según el entorno, documentados en el README. Un sitio estático sin backend no puede guardar secretos: si algún día hiciera falta uno, exigiría un backend o una función de servidor y un ADR nuevo aprobado por David. Hoy no hace falta.

### Consecuencias

- Buena, porque cambiar un dato es editar un archivo y el plan B por correo funciona mientras `formEndpoint` está vacío.
- Buena, porque `buildWhatsAppUrl` de `src/lib/whatsapp.ts` recibe el número y el mensaje desde ahí.
- Mala, porque cambiar los valores exige una nueva compilación y despliegue.
- Mala, porque el archivo es público: nadie debe pegar en él nada que no pueda verse en el HTML.

### Cómo se confirma

La invariante INV-04 de ARCHITECTURE: búsqueda de `formspree.io/f/` con un identificador real en el repositorio (debe dar 0 resultados) y revisión de Security. Hoy los valores son marcadores (`https://axyntia.example`, `hola@axyntia.example`, `34600000000`).

## Pros y contras de las opciones

### Archivo `src/config/site.ts`

- A favor: un solo lugar, tipado, importable desde cualquier módulo.
- En contra: los cambios exigen compilar de nuevo.

### Variables de entorno `PUBLIC_…`

- A favor: valores distintos por entorno sin tocar código.
- En contra: la configuración queda repartida entre el entorno y el repositorio y es fácil comitear un valor real por error.

### Valores repartidos

- A favor: ninguno.
- En contra: se olvidan cambios y los textos y enlaces se desincronizan.

## Más información

PRD RF-028 y RNF-009; ARCHITECTURE sección 7. README, sección «Datos de contacto».
