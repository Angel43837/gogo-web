# 06 · Plano con scroll

[← Páginas y secciones](05-paginas-y-secciones.md) · [Índice](README.md) · [Siguiente: Simulación de la app →](07-simulacion-de-la-app.md)

---

Componente: [`src/components/sections/ScrollVideo.tsx`](../src/components/sections/ScrollVideo.tsx)

Va justo debajo del Hero, a sangre completa. La sección se fija y **el repartidor avanza y retrocede con el scroll**.

## Por qué NO es una etiqueta `<video>`

Esta es la decisión técnica más importante del proyecto y merece explicación, porque se intentó primero de la forma obvia y **no funciona**.

Para hacer scrubbing hay que saltar a un instante concreto en cada frame de scroll. Un vídeo comprimido guarda un fotograma completo cada varios segundos y, entre medias, solo las diferencias. Cada salto obliga al navegador a decodificar desde el keyframe anterior.

El archivo original tenía **un solo keyframe en 8 segundos**. Resultado: se congelaba o no llegaba a pintar nada.

Reencodarlo a *all-intra* (todos los fotogramas keyframe) lo arregló a medias, pero seguía siendo caro de decodificar. La solución definitiva es la que usan Apple y compañía: **una secuencia de imágenes pintada en un `<canvas>`**.

| | `<video>` + seek | Secuencia + canvas |
|---|---|---|
| Coste por salto | Decodificar N fotogramas | Pintar 1 imagen |
| Carga | Hay que esperar | **Progresiva** |
| Peso escritorio | 3.73 MB | **2.59 MB** |
| Peso móvil | 3.73 MB | **1.49 MB** |

## Generar los fotogramas

```bash
npm run video
```

[`scripts/prepare-video.mjs`](../scripts/prepare-video.mjs) lee de `Video scroll/` y genera **dos juegos de 72 fotogramas WebP a 9 fps**:

- `public/video/frames/desktop/` — 1280 px, ~35 KB cada uno
- `public/video/frames/mobile/` — 768 px, ~20 KB cada uno

**9 fps es suficiente** porque el ritmo lo marca el scroll, no un reloj: no se percibe como cámara lenta. El navegador descarga **un solo juego**, elegido con `gsap.matchMedia()`.

El script escribe además [`src/data/scrollFrames.ts`](../src/data/scrollFrames.ts) con el número de fotogramas y las dimensiones, para que componente e imágenes no se desincronicen. **Ese archivo es generado: no se edita a mano.**

## Cómo se pinta

Una timeline con `scrub` mueve un objeto proxy con el fotograma y el zoom:

```ts
const state = { frame: 0, zoom: ZOOM.from };

const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: rootRef.current,
    start: "top top",
    end: isDesktop ? "+=280%" : "+=190%",
    scrub: 0.6,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  },
});

tl.to(state, { frame: count - 1, zoom: ZOOM.to, duration: 1, onUpdate: requestDraw }, 0);
```

El `drawImage` reproduce a mano `object-fit: cover` + `object-position` + zoom, así que `FOCUS` y `ZOOM` funcionan igual que con CSS.

**Nunca se queda en blanco.** Si el fotograma pedido aún no ha llegado, se pinta el más cercano ya cargado. Y el primero se adelanta con `<link rel="preload">` (uno por juego, con `media`), así empieza a descargarse mientras se parsea el HTML.

## Para que no parezca un vídeo incrustado

Cuatro capas:

1. **Máscara de banda** — los bordes superior e inferior se disuelven en transparente. Sin rectángulo, sin esquinas.
2. **Viraje naranja** — dos capas en `mix-blend-multiply` llevan la imagen a la paleta de marca.
3. **Fundidos verticales** hacia el negro, que cosen la sección con las vecinas.
4. **Viñeta radial** que apaga los extremos.

Sin controles y sin botón de play. El único indicador es una línea de progreso de 1 px pegada al borde inferior.

## Constantes de ajuste

Al principio del componente:

```ts
const FOCUS = { x: 0.5, y: 0.55 };            // punto focal del encuadre
const ZOOM  = { from: 1.24, to: 1.04 };       // la cámara se abre al avanzar
const BAND  = { top: "13%", bottom: "87%" };  // altura de la banda visible
const SCROLL_DISTANCE = { desktop: "+=280%", mobile: "+=190%" };
const SCRUB = 0.6;                            // suavizado
```

## Detalles de compatibilidad

- **`useGSAP()` con `scope`**: los selectores quedan limitados al componente, y timeline, `matchMedia` y ScrollTrigger se revierten solos al desmontar.
- **`gsap.matchMedia()`** resuelve responsive y accesibilidad a la vez: con `prefers-reduced-motion` **no se fija la sección** y se muestra un plano estático.
- **`ResizeObserver`** reajusta el canvas al redimensionar, limitando el `devicePixelRatio` a 2×.
- **Carga con concurrencia limitada** (6 en paralelo) y **en orden**: los primeros fotogramas llegan primero.

---

[← Páginas y secciones](05-paginas-y-secciones.md) · [Índice](README.md) · [Siguiente: Simulación de la app →](07-simulacion-de-la-app.md)
