# 05 · Páginas y secciones

[← Arquitectura](04-arquitectura.md) · [Índice](README.md) · [Siguiente: Plano con scroll →](06-plano-con-scroll.md)

---

## Las 15 rutas

Todas se generan estáticas en la compilación.

### Públicas

| Ruta | Contenido |
|---|---|
| `/` | Home, 14 secciones |
| `/usuarios` | Experiencia del cliente |
| `/restaurantes` | Captación de restaurantes |
| `/repartidores` | Captación de repartidores |
| `/como-funciona` | El recorrido de un pedido |
| `/bonos` | Bonos y promociones |
| `/faq` | Preguntas frecuentes |
| `/contacto` | Canales de contacto |
| `/descarga` | Descarga de la app |

### Registro

| Ruta | Contenido |
|---|---|
| `/registro/restaurante` | Asistente de 5 pasos → [08](08-registro-de-restaurantes.md) |
| `/registro/repartidor` | Asistente de 6 pasos → [09](09-registro-de-repartidores.md) |

Ambas llevan `robots: { index: false }`: son formularios, no contenido para buscadores.

### Legales

| Ruta | Estado |
|---|---|
| `/legal/terminos` | Pendiente de redacción |
| `/legal/privacidad` | Pendiente de redacción |
| `/legal/politicas-restaurantes` | Pendiente de redacción |
| `/legal/politicas-repartidores` | Pendiente de redacción |

Las cuatro muestran el bloque `ComingSoon`. **No se publica texto provisional**: comunicar condiciones que no son oficiales sería peor que no tener página.

### Generadas automáticamente

`/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon.svg` y la página 404.

---

## Las 14 secciones de la Home

| # | Sección | Fondo | Qué hace |
|---|---|---|---|
| 1 | **Navbar** | Naranja translúcido | Sticky, se compacta al hacer scroll, menú móvil a pantalla completa |
| 2 | **Hero** | Naranja | Titular, dos CTA, mockup del móvil y cuatro tarjetas flotantes |
| 3 | **Plano con scroll** | Negro | El repartidor en moto avanza con el scroll → [06](06-plano-con-scroll.md) |
| 4 | **¿Qué es GOGO?** | Claro | Los tres protagonistas y el recorrido del pedido |
| 5 | **Tres ecosistemas** | Naranja | Tarjetas blancas de usuarios / restaurantes / repartidores |
| 6 | **Cómo funciona** | Claro | Timeline de 5 pasos con progreso ligado al scroll |
| 7 | **Experiencia del usuario** | Negro | Descubre → Elige → Pide → Sigue → Recibe, con el móvil sincronizado |
| 8 | **Restaurantes** | Claro | Beneficios, pasos de alta y CTA |
| 9 | **Repartidores** | Negro | Requisitos y proceso de alta |
| 10 | **Bonos** | Claro | Tarjetas tipo cupón, sin cantidades |
| 11 | **Descarga la App** | Naranja vivo | Mockup y botones de tienda |
| 12 | **FAQ** | Claro | Acordeón accesible con JSON-LD |
| 13 | **CTA final** | Naranja | Los tres caminos: pedir, vender, repartir |
| 14 | **Footer** | Negro | Marca, navegación y descargas |

## Detalles que no se ven a simple vista

**El timeline de «Cómo funciona»** cambia de orientación: horizontal en escritorio, vertical en móvil. La línea de progreso avanza con el scroll.

**«Experiencia del usuario»** tiene pestañas que hacen dos cosas a la vez: cambian el texto y **saltan al momento correspondiente de la grabación real de la app**. Las dos últimas etapas muestran la pantalla de seguimiento con el recorrido animado.

**Los botones de tienda están deshabilitados**, con la etiqueta «Enlace próximamente». No existen las URLs oficiales y no se inventan.

**La sección de bonos no muestra ninguna cantidad.** La estructura visual está lista; los importes y condiciones se rellenarán cuando existan.

## Cómo se compone una página interna

Todas siguen el mismo patrón:

```
PageHero          cabecera naranja con miga de pan, título y descripción
  ↓
Secciones         reutilizadas de la Home
  ↓
FinalCTA          cierre
```

Esto significa que **una misma sección aparece en varias páginas** sin duplicar código. Por ejemplo `BusinessSection` está en la Home y en `/restaurantes`.

---

[← Arquitectura](04-arquitectura.md) · [Índice](README.md) · [Siguiente: Plano con scroll →](06-plano-con-scroll.md)
