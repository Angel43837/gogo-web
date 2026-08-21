# GOGO FOOD — Sitio web oficial

Base del sitio web oficial de **GOGO**, la plataforma de delivery que conecta **usuarios**, **restaurantes** y **repartidores**.

Construido con **Next.js 15 (App Router)** + **TypeScript** + **Tailwind CSS**. Animaciones con **Framer Motion** (reveals de scroll, menús, acordeón) y **GSAP + ScrollTrigger** (el video controlado por scroll). Iconos con **Lucide React**. Formularios con **React Hook Form + Zod** y **Supabase** como backend.

---

## Ejecutar localmente

```bash
npm install
cp .env.example .env.local   # y rellena las credenciales de Supabase
npm run dev                  # http://localhost:3000
```

Sin `.env.local` la web funciona igual, pero los dos formularios de registro se muestran con un aviso y no envían nada.

Otros comandos:

```bash
npm run build   # build de producción
npm start       # servir el build
npm run lint    # ESLint
npm run video   # regenera los fotogramas del plano con scroll
```

Estado actual: `build` y `lint` pasan sin errores. Las 20 rutas se generan como estáticas.

---

## Identidad visual

- **Logo**: se usa el archivo oficial sin modificar (`public/logo/gogo-logo.svg`). Nunca se recolorea ni se deforma (`object-contain`). En fondos claros se muestra sobre la placa naranja de marca; en fondos oscuros, tal cual.
- **Naranja oficial**: `#F7500C`.
- **Acento secundario**: celeste `#99D4F2`, tomado del logo. Se usa sobre fondos oscuros, no sobre el naranja (no contrasta con #F7500C).
- **Paleta naranja-dominante**: el naranja es el fondo del sitio, no un acento. Se usa una escala de tres pasos, todos definidos en `globals.css`:

| Superficie | Uso | Texto |
|---|---|---|
| `.bg-brand-tint` | secciones claras (#FFF1E9 → #FFE3D4) | oscuro |
| `.bg-brand` | el naranja oficial, vivo (#FF6A2C → #EF4A08) | titulares en blanco, cuerpo en `text-onBrand` |
| `.bg-brand-vivid` | naranja plano de marca (#F7500C) | igual |
| `.bg-brand-deep` | casi negro neutro (#141113 → #0B0A0B) | blanco, admite opacidades |

**Sin naranjas quemados ni degradados oscuros.** Los tramos oscuros son negro neutro, no naranja apagado: así el #F7500C destaca en lugar de ensuciarse. Esto además respeta el encargo original (naranja + blanco + negro/gris oscuro + grises neutros).

**Texto sobre naranja.** El blanco sobre #F7500C solo alcanza **3.44:1**, por debajo del mínimo AA de 4.5:1. Por eso:

- **Titulares grandes** → blanco (cumple el mínimo de 3:1 para texto grande) y mantiene el emparejamiento de la propia marca.
- **Cuerpo de texto, descripciones y migas** → `text-onBrand` (#280E02), que da **5.9:1**.
- **Etiquetas pequeñas y CTA** → chip blanco sólido con texto naranja.

### Cambiar el color de marca

Una sola línea, en [src/app/globals.css](src/app/globals.css):

```css
:root {
  --color-primary: 247 80 12;   /* #F7500C — canales RGB separados por espacio */
}
```

Todo el sitio se actualiza. Lo mismo aplica a `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, radios, sombras y ritmo vertical.

---

## Estructura

```
src/
├─ app/
│  ├─ page.tsx                     # HOME (14 secciones)
│  ├─ layout.tsx                   # fuentes, SEO, navbar, footer, JSON-LD
│  ├─ globals.css                  # SISTEMA DE DISEÑO (variables CSS)
│  ├─ not-found.tsx  robots.ts  sitemap.ts  opengraph-image.tsx  icon.svg
│  ├─ como-funciona/  usuarios/  restaurantes/  repartidores/
│  ├─ bonos/  faq/  contacto/  descarga/
│  ├─ registro/restaurante/  registro/repartidor/     # rutas reservadas para formularios
│  └─ legal/terminos/  legal/privacidad/
│
├─ components/
│  ├─ forms/                       # Field, FormShell, RestaurantForm, RiderForm
│  ├─ navbar/Navbar.tsx            # sticky, cambia al hacer scroll, menú hamburguesa
│  ├─ footer/Footer.tsx
│  ├─ hero/                        # Hero.tsx, FloatingBadge.tsx
│  ├─ cards/                       # EcosystemCard, FeatureCard, BonusCard
│  ├─ sections/                    # una sección por archivo
│  ├─ ui/                          # Button, Logo, SectionTitle, PhoneMockup, StoreButtons
│  └─ animations/Reveal.tsx        # Reveal, RevealGroup, RevealItem
│
├─ data/                           # CONTENIDO EDITABLE (sin tocar componentes)
│  ├─ ecosystems.ts  process.ts  users.ts
│  ├─ businesses.ts  drivers.ts  bonuses.ts  faq.ts
│  └─ scrollFrames.ts               # GENERADO por npm run video
│
└─ lib/
   ├─ site.ts                      # navegación, tiendas, rutas
   ├─ supabase.ts                  # cliente (proyecto de PRODUCCIÓN)
   ├─ zona.ts                      # Maravatío / Acámbaro + geocodificación
   └─ utils.ts                     # cn() y constante PENDING

scripts/prepare-video.mjs          # genera los fotogramas del scroll (npm run video)
public/video/frames/               # 2 juegos x 72 fotogramas WebP
```

---

## Home — secciones implementadas

1. **Navbar** — sticky, se compacta al hacer scroll, subrayado animado, menú móvil a pantalla completa con bloqueo de scroll y cierre con `Escape`.
2. **Hero** — sobre naranja de marca: titular *"Tu comida. Tu restaurante. Tu oportunidad."*, dos CTA, mockup de smartphone con seguimiento de pedido y cuatro tarjetas flotantes animadas.
3. **Plano con scroll** — a sangre completa: el reparto en moto avanza con el scroll. Ver sección propia más abajo.
4. **¿Qué es GOGO?** — los tres protagonistas y el recorrido completo de un pedido.
5. **Los tres ecosistemas** — tarjetas blancas sobre naranja: Usuarios / Restaurantes / Repartidores, cada una con su CTA.
6. **Cómo funciona** — timeline de 5 pasos con línea de progreso ligada al scroll: horizontal en desktop, vertical en móvil.
7. **Experiencia del usuario** — Descubre → Elige → Pide → Sigue → Recibe, con pestañas interactivas y mockup sincronizado.
8. **Restaurantes** — beneficios cualitativos + pasos de alta + CTA de registro.
9. **Repartidores** — requisitos y proceso de alta en 6 pasos.
10. **Bonos y promociones** — tarjetas tipo cupón, **sin cantidades ni condiciones**.
11. **Descarga la App** — bloque naranja vivo con mockup y botones de tienda deshabilitados.
12. **FAQ** — acordeón accesible con JSON-LD `FAQPage`.
13. **CTA final** — los tres caminos: pedir / vender / repartir.
14. **Footer** — marca, Explorar / Ayuda / Legal, botones de descarga.

---

## Plano controlado por el scroll

Componente: [src/components/sections/ScrollVideo.tsx](src/components/sections/ScrollVideo.tsx). Va justo debajo del Hero, a sangre completa.

Implementado con **GSAP ScrollTrigger** (`gsap` + `@gsap/react`), siguiendo las skills oficiales de GreenSock.

### Por qué es una secuencia de imágenes y no un `<video>`

Se probó primero con `<video>` y **no funciona**. Para hacer scrubbing hay que saltar a un instante concreto en cada frame de scroll, y un video comprimido obliga al navegador a decodificar desde el keyframe anterior en cada salto. El archivo original traía **un solo keyframe en 8 segundos**, así que se congelaba. Reencodarlo a all-intra lo arregló a medias, pero seguía siendo pesado de decodificar.

La solución definitiva es la que usan Apple y compañía: **una secuencia de imágenes pintada en un `<canvas>`**.

| | `<video>` + seek | secuencia + canvas |
|---|---|---|
| Coste por salto | decodificar N fotogramas | pintar 1 imagen |
| Carga | hay que esperar | **progresiva**: con la primera imagen ya se ve algo |
| Peso (escritorio) | 3.73 MB | **2.59 MB** |
| Peso (móvil) | 3.73 MB | **1.49 MB** |

### Generar los fotogramas

```bash
npm run video     # lee de "Video scroll/" y escribe en public/video/frames/
```

El script [scripts/prepare-video.mjs](scripts/prepare-video.mjs) usa `ffmpeg-static` (devDependency; no hace falta instalar ffmpeg en el sistema) y genera **dos juegos de 72 fotogramas WebP a 9 fps**:

- `public/video/frames/desktop/` — 1280 px, ~35 KB por fotograma
- `public/video/frames/mobile/` — 768 px, ~20 KB por fotograma

9 fps es suficiente porque **el ritmo lo marca el scroll**, no un reloj: no se percibe como cámara lenta. El navegador descarga **solo un juego**, elegido con `gsap.matchMedia()`.

El script escribe además [src/data/scrollFrames.ts](src/data/scrollFrames.ts) con el número de fotogramas y las dimensiones, para que el componente y las imágenes no se desincronicen. **Ese archivo es generado: no se edita a mano.**

El archivo fuente se conserva intacto en `Video scroll/`; si lo cambias, vuelve a ejecutar `npm run video`.

### Cómo se pinta

Una timeline con `scrub` mueve un objeto proxy con el número de fotograma y el zoom; cada actualización se agrupa en un `requestAnimationFrame` y se pinta:

```ts
const state = { frame: 0, zoom: ZOOM.from };
tl.to(state, { frame: count - 1, zoom: ZOOM.to, duration: 1, onUpdate: requestDraw }, 0);
```

El `drawImage` reproduce a mano `object-fit: cover` + `object-position` + zoom, así que `FOCUS` y `ZOOM` siguen funcionando igual que con CSS.

**Nunca se queda en blanco**: si el fotograma pedido aún no ha llegado, se pinta el más cercano ya cargado. Y el primero se adelanta con `<link rel="preload">` (con `media`, uno por juego), así empieza a descargarse mientras se parsea el HTML.

### Para que no parezca "un video incrustado"

1. **Máscara de banda** — los bordes superior e inferior se disuelven en transparente, así que no hay rectángulo ni esquinas visibles.
2. **Viraje naranja** — dos capas en `mix-blend-multiply` llevan la imagen a la paleta de marca.
3. **Fundidos verticales** hacia el naranja profundo, que cosen la sección con las vecinas.
4. **Viñeta radial** que apaga los extremos sin cortar la imagen.

Sin controles, sin botón de play: el único indicador es una línea de progreso de 1 px pegada al borde inferior.

### Constantes de ajuste

```ts
const FOCUS = { x: 0.5, y: 0.55 };            // punto focal del encuadre
const ZOOM  = { from: 1.24, to: 1.04 };       // la cámara se abre al avanzar
const BAND  = { top: "13%", bottom: "87%" };  // altura de la banda visible
const SCROLL_DISTANCE = { desktop: "+=280%", mobile: "+=190%" };
```

### Detalles de compatibilidad

- **`useGSAP()`** con `scope`: los selectores quedan limitados al componente y toda la timeline, el `matchMedia` y los ScrollTrigger se revierten solos al desmontar.
- **`gsap.matchMedia()`** resuelve a la vez lo responsive (juego de imágenes y distancia de scroll por tamaño) y la accesibilidad: con `prefers-reduced-motion` **no se fija la sección** y se muestra un plano estático.
- **`ResizeObserver`** reajusta el canvas al redimensionar, limitando el `devicePixelRatio` a 2x.
- **`invalidateOnRefresh`**: `end` se recalcula al redimensionar.
- La carga va con concurrencia limitada (6 en paralelo) y **en orden**, así los primeros fotogramas —los que se ven antes— llegan primero.

---

## Formularios de registro

Dos formularios funcionales, portados desde el repositorio Flutter [`Angel43837/gogo-registro`](https://github.com/Angel43837/gogo-registro):

| Ruta | Qué hace |
|---|---|
| `/registro/restaurante` | Crea la cuenta del dueño (rol `dueno`) y la fila en la tabla `restaurants` |
| `/registro/repartidor` | Crea la cuenta del rider (rol `repartidor_plus`) |

El repositorio original era **Flutter/Dart**, así que no fue copiar y pegar: se reescribió como componentes React/TypeScript. **Ya no hay ninguna dependencia de ese repositorio.**

### ⚠️ Base de datos de PRODUCCIÓN

Apuntan al Supabase real de GOGO Food. **Cada envío crea una cuenta y un restaurante de verdad**, no hay entorno de pruebas. Cualquier alta de prueba hay que borrarla a mano desde el panel de Supabase.

### Qué se conservó del original

- Los mismos roles (`dueno`, `repartidor_plus`), la misma tabla y las mismas columnas.
- El guardado de `restaurant_id` en los metadatos de la cuenta (el dueño entra desde otro dominio, así que solo sirve del lado del servidor).
- La detección automática de zona **Maravatío / Acámbaro** por cercanía, portada a [src/lib/zona.ts](src/lib/zona.ts) con la fórmula del haversine.
- Las 7 categorías fijas de restaurante ([src/data/restaurantCategories.ts](src/data/restaurantCategories.ts)).
- El diálogo de recuperación de contraseña de los riders.
- Los enlaces de vuelta a la app principal (`/dueno`, `/dueno-login`, `/moto`).

### Qué cambió, y por qué

| Antes (Flutter) | Ahora | Motivo |
|---|---|---|
| Credenciales en `constants.dart` | `.env.local` (no versionado) | no dejar claves en el código |
| Google Maps API para geocodificar | Nominatim (OpenStreetMap) | no necesita clave: un secreto menos que exponer |
| Validación manual dentro de `_registrar()` | **Zod + React Hook Form** | errores por campo, en vivo, y accesibles |
| Inputs naranja sobre naranja | Tarjeta blanca sobre naranja | contraste y coherencia con el resto de la web |
| `SnackBar` de Material | Avisos en línea con `role="alert"` | los lectores de pantalla los anuncian |

Todos los campos llevan `label` asociada, `aria-invalid`, `aria-describedby` y `autoComplete`.

### Pendiente de revisar

- **No probé ningún envío real**, precisamente por ser producción. La validación, los estados de carga y el renderizado sí están verificados.
- Para que el correo de recuperación de contraseña funcione desde este dominio, hay que añadirlo a las **Redirect URLs** del proyecto en Supabase.

---

## Responsive

Diseño **mobile first**, verificado sobre 320 / 375 / 390 / 430 px, tablet, laptop, desktop y pantallas grandes. Se añadió el breakpoint `xs: 390px`.

La versión móvil no es una reducción del desktop: el timeline cambia de horizontal a vertical, el selector de la experiencia de usuario se convierte en un carrusel horizontal, el orden de columnas se invierte donde conviene y las tarjetas flotantes del Hero se reescalan y reposicionan.

---

## Accesibilidad

- HTML semántico (`header`, `nav`, `main`, `section`, `ol/ul`, un único `h1` por página).
- Enlace "Saltar al contenido".
- Estado de foco visible y unificado (`:focus-visible`).
- `aria-expanded`, `aria-controls`, `role="tablist"/"tab"/"tabpanel"`, `aria-current`, `aria-label` en el logo, `alt` en todas las imágenes.
- Iconos decorativos marcados `aria-hidden`.
- `prefers-reduced-motion`: todas las animaciones se desactivan.
- Navegación completa por teclado, incluido el cierre del menú móvil con `Escape`.

---

## SEO y performance

- `metadata` por página con `title`, `description` y `canonical`; Open Graph y Twitter Card.
- Imagen OG 1200×630 generada dinámicamente con los colores de marca (`opengraph-image.tsx`).
- Favicon a partir del logotipo oficial (`icon.svg`).
- JSON-LD: `Organization` en el layout y `FAQPage` en Home y FAQ.
- `robots.txt` y `sitemap.xml` generados por Next.
- Fuentes locales vía `next/font` (Inter + Plus Jakarta Sans) → sin CLS por fuentes.
- Todas las rutas son estáticas. First Load JS compartido ≈ 103 kB.
- Los mockups de app son UI construida en HTML/CSS, no capturas: cero peso de imagen.
- El plano del scroll descarga **un solo juego** de fotogramas según el tamaño de pantalla (2.59 MB en escritorio, 1.49 MB en móvil) y lo hace de forma progresiva, sin bloquear la página.

---

## Regla aplicada: no inventar información

No se publica ningún dato que no exista todavía. En concreto, **no** hay: precios, comisiones, porcentajes, ganancias, número de usuarios/restaurantes/repartidores, cobertura, tiempos de entrega, promociones, bonos, estadísticas, testimonios, enlaces de descarga, teléfonos ni redes sociales.

Donde falta información se usa una estructura preparada y visiblemente marcada:

- Constante `PENDING = "[POR DEFINIR]"` en [src/lib/utils.ts](src/lib/utils.ts).
- Componente `PendingTag` y clase `.tag-pending` para etiquetar contenido pendiente.
- Componente `ComingSoon` para rutas cuya funcionalidad aún no existe.

Los mockups de app están etiquetados como **"Interfaz conceptual — no es una captura real"**.

---

## Pendiente de definir por GOGO

| Tema | Dónde se edita |
|---|---|
| Enlaces reales de App Store y Google Play | `appStores` en [src/lib/site.ts](src/lib/site.ts) (`href: null` → URL) |
| Dominio oficial | `site.url` en [src/lib/site.ts](src/lib/site.ts) |
| Correo, teléfono y redes sociales | [src/app/contacto/page.tsx](src/app/contacto/page.tsx) y el footer |
| Requisitos y documentos para repartidores | `driverRequirements` y `driverOnboarding` en [src/data/drivers.ts](src/data/drivers.ts) |
| Bonos y promociones (importes y condiciones) | [src/data/bonuses.ts](src/data/bonuses.ts) |
| Condiciones comerciales para restaurantes | [src/data/businesses.ts](src/data/businesses.ts) |
| Términos y condiciones / Aviso de privacidad | [src/app/legal/](src/app/legal/) |
| Capturas reales de la app | sustituir `PhoneMockup` por `next/image` con `priority` |

---

## Arquitectura preparada para el futuro

Rutas ya reservadas y tipadas en `futureRoutes` ([src/lib/site.ts](src/lib/site.ts)):

`/registro/restaurante` · `/registro/repartidor` · `/registro` · `/login` · `/descarga` · `/checkout` · `/pago` · `/promociones` · `/dashboard`

`/registro/restaurante` y `/registro/repartidor` **ya están implementadas** con sus formularios conectados a Supabase (ver la sección de formularios más arriba).

**La Home no depende de ningún formulario.** Los CTA apuntan a rutas, no a componentes de formulario, así que se pueden conectar funnels (`/repartidores` → funnel → formulario → confirmación) sin tocar la Home.

Los formularios usan `react-hook-form` + `zod` + `@supabase/supabase-js`. Solo se cargan en las dos rutas de registro (251-253 kB de First Load JS ahí; el resto de la web no los descarga).
