# 04 · Arquitectura

[← Sistema de diseño](03-sistema-de-diseno.md) · [Índice](README.md) · [Siguiente: Páginas y secciones →](05-paginas-y-secciones.md)

---

## Estructura

```
Pagina GoGo/
├── documentacion/          ← estás aquí
├── public/
│   ├── logo/               3 lockups del logotipo
│   └── video/
│       ├── frames/         2 juegos × 72 fotogramas WebP
│       ├── app-demo.mp4    grabación de la app
│       └── app-demo-poster.jpg
├── scripts/
│   ├── prepare-video.mjs   genera los fotogramas del scroll
│   └── prepare-demo.mjs    procesa la grabación de la app
├── supabase/migrations/    SQL listo para aplicar
├── src/
│   ├── app/                rutas (App Router)
│   ├── components/
│   ├── data/               CONTENIDO EDITABLE
│   └── lib/                lógica sin interfaz
├── SVG/  300ppi/           logotipos originales
├── Video scroll/           fuente del plano con scroll
└── video demo app/         fuente de la grabación
```

## La regla más importante

**`src/data/` es contenido; `src/components/` es presentación.**

Todos los textos, listas, categorías, estados y recomendaciones viven en `src/data/`. Para cambiar qué dice la web casi nunca hace falta abrir un componente.

| Archivo | Contiene |
|---|---|
| `ecosystems.ts` | Las tres tarjetas de usuarios / restaurantes / repartidores |
| `process.ts` | Los 5 pasos de «Cómo funciona» |
| `users.ts` | El recorrido Descubre → Elige → Pide → Sigue → Recibe |
| `businesses.ts` | Beneficios y alta de restaurantes |
| `drivers.ts` | Requisitos, compromiso de seguridad y programa Riders |
| `bonuses.ts` | Bonos (sin cantidades: aún no existen) |
| `faq.ts` | Preguntas frecuentes |
| `restaurantCategories.ts` | 26 categorías en 6 grupos |
| `restaurantRegistration.ts` | Modalidades, estados, guías de imagen |
| `driverRegistration.ts` | Vehículos, identificación, deslinde, política de aprobación |
| `driverOperations.ts` | Disponibilidad y ciclo de vida del pedido |
| `scrollFrames.ts` | **Generado** por `npm run video`. No editar a mano |

## Componentes

| Carpeta | Qué hay |
|---|---|
| `navbar/` | Barra sticky con menú móvil |
| `footer/` | Pie de página |
| `hero/` | Hero y sus tarjetas flotantes |
| `sections/` | Una sección de la Home por archivo (13) |
| `cards/` | Tarjetas reutilizables |
| `forms/` | Campos, asistentes y sus pasos |
| `ui/` | Botón, logotipo, títulos, mockup del móvil |
| `animations/` | `Reveal`, `RevealGroup`, `RevealItem` |

## Lógica (`src/lib/`)

| Archivo | Responsabilidad |
|---|---|
| `site.ts` | Navegación, tiendas de apps, rutas, dominio |
| `utils.ts` | `cn()` para clases y la constante `PENDING` |
| `validation.ts` | Teléfono, contraseña y su medidor — compartidos |
| `restaurantRegistration.ts` | Esquemas Zod + borrador del asistente |
| `driverRegistration.ts` | Ídem para repartidores |
| `supabase.ts` | Cliente del navegador |
| `zona.ts` | Maravatío/Acámbaro, geocodificación y GPS |

## Decisiones técnicas que conviene conocer

### Servidor por defecto, cliente solo cuando hace falta

Las 15 rutas se generan estáticas. Solo llevan `"use client"` los componentes que realmente necesitan interactividad: navbar, acordeón, asistentes, mapa y las animaciones de scroll.

### Las animaciones respetan `prefers-reduced-motion`

En todos los casos. El plano con scroll llega al extremo de **no fijar la sección** si la preferencia está activa, en lugar de limitarse a quitar el efecto: secuestrar el scroll a quien pidió no tener movimiento sería peor que la animación misma.

### Dos librerías de animación, a propósito

**Framer Motion** para reveals, menús y transiciones. **GSAP + ScrollTrigger** solo para el plano con scroll, donde su `pin` y su `scrub` no tienen equivalente cómodo. GSAP no se carga en el resto de la web.

### Mapas sin clave de API

Leaflet con teselas de OpenStreetMap, y Nominatim para geocodificar. El proyecto original en Flutter usaba Google Maps con la clave incrustada en el código; migrarlo elimina un secreto que gestionar.

### El borrador nunca guarda la contraseña

Los dos asistentes guardan el avance en `localStorage` para poder retomarlo, pero **la contraseña y las imágenes quedan fuera**: la primera por seguridad, las segundas porque no caben.

### Rutas reservadas

En `site.ts`, el objeto `futureRoutes` tipa las rutas de producto. Dos ya existen (`/registro/restaurante` y `/registro/repartidor`); el resto —`/login`, `/checkout`, `/pago`, `/promociones`, `/dashboard`— están reservadas para no inventar enlaces.

---

[← Sistema de diseño](03-sistema-de-diseno.md) · [Índice](README.md) · [Siguiente: Páginas y secciones →](05-paginas-y-secciones.md)
