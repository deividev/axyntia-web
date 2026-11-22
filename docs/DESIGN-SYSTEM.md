---
tipo: sistema-diseno
titulo: 'Sistema de diseño de axyntia-web'
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

# Sistema de diseño de axyntia-web

## 1. Principios

**Tesis:** profesional y futurista, oscuro, limpio y sobrio: mucho espacio, tipografía grande y brillos sutiles; nada recargado.

| Principio                 | Qué implica en la práctica                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Claridad antes que adorno | 1 acción primaria por bloque; el brillo y la animación nunca tapan el texto; el hero deja visibles titular y botón de contacto |
| Accesible por defecto     | WCAG 2.2 AA en todo; se diseña con teclado desde el principio; texto oscuro sobre fondos de marca claros                       |
| Mobile-first              | Se maqueta primero a 360 px y se amplía con `min-width`                                                                        |
| Movimiento con permiso    | Toda animación tiene alternativa con `prefers-reduced-motion: reduce` y el contenido nunca depende de ella                     |
| Marca contenida           | El cian y el violeta son acentos; WhatsApp usa su verde solo en su botón                                                       |

Las referencias (linear.app, stripe.com, raycast.com, resend.com, huly.io, lusion.co y la galería de awwwards.com) son solo inspiración: no se copian textos, imágenes ni código.

## 2. Voz y contenido

- Idioma: español de España · Tratamiento: tuteo cercano pero profesional · Fechas: DD/MM/AAAA · Números: 1.234,56.
- Botones con verbo de acción («Solicita una propuesta», «Hablemos», «Enviar mensaje»), nunca «OK» o «Enviar».
- Errores: qué pasó y qué hacer («Escribe un mensaje de al menos 10 caracteres»).
- Sin cifras, clientes, logos ni testimonios inventados.
- Textos base de la issue: titular del hero «Software a medida e IA que trabajan para tu empresa» y contacto «Cuéntanos tu idea. Te respondemos en 24 h laborables con una propuesta sin compromiso.»

## 3. Tokens

Tres niveles: `ref` (primitivos, no se usan en componentes), `sys` (semánticos, los que usa el código) y `comp` (de componente). Este bloque es la fuente de verdad: si la prosa y los tokens no coinciden, mandan los tokens. El archivo de tokens es `src/styles/global.css`.

```yaml
ref:
  color:
    neutral:
      {
        0: '#07080C',
        50: '#0E1118',
        100: '#151A24',
        200: '#222A38',
        600: '#9AA3B5',
        900: '#E8ECF4',
      }
    cyan: '#22D3EE'
    violet: '#7C5CFF'
    green: '#3DF5A6'
    red: '#FF5C7A'
    whatsapp: '#25D366'
  font:
    family: { display: 'Space Grotesk', sans: 'Inter', mono: 'JetBrains Mono' }
  space: { 1: 4px, 2: 8px, 3: 12px, 4: 16px, 6: 24px, 8: 32px, 12: 48px, 16: 64px, 24: 96px }
  font-size: { 1: 0.875rem, 2: 1rem, 3: 1.25rem, 4: 1.75rem, 5: 2.5rem, 6: 4.5rem }
  font-weight: { regular: 400, medium: 500, semibold: 600, bold: 700 }
sys:
  color:
    bg: '{ref.color.neutral.0}'
    surface: '{ref.color.neutral.50}'
    surface-raised: '{ref.color.neutral.100}'
    border: '{ref.color.neutral.200}'
    border-control: '{ref.color.neutral.600}'
    text: '{ref.color.neutral.900}'
    text-muted: '{ref.color.neutral.600}'
    text-inverse: '{ref.color.neutral.0}'
    primary: '{ref.color.cyan}'
    secondary: '{ref.color.violet}'
    gradient-brand: 'linear-gradient(135deg, {ref.color.cyan}, {ref.color.violet})'
    success: '{ref.color.green}'
    error: '{ref.color.red}'
    focus-ring: '{ref.color.cyan}'
    whatsapp: '{ref.color.whatsapp}'
  type:
    display:
      {
        family: '{ref.font.family.display}',
        size: '{ref.font-size.6}',
        size-mobile: '{ref.font-size.5}',
        line-height: 1.1,
        weight: '{ref.font-weight.bold}',
      }
    heading:
      {
        family: '{ref.font.family.display}',
        size: '{ref.font-size.5}',
        size-mobile: '{ref.font-size.4}',
        line-height: 1.2,
        weight: '{ref.font-weight.bold}',
      }
    subheading:
      {
        family: '{ref.font.family.display}',
        size: '{ref.font-size.3}',
        line-height: 1.3,
        weight: '{ref.font-weight.medium}',
      }
    body:
      {
        family: '{ref.font.family.sans}',
        size: '{ref.font-size.2}',
        line-height: 1.6,
        weight: '{ref.font-weight.regular}',
      }
    body-strong:
      {
        family: '{ref.font.family.sans}',
        size: '{ref.font-size.2}',
        line-height: 1.6,
        weight: '{ref.font-weight.semibold}',
      }
    label:
      {
        family: '{ref.font.family.sans}',
        size: '{ref.font-size.1}',
        line-height: 1.4,
        weight: '{ref.font-weight.medium}',
      }
    mono:
      {
        family: '{ref.font.family.mono}',
        size: '{ref.font-size.1}',
        line-height: 1.4,
        weight: '{ref.font-weight.regular}',
      }
  radius: { sm: 4px, md: 8px, lg: 16px, full: 9999px }
  shadow:
    raised: '0 0 0 1px {sys.color.border}'
    glow: '0 0 32px color-mix(in srgb, {ref.color.cyan} 20%, transparent)'
  motion:
    duration: { fast: 150ms, base: 250ms, slow: 500ms }
    easing: { standard: 'cubic-bezier(0.2, 0, 0, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)' }
    distance: { reveal: 16px }
comp:
  button-primary:
    {
      bg: '{sys.color.gradient-brand}',
      text: '{sys.color.text-inverse}',
      radius: '{sys.radius.md}',
    }
  button-whatsapp:
    { bg: '{ref.color.whatsapp}', text: '{sys.color.text-inverse}', radius: '{sys.radius.md}' }
  card-service:
    {
      bg: '{sys.color.surface}',
      border: '{sys.color.border}',
      radius: '{sys.radius.lg}',
      glow: '{sys.shadow.glow}',
    }
  input:
    {
      bg: '{sys.color.surface}',
      border: '{sys.color.border-control}',
      border-error: '{sys.color.error}',
      radius: '{sys.radius.sm}',
    }
  header: { bg: '{sys.color.surface}', border: '{sys.color.border}' }
```

**Tokens que ya existen** en `src/styles/global.css` y se conservan: `--color-axyntia-dark` (`#07080c`) equivale a `ref.color.neutral.0` y `sys.color.bg`; `--color-axyntia-light` (`#e8ecf4`) equivale a `ref.color.neutral.900` y `sys.color.text`. No se renombran ni se quitan: `tests/integration/build.test.ts` busca `.bg-axyntia-dark`, `.text-axyntia-light` y los dos valores en el CSS generado. Los tokens `sys` nuevos se añaden al mismo `@theme`.

**Convención de nombres de las variables CSS:** `sys.color.text-muted` → `--color-text-muted` (y análogos: `--font-*`, `--radius-*`, `--shadow-*`, `--duration-*`); `ref.*` → `--ref-*`, que solo se declara y se usa dentro de `global.css`.

### 3.1 Color: uso y contraste

Ratios calculados con la fórmula de contraste de WCAG y redondeados a 1 decimal. Mínimos: texto normal ≥ 4,5:1; texto grande y elementos de interfaz ≥ 3:1.

| Token (primer plano)                                | Uso (y cuándo NO usarlo)                                 | Sobre                                       | Contraste          |
| --------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------- | ------------------ |
| `sys.color.text` `#E8ECF4`                          | Texto principal                                          | `bg` / `surface` / `surface-raised`         | 16,9 / 16,1 / 14,7 |
| `sys.color.text-muted` `#9AA3B5`                    | Texto secundario; nunca información imprescindible       | `bg` / `surface` / `surface-raised`         | 7,9 / 7,5 / 6,9    |
| `sys.color.primary` `#22D3EE` (como texto o enlace) | Enlaces y detalles; no como fondo con texto claro        | `bg` / `surface` / `surface-raised`         | 11,1 / 10,5 / 9,6  |
| `sys.color.success` `#3DF5A6`                       | Mensaje de éxito                                         | `bg` / `surface` / `surface-raised`         | 14,1 / 13,3 / 12,3 |
| `sys.color.error` `#FF5C7A`                         | Errores (texto y borde); nunca decoración                | `bg` / `surface` / `surface-raised`         | 6,7 / 6,4 / 5,9    |
| `sys.color.secondary` `#7C5CFF` (como texto)        | **No usar como texto**: solo elemento gráfico y fondo    | `bg` / `surface` / `surface-raised`         | 4,6 / 4,4 / 4,0    |
| `sys.color.text-inverse` `#07080C`                  | Texto sobre cian, verde de WhatsApp, violeta y degradado | `primary`                                   | 11,1               |
| `sys.color.text-inverse` `#07080C`                  | Texto del botón de WhatsApp                              | `whatsapp` `#25D366`                        | 10,1               |
| `sys.color.text-inverse` `#07080C`                  | Texto del botón primario                                 | degradado de marca (extremo cian / violeta) | 11,1 / 4,6         |
| `sys.color.border-control` `#9AA3B5`                | Borde de campos, casillas y desplegables (WCAG 1.4.11)   | `bg` / `surface` / `surface-raised`         | 7,9 / 7,5 / 6,9    |
| `sys.color.focus-ring` `#22D3EE`                    | Anillo de foco de 2 px                                   | `bg` / `surface` / `surface-raised`         | 11,1 / 10,5 / 9,6  |
| `ref.color.whatsapp` `#25D366` (fondo del botón)    | Solo el botón de WhatsApp                                | `bg`                                        | 10,1               |

**Pares que no llegaban y su solución** (la paleta aprobada no cambia):

| Par que falla                                    | Ratio | Solución                                                                                                                                                          |
| ------------------------------------------------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Texto claro `#E8ECF4` sobre cian `#22D3EE`       | 1,5   | Texto `#07080C` (`text-inverse`) en botones con cian: 11,1                                                                                                        |
| Texto claro sobre el verde de WhatsApp `#25D366` | 1,7   | Texto `#07080C` sobre `#25D366`: 10,1                                                                                                                             |
| Texto claro sobre el violeta `#7C5CFF`           | 3,7   | El violeta no lleva texto claro. Sobre el degradado, el texto es `#07080C`: 4,6 en el extremo violeta                                                             |
| Violeta `#7C5CFF` como texto sobre `surface`     | 4,3   | El violeta no se usa como texto; solo como acento gráfico (≥ 3:1) o como fondo con texto oscuro                                                                   |
| Borde `#222A38` sobre `bg`                       | 1,4   | No sirve como límite de un campo (WCAG 1.4.11, ≥ 3:1): `comp.input.border` usa `#9AA3B5` (7,9). `#222A38` queda solo como borde decorativo de tarjetas y cabecera |

### 3.2 Tipografía

Tres familias porque lo pide la dirección visual de la issue (la plantilla sugiere máximo 2 familias y 3 pesos): Space Grotesk para titulares, Inter para el texto y JetBrains Mono solo para etiquetas y detalles técnicos. Son archivos woff2 autoalojados en `public/fonts` (ADR-005), con `font-display: swap`, sin ninguna petición a Google y con precarga solo de la fuente del titular (Space Grotesk 700).

| Token                  | Tamaño / altura de línea          | Peso | Uso                              |
| ---------------------- | --------------------------------- | ---- | -------------------------------- |
| `sys.type.display`     | 4,5 rem (2,5 rem en móvil) / 1,1  | 700  | `h1` del hero, 1 por página      |
| `sys.type.heading`     | 2,5 rem (1,75 rem en móvil) / 1,2 | 700  | `h2` de cada sección             |
| `sys.type.subheading`  | 1,25 rem / 1,3                    | 500  | `h3` de tarjetas y pasos         |
| `sys.type.body`        | 1 rem / 1,6                       | 400  | Texto general                    |
| `sys.type.body-strong` | 1 rem / 1,6                       | 600  | Énfasis en el texto y botones    |
| `sys.type.label`       | 0,875 rem / 1,4                   | 500  | Etiquetas de campos y ayudas     |
| `sys.type.mono`        | 0,875 rem / 1,4                   | 400  | Etiquetas tipo `// 01 Servicios` |

Pesos que se descargan: Space Grotesk 500 y 700; Inter 400, 500 y 600; JetBrains Mono 400.

### 3.3 Espaciado, radios, sombras y movimiento

- **Espaciado:** solo valores de `ref.space` (base de 4 px) mediante tokens. Dentro de un componente 2 a 4; entre bloques, 12 a 24.
- **Radios:** `sm` para campos y casillas, `md` para botones, `lg` para tarjetas, `full` para etiquetas redondeadas.
- **Sombras:** `raised` (borde de 1 px) en tarjetas; `glow` solo en tarjetas y botones con hover o foco. Nada más.
- **Fondo:** rejilla muy tenue con `border` y brillos de baja opacidad; nunca debajo del texto con un contraste menor que el de la tabla.
- **Etiquetas tipo mono:** `// 01 Servicios` en `sys.type.mono` y `text-muted`.

**Escala de movimiento** (cada animación con su alternativa cuando el visitante pide `prefers-reduced-motion: reduce`):

| Animación                              | Duración y curva                                                                                                                                           | Alternativa con movimiento reducido                                               |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Hero: constelación de datos en canvas  | Rotación lenta continua, una vuelta cada 120 s, lineal; 80 a 150 nodos (menos en móvil); DPR ≤ 2; se pausa con `IntersectionObserver` y `visibilitychange` | Sin animación: degradado o imagen estática; el titular y los botones se ven igual |
| Aparición de secciones                 | `fade` + `translateY(16px)` con `slow` (500 ms) y `standard`; una vez, al entrar en pantalla                                                               | Sin desplazamiento ni fundido: todo el contenido visible desde el principio       |
| Línea de progreso de «Cómo trabajamos» | Ligada al desplazamiento, sin duración propia; lineal                                                                                                      | La línea aparece completa y estática; los 4 pasos siguen visibles                 |
| Hover de tarjetas y botones, brillo    | `base` (250 ms) y `standard` en color, borde y brillo; el brillo sigue al cursor con variables CSS                                                         | Cambio de color o borde inmediato (0 ms), sin movimiento                          |
| Foco                                   | `fast` (150 ms) en el anillo de foco                                                                                                                       | Anillo visible al instante                                                        |
| Menú móvil (abrir y cerrar)            | `base` y `standard` al abrir; `fast` y `exit` al cerrar                                                                                                    | Aparece y desaparece sin transición                                               |

Ninguna animación se usa para transmitir información que no esté también en texto.

## 4. Layout y breakpoints

Mobile-first: los estilos base son los de 360 px y se amplían con `min-width`.

| Nombre | Desde   | Columnas | Márgenes | Qué cambia                                                                                                                                                       |
| ------ | ------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sm`   | 0 px    | 4        | 16 px    | Diseño base; se prueba a 360 px. Cabecera con menú desplegable, servicios y pasos en una columna, botones a todo el ancho, `display` y `heading` en tamaño móvil |
| `md`   | 768 px  | 8        | 24 px    | Servicios en 2 columnas, pasos en 2 columnas, botones del hero en fila, tamaños de titular de escritorio                                                         |
| `lg`   | 1024 px | 12       | 32 px    | Cabecera con enlaces visibles y sin menú desplegable, servicios en 2 columnas amplias, «Contacto» con formulario y datos en dos columnas                         |
| `xl`   | 1440 px | 12       | 40 px    | Ancho máximo de contenido de 1200 px, centrado; más espacio vertical entre secciones (`space.24`)                                                                |

Se comprueba a 360, 768, 1024 y 1440 px de ancho sin scroll horizontal ni solapes. La cabecera es fija: las anclas llevan un margen superior de desplazamiento mayor que su altura, para que el foco y los encabezados no queden tapados.

## 5. Componentes

Matriz de estados: ✓ = definido; lo prueba (e2e o revisión) el trabajo que crea el componente; — = no aplica (el motivo está en Notas). Foco = anillo de 2 px con `sys.color.focus-ring`, contraste ≥ 3:1. Cargando = sin doble envío.

| Componente                           | Cuándo usarlo                                            | Variantes                         | Normal | Hover | Foco | Deshab. | Cargando | Vacío | Error | Tokens comp       | Notas                                                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------- | --------------------------------- | ------ | ----- | ---- | ------- | -------- | ----- | ----- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cabecera con menú móvil              | Navegación fija en toda la página                        | escritorio, móvil abierta/cerrada | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | `aria-expanded`, cierra con Escape. — Deshab.: la navegación nunca se desactiva. — Cargando, Vacío y Error: no hay datos que cargar ni fallar                                            |
| Botón primario                       | Acción principal («Solicita una propuesta», «Hablemos»)  | degradado, a todo el ancho        | ✓      | ✓     | ✓    | ✓       | ✓        | —     | —     | `button-primary`  | Texto `#07080C`. Cargando: «Enviando…» y bloqueado. — Vacío y Error: no tienen contenido propio                                                                                          |
| Botón de WhatsApp                    | Abrir WhatsApp en hero y contacto                        | único                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `button-whatsapp` | Fondo `#25D366` solo aquí; texto `#07080C`. — Deshab. y Cargando: es un enlace que abre otra pestaña. — Vacío y Error: no aplica                                                         |
| Tarjeta de servicio                  | Mostrar uno de los 4 servicios                           | única                             | ✓      | ✓     | —    | —       | —        | —     | —     | `card-service`    | Brillo que sigue al cursor. — Foco: no es interactiva. — Deshab., Cargando, Vacío y Error: contenido fijo y siempre presente                                                             |
| Paso de «Cómo trabajamos»            | Mostrar un paso del proceso                              | 4 pasos                           | ✓      | —     | —    | —       | —        | —     | —     | `card-service`    | Línea de progreso ligada al scroll. — Resto de estados: no es interactivo y su contenido es fijo                                                                                         |
| Campo de texto (`input`, `textarea`) | Nombre, email, empresa y mensaje                         | texto, email, área de texto       | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Etiqueta visible, `aria-describedby` al error. Vacío: placeholder de ayuda. Error: borde y texto `error` (icono más texto). — Cargando: el formulario completo se bloquea, no cada campo |
| Desplegable                          | Servicio de interés                                      | 4 servicios + «Otro»              | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Vacío: opción inicial «Elige un servicio». — Cargando: opciones fijas, no se cargan                                                                                                      |
| Casilla de privacidad                | Aceptar la política de privacidad                        | única, con enlace                 | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Objetivo táctil ≥ 44×44 px. Vacío = sin marcar. — Cargando: se bloquea con el formulario                                                                                                 |
| Resumen de errores                   | Anunciar los errores al enviar                           | único                             | —      | —     | ✓    | —       | —        | ✓     | ✓     | `input`           | `aria-live`; enlaza a cada campo con error. — Normal: no se muestra. Vacío: sin errores no hay resumen. — Hover, Deshab. y Cargando: no aplica                                           |
| Pie                                  | Cierre con enlaces y año                                 | única                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | Logotipo, enlaces de sección y legales, © con el año actual. — Deshab., Cargando, Vacío y Error: contenido fijo                                                                          |
| Fondo animado del hero (canvas)      | Fondo decorativo de la constelación de datos en el hero  | animado, estático (mov. reducido) | ✓      | —     | —    | —       | —        | —     | —     | `header`          | `aria-hidden`, DPR ≤ 2, se pausa fuera de pantalla. Con movimiento reducido no se dibuja y queda el degradado. — Resto de estados: es decorativo y no interactivo                        |
| Aviso sin JavaScript                 | Alternativa de contacto cuando JavaScript no está activo | único                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `input`           | `<noscript>` con enlace `mailto:` y WhatsApp. — Deshab., Cargando, Vacío y Error: es texto fijo                                                                                          |
| Wordmark                             | Logotipo provisional en cabecera y pie                   | cabecera, pie                     | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | Símbolo SVG decorativo más el texto «Axyntia». — Resto de estados: contenido fijo                                                                                                        |

**Patrones comunes**

- Formularios: validación al enviar y al salir del campo; el error va junto al campo, en texto además de color, y un resumen se anuncia con `aria-live`. No se envía con errores.
- Estados del envío: «Enviando…» con el botón bloqueado; éxito («Gracias, te respondemos en 24 h laborables») con el formulario vaciado; error con alternativas de WhatsApp y email, conservando lo escrito.
- Carga: no hay datos que tarden; no se usan esqueletos ni spinners.

## 6. Accesibilidad (WCAG 2.2 AA)

| Regla                                                                                | Criterio WCAG       | Cómo se comprueba                                                        |
| ------------------------------------------------------------------------------------ | ------------------- | ------------------------------------------------------------------------ |
| Contraste de texto ≥ 4,5:1 (≥ 3:1 en texto grande)                                   | 1.4.3               | Tabla de 3.1 y análisis automático en la landing                         |
| Controles, iconos y foco ≥ 3:1 contra su fondo                                       | 1.4.11              | Tabla de 3.1 y revisión                                                  |
| Todo se usa con teclado, en orden lógico, sin trampas de foco; Escape cierra el menú | 2.1.1, 2.1.2, 2.4.3 | Prueba e2e solo con teclado (la añade la landing)                        |
| Foco siempre visible y no tapado por la cabecera fija                                | 2.4.7, 2.4.11       | Prueba e2e y revisión                                                    |
| Enlace «Saltar al contenido» y `lang="es"`                                           | 2.4.1, 3.1.1        | `tests/integration/build.test.ts` para `lang`; prueba e2e para el enlace |
| Objetivos táctiles ≥ 24×24 px (botones y casillas ≥ 44×44 px)                        | 2.5.8               | Revisión                                                                 |
| Campos con etiqueta visible y nombre accesible; errores en texto, no solo color      | 1.3.1, 3.3.1, 1.4.1 | Análisis automático y prueba e2e del formulario                          |
| Imágenes con `alt` (las decorativas, vacío)                                          | 1.1.1               | Análisis automático                                                      |
| Contenido usable a 320 px y al 200 % de zoom sin scroll horizontal                   | 1.4.4, 1.4.10       | Prueba e2e a 320 px (además de los anchos de RNF-003)                    |
| Respeta `prefers-reduced-motion`                                                     | 2.3.3 (adoptado)    | Prueba e2e con `emulateMedia`                                            |

## 7. Reglas para agentes

1. **Nunca valores a mano.** Ningún color hex, `rgb`, `hsl`, tamaño en px, radio, sombra o duración fuera de `src/styles/global.css`. Se comprueba con: `grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\[[0-9.]+(px|rem|ms|s)\]' src --exclude=global.css` (debe dar 0 resultados).
2. Usa tokens `sys` (o `comp`); nunca `ref` en un componente. Se comprueba con: `grep -rn 'ref-' src --exclude=global.css` (0 resultados).
3. Antes de crear un componente, busca en la sección 5. Si la spec lo pide, rellena su fila completa (todos los estados) en el mismo cambio; si no, no toques este documento y anota en `risk_signals` la fila que falta. Se comprueba con la revisión del Reviewer: contrasta `ls src/components` con las filas de la sección 5 (cada componente tiene su fila).
4. Cada componente nuevo cubre los estados de su fila; los ✓ tienen prueba e2e o revisión del Reviewer.
5. Texto sobre cian, verde de WhatsApp, verde de éxito o el degradado de marca usa `sys.color.text-inverse`; el violeta no se usa como texto. Se comprueba con la tabla de 3.1 y con el análisis de contraste del e2e de la landing.
6. Los bordes de campos y casillas usan `border-control`, no `border`. Se comprueba con el análisis de contraste de la landing y con `grep -rnE 'border-(border|\[)' src` en campos y casillas (revisión del Reviewer de los resultados).
7. Cada animación tiene alternativa con `prefers-reduced-motion: reduce` (sección 3.3). Se comprueba con la prueba e2e con `emulateMedia` de la landing.
8. Sin GSAP ni three.js ni otras librerías de animación. Se comprueba con: `grep -nE '"(gsap|three)"' package.json` (0 resultados).
9. Fuentes solo autoalojadas en `public/fonts`. Se comprueba con: `grep -rnE 'fonts\.(googleapis|gstatic)\.com' src public` (0 resultados) y la prueba e2e de 0 peticiones a terceros.
10. No renombres ni quites `--color-axyntia-dark` ni `--color-axyntia-light`; los comprueba `tests/integration/build.test.ts`.
11. No copies textos, imágenes ni código de las referencias de inspiración. No es automatizable: lo comprueba el Reviewer en cada PR y, como apoyo, `grep -rniE 'linear\.app|stripe\.com|raycast\.com|resend\.com|huly\.io|lusion\.co|awwwards\.com' src public` debe dar 0 resultados.

## 8. Historial de cambios

| Versión | Fecha      | Cambio                                                               |
| ------- | ---------- | -------------------------------------------------------------------- |
| 0.1.0   | 2026-11-22 | Versión inicial                                                      |
| 0.1.1   | 2026-11-22 | Filas de §5: fondo animado del hero, aviso sin JavaScript y wordmark |
