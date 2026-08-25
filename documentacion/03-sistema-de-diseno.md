# 03 · Sistema de diseño

[← Puesta en marcha](02-puesta-en-marcha.md) · [Índice](README.md) · [Siguiente: Arquitectura →](04-arquitectura.md)

---

Todo el sistema vive en un único archivo: [`src/app/globals.css`](../src/app/globals.css). Tailwind lee de ahí a través de [`tailwind.config.ts`](../tailwind.config.ts), así que **no hay colores sueltos repartidos por los componentes**.

## Color de marca

El naranja oficial es **`#F7500C`**. Se cambia en una sola línea y toda la web se actualiza:

```css
:root {
  --color-primary: 247 80 12;   /* canales RGB separados por espacio */
}
```

El formato sin `rgb()` permite que Tailwind aplique opacidades: `bg-primary/10`, `text-primary/60`, etc.

## Escala naranja

La web es **naranja-dominante**: el naranja es el fondo, no un acento.

| Utilidad | Color | Uso | Texto encima |
|---|---|---|---|
| `.bg-brand-tint` | `#FFF1E9 → #FFE3D4` | Secciones claras | Oscuro |
| `.bg-brand` | `#FF6A2C → #EF4A08` | Naranja vivo de marca | Titulares en blanco, cuerpo en `text-onBrand` |
| `.bg-brand-vivid` | `#F7500C` | Bloque de descarga | Igual |
| `.bg-brand-deep` | `#141113 → #0B0A0B` | Tramos oscuros | Blanco, admite opacidades |

**Los tramos oscuros son negro neutro, no naranja apagado.** Es una decisión deliberada: un naranja quemado ensucia la marca, mientras que el negro hace que el `#F7500C` destaque. Además respeta el encargo original —naranja + blanco + negro/gris oscuro + grises neutros.

## Contraste: el punto delicado

**El blanco sobre `#F7500C` alcanza 3.44:1**, por debajo del mínimo AA de 4.5:1 para texto normal. La solución no fue cambiar tu color, sino repartir los roles:

| Elemento | Color | Contraste |
|---|---|---|
| Titulares grandes | Blanco | 3.44:1 — cumple el mínimo de 3:1 para texto grande |
| Cuerpo, descripciones, migas | `text-onBrand` (`#280E02`) | **5.9:1** |
| Etiquetas pequeñas y CTA | Chip blanco con texto naranja | Alto |

Esto explica por qué en las secciones naranjas verás titulares blancos con texto de apoyo oscuro: no es un descuido, es lo que hace la página legible.

## Tipografía

| Familia | Uso | Variable |
|---|---|---|
| **Plus Jakarta Sans** | Titulares (`font-display`) | `--font-display` |
| **Inter** | Texto corrido | `--font-sans` |

Ambas se cargan con `next/font`, que las autoaloja: sin peticiones a Google, sin salto de maquetación al cargar.

## Otros tokens

Todos parametrizados en `globals.css`:

- **Radios:** de `--radius-sm` (0.5rem) a `--radius-3xl` (2rem), más `--radius-pill`
- **Sombras:** `soft`, `card`, `lift`, `glow`
- **Ritmo vertical:** `--space-section` y `--space-section-sm`
- **Curva de animación:** `ease-gogo` = `cubic-bezier(0.22, 1, 0.36, 1)`

## Utilidades propias

| Clase | Para qué |
|---|---|
| `.section-shell` | Contenedor estándar de sección con su ritmo vertical |
| `.text-brand-gradient` | Degradado naranja en texto, para fondos claros |
| `.text-brand-gradient-light` | Degradado claro, para fondos oscuros o naranjas |
| `.bg-grid` / `.bg-grid-dark` | Retícula sutil de fondo |
| `.mask-fade-edges` / `.mask-fade-b` | Desvanecidos |
| `.tag-pending` | Etiqueta de contenido por definir |
| `.on-brand` | Reescribe los realces naranjas anidados a texto oscuro |

## El logotipo

Se usa **siempre el archivo original**: nunca se recolorea, se recorta ni se deforma (`object-contain` en todos los casos).

Hay tres lockups y cada uno tiene su sitio:

| Lockup | Archivo | Dónde |
|---|---|---|
| Apilado | `gogo-logo.svg` | Navbar, favicon, icono de la app |
| Horizontal | `gogo-wordmark.png` | Dentro de textos, donde decía «GOGO» |
| Horizontal con FOOD | `gogo-wordmark-food.png` | Footer y donde decía «GOGO FOOD» |

### El logotipo dentro del texto

El componente `InlineLogo` sustituye la palabra por el logotipo, dimensionado en `em` para que crezca y encoja con el texto. Como el logotipo es **blanco y celeste**, necesita tratamiento según el fondo:

| Variante | Fondo | Tratamiento |
|---|---|---|
| `badge` | Claro | Placa naranja detrás |
| `dark` | Naranja | Placa oscura, que armoniza con el texto oscuro de esas zonas |
| `plain` | Oscuro | Sin placa; el logotipo se lee solo |

Detalle en [11 · Multimedia](11-multimedia.md).

---

[← Puesta en marcha](02-puesta-en-marcha.md) · [Índice](README.md) · [Siguiente: Arquitectura →](04-arquitectura.md)
