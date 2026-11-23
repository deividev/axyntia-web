---
tipo: sistema-diseno
titulo: 'Sistema de diseño de axyntia-web'
proyecto: 'axyntia-web'
cliente: 'interno'
estado: propuesta
version: 0.2.0
fecha: '2026-11-23'
creado: '2026-11-22'
actualizado: '2026-11-23'
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

**Tesis:** una oficina bien llevada: papel crudo, tinta oscura y un único acento; la tipografía y el orden hacen el trabajo, no el efecto. Pensada para dueños y gerentes de pymes que no son técnicos y leen en el móvil.

| Principio                 | Qué implica en la práctica                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Claridad antes que adorno | 1 acción primaria por bloque; el hero deja visibles titular y botón de contacto sin esperar a ninguna animación |
| Accesible por defecto     | WCAG 2.2 AA en todo; se diseña con teclado desde el principio; el contraste se calcula par a par (§3.1)         |
| Mobile-first              | Se maqueta primero a 360 px y se amplía con `min-width`                                                         |
| Rápida en el móvil        | Solo se animan `transform` y `opacity`; ninguna animación continua; 0 bytes de fuentes (ADR-009)                |
| Movimiento con permiso    | Toda animación tiene alternativa con `prefers-reduced-motion: reduce` y el contenido nunca depende de ella      |
| Marca contenida           | El ladrillo es el único acento; el verde de WhatsApp se usa solo en su botón; no hay degradados                 |

### 1.1 Dirección visual

- **Concepto:** el libro de cuentas de la pyme: la ordenada hoja de papel donde cada cosa tiene su fila. Software a medida explicado con la calma y la claridad de un buen albarán, no con el decorado de «tecnología».
- **La cosa atrevida:** el titular del hero compuesto como portada de periódico económico: serif del sistema a gran tamaño (4,5 rem en escritorio, 2,5 rem en móvil), interlineado apretado y la palabra clave subrayada con un trazo grueso de tinta ladrillo, dibujado con una línea estática (sin animación). Todo lo demás es tranquilo: papel liso, filas separadas por una línea fina y texto.
- **Referencias** (se estudian, no se copian textos, imágenes ni código):

| Referencia                                 | URL                                  | Qué se toma (y qué no)                                                                                                       |
| ------------------------------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Financial Times (prensa económica)         | https://www.ft.com                   | Titulares serif de gran tamaño sobre fondo crudo y jerarquía densa pero legible. No: el color salmón ni la densidad de texto |
| GOV.UK Design System (servicio público)    | https://design-system.service.gov.uk | Legibilidad, enlaces subrayados, formularios con error junto al campo y lenguaje llano. No: su paleta ni sus componentes     |
| Museo Plantin-Moretus (imprenta histórica) | https://www.museumplantinmoretus.be  | Composición tipográfica clásica, márgenes amplios y filas ordenadas por líneas finas. No: ornamentos ni texturas             |
| Basecamp (software para pequeños equipos)  | https://basecamp.com                 | Tono directo y cercano, titulares que hablan de problemas del negocio. No: ilustraciones ni el estilo de sus botones         |

- **Direcciones descartadas:**
  - **Oscuro con cian y violeta y constelación en el hero** (la dirección anterior): el diagnóstico de la prueba 01 la señala como «hecha con IA» y se parece a cualquier landing de software; el canvas de la constelación gastaba el 52,5 % del hilo principal con la CPU 4× más lenta (ADR-010); y un fondo casi negro cuesta leer a un público que lee en el móvil a plena luz.
  - **Corporativo azul marino con fotos de stock:** vale para cualquier consultora, no dice nada de Axyntia y necesita imágenes de stock que quedan fuera de alcance (PRD §3).
  - **Brutalista monocromo con letra de máquina:** señala «herramienta para programadores» y intimida a dueños y gerentes que no son técnicos.
- **Defaults de «web hecha con IA»** (cada fila lleva su decisión y su motivo):

| Default                                                                            | En este proyecto                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Degradado cian/azul → violeta en botones, títulos o fondos                         | Prohibido: ningún degradado. Motivo: es la firma de las webs generadas y el acento es un único color plano (ladrillo)                                                                                                                                                                                                                        |
| Fondo casi negro teñido con halos radiales y cuadrícula decorativa                 | Prohibido: el fondo es papel liso claro (`bg`). Motivo: la lectura en móvil a plena luz es mejor con fondo claro y los halos añaden coste de pintado sin informar                                                                                                                                                                            |
| Inter, Space Grotesk, Roboto o la pila del sistema como única voz                  | Permitido de forma limitada: solo hay fuentes del sistema porque ADR-009 (decisión de David en la issue #3) lo exige. Motivo: la voz propia sale del contraste entre serif del sistema (titulares) y sans del sistema (texto) y de la escala; no hay una sola familia para todo. Inter, Space Grotesk y Roboto no se nombran ni se descargan |
| Etiqueta encima de cada título (`// `, MAYÚSCULAS espaciadas, «01 —»)              | Prohibido encima de los títulos. Única excepción: el número de cada paso de «Cómo trabajamos», porque ahí el orden es contenido. Motivo: una etiqueta sobre cada título es decoración que no informa                                                                                                                                         |
| Hero genérico con red de nodos, orbe o partículas como imagen de «IA»              | Prohibido: el hero es solo tipografía sobre papel, sin canvas ni imagen decorativa. Motivo: coste de CPU medido (ADR-010) y no dice nada de lo que hace Axyntia                                                                                                                                                                              |
| Tarjetas idénticas en rejilla (icono + título + texto) con el mismo radio y sombra | Prohibido: los servicios y pasos son filas de albarán (línea fina arriba, título y texto), sin caja, sin icono y sin sombra. Motivo: las tarjetas repetidas son indistinguibles de cualquier plantilla                                                                                                                                       |
| Brillo que sigue al puntero, glassmorphism, `backdrop-filter` decorativo           | Prohibido. Motivo: gasta GPU y CPU en móviles de gama baja y el gate mide la fluidez; el hover solo cambia el color                                                                                                                                                                                                                          |
| Aparición fade + subida en cada sección y hover en cada tarjeta                    | Prohibido: las secciones no se animan al entrar y no hay tarjetas. Motivo: retrasa la lectura y añade trabajo en el móvil. El único movimiento es el de estado: menú móvil y pulsación de botón (§3.3)                                                                                                                                       |
| Textos que valen para cualquier empresa                                            | Prohibido siempre. Motivo: cada texto habla de un problema concreto de una pyme (papeles, hojas de cálculo, tareas repetidas)                                                                                                                                                                                                                |
| Modo oscuro por defecto como seña de «tecnología»                                  | Prohibido por defecto: el sitio es claro (`color-scheme: light`). Motivo: ver fondo casi negro. Un modo oscuro opcional necesitaría su propia tabla de contraste y no está en el alcance                                                                                                                                                     |

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
    paper:
      {
        0: '#F6F1E7',
        50: '#FBF8F1',
        100: '#EDE5D4',
        200: '#D9D0BD',
        500: '#7A7466',
        700: '#5C574C',
        900: '#1B1A17',
      }
    light: '#FFFDF8'
    brick: '#A8321A'
    brick-dark: '#8C2711'
    green: '#2F6B3A'
    red: '#B3261E'
    whatsapp: '#25D366'
  font:
    family: { serif: "ui-serif, Georgia, 'Times New Roman', serif", sans: 'system-ui, sans-serif' }
  space: { 1: 4px, 2: 8px, 3: 12px, 4: 16px, 6: 24px, 8: 32px, 12: 48px, 16: 64px, 24: 96px }
  font-size: { 1: 0.875rem, 2: 1rem, 3: 1.25rem, 4: 1.75rem, 5: 2.5rem, 6: 4.5rem }
  font-weight: { regular: 400, semibold: 600, bold: 700 }
sys:
  color:
    bg: '{ref.color.paper.0}'
    surface: '{ref.color.paper.50}'
    surface-raised: '{ref.color.paper.100}'
    border: '{ref.color.paper.200}'
    border-control: '{ref.color.paper.500}'
    text: '{ref.color.paper.900}'
    text-muted: '{ref.color.paper.700}'
    text-inverse: '{ref.color.light}'
    primary: '{ref.color.brick}'
    primary-hover: '{ref.color.brick-dark}'
    success: '{ref.color.green}'
    error: '{ref.color.red}'
    focus-ring: '{ref.color.paper.900}'
    whatsapp: '{ref.color.whatsapp}'
  type:
    display:
      {
        family: '{ref.font.family.serif}',
        size: '{ref.font-size.6}',
        size-mobile: '{ref.font-size.5}',
        line-height: 1.05,
        weight: '{ref.font-weight.bold}',
      }
    heading:
      {
        family: '{ref.font.family.serif}',
        size: '{ref.font-size.5}',
        size-mobile: '{ref.font-size.4}',
        line-height: 1.15,
        weight: '{ref.font-weight.bold}',
      }
    subheading:
      {
        family: '{ref.font.family.serif}',
        size: '{ref.font-size.3}',
        line-height: 1.3,
        weight: '{ref.font-weight.semibold}',
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
        weight: '{ref.font-weight.semibold}',
      }
  radius: { sm: 2px, md: 4px, full: 9999px }
  motion:
    duration: { fast: 120ms, base: 200ms }
    easing: { enter: 'cubic-bezier(0.23, 1, 0.32, 1)' }
    distance: { menu: 8px }
    scale: { press: 0.97 }
comp:
  button-primary:
    {
      bg: '{sys.color.primary}',
      bg-hover: '{sys.color.primary-hover}',
      text: '{sys.color.text-inverse}',
      radius: '{sys.radius.md}',
    }
  button-whatsapp:
    {
      bg: '{sys.color.whatsapp}',
      text: '{sys.color.text}',
      border: '{sys.color.text}',
      radius: '{sys.radius.md}',
    }
  row-service: { bg: '{sys.color.bg}', border-top: '{sys.color.border}' }
  input:
    {
      bg: '{sys.color.surface}',
      border: '{sys.color.border-control}',
      border-error: '{sys.color.error}',
      radius: '{sys.radius.sm}',
    }
  header: { bg: '{sys.color.surface}', border: '{sys.color.border}' }
```

**Tokens que ya existen** en `src/styles/global.css` y no se tocan en este trabajo: `--color-axyntia-dark` (`#07080c`) y `--color-axyntia-light` (`#e8ecf4`). Son de la paleta anterior (oscura) y la paleta nueva ya no los usa: `sys.color.bg` es ahora `#F6F1E7` y `sys.color.text` es `#1B1A17`. No se renombran ni se quitan todavía porque `tests/integration/build.test.ts` busca `.bg-axyntia-dark`, `.text-axyntia-light` y los dos valores en el CSS generado. Hasta que la issue #10 cambie el código, quedan como alias heredados sin significado semántico y ningún componente nuevo debe usarlos. La issue #10 deberá actualizar a la vez esos dos tokens y ese test (cambio de tests que aprueba David) y entonces se retira esta nota. Los tokens `sys` nuevos se añaden al mismo `@theme`.

**Convención de nombres de las variables CSS:** `sys.color.text-muted` → `--color-text-muted` (y análogos: `--font-*`, `--radius-*`, `--duration-*`); `ref.*` → `--ref-*`, que solo se declara y se usa dentro de `global.css`.

### 3.1 Color: uso y contraste

Ratios calculados con la fórmula de contraste de WCAG y redondeados a 1 decimal. Mínimos: texto normal ≥ 4,5:1; texto grande y elementos de interfaz ≥ 3:1. Todo el sitio es claro (`color-scheme: light`).

| Token (primer plano)                                | Uso (y cuándo NO usarlo)                                | Sobre                               | Contraste          |
| --------------------------------------------------- | ------------------------------------------------------- | ----------------------------------- | ------------------ |
| `sys.color.text` `#1B1A17`                          | Texto principal                                         | `bg` / `surface` / `surface-raised` | 15,5 / 16,4 / 13,9 |
| `sys.color.text-muted` `#5C574C`                    | Texto secundario; nunca información imprescindible      | `bg` / `surface` / `surface-raised` | 6,4 / 6,8 / 5,7    |
| `sys.color.primary` `#A8321A` (como texto o enlace) | Enlaces (siempre subrayados) y el subrayado del titular | `bg` / `surface` / `surface-raised` | 6,0 / 6,3 / 5,3    |
| `sys.color.primary-hover` `#8C2711` (como texto)    | Enlace en hover                                         | `bg`                                | 7,7                |
| `sys.color.success` `#2F6B3A`                       | Mensaje de éxito (con texto y icono)                    | `bg` / `surface` / `surface-raised` | 5,7 / 6,0 / 5,1    |
| `sys.color.error` `#B3261E`                         | Errores (texto y borde); nunca decoración               | `bg` / `surface` / `surface-raised` | 5,8 / 6,2 / 5,2    |
| `sys.color.text-inverse` `#FFFDF8`                  | Texto del botón primario                                | `primary` / `primary-hover`         | 6,6 / 8,6          |
| `sys.color.text` `#1B1A17`                          | Texto del botón de WhatsApp                             | `whatsapp` `#25D366`                | 8,8                |
| `sys.color.border-control` `#7A7466`                | Borde de campos, casillas y desplegables (WCAG 1.4.11)  | `bg` / `surface` / `surface-raised` | 4,1 / 4,4 / 3,7    |
| `sys.color.focus-ring` `#1B1A17`                    | Anillo de foco de 2 px con desplazamiento de 2 px       | `bg` / `surface` / `surface-raised` | 15,5 / 16,4 / 13,9 |
| `sys.color.text` `#1B1A17` (borde de 2 px)          | Borde del botón de WhatsApp, que lo separa del fondo    | `bg`                                | 15,5               |

**Pares que no llegan y su solución:**

| Par que falla                                              | Ratio | Solución                                                                                                                                                                  |
| ---------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Texto oscuro `#1B1A17` sobre ladrillo `#A8321A`            | 2,6   | Prohibido: el texto sobre ladrillo es `text-inverse` `#FFFDF8` (6,6)                                                                                                      |
| Texto claro `#FFFDF8` sobre el verde de WhatsApp `#25D366` | 1,9   | Prohibido: el texto del botón de WhatsApp es `#1B1A17` (8,8)                                                                                                              |
| Verde de WhatsApp `#25D366` contra `bg` como límite visual | 1,8   | El botón lleva un borde de 2 px `#1B1A17` (15,5); el texto del botón también lo identifica                                                                                |
| Borde `#D9D0BD` sobre `bg`                                 | 1,4   | No sirve como límite de un campo (WCAG 1.4.11, ≥ 3:1): `comp.input.border` usa `#7A7466` (4,1). `#D9D0BD` queda solo como línea decorativa entre filas y bajo la cabecera |

### 3.2 Tipografía

Solo fuentes del sistema (ADR-009, decisión de David en la issue #3): no hay `@font-face`, ni precarga, ni archivos de fuentes, ni peticiones a terceros. Dos familias, definidas como pilas: serif para titulares (`ui-serif, Georgia, 'Times New Roman', serif`) y sans para el texto (`system-ui, sans-serif`). Las dos son las del equipo del visitante: lo que «se descarga» es 0 bytes. No hay familia monoespaciada: las etiquetas tipo `// 01 Servicios` quedan eliminadas (§1.1).

| Token                  | Tamaño / altura de línea           | Peso | Uso                                         |
| ---------------------- | ---------------------------------- | ---- | ------------------------------------------- |
| `sys.type.display`     | 4,5 rem (2,5 rem en móvil) / 1,05  | 700  | `h1` del hero, 1 por página                 |
| `sys.type.heading`     | 2,5 rem (1,75 rem en móvil) / 1,15 | 700  | `h2` de cada sección                        |
| `sys.type.subheading`  | 1,25 rem / 1,3                     | 600  | `h3` de filas de servicio y pasos           |
| `sys.type.body`        | 1 rem / 1,6                        | 400  | Texto general, líneas de 65 caracteres máx. |
| `sys.type.body-strong` | 1 rem / 1,6                        | 600  | Énfasis en el texto y botones               |
| `sys.type.label`       | 0,875 rem / 1,4                    | 600  | Etiquetas de campos y ayudas                |

Pesos usados: 400, 600 y 700. Como cada sistema trae sus propios pesos, si falta el 600 el navegador usa el 700, y es aceptable.

### 3.3 Espaciado, radios, sombras y movimiento

- **Espaciado:** solo valores de `ref.space` (base de 4 px) mediante tokens. Dentro de un componente 2 a 4; entre bloques, 12 a 24.
- **Radios:** `sm` (2 px) para campos y casillas, `md` (4 px) para botones, `full` solo para el anillo de las casillas redondas si las hubiera.
- **Sombras:** ninguna. La separación se hace con líneas de 1 px (`border`) y con espacio.
- **Fondo:** papel liso `bg`; sin rejilla, sin halos y sin degradados.
- **Etiquetas:** ninguna etiqueta con prefijo (`// 01`) sobre los títulos (§1.1).

**Escala de movimiento.** Solo se animan `transform` y `opacity`. No hay ninguna animación continua ni infinita, en móvil ni en escritorio, ni canvas. Cada animación con su alternativa cuando el visitante pide `prefers-reduced-motion: reduce`:

| Animación                      | Propiedades animadas                               | Duración y curva                                                      | Alternativa con movimiento reducido |
| ------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------- |
| Menú móvil: abrir              | `opacity` y `transform` (`translateY` de 8 px a 0) | `base` (200 ms) y `enter` (ease-out)                                  | Aparece sin transición              |
| Menú móvil: cerrar             | `opacity`                                          | `fast` (120 ms) y `enter`                                             | Desaparece sin transición           |
| Pulsación de botón (`:active`) | `transform` (`scale` 0,97)                         | `fast` (120 ms) y `enter`                                             | Sin `transform`                     |
| Hover de botones y enlaces     | Ninguna (el color cambia al instante)              | 0 ms; solo con `@media (hover: hover)`                                | Igual: no hay movimiento que quitar |
| Foco                           | Ninguna                                            | Anillo visible al instante, sin transición (es una acción de teclado) | Igual                               |
| Hero, secciones y pasos        | Ninguna                                            | Sin aparición ni animación: el contenido está visible desde la carga  | Igual                               |
| Desplazamiento a anclas        | Ninguna                                            | Salto directo, sin `scroll-behavior: smooth`                          | Igual                               |

Ninguna animación se usa para transmitir información que no esté también en texto. Nunca `backdrop-filter`, `transition: all` ni `will-change` permanente.

## 4. Layout y breakpoints

Mobile-first: los estilos base son los de 360 px y se amplían con `min-width`.

| Nombre | Desde   | Columnas | Márgenes | Qué cambia                                                                                                                                                               |
| ------ | ------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sm`   | 0 px    | 4        | 16 px    | Diseño base; se prueba a 360 px. Cabecera con menú desplegable, filas de servicio y pasos en una columna, botones a todo el ancho, `display` y `heading` en tamaño móvil |
| `md`   | 768 px  | 8        | 24 px    | Cada fila de servicio en dos columnas (título a la izquierda, texto a la derecha), pasos en 2 columnas, botones del hero en fila, tamaños de titular de escritorio       |
| `lg`   | 1024 px | 12       | 32 px    | Cabecera con enlaces visibles y sin menú desplegable, «Contacto» con formulario y datos en dos columnas                                                                  |
| `xl`   | 1440 px | 12       | 40 px    | Ancho máximo de contenido de 1200 px, centrado; más espacio vertical entre secciones (`space.24`)                                                                        |

Se comprueba a 360, 768, 1024 y 1440 px de ancho sin scroll horizontal ni solapes. La cabecera es fija: las anclas llevan un margen superior de desplazamiento mayor que su altura, para que el foco y los encabezados no queden tapados.

## 5. Componentes

Matriz de estados: ✓ = definido; lo prueba (e2e o revisión) el trabajo que crea el componente; — = no aplica (el motivo está en Notas). Foco = anillo de 2 px con `sys.color.focus-ring`, contraste ≥ 3:1. Cargando = sin doble envío.

| Componente                           | Cuándo usarlo                                                                         | Variantes                         | Normal | Hover | Foco | Deshab. | Cargando | Vacío | Error | Tokens comp       | Notas                                                                                                                                                                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------- | ------ | ----- | ---- | ------- | -------- | ----- | ----- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cabecera con menú móvil              | Navegación fija en toda la página                                                     | escritorio, móvil abierta/cerrada | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | `aria-expanded`, cierra con Escape. Animación del menú: §3.3. — Deshab.: la navegación nunca se desactiva. — Cargando, Vacío y Error: no hay datos que cargar ni fallar                                                                                                          |
| Botón primario                       | Acción principal («Solicita una propuesta», «Hablemos»)                               | normal, a todo el ancho           | ✓      | ✓     | ✓    | ✓       | ✓        | —     | —     | `button-primary`  | Fondo ladrillo plano, texto `#FFFDF8`; hover: `primary-hover`. Cargando: «Enviando…» y bloqueado. — Vacío y Error: no tienen contenido propio                                                                                                                                    |
| Botón de WhatsApp                    | Abrir WhatsApp en hero y contacto                                                     | único                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `button-whatsapp` | Fondo `#25D366` solo aquí; texto y borde de 2 px `#1B1A17`. — Deshab. y Cargando: es un enlace que abre otra pestaña. — Vacío y Error: no aplica                                                                                                                                 |
| Fila de servicio                     | Mostrar uno de los 4 servicios                                                        | única                             | ✓      | —     | —    | —       | —        | —     | —     | `row-service`     | Línea de 1 px arriba, título `subheading` y texto; sin caja, icono ni sombra. — Hover y Foco: no es interactiva. — Deshab., Cargando, Vacío y Error: contenido fijo y siempre presente                                                                                           |
| Paso de «Cómo trabajamos»            | Mostrar un paso del proceso                                                           | 4 pasos                           | ✓      | —     | —    | —       | —        | —     | —     | `row-service`     | Número del paso en serif (el orden es contenido, §1.1). Sin línea de progreso ni animación. — Resto de estados: no es interactivo y su contenido es fijo                                                                                                                         |
| Campo de texto (`input`, `textarea`) | Nombre, email, empresa y mensaje                                                      | texto, email, área de texto       | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Etiqueta visible, `aria-describedby` al error. Vacío: placeholder de ayuda. Error: borde y texto `error` (icono más texto). — Cargando: el formulario completo se bloquea, no cada campo                                                                                         |
| Desplegable                          | Servicio de interés                                                                   | 4 servicios + «Otro»              | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Vacío: opción inicial «Elige un servicio». — Cargando: opciones fijas, no se cargan                                                                                                                                                                                              |
| Casilla de privacidad                | Aceptar la política de privacidad                                                     | única, con enlace                 | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Objetivo táctil ≥ 44×44 px. Vacío = sin marcar. — Cargando: se bloquea con el formulario                                                                                                                                                                                         |
| Resumen de errores                   | Anunciar los errores al enviar                                                        | único                             | —      | —     | ✓    | —       | —        | ✓     | ✓     | `input`           | `aria-live`; enlaza a cada campo con error. — Normal: no se muestra. Vacío: sin errores no hay resumen. — Hover, Deshab. y Cargando: no aplica                                                                                                                                   |
| Pie                                  | Cierre con enlaces y año                                                              | única                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | Logotipo, enlaces de sección y legales, © con el año actual. — Deshab., Cargando, Vacío y Error: contenido fijo                                                                                                                                                                  |
| Titular tipográfico del hero         | Presentar la propuesta en el hero con el titular como único elemento memorable (§1.1) | único                             | ✓      | —     | —    | —       | —        | —     | —     | `button-primary`  | `h1` en `sys.type.display` con la palabra clave subrayada con una línea estática de `primary`; sobre `bg` liso, sin canvas, imagen ni animación. — Hover, Foco, Deshab., Cargando, Vacío y Error: es texto fijo y no interactivo (los botones del hero tienen sus propias filas) |
| Aviso sin JavaScript                 | Alternativa de contacto cuando JavaScript no está activo                              | único                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `input`           | `<noscript>` con enlace `mailto:` y WhatsApp. — Deshab., Cargando, Vacío y Error: es texto fijo                                                                                                                                                                                  |
| Wordmark                             | Logotipo provisional en cabecera y pie                                                | cabecera, pie                     | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | Símbolo SVG decorativo más el texto «Axyntia». — Resto de estados: contenido fijo                                                                                                                                                                                                |

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
5. Texto sobre ladrillo usa `sys.color.text-inverse`; texto sobre el verde de WhatsApp usa `sys.color.text`. Se comprueba con la tabla de 3.1 y con el análisis de contraste del e2e de la landing.
6. Los bordes de campos y casillas usan `border-control`, no `border`. Se comprueba con el análisis de contraste de la landing y con `grep -rnE 'border-(border|\[)' src` en campos y casillas (revisión del Reviewer de los resultados).
7. Cada animación tiene alternativa con `prefers-reduced-motion: reduce` (sección 3.3). Se comprueba con la prueba e2e con `emulateMedia` de la landing.
8. Sin GSAP ni three.js ni otras librerías de animación. Se comprueba con: `grep -nE '"(gsap|three)"' package.json` (0 resultados).
9. Solo fuentes del sistema, sin `@font-face` ni peticiones a terceros (ADR-009). Se comprueba con: `grep -rnE '@font-face|fonts\.(googleapis|gstatic)\.com' src public` (0 resultados) y la prueba e2e de 0 peticiones a terceros.
10. No renombres ni quites `--color-axyntia-dark` ni `--color-axyntia-light` mientras `tests/integration/build.test.ts` los exija (nota de la sección 3); los quita la issue #10 junto con ese test.
11. No copies textos, imágenes ni código de las referencias de inspiración. No es automatizable: lo comprueba el Reviewer en cada PR y, como apoyo, `grep -rniE 'ft\.com|design-system\.service\.gov\.uk|museumplantinmoretus\.be|basecamp\.com' src public` debe dar 0 resultados.
12. Movimiento solo con `transform` y `opacity`, sin animación continua, canvas, degradados ni `backdrop-filter` (sección 1.1 y 3.3). Se comprueba con: `grep -rnE 'backdrop-filter|gradient|infinite|requestAnimationFrame|<canvas' src` (0 resultados).

## 8. Historial de cambios

| Versión | Fecha      | Cambio                                                                                                                                                                                               |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1.0   | 2026-11-22 | Versión inicial                                                                                                                                                                                      |
| 0.1.1   | 2026-11-22 | Filas de §5: fondo animado del hero, aviso sin JavaScript y wordmark                                                                                                                                 |
| 0.2.0   | 2026-11-23 | Nueva dirección visual (§1.1): papel claro con acento ladrillo, serif y sans del sistema, filas en lugar de tarjetas; tokens, contraste, movimiento (solo `transform` y `opacity`) y reglas rehechos |
