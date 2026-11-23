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

**Tesis:** una oficina bien llevada: papel blanco azulado, tinta negra y un único acento de azul tinta de bolígrafo; la tipografía y el orden hacen el trabajo, no el efecto. Pensada para dueños y gerentes de pymes que no son técnicos y leen en el móvil.

| Principio                 | Qué implica en la práctica                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Claridad antes que adorno | 1 acción primaria por bloque; el hero deja visibles titular y botón de contacto sin esperar a ninguna animación |
| Accesible por defecto     | WCAG 2.2 AA en todo; se diseña con teclado desde el principio; el contraste se calcula par a par (§3.1)         |
| Mobile-first              | Se maqueta primero a 360 px y se amplía con `min-width`                                                         |
| Rápida en el móvil        | Solo se animan `transform` y `opacity`; ninguna animación continua; 0 bytes de fuentes (ADR-009)                |
| Movimiento con permiso    | Toda animación tiene alternativa con `prefers-reduced-motion: reduce` y el contenido nunca depende de ella      |
| Marca contenida           | El azul tinta es el único acento; el verde de WhatsApp se usa solo en su botón; no hay degradados               |

### 1.1 Dirección visual

- **Concepto:** el libro de cuentas de la pyme: la ordenada hoja de papel donde cada cosa tiene su fila. Software a medida explicado con la calma y la claridad de un buen albarán, no con el decorado de «tecnología».
- **La cosa atrevida:** los servicios y los pasos de trabajo se presentan como las líneas de un albarán real: una tabla de columnas alineadas (nº de línea, concepto, para quién y qué resuelve) con cabecera de columnas y el número de línea en cifras serif de ancho fijo, como en un documento de pyme. El titular del hero es sans del sistema en negrita, entero en tinta negra y sin énfasis en ninguna palabra. En móvil cada línea se apila con sus rótulos («Para quién», «Qué resuelve»). Todo lo demás es tranquilo: papel liso y texto, sin animación.
- **Valores de marca propuestos** [POR ACLARAR: confirmar con David]: acento azul tinta `#1F3C9C`, fondo `#F4F6F8` (papel blanco azulado) y pareja de familias sans del sistema para titulares y texto con serif del sistema solo para cifras. No hay marca cerrada: son una propuesta hasta que David la apruebe.
- **Referencias** (se estudian, no se copian textos, imágenes ni código):

| Referencia                                 | URL                                  | Qué se toma (y qué no)                                                                                                      |
| ------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Financial Times (prensa económica)         | https://www.ft.com                   | Cifras serif de ancho fijo y jerarquía densa pero legible. No: el fondo salmón, los titulares serif ni la densidad de texto |
| GOV.UK Design System (servicio público)    | https://design-system.service.gov.uk | Legibilidad, enlaces subrayados, formularios con error junto al campo y lenguaje llano. No: su paleta ni sus componentes    |
| Museo Plantin-Moretus (imprenta histórica) | https://www.museumplantinmoretus.be  | Composición tipográfica clásica, márgenes amplios y columnas alineadas como en un registro. No: ornamentos ni texturas      |
| Basecamp (software para pequeños equipos)  | https://basecamp.com                 | Tono directo y cercano, titulares que hablan de problemas del negocio. No: ilustraciones ni el estilo de sus botones        |

- **Direcciones descartadas:**
  - **Oscuro con cian y violeta y constelación en el hero** (la dirección anterior): el diagnóstico de la prueba 01 la señala como «hecha con IA» y se parece a cualquier landing de software; el canvas de la constelación gastaba el 52,5 % del hilo principal con la CPU 4× más lenta (ADR-010); y un fondo casi negro cuesta leer a un público que lee en el móvil a plena luz.
  - **Corporativo azul marino con fotos de stock:** vale para cualquier consultora, no dice nada de Axyntia y necesita imágenes de stock que quedan fuera de alcance (PRD §3).
  - **Brutalista monocromo con letra de máquina:** señala «herramienta para programadores» y intimida a dueños y gerentes que no son técnicos.
- **Defaults de «web hecha con IA»** (cada fila lleva su decisión y su motivo):

| Default                                                                            | En este proyecto                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Degradado cian/azul → violeta en botones, títulos o fondos                         | Prohibido: ningún degradado. Motivo: es la firma de las webs generadas y el acento es un único color plano (azul tinta)                                                                                                                                                                                                                                                 |
| Fondo casi negro teñido con halos radiales y cuadrícula decorativa                 | Prohibido: el fondo es papel liso claro (`bg`). Motivo: la lectura en móvil a plena luz es mejor con fondo claro y los halos añaden coste de pintado sin informar                                                                                                                                                                                                       |
| Inter, Space Grotesk, Roboto o la pila del sistema como única voz                  | Permitido de forma limitada: solo hay fuentes del sistema porque ADR-009 (decisión de David en la issue #3) lo exige. Motivo: la voz propia sale del contraste entre la sans del sistema en negrita (titulares y texto) y la serif del sistema solo en las cifras de las líneas de albarán, y de la escala. Inter, Space Grotesk y Roboto no se nombran ni se descargan |
| Etiqueta encima de cada título (`// `, MAYÚSCULAS espaciadas, «01 —»)              | Prohibido encima de los títulos. Única excepción: el número de cada paso de «Cómo trabajamos», porque ahí el orden es contenido. Motivo: una etiqueta sobre cada título es decoración que no informa                                                                                                                                                                    |
| Hero genérico con red de nodos, orbe o partículas como imagen de «IA»              | Prohibido: el hero es solo tipografía sobre papel, sin canvas ni imagen decorativa. Motivo: coste de CPU medido (ADR-010) y no dice nada de lo que hace Axyntia                                                                                                                                                                                                         |
| Tarjetas idénticas en rejilla (icono + título + texto) con el mismo radio y sombra | Prohibido: los servicios y pasos son líneas de albarán en una tabla de columnas (nº, concepto, para quién, qué resuelve), sin caja, sin icono y sin sombra. Motivo: las tarjetas repetidas son indistinguibles de cualquier plantilla                                                                                                                                   |
| Brillo que sigue al puntero, glassmorphism, `backdrop-filter` decorativo           | Prohibido. Motivo: gasta GPU y CPU en móviles de gama baja y el gate mide la fluidez; el hover solo cambia el color                                                                                                                                                                                                                                                     |
| Aparición fade + subida en cada sección y hover en cada tarjeta                    | Prohibido: las secciones no se animan al entrar y no hay tarjetas. Motivo: retrasa la lectura y añade trabajo en el móvil. El único movimiento es el de estado: menú móvil y pulsación de botón (§3.3)                                                                                                                                                                  |
| Fondo crema + serif de gran tamaño en titulares + acento terracota o barro         | Prohibido: el fondo es blanco azulado frío (`#F4F6F8`), los titulares van en sans del sistema y el acento es azul tinta; no se repite ninguno de los tres elementos. Motivo: es la combinación de la segunda ola de webs generadas y nada del concepto la pide                                                                                                          |
| Una sola palabra del titular en otro color, cursiva o subrayada                    | Prohibido: el titular va entero en `text`. Motivo: es un recurso de plantilla que no dice nada; el énfasis lo da el tamaño y la negrita                                                                                                                                                                                                                                 |
| Maquetación de periódico: líneas finas, radio 0 y columnas densas                  | Permitido de forma limitada: las líneas de 1 px solo separan las líneas del albarán (es la forma del documento); los radios son 4 px y 8 px, no 0; no hay columnas de texto densas ni cabecera de portada. Motivo: la tabla alineada es el concepto, pero el resto de la página no imita un diario                                                                      |
| Textos que valen para cualquier empresa                                            | Prohibido siempre. Motivo: cada texto habla de un problema concreto de una pyme (papeles, hojas de cálculo, tareas repetidas)                                                                                                                                                                                                                                           |
| Modo oscuro por defecto como seña de «tecnología»                                  | Prohibido por defecto: el sitio es claro (`color-scheme: light`). Motivo: ver fondo casi negro. Un modo oscuro opcional necesitaría su propia tabla de contraste y no está en el alcance                                                                                                                                                                                |

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
        0: '#F4F6F8',
        50: '#FFFFFF',
        100: '#E8ECF1',
        200: '#CBD2DB',
        500: '#6B7482',
        700: '#4A5260',
        900: '#14181F',
      }
    light: '#FFFFFF'
    ink: '#1F3C9C'
    ink-dark: '#162C75'
    green: '#2A6B3A'
    red: '#B3261E'
    whatsapp: '#25D366'
  font:
    family: { serif: "ui-serif, Georgia, 'Times New Roman', serif", sans: 'system-ui, sans-serif' }
  space: { 1: 4px, 2: 8px, 3: 12px, 4: 16px, 6: 24px, 8: 32px, 12: 48px, 16: 64px, 24: 96px }
  font-size: { 1: 0.875rem, 2: 1rem, 3: 1.25rem, 4: 1.75rem, 5: 2.25rem, 6: 3.5rem }
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
    primary: '{ref.color.ink}'
    primary-hover: '{ref.color.ink-dark}'
    success: '{ref.color.green}'
    error: '{ref.color.red}'
    focus-ring: '{ref.color.paper.900}'
    whatsapp: '{ref.color.whatsapp}'
  type:
    display:
      {
        family: '{ref.font.family.sans}',
        size: '{ref.font-size.6}',
        size-mobile: '{ref.font-size.5}',
        line-height: 1.1,
        weight: '{ref.font-weight.bold}',
      }
    heading:
      {
        family: '{ref.font.family.sans}',
        size: '{ref.font-size.5}',
        size-mobile: '{ref.font-size.4}',
        line-height: 1.15,
        weight: '{ref.font-weight.bold}',
      }
    subheading:
      {
        family: '{ref.font.family.sans}',
        size: '{ref.font-size.3}',
        line-height: 1.3,
        weight: '{ref.font-weight.semibold}',
      }
    figure:
      {
        family: '{ref.font.family.serif}',
        size: '{ref.font-size.3}',
        line-height: 1.3,
        weight: '{ref.font-weight.bold}',
        numeric: tabular-nums,
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
  radius: { sm: 4px, md: 8px, full: 9999px }
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
  row-service:
    { bg: '{sys.color.bg}', border-top: '{sys.color.border}', figure: '{sys.type.figure}' }
  hero-title: { color: '{sys.color.text}', type: '{sys.type.display}' }
  input:
    {
      bg: '{sys.color.surface}',
      border: '{sys.color.border-control}',
      border-error: '{sys.color.error}',
      radius: '{sys.radius.sm}',
    }
  header: { bg: '{sys.color.surface}', border: '{sys.color.border}' }
```

**Tokens que ya existen** en `src/styles/global.css` y no se tocan en este trabajo: `--color-axyntia-dark` (`#07080c`) y `--color-axyntia-light` (`#e8ecf4`). Son de la paleta anterior (oscura) y la paleta nueva ya no los usa: `sys.color.bg` es ahora `#F4F6F8` y `sys.color.text` es `#14181F`. Los valores de marca (acento, fondo y pareja de familias) son una propuesta [POR ACLARAR: confirmar con David] (§1.1). No se renombran ni se quitan todavía porque `tests/integration/build.test.ts` busca `.bg-axyntia-dark`, `.text-axyntia-light` y los dos valores en el CSS generado. Hasta que la issue #10 cambie el código, quedan como alias heredados sin significado semántico y ningún componente nuevo debe usarlos. La issue #10 deberá actualizar a la vez esos dos tokens y ese test (cambio de tests que aprueba David) y entonces se retira esta nota. Los tokens `sys` nuevos se añaden al mismo `@theme`.

**Convención de nombres de las variables CSS:** `sys.color.text-muted` → `--color-text-muted` (y análogos: `--font-*`, `--radius-*`, `--duration-*`); `ref.*` → `--ref-*`, que solo se declara y se usa dentro de `global.css`.

### 3.1 Color: uso y contraste

Ratios calculados con la fórmula de contraste de WCAG y redondeados a 1 decimal. Mínimos: texto normal ≥ 4,5:1; texto grande y elementos de interfaz ≥ 3:1. Todo el sitio es claro (`color-scheme: light`).

| Token (primer plano)                                | Uso (y cuándo NO usarlo)                               | Sobre                               | Contraste          |
| --------------------------------------------------- | ------------------------------------------------------ | ----------------------------------- | ------------------ |
| `sys.color.text` `#14181F`                          | Texto principal                                        | `bg` / `surface` / `surface-raised` | 16,4 / 17,8 / 15,0 |
| `sys.color.text-muted` `#4A5260`                    | Texto secundario; nunca información imprescindible     | `bg` / `surface` / `surface-raised` | 7,3 / 7,9 / 6,6    |
| `sys.color.primary` `#1F3C9C` (como texto o enlace) | Enlaces (siempre subrayados)                           | `bg` / `surface` / `surface-raised` | 8,9 / 9,6 / 8,1    |
| `sys.color.primary-hover` `#162C75` (como texto)    | Enlace en hover                                        | `bg`                                | 11,7               |
| `sys.color.success` `#2A6B3A`                       | Mensaje de éxito (con texto y icono)                   | `bg` / `surface` / `surface-raised` | 5,9 / 6,4 / 5,4    |
| `sys.color.error` `#B3261E`                         | Errores (texto y borde); nunca decoración              | `bg` / `surface` / `surface-raised` | 6,0 / 6,5 / 5,5    |
| `sys.color.text-inverse` `#FFFFFF`                  | Texto del botón primario                               | `primary` / `primary-hover`         | 9,6 / 12,7         |
| `sys.color.text` `#14181F`                          | Texto del botón de WhatsApp                            | `whatsapp` `#25D366`                | 9,0                |
| `sys.color.border-control` `#6B7482`                | Borde de campos, casillas y desplegables (WCAG 1.4.11) | `bg` / `surface` / `surface-raised` | 4,4 / 4,7 / 4,0    |
| `sys.color.focus-ring` `#14181F`                    | Anillo de foco de 2 px con desplazamiento de 2 px      | `bg` / `surface` / `surface-raised` | 16,4 / 17,8 / 15,0 |
| `sys.color.text` `#14181F` (borde de 2 px)          | Borde del botón de WhatsApp, que lo separa del fondo   | `bg`                                | 16,4               |

**Pares que no llegan y su solución:**

| Par que falla                                              | Ratio | Solución                                                                                                                                                                               |
| ---------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Texto oscuro `#14181F` sobre azul tinta `#1F3C9C`          | 1,9   | Prohibido: el texto sobre azul tinta es `text-inverse` `#FFFFFF` (9,6)                                                                                                                 |
| Texto claro `#FFFFFF` sobre el verde de WhatsApp `#25D366` | 2,0   | Prohibido: el texto del botón de WhatsApp es `#14181F` (9,0)                                                                                                                           |
| Verde de WhatsApp `#25D366` contra `bg` como límite visual | 1,8   | El botón lleva un borde de 2 px `#14181F` (16,4); el texto del botón también lo identifica                                                                                             |
| Borde `#CBD2DB` sobre `bg`                                 | 1,4   | No sirve como límite de un campo (WCAG 1.4.11, ≥ 3:1): `comp.input.border` usa `#6B7482` (4,4). `#CBD2DB` queda solo como línea decorativa entre líneas del albarán y bajo la cabecera |

### 3.2 Tipografía

Solo fuentes del sistema (ADR-009, decisión de David en la issue #3): no hay `@font-face`, ni precarga, ni archivos de fuentes, ni peticiones a terceros. Dos familias, definidas como pilas: sans para titulares y texto (`system-ui, sans-serif`) y serif solo para las cifras de las líneas de albarán (`ui-serif, Georgia, 'Times New Roman', serif`, con cifras de ancho fijo). Las dos son las del equipo del visitante: lo que «se descarga» es 0 bytes. No hay familia monoespaciada: las etiquetas tipo `// 01 Servicios` quedan eliminadas (§1.1).

| Token                  | Tamaño / altura de línea             | Peso | Uso                                                 |
| ---------------------- | ------------------------------------ | ---- | --------------------------------------------------- |
| `sys.type.display`     | 3,5 rem (2,25 rem en móvil) / 1,1    | 700  | `h1` del hero, 1 por página, sans, entero en `text` |
| `sys.type.heading`     | 2,25 rem (1,75 rem en móvil) / 1,15  | 700  | `h2` de cada sección                                |
| `sys.type.subheading`  | 1,25 rem / 1,3                       | 600  | Concepto de cada línea de albarán y paso            |
| `sys.type.figure`      | 1,25 rem / 1,3, cifras de ancho fijo | 700  | Solo el nº de línea y de paso (serif)               |
| `sys.type.body`        | 1 rem / 1,6                          | 400  | Texto general, líneas de 65 caracteres máx.         |
| `sys.type.body-strong` | 1 rem / 1,6                          | 600  | Énfasis en el texto y botones                       |
| `sys.type.label`       | 0,875 rem / 1,4                      | 600  | Etiquetas de campos y ayudas                        |

Pesos usados: 400, 600 y 700. Sin titulares serif ni énfasis de una palabra (§1.1). Como cada sistema trae sus propios pesos, si falta el 600 el navegador usa el 700, y es aceptable.

### 3.3 Espaciado, radios, sombras y movimiento

- **Espaciado:** solo valores de `ref.space` (base de 4 px) mediante tokens. Dentro de un componente 2 a 4; entre bloques, 12 a 24.
- **Radios:** `sm` (4 px) para campos y casillas, `md` (8 px) para botones (nunca 0, §1.1), `full` solo para el anillo de las casillas redondas si las hubiera.
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

| Nombre | Desde   | Columnas | Márgenes | Qué cambia                                                                                                                                                                         |
| ------ | ------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sm`   | 0 px    | 4        | 16 px    | Diseño base; se prueba a 360 px. Cabecera con menú desplegable, líneas de albarán y pasos apiladas con sus rótulos, botones a todo el ancho, `display` y `heading` en tamaño móvil |
| `md`   | 768 px  | 8        | 24 px    | Cada fila de servicio en dos columnas (título a la izquierda, texto a la derecha), pasos en 2 columnas, botones del hero en fila, tamaños de titular de escritorio                 |
| `lg`   | 1024 px | 12       | 32 px    | Cabecera con enlaces visibles y sin menú desplegable, «Contacto» con formulario y datos en dos columnas                                                                            |
| `xl`   | 1440 px | 12       | 40 px    | Ancho máximo de contenido de 1200 px, centrado; más espacio vertical entre secciones (`space.24`)                                                                                  |

Se comprueba a 360, 768, 1024 y 1440 px de ancho sin scroll horizontal ni solapes. La cabecera es fija: las anclas llevan un margen superior de desplazamiento mayor que su altura, para que el foco y los encabezados no queden tapados.

## 5. Componentes

Matriz de estados: ✓ = definido; lo prueba (e2e o revisión) el trabajo que crea el componente; — = no aplica (el motivo está en Notas). Foco = anillo de 2 px con `sys.color.focus-ring`, contraste ≥ 3:1. Cargando = sin doble envío.

| Componente                           | Cuándo usarlo                                                 | Variantes                         | Normal | Hover | Foco | Deshab. | Cargando | Vacío | Error | Tokens comp       | Notas                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------- | --------------------------------- | ------ | ----- | ---- | ------- | -------- | ----- | ----- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cabecera con menú móvil              | Navegación fija en toda la página                             | escritorio, móvil abierta/cerrada | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | `aria-expanded`, cierra con Escape. Animación del menú: §3.3. — Deshab.: la navegación nunca se desactiva. — Cargando, Vacío y Error: no hay datos que cargar ni fallar                                                                                                                                                                 |
| Botón primario                       | Acción principal («Solicita una propuesta», «Hablemos»)       | normal, a todo el ancho           | ✓      | ✓     | ✓    | ✓       | ✓        | —     | —     | `button-primary`  | Fondo azul tinta plano, texto `#FFFFFF`; hover: `primary-hover`. Cargando: «Enviando…» y bloqueado. — Vacío y Error: no tienen contenido propio                                                                                                                                                                                         |
| Botón de WhatsApp                    | Abrir WhatsApp en hero y contacto                             | único                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `button-whatsapp` | Fondo `#25D366` solo aquí; texto y borde de 2 px `#1B1A17`. — Deshab. y Cargando: es un enlace que abre otra pestaña. — Vacío y Error: no aplica                                                                                                                                                                                        |
| Línea de albarán (servicio)          | Mostrar uno de los 4 servicios                                | única                             | ✓      | —     | —    | —       | —        | —     | —     | `row-service`     | Una fila de la tabla de servicios: nº de línea (`figure`), concepto (`subheading`), para quién y qué resuelve, en columnas con cabecera y línea de 1 px entre filas; en móvil se apila con rótulos. Sin caja, icono ni sombra. — Hover y Foco: no es interactiva. — Deshab., Cargando, Vacío y Error: contenido fijo y siempre presente |
| Paso de «Cómo trabajamos»            | Mostrar un paso del proceso                                   | 4 pasos                           | ✓      | —     | —    | —       | —        | —     | —     | `row-service`     | Mismo formato de línea de albarán; número del paso con `figure` (el orden es contenido, §1.1). Sin línea de progreso ni animación. — Resto de estados: no es interactivo y su contenido es fijo                                                                                                                                         |
| Campo de texto (`input`, `textarea`) | Nombre, email, empresa y mensaje                              | texto, email, área de texto       | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Etiqueta visible, `aria-describedby` al error. Vacío: placeholder de ayuda. Error: borde y texto `error` (icono más texto). — Cargando: el formulario completo se bloquea, no cada campo                                                                                                                                                |
| Desplegable                          | Servicio de interés                                           | 4 servicios + «Otro»              | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Vacío: opción inicial «Elige un servicio». — Cargando: opciones fijas, no se cargan                                                                                                                                                                                                                                                     |
| Casilla de privacidad                | Aceptar la política de privacidad                             | única, con enlace                 | ✓      | ✓     | ✓    | ✓       | —        | ✓     | ✓     | `input`           | Objetivo táctil ≥ 44×44 px. Vacío = sin marcar. — Cargando: se bloquea con el formulario                                                                                                                                                                                                                                                |
| Resumen de errores                   | Anunciar los errores al enviar                                | único                             | —      | —     | ✓    | —       | —        | ✓     | ✓     | `input`           | `aria-live`; enlaza a cada campo con error. — Normal: no se muestra. Vacío: sin errores no hay resumen. — Hover, Deshab. y Cargando: no aplica                                                                                                                                                                                          |
| Pie                                  | Cierre con enlaces y año                                      | única                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | Logotipo, enlaces de sección y legales, © con el año actual. — Deshab., Cargando, Vacío y Error: contenido fijo                                                                                                                                                                                                                         |
| Titular tipográfico del hero         | Presentar la propuesta en el hero con un titular claro (§1.1) | único                             | ✓      | —     | —    | —       | —        | —     | —     | `hero-title`      | `h1` en `sys.type.display`, sans, entero en `text` y sin énfasis en ninguna palabra; sobre `bg` liso, sin canvas, imagen ni animación. — Hover, Foco, Deshab., Cargando, Vacío y Error: es texto fijo y no interactivo (los botones del hero tienen sus propias filas)                                                                  |
| Aviso sin JavaScript                 | Alternativa de contacto cuando JavaScript no está activo      | único                             | ✓      | ✓     | ✓    | —       | —        | —     | —     | `input`           | `<noscript>` con enlace `mailto:` y WhatsApp. — Deshab., Cargando, Vacío y Error: es texto fijo                                                                                                                                                                                                                                         |
| Wordmark                             | Logotipo provisional en cabecera y pie                        | cabecera, pie                     | ✓      | ✓     | ✓    | —       | —        | —     | —     | `header`          | Símbolo SVG decorativo más el texto «Axyntia». — Resto de estados: contenido fijo                                                                                                                                                                                                                                                       |

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
5. Texto sobre azul tinta usa `sys.color.text-inverse`; texto sobre el verde de WhatsApp usa `sys.color.text`. Se comprueba con la tabla de 3.1 y con el análisis de contraste del e2e de la landing.
6. Los bordes de campos y casillas usan `border-control`, no `border`. Se comprueba con el análisis de contraste de la landing y con `grep -rnE 'border-(border|\[)' src` en campos y casillas (revisión del Reviewer de los resultados).
7. Cada animación tiene alternativa con `prefers-reduced-motion: reduce` (sección 3.3). Se comprueba con la prueba e2e con `emulateMedia` de la landing.
8. Sin GSAP ni three.js ni otras librerías de animación. Se comprueba con: `grep -nE '"(gsap|three)"' package.json` (0 resultados).
9. Solo fuentes del sistema, sin `@font-face` ni peticiones a terceros (ADR-009). Se comprueba con: `grep -rnE '@font-face|fonts\.(googleapis|gstatic)\.com' src public` (0 resultados) y la prueba e2e de 0 peticiones a terceros.
10. No renombres ni quites `--color-axyntia-dark` ni `--color-axyntia-light` mientras `tests/integration/build.test.ts` los exija (nota de la sección 3); los quita la issue #10 junto con ese test.
11. No copies textos, imágenes ni código de las referencias de inspiración. No es automatizable: lo comprueba el Reviewer en cada PR y, como apoyo, `grep -rniE 'ft\.com|design-system\.service\.gov\.uk|museumplantinmoretus\.be|basecamp\.com' src public` debe dar 0 resultados.
12. Movimiento solo con `transform` y `opacity`, sin animación continua, canvas, degradados ni `backdrop-filter` (sección 1.1 y 3.3). Se comprueba con: `grep -rnE 'backdrop-filter|gradient|infinite|requestAnimationFrame|<canvas' src` (0 resultados).

## 8. Historial de cambios

| Versión | Fecha      | Cambio                                                                                                                                                                                                                                     |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.1.0   | 2026-11-22 | Versión inicial                                                                                                                                                                                                                            |
| 0.1.1   | 2026-11-22 | Filas de §5: fondo animado del hero, aviso sin JavaScript y wordmark                                                                                                                                                                       |
| 0.2.0   | 2026-11-23 | Nueva dirección visual (§1.1): papel blanco azulado con acento azul tinta, sans del sistema y serif solo en cifras, líneas de albarán en lugar de tarjetas; tokens, contraste, movimiento (solo `transform` y `opacity`) y reglas rehechos |
