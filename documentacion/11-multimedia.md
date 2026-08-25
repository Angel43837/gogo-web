# 11 · Multimedia

[← Supabase y datos](10-supabase-y-datos.md) · [Índice](README.md) · [Siguiente: SEO, accesibilidad y rendimiento →](12-seo-accesibilidad-rendimiento.md)

---

## Logotipos

### Los archivos

Los originales están en `SVG/` y `300ppi/`. Las copias que usa la web viven en `public/logo/`:

| Archivo | Formato | Qué es |
|---|---|---|
| `gogo-logo.svg` | 312 × 362 | Apilado: GO / GO / FOOD |
| `gogo-wordmark.png` | 2210 × 569 | Horizontal: GO GO |
| `gogo-wordmark-food.png` | 2210 × 888 | Horizontal con FOOD |
| `gogo-logo-badge.svg` | 1080 × 1080 | Sobre placa naranja |

Todos con transparencia. **Nunca se recolorean ni se deforman.**

### Dónde va cada uno

| Lockup | Dónde | Por qué |
|---|---|---|
| **Apilado** | Navbar, favicon, icono de la app | Es el oficial para esos sitios; el favicon necesita marca cuadrada |
| **Horizontal** | Dentro de textos, donde decía «GOGO» | A la altura del texto se lee; el apilado quedaba comprimido |
| **Horizontal con FOOD** | Footer y donde decía «GOGO FOOD» | Los pies de página son anchos y bajos: es su forma natural |

### El logotipo dentro del texto

`InlineLogo` sustituye la palabra por el logotipo. Se dimensiona en `em`, así que crece y encoge con el texto que lo rodea.

Está en **19 sitios**: cabeceras de página, titulares de sección, descripciones y los textos de los asistentes.

**Se dejaron como texto a propósito:**

- **Metadatos, JSON-LD y descripciones SEO** — son para buscadores y un atributo HTML no admite imágenes
- **Tres etiquetas pequeñas** («¿Qué es GOGO?», «GOGO Riders», «La app de GOGO») — a 12 px el logotipo saldría ilegible
- **El botón «Ir a la web de GOGO»** — una imagen dentro rompe la caja
- **El Hero** — por indicación expresa, se mantiene con su texto original

### Optimización

Los PNG se sirven por el optimizador de Next: **4.6 KB en pantalla** frente a los 118 KB del archivo original, en WebP y a la resolución justa.

---

## Vídeo 1 — Plano con scroll

**Fuente:** `Video scroll/` · **Comando:** `npm run video`

Genera dos juegos de 72 fotogramas WebP a 9 fps:

| Juego | Ancho | Por fotograma | Total |
|---|---|---|---|
| Escritorio | 1280 px | ~35 KB | 2.59 MB |
| Móvil | 768 px | ~20 KB | 1.49 MB |

El navegador descarga **uno solo**. El script escribe además `src/data/scrollFrames.ts` con los datos, para que componente e imágenes no se desincronicen.

El porqué de usar imágenes y no vídeo está en [06 · Plano con scroll](06-plano-con-scroll.md).

---

## Vídeo 2 — Grabación de la app

**Fuente:** `video demo app/` · **Comando:** `npm run demo`

Genera `public/video/app-demo.mp4` (**1.09 MB**, 29 s) y su póster (29 KB).

### Qué hace el script

| Paso | Detalle |
|---|---|
| Recorta el cromo del navegador | Solo si lo hubiera. Con `CROP = null` se salta |
| Recorta el clip | `TRIM_START` / `TRIM_DURATION` |
| Quita el audio | El vídeo va silenciado en la web |
| Aplica faststart | El índice `moov` al principio |

### Ajustes

```js
const TRIM_START = 0;
const TRIM_DURATION = 29;
const CROP = null;   // "ancho:alto:x:y" si la grabación trae barras del navegador
const CRF = 26;      // más bajo = mejor imagen y más peso
```

Si cambias de grabación, revisa también los **capítulos** en `ScreenAppDemo.tsx`, que apuntan a segundos concretos del clip.

### Nota sobre la calidad

Las grabaciones han llegado por WhatsApp, que las recomprime (la última, a 480 × 816). Se ven bien porque el teléfono del mockup es pequeño, pero en pantallas retina se nota algo blando. **El archivo original sin comprimir ganaría bastante nitidez** sin pesar mucho más.

---

## ffmpeg

Viene como dependencia de desarrollo (`ffmpeg-static`): no hace falta instalarlo en el sistema, y los dos scripts lo encuentran solos.

---

[← Supabase y datos](10-supabase-y-datos.md) · [Índice](README.md) · [Siguiente: SEO, accesibilidad y rendimiento →](12-seo-accesibilidad-rendimiento.md)
