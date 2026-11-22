---
tipo: prd
titulo: 'Web corporativa de Axyntia'
proyecto: 'axyntia-web'
cliente: 'interno'
estado: propuesta
version: 0.1.0
fecha: '2026-11-22'
creado: '2026-11-22'
actualizado: '2026-11-22'
responsable: factory
sensibilidad: interna
aprobado_por: ''
aprobado_el: ''
evidencia_aprobacion: ''
origen: interno
reemplaza: ''
tags: []
---

# Web corporativa de Axyntia: requisitos de producto

## 1. Problema y por qué

Axyntia es una empresa española de software a medida e IA. Sus clientes potenciales son dueños, gerentes y responsables de operaciones de pymes que no son técnicos. Hoy Axyntia no tiene una web propia donde estas personas vean qué ofrece la empresa y puedan escribirle. Sin ese punto de entrada, cada contacto depende de recomendaciones o de conversaciones sueltas, y quien llega por otra vía no encuentra información que le ayude a decidir.

**Evidencia:** petición de la issue #1 del repositorio `axyntia-web` y su anexo de requisitos. No hay datos de visitas, de contactos ni de mercado: no existe web previa.
**Por qué ahora:** el repositorio ya tiene el esqueleto técnico y falta fijar el contrato de producto antes de construir la landing en trabajos posteriores.

## 2. Usuarios

| Usuario                                                 | Contexto (dónde, con qué dispositivo, cuánto sabe)                                                                                                                | Tarea principal                                                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Dueño, gerente o responsable de operaciones de una pyme | Empresa española de 5 a 250 empleados. Lee sobre todo en el móvil y también en escritorio. No es técnico y quiere ahorrar costes, ordenar sus clientes o usar IA. | Entender qué hace Axyntia y contactar con la empresa por formulario o WhatsApp.                        |
| Persona de Axyntia que recibe contactos (David)         | Recibe los mensajes del formulario, de WhatsApp o del correo. Configura los datos de contacto.                                                                    | Recibir mensajes completos y poder cambiar número, correo y destino del formulario sin rehacer la web. |

## 3. Objetivos y no-objetivos

**Objetivos**

- Que una pyme vea en menos de 30 segundos qué hace Axyntia (RNF-012).
- Que contactar cueste un clic desde el primer bloque de la página (CE-002).
- Que la persona llegue a «Contacto» y envíe el formulario o abra WhatsApp (CE-001).
- Que la web sea accesible (WCAG 2.2 AA) y legible en móvil desde 360 px de ancho.
- Que el contenido no invente cifras, clientes ni testimonios.

**No-objetivos**

- Despliegue, hosting y dominio: se deciden fuera de este producto y de la factoría.
- Backend propio o envío de correos desde un servidor: el formulario usa un servicio externo y un plan B por correo.
- Base de datos: la web no guarda datos de visitantes ni de mensajes.
- Analítica y cookies, y por tanto banner de cookies: se respeta la privacidad del visitante y se evita una carga legal innecesaria.
- Blog, CMS y varios idiomas: la v1 es una sola página en español de España.
- Chat en vivo o agente de IA real en la web: la web describe los servicios, no los ejecuta.
- Logo definitivo: se usa un logotipo de texto provisional.
- Imágenes generadas con IA o de stock de pago: por coste y por derechos de uso.
- Textos legales definitivos: solo hay plantilla con marcadores que rellena David, porque requieren datos de la empresa y revisión legal.
- Casos de éxito, clientes, cifras o testimonios: no hay datos reales y no se inventan.

## 4. Alcance de la v1

| Entra en la v1                                                                                                           | Queda fuera (y cuándo se revisa)                                            |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Página única con cabecera, hero, servicios, cómo trabajamos, por qué nosotros, contacto y pie                            | Blog, CMS y multidioma: tras la v1, si David lo pide                        |
| Formulario de contacto con validación y plan B por correo                                                                | Backend propio: solo si el servicio externo deja de servir                  |
| Botón y enlace de WhatsApp                                                                                               | Chat en vivo y agente de IA en la web: no previsto                          |
| Páginas `/aviso-legal` y `/privacidad` con marcadores                                                                    | Textos legales definitivos: los redacta y revisa David antes de publicar    |
| Datos para buscadores: título, descripción, imagen para compartir, datos estructurados, mapa del sitio, robots y favicon | Analítica y cookies: no previsto                                            |
| Animaciones suaves que respetan la preferencia de movimiento reducido                                                    | Casos de éxito, clientes, cifras y testimonios: cuando existan datos reales |
| Logotipo de texto provisional con un símbolo sencillo                                                                    | Logo definitivo: cuando David lo encargue                                   |

## 5. Historias de usuario

### HU-01 · Entender la oferta en menos de 30 segundos · P1

Como dueño o gerente de una pyme, quiero ver de un vistazo qué servicios ofrece Axyntia y cómo trabaja para decidir si le escribo.

- **Por qué esta prioridad:** es la razón de la web; sin esto no hay contacto.
- **Prueba independiente:** abrir la página en un móvil de 360 px y recorrerla de arriba abajo: están las siete secciones en orden, las cuatro tarjetas de servicio con sus títulos y las cuatro razones, sin necesidad de formulario ni páginas legales.
- **Criterios de aceptación:**
  - [ ] Dado que abro la página, cuando la recorro, entonces veo en este orden: cabecera fija, hero, servicios, cómo trabajamos, por qué nosotros, contacto y pie. (RF-001)
  - [ ] Dado que pulso un enlace de la cabecera, cuando el destino es una sección, entonces la página se desplaza a `#servicios`, `#como-trabajamos`, `#por-que` o `#contacto`. (RF-002)
  - [ ] EL SISTEMA DEBE mostrar un solo `h1` y una jerarquía de encabezados sin saltos de nivel. (RF-003)
  - [ ] Dado que miro la cabecera, entonces veo el logotipo de texto «Axyntia» con su símbolo, los enlaces a Servicios, Cómo trabajamos, Por qué nosotros y Contacto, y el botón «Hablemos». (RF-004)
  - [ ] Dado que miro el hero, entonces veo el titular, el subtítulo y dos botones: «Solicita una propuesta», que lleva a `#contacto`, y «Escríbenos por WhatsApp». (RF-005)
  - [ ] Dado que miro Servicios, entonces hay cuatro tarjetas con los títulos «CRM personalizados en 3D», «Desarrollo de software a medida», «Agentes de IA personalizados» y «Automatizaciones que reducen gastos en tu empresa», cada una con icono, descripción de 2 o 3 frases y 3 beneficios. (RF-006)
  - [ ] Dado que miro «Cómo trabajamos», entonces veo cuatro pasos (Descubrimiento, Diseño y prototipo, Desarrollo por iteraciones, Lanzamiento y mejora continua) y una línea de progreso que avanza con el desplazamiento. (RF-007)
  - [ ] Dado que miro «Por qué nosotros», entonces hay exactamente cuatro razones: a medida y sin plantillas, IA aplicada a resultados medibles, comunicación directa con quien desarrolla, y código y datos tuyos. (RF-008)
  - [ ] Dado que miro el pie, entonces veo el logotipo, los enlaces de sección, los enlaces a «Aviso legal» y «Política de privacidad» y el año actual. (RF-009)
  - [ ] DONDE el visitante no pide movimiento reducido, EL SISTEMA DEBE mostrar en el hero una animación decorativa que reacciona levemente al ratón. (RF-010)
  - [ ] DONDE el visitante no pide movimiento reducido, EL SISTEMA DEBE mostrar las secciones con una aparición suave al llegar a ellas. (RF-011)

### HU-02 · Contactar por formulario · P1

Como dueño o gerente de una pyme, quiero enviar un mensaje desde la web para pedir una propuesta sin salir de la página.

- **Por qué esta prioridad:** el formulario es una de las dos formas de cumplir la métrica de éxito.
- **Prueba independiente:** rellenar y enviar el formulario con el servicio externo simulado y con el destino vacío, sin usar WhatsApp ni las páginas legales.
- **Criterios de aceptación:**
  - [ ] Dado que miro el formulario, entonces hay nombre, email, empresa, servicio de interés (los 4 servicios y «Otro»), mensaje y casilla de privacidad con enlace. (RF-012)
  - [ ] SI nombre, email o mensaje están vacíos, ENTONCES EL SISTEMA DEBE impedir el envío y mostrar un mensaje en español junto a cada campo. (RF-013)
  - [ ] SI el email no tiene un formato válido, ENTONCES EL SISTEMA DEBE impedir el envío y mostrar el mensaje junto al campo. (RF-014)
  - [ ] SI el mensaje tiene menos de 10 o más de 2000 caracteres, ENTONCES EL SISTEMA DEBE impedir el envío y mostrar el mensaje junto al campo. (RF-015)
  - [ ] SI la casilla de privacidad no está marcada, ENTONCES EL SISTEMA DEBE impedir el envío y mostrar el mensaje junto a la casilla. (RF-016)
  - [ ] CUANDO hay errores, EL SISTEMA DEBE asociar cada mensaje a su campo y anunciar un resumen de errores a los lectores de pantalla. (RF-017)
  - [ ] SI el campo oculto contra spam viene relleno, ENTONCES EL SISTEMA DEBE no enviar nada y no avisar al remitente del motivo. (RF-018)
  - [ ] CUANDO el formulario es válido y hay un destino del servicio de formularios configurado, EL SISTEMA DEBE enviar los datos a Formspree y mostrar «Enviando…» mientras espera. (RF-019)
  - [ ] CUANDO el servicio responde con éxito, EL SISTEMA DEBE mostrar «Gracias, te respondemos en 24 h laborables» y vaciar el formulario. (RF-020)
  - [ ] SI el servicio responde con error o no hay conexión, ENTONCES EL SISTEMA DEBE mostrar un mensaje de error con las alternativas de WhatsApp y email y conservar lo escrito. (RF-021)
  - [ ] CUANDO el formulario es válido y el destino está vacío, EL SISTEMA DEBE abrir un correo `mailto:` al email de contacto con asunto y cuerpo rellenados con los datos del formulario. (RF-022)
  - [ ] Dado un mensaje con tildes, `&`, saltos de línea o emojis, cuando se prepara el correo, entonces los caracteres quedan codificados sin pérdida. (RF-023)
  - [ ] SI el visitante no tiene la parte interactiva de la página disponible, ENTONCES EL SISTEMA DEBE [POR ACLARAR: comportamiento del formulario sin JavaScript]. (RF-024)

### HU-03 · Contactar por WhatsApp o correo · P1

Como dueño o gerente de una pyme, quiero abrir WhatsApp con un mensaje ya escrito o ver el correo de contacto para escribir por el canal que prefiero.

- **Por qué esta prioridad:** WhatsApp es la otra forma de cumplir la métrica de éxito y es el canal preferido en móvil.
- **Prueba independiente:** pulsar el botón de WhatsApp del hero y el de «Contacto» y comprobar el destino, sin usar el formulario.
- **Criterios de aceptación:**
  - [ ] Dado que pulso un botón de WhatsApp, cuando se abre el enlace, entonces usa el número y el mensaje predefinido de la configuración, con el mensaje codificado. (RF-025)
  - [ ] CUANDO se pulsa un enlace de WhatsApp, EL SISTEMA DEBE abrirlo con `target="_blank"` y `rel="noopener noreferrer"`. (RF-026)
  - [ ] Dado que miro «Contacto», entonces veo el formulario, el botón de WhatsApp y el email de contacto. (RF-027)
  - [ ] EL SISTEMA DEBE tomar el número, el mensaje, el email, la dirección del sitio y el destino del formulario de un único punto de configuración, y la documentación del proyecto DEBE explicar cómo cambiarlos. (RF-028)

### HU-04 · Navegar en móvil y con teclado · P1

Como visitante que usa el móvil o el teclado, quiero moverme por la página sin obstáculos para llegar a «Contacto».

- **Por qué esta prioridad:** la mayoría lee en móvil y la accesibilidad es un requisito de producto.
- **Prueba independiente:** abrir la página a 360, 768, 1024 y 1440 px y recorrerla solo con teclado, sin enviar el formulario.
- **Criterios de aceptación:**
  - [ ] Dado un ancho de móvil, cuando abro el menú de la cabecera con el teclado, entonces el estado abierto o cerrado se anuncia y la tecla Escape lo cierra. (RF-029)
  - [ ] Dado un ancho de 360, 768, 1024 o 1440 px, cuando miro la página, entonces no hay desplazamiento horizontal ni elementos solapados. (RF-030)
  - [ ] Dado que empiezo a navegar con el teclado, cuando pulso la primera tecla de tabulación, entonces aparece el enlace «Saltar al contenido». (RF-031)
  - [ ] EL SISTEMA DEBE permitir usar todos los enlaces, botones y campos con el teclado y mostrar el foco de forma visible. (RF-032)
  - [ ] EL SISTEMA DEBE declarar el idioma del documento como español. (RF-045)
  - [ ] EL SISTEMA DEBE dar texto alternativo a las imágenes informativas y `alt` vacío a las decorativas. (RF-046)

### HU-05 · Consultar las páginas legales · P2

Como visitante, quiero leer el aviso legal y la política de privacidad para saber quién gestiona la web y qué se hace con mis datos.

- **Por qué esta prioridad:** son necesarias antes de publicar, pero la landing aporta valor de contacto sin ellas en pruebas.
- **Prueba independiente:** abrir `/aviso-legal` y `/privacidad` directamente por su dirección.
- **Criterios de aceptación:**
  - [ ] Dado que abro `/aviso-legal`, entonces veo un texto base con marcadores. (RF-033)
  - [ ] Dado que abro `/privacidad`, entonces veo un texto base con marcadores. (RF-034)
  - [ ] EL SISTEMA DEBE dejar marcadores visibles para el titular, el NIF, el domicilio y el email, que rellena David, y no incluir datos reales. (RF-035)
  - [ ] EL SISTEMA DEBE no usar cookies ni analítica y, por tanto, no mostrar banner de cookies. (RF-036)
  - [ ] EL SISTEMA DEBE [POR ACLARAR: texto de la política de privacidad sobre el envío de datos a Formspree] en la página de privacidad. (RF-037)

### HU-06 · Encontrar y compartir la web · P2

Como persona que busca o recibe el enlace de Axyntia, quiero ver un título, una descripción y una imagen claros para reconocer la empresa.

- **Por qué esta prioridad:** mejora la visibilidad, pero no condiciona el contacto.
- **Prueba independiente:** inspeccionar la información de cabecera de la página y abrir el mapa del sitio y el archivo de robots.
- **Criterios de aceptación:**
  - [ ] EL SISTEMA DEBE tener un título y una descripción propios para la página de inicio. (RF-038)
  - [ ] EL SISTEMA DEBE declarar una dirección canónica construida a partir de la dirección del sitio configurada. (RF-039)
  - [ ] EL SISTEMA DEBE incluir datos para compartir en redes (Open Graph y Twitter) con una imagen de 1200×630 px. (RF-040)
  - [ ] EL SISTEMA DEBE incluir datos estructurados de tipo `Organization` o `ProfessionalService`. (RF-041)
  - [ ] Dado que abro `/sitemap.xml`, entonces veo las páginas públicas con direcciones absolutas. (RF-042)
  - [ ] Dado que abro `/robots.txt`, entonces veo las reglas para buscadores y la dirección del mapa del sitio. (RF-043)
  - [ ] EL SISTEMA DEBE ofrecer un favicon en formato SVG. (RF-044)

## 6. Requisitos

**Funcionales**

| ID     | Requisito                                                                                                                                                     | Historia | Prioridad |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| RF-001 | EL SISTEMA DEBE ser una página única con siete bloques en orden: cabecera fija, hero, servicios, cómo trabajamos, por qué nosotros, contacto y pie            | HU-01    | P1        |
| RF-002 | EL SISTEMA DEBE ofrecer las anclas `#servicios`, `#como-trabajamos`, `#por-que` y `#contacto`                                                                 | HU-01    | P1        |
| RF-003 | EL SISTEMA DEBE tener un solo `h1` y encabezados sin saltos de nivel                                                                                          | HU-01    | P1        |
| RF-004 | EL SISTEMA DEBE mostrar en la cabecera logotipo de texto con símbolo, cuatro enlaces y el botón «Hablemos»                                                    | HU-01    | P1        |
| RF-005 | EL SISTEMA DEBE mostrar en el hero titular, subtítulo y los botones «Solicita una propuesta» (a `#contacto`) y «Escríbenos por WhatsApp»                      | HU-01    | P1        |
| RF-006 | EL SISTEMA DEBE mostrar cuatro tarjetas de servicio con los títulos indicados, icono, descripción de 2 o 3 frases y 3 beneficios                              | HU-01    | P1        |
| RF-007 | EL SISTEMA DEBE mostrar cuatro pasos de «Cómo trabajamos» con una línea de progreso ligada al desplazamiento                                                  | HU-01    | P1        |
| RF-008 | EL SISTEMA DEBE mostrar solo las cuatro razones de «Por qué nosotros», sin cifras, clientes, logos ni testimonios                                             | HU-01    | P1        |
| RF-009 | EL SISTEMA DEBE mostrar en el pie logotipo, enlaces de sección, enlaces legales y el año actual                                                               | HU-01    | P1        |
| RF-010 | DONDE no se pide movimiento reducido, EL SISTEMA DEBE mostrar una animación decorativa en el hero que reacciona levemente al ratón y se pausa cuando no se ve | HU-01    | P2        |
| RF-011 | DONDE no se pide movimiento reducido, EL SISTEMA DEBE mostrar las secciones con una aparición suave                                                           | HU-01    | P2        |
| RF-012 | EL SISTEMA DEBE ofrecer los campos nombre, email, empresa (opcional), servicio de interés, mensaje y casilla de privacidad                                    | HU-02    | P1        |
| RF-013 | SI nombre, email o mensaje están vacíos, ENTONCES EL SISTEMA DEBE impedir el envío y explicarlo junto al campo                                                | HU-02    | P1        |
| RF-014 | SI el email no es válido, ENTONCES EL SISTEMA DEBE impedir el envío y explicarlo                                                                              | HU-02    | P1        |
| RF-015 | SI el mensaje tiene menos de 10 o más de 2000 caracteres, ENTONCES EL SISTEMA DEBE impedir el envío                                                           | HU-02    | P1        |
| RF-016 | SI la casilla de privacidad no está marcada, ENTONCES EL SISTEMA DEBE impedir el envío; la casilla enlaza a `/privacidad`                                     | HU-02    | P1        |
| RF-017 | EL SISTEMA DEBE asociar cada error a su campo y anunciar un resumen                                                                                           | HU-02    | P1        |
| RF-018 | SI el campo oculto contra spam está relleno, ENTONCES EL SISTEMA DEBE no enviar y no informar del motivo                                                      | HU-02    | P1        |
| RF-019 | CUANDO hay destino del servicio de formularios y el formulario es válido, EL SISTEMA DEBE enviarlo a Formspree y mostrar «Enviando…»                          | HU-02    | P1        |
| RF-020 | CUANDO el envío tiene éxito, EL SISTEMA DEBE mostrar «Gracias, te respondemos en 24 h laborables» y vaciar el formulario                                      | HU-02    | P1        |
| RF-021 | SI el envío falla, ENTONCES EL SISTEMA DEBE mostrar el error con alternativas de WhatsApp y email y conservar los datos                                       | HU-02    | P1        |
| RF-022 | CUANDO el destino está vacío y el formulario es válido, EL SISTEMA DEBE abrir un `mailto:` con asunto y cuerpo rellenados                                     | HU-02    | P1        |
| RF-023 | EL SISTEMA DEBE codificar tildes, `&`, saltos de línea y emojis en el correo y en el mensaje de WhatsApp                                                      | HU-02    | P1        |
| RF-024 | SI no está disponible la parte interactiva, ENTONCES EL SISTEMA DEBE [POR ACLARAR: comportamiento del formulario sin JavaScript]                              | HU-02    | P2        |
| RF-025 | EL SISTEMA DEBE abrir WhatsApp con el número y el mensaje de la configuración, codificado                                                                     | HU-03    | P1        |
| RF-026 | EL SISTEMA DEBE abrir WhatsApp con `target="_blank"` y `rel="noopener noreferrer"`                                                                            | HU-03    | P1        |
| RF-027 | EL SISTEMA DEBE mostrar en «Contacto» el formulario, el botón de WhatsApp y el email de contacto                                                              | HU-03    | P1        |
| RF-028 | EL SISTEMA DEBE tomar los datos de contacto de un único punto de configuración, documentado para quien lo cambie                                              | HU-03    | P1        |
| RF-029 | EL SISTEMA DEBE ofrecer en móvil un menú desplegable operable con teclado, que anuncia su estado y se cierra con Escape                                       | HU-04    | P1        |
| RF-030 | EL SISTEMA DEBE no tener desplazamiento horizontal ni solapes a 360, 768, 1024 y 1440 px                                                                      | HU-04    | P1        |
| RF-031 | EL SISTEMA DEBE ofrecer un enlace «Saltar al contenido»                                                                                                       | HU-04    | P1        |
| RF-032 | EL SISTEMA DEBE permitir usar todo con teclado, con foco visible y etiquetas en todos los campos                                                              | HU-04    | P1        |
| RF-033 | EL SISTEMA DEBE ofrecer la página `/aviso-legal`                                                                                                              | HU-05    | P2        |
| RF-034 | EL SISTEMA DEBE ofrecer la página `/privacidad`                                                                                                               | HU-05    | P2        |
| RF-035 | EL SISTEMA DEBE usar marcadores de titular, NIF, domicilio y email en los textos legales                                                                      | HU-05    | P2        |
| RF-036 | EL SISTEMA DEBE no usar cookies ni analítica y no mostrar banner de cookies                                                                                   | HU-05    | P2        |
| RF-037 | EL SISTEMA DEBE [POR ACLARAR: texto de la política de privacidad sobre el envío de datos a Formspree]                                                         | HU-05    | P2        |
| RF-038 | EL SISTEMA DEBE tener título y descripción propios                                                                                                            | HU-06    | P2        |
| RF-039 | EL SISTEMA DEBE declarar una dirección canónica a partir de la dirección configurada                                                                          | HU-06    | P2        |
| RF-040 | EL SISTEMA DEBE incluir datos Open Graph y Twitter con imagen de 1200×630 px                                                                                  | HU-06    | P2        |
| RF-041 | EL SISTEMA DEBE incluir datos estructurados `Organization` o `ProfessionalService`                                                                            | HU-06    | P2        |
| RF-042 | EL SISTEMA DEBE publicar `sitemap.xml`                                                                                                                        | HU-06    | P2        |
| RF-043 | EL SISTEMA DEBE publicar `robots.txt`                                                                                                                         | HU-06    | P2        |
| RF-044 | EL SISTEMA DEBE ofrecer un favicon SVG                                                                                                                        | HU-06    | P2        |
| RF-045 | EL SISTEMA DEBE declarar el idioma del documento como español                                                                                                 | HU-04    | P1        |
| RF-046 | EL SISTEMA DEBE dar texto alternativo a las imágenes informativas y `alt` vacío a las decorativas                                                              | HU-04    | P1        |

**No funcionales**

| ID      | Requisito (con cifra)                                                                                                                          | Cómo se comprueba                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| RNF-001 | Accesibilidad WCAG 2.2 AA en toda la web                                                                                                       | Revisión manual y pruebas e2e                                          |
| RNF-002 | Contraste ≥ 4,5:1 en texto normal y ≥ 3:1 en texto grande y elementos de interfaz                                                              | Tabla de contraste del sistema de diseño y revisión                    |
| RNF-003 | Sin desplazamiento horizontal ni solapes a 360, 768, 1024 y 1440 px de ancho                                                                   | Prueba e2e a los cuatro anchos                                         |
| RNF-004 | Lighthouse móvil, en la versión de producción: Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95 y SEO ≥ 95                          | Medido a mano por Eryon en la revisión del PR; no forma parte del gate |
| RNF-005 | JavaScript de cliente ≤ 60 KB comprimido con gzip                                                                                              | Medida del resultado de la compilación                                 |
| RNF-006 | 0 peticiones a terceros al cargar la página                                                                                                    | Prueba e2e que registra las peticiones                                 |
| RNF-007 | Imágenes en AVIF o WebP con ancho y alto declarados                                                                                            | Revisión del HTML generado                                             |
| RNF-008 | Con movimiento reducido: 0 animaciones del hero y de aparición, con todo el contenido visible                                                  | Prueba e2e emulando la preferencia                                     |
| RNF-009 | 0 secretos y 0 datos reales (número, email, NIF, domicilio) en el repositorio; solo marcadores                                                 | Búsqueda en el repositorio y revisión de seguridad                     |
| RNF-010 | Español de España con tuteo cercano y profesional, en el 100 % de los textos visibles                                                          | Revisión de contenido                                                  |
| RNF-011 | Comprobaciones automáticas en verde: lint, formato, tipos, compilación y las tres suites de tests                                              | Gate de la factoría y CI                                               |
| RNF-012 | Quien llega entiende qué hace Axyntia en ≤ 30 s, con titular, subtítulo y botón de contacto visibles sin desplazarse a 360×740 y a 1440×900 px | Revisión manual del PR y prueba e2e de visibilidad                     |

## 7. Métricas de éxito

| ID     | Métrica                                                                           | Tipo       | Hoy      | Objetivo                                             | Plazo     | Cómo se mide                                                  |
| ------ | --------------------------------------------------------------------------------- | ---------- | -------- | ---------------------------------------------------- | --------- | ------------------------------------------------------------- |
| CE-001 | Contactos recibidos tras llegar a «Contacto» (formulario, WhatsApp o correo)      | primaria   | sin dato | [POR ACLARAR: objetivo numérico de contactos al mes] | sin plazo | Recuento manual de mensajes recibidos; no hay analítica       |
| CE-002 | Clics necesarios para llegar a «Contacto» desde el hero                           | primaria   | sin dato | 1 clic                                               | en la v1  | Prueba e2e desde la página de inicio                          |
| CE-003 | Tiempo para entender qué ofrece Axyntia                                           | primaria   | sin dato | ≤ 30 s                                               | en la v1  | Revisión manual del PR                                        |
| CE-004 | Puntuaciones Lighthouse móvil (Rendimiento, Accesibilidad, Buenas prácticas, SEO) | secundaria | sin dato | ≥ 90 / 95 / 95 / 95                                  | en la v1  | Medido a mano por Eryon en la revisión del PR; fuera del gate |

## 8. Modelo de datos (conceptual)

| Entidad                         | Qué representa                                                                               | Atributos clave                                                                           | Relaciones                                                      | ¿Datos personales?      |
| ------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------- |
| Mensaje de contacto             | Lo que el visitante escribe en el formulario                                                 | nombre, email, empresa (opcional), servicio de interés, mensaje, aceptación de privacidad | Formspree, o correo preparado en el cliente del visitante       | sí                      |
| Servicio                        | Cada una de las cuatro líneas de trabajo (más «Otro» en el formulario)                       | título, descripción, tres beneficios, icono                                               | Se elige como interés en el mensaje                             | no                      |
| Datos de contacto de la empresa | Número de WhatsApp, mensaje predefinido, email, dirección del sitio y destino del formulario | valores de configuración                                                                  | Los usan los botones, el formulario y los datos para buscadores | no (hoy son marcadores) |

La web no guarda ningún mensaje: solo lo transmite.

## 9. Casos límite y fallos

| Situación                                           | Comportamiento esperado                                                       | Requisito      |
| --------------------------------------------------- | ----------------------------------------------------------------------------- | -------------- |
| Campos obligatorios vacíos                          | No se envía; mensaje junto a cada campo y resumen anunciado                   | RF-013, RF-017 |
| Email con formato inválido                          | No se envía; mensaje junto al campo                                           | RF-014         |
| Mensaje de menos de 10 o más de 2000 caracteres     | No se envía; mensaje junto al campo                                           | RF-015         |
| Casilla de privacidad sin marcar                    | No se envía; mensaje junto a la casilla                                       | RF-016         |
| Campo oculto contra spam relleno                    | No se envía y no se explica el motivo                                         | RF-018         |
| Destino del formulario vacío (valor actual)         | Se abre un correo con asunto y cuerpo rellenados                              | RF-022         |
| Error de red o respuesta de error del servicio      | Mensaje de error con alternativas de WhatsApp y email; se conserva lo escrito | RF-021         |
| Tildes, `&`, saltos de línea y emojis en el mensaje | Quedan codificados en el correo y en el enlace de WhatsApp                    | RF-023         |
| Número de WhatsApp sin dígitos                      | El enlace no se genera con un número vacío; la configuración debe corregirse  | RF-025         |
| Movimiento reducido                                 | Sin animación del hero ni apariciones; todo el contenido visible              | RNF-008        |
| Pestaña oculta o hero fuera de pantalla             | La animación del hero se detiene                                              | RF-010         |
| Ancho de 360 px con cabecera fija y menú abierto    | Sin desplazamiento horizontal; Escape cierra el menú                          | RF-029, RF-030 |
| Formulario sin JavaScript                           | [POR ACLARAR: comportamiento del formulario sin JavaScript]                   | RF-024         |

## 10. Supuestos, dependencias y restricciones

- **Supuesto:** la persona que contacta prefiere el formulario o WhatsApp antes que llamar → si es falso: se añade otro canal en una versión posterior.
- **Supuesto:** el servicio de formularios externo (Formspree) seguirá gratis o barato para el volumen de una landing → si es falso: se elige otro servicio o se pasa a un envío propio con un ADR nuevo.
- **Dependencia:** David debe crear el formulario en Formspree; hasta entonces funciona el plan B por correo.
- **Dependencia:** David rellena titular, NIF, domicilio y email legales, y sustituye el número, el email y la dirección del sitio de marcador.
- **Restricción:** el envío de datos personales de los visitantes a Formspree requiere la aprobación de David y una política de privacidad que lo mencione.
- **Restricción:** sin secretos en el repositorio: el destino del formulario es público por diseño.
- **Restricción:** la factoría no despliega ni gestiona el dominio.
- **Restricción:** las referencias visuales (linear.app, stripe.com, raycast.com, resend.com, huly.io, lusion.co, awwwards.com) son inspiración; no se copian textos, imágenes ni código.

## 11. Riesgos

| Riesgo                                                                      | Probabilidad | Impacto | Mitigación                                                                                       |
| --------------------------------------------------------------------------- | ------------ | ------- | ------------------------------------------------------------------------------------------------ |
| Los mensajes del formulario no llegan porque el destino está sin configurar | media        | alto    | Plan B por correo con destino vacío; la documentación explica cómo configurarlo (RF-022, RF-028) |
| Spam en el formulario                                                       | media        | medio   | Campo oculto contra spam y validación (RF-018)                                                   |
| Texto claro sobre colores de marca claros no alcanza el contraste mínimo    | alta         | medio   | El sistema de diseño fija texto oscuro sobre esos fondos y recalcula los ratios (RNF-002)        |
| La animación del hero empeora la lectura en móviles de gama baja            | media        | medio   | Menos nodos en móvil, pausa fuera de pantalla y alternativa sin movimiento (RF-010, RNF-004)     |
| Publicar con marcadores en lugar de datos legales                           | media        | alto    | Los marcadores son visibles y David los rellena antes de publicar (RF-035)                       |
| Se inventan cifras o clientes al pulir los textos                           | baja         | alto    | RF-008 y revisión de contenido                                                                   |

## 12. Preguntas abiertas

| #   | Pregunta                                                                              | Dónde afecta             | Quién responde |
| --- | ------------------------------------------------------------------------------------- | ------------------------ | -------------- |
| 1   | [POR ACLARAR: comportamiento del formulario sin JavaScript]                           | HU-02, RF-024, sección 9 | David          |
| 2   | [POR ACLARAR: texto de la política de privacidad sobre el envío de datos a Formspree] | HU-05, RF-037            | David          |
| 3   | [POR ACLARAR: objetivo numérico de contactos al mes]                                  | Sección 7, CE-001        | David          |

## 13. Comprobación final del documento

- [ ] No queda ningún marcador sin resolver: quedan 3 `[POR ACLARAR]` (sección 12), por lo que el PRD no pasa a `aprobado`.
- [x] Cada historia P1 tiene prueba independiente y criterios verificables.
- [x] Cada RF tiene historia y cada historia tiene al menos un RF.
- [ ] Las métricas tienen valor objetivo y no mencionan tecnología: CE-001 espera respuesta de David.
- [x] Hay al menos 2 no-objetivos con motivo.
- [x] No hay decisiones de implementación (pila, API, carpetas).
