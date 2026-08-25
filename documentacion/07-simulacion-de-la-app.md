# 07 · Simulación de la app

[← Plano con scroll](06-plano-con-scroll.md) · [Índice](README.md) · [Siguiente: Registro de restaurantes →](08-registro-de-restaurantes.md)

---

Los teléfonos que aparecen en la web muestran tres cosas distintas. Conviene saber cuál es cuál, porque **la etiqueta debajo del móvil cambia según el caso** y eso es deliberado: no se presenta como captura real algo que no lo es.

| Contenido | Qué es | Etiqueta |
|---|---|---|
| Seguimiento del pedido | Recreación en código | «Interfaz conceptual — no es una captura real» |
| Portada de la app | Recreación en código | «Interfaz conceptual» |
| Recorrido de compra | **Grabación real** | «Grabación real de la app» |

## La carcasa

[`PhoneMockup`](../src/components/ui/PhoneMockup.tsx) dibuja el teléfono: marco, isla dinámica, reflejo de cristal y la etiqueta inferior. El contenido va dentro como hijos.

## Pantalla 1 — Seguimiento del pedido

Reproduce la pantalla real de tu app, tomada de una captura que enviaste:

- **Mapa a pantalla completa** con estilo OpenStreetMap: calles blancas, avenidas en tono arena, parques, un río en diagonal y la etiqueta «Maravatío». Está **dibujado en SVG**, no son teselas: sin clave de API, sin peticiones externas y funciona sin conexión.
- **Barra flotante superior** con el botón de volver y la tarjeta negra del estado, con su círculo ámbar y el reloj de arena.
- **Marcador de casa** azul con borde blanco.
- **Hoja inferior** con asa, tile naranja del restaurante, nombre, dirección, total, línea divisoria, **stepper de 4 pasos** (Recibido activo con anillo ámbar; el resto en gris) y el botón «Cancelar pedido» con contorno rojo.
- **El recorrido animado**: ruta naranja discontinua y el repartidor con anillo pulsante.

Los colores salen de la captura: fondo `#17171A`, gris `#8E8E93`, ámbar `#F5B800`, rojo `#FF453A`, azul `#2E86F0`.

## Pantalla 2 — Portada de la app

Recreada en código, no como imagen. Reproduce la portada real: cabecera con perfil, el **logotipo grande centrado** (usando el archivo oficial, blanco sobre naranja), el saludo, los botones circulares de filtro y búsqueda, y el listado de restaurantes con su contador de «me gusta».

Se hizo en código y no con una captura porque así **escala nítida a cualquier resolución**, pesa cero y se ajusta sola si cambia un color de la marca.

## Pantalla 3 — La grabación real

[`ScreenAppDemo`](../src/components/ui/ScreenAppDemo.tsx) reproduce en bucle la grabación del recorrido de compra completo: portada → restaurante → producto → carrito → confirmar pedido.

Se usa en «Experiencia del usuario», donde **las pestañas saltan al momento correspondiente del clip**:

```ts
export const demoChapters = {
  descubre: 0,   // portada con el logotipo y el listado
  elige: 7,      // restaurante abierto y ficha del producto
  pide: 16,      // carrito y confirmación
} as const;
```

Las dos últimas etapas (*Sigue* y *Recibe*) muestran la pantalla de seguimiento con el recorrido animado.

Procesado con `npm run demo` → **1.09 MB**, 29 segundos, con faststart y póster de 29 KB. Ver [11 · Multimedia](11-multimedia.md).

## Dos sustituciones deliberadas

**Nombres de restaurante ficticios.** En la app real aparecen marcas de terceros. Publicarlas en la web de GOGO daría a entender una alianza comercial que puede no existir, así que en las pantallas recreadas se usan nombres inventados (los mismos que emplea el formulario de alta como ejemplo).

**Avatar neutro.** Un círculo con inicial, no la fotografía de ninguna persona real.

> **Requiere tu decisión.** En la grabación real sí aparece una marca de tercero, y de forma persistente. No se recortó porque hacerlo costaría la intro con el logotipo. Si esa marca no es cliente con acuerdo, conviene desenfocarla o cortar el clip.

---

[← Plano con scroll](06-plano-con-scroll.md) · [Índice](README.md) · [Siguiente: Registro de restaurantes →](08-registro-de-restaurantes.md)
