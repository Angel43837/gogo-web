# 12 · SEO, accesibilidad y rendimiento

[← Multimedia](11-multimedia.md) · [Índice](README.md) · [Siguiente: Despliegue →](13-despliegue.md)

---

## SEO

### Metadatos

Cada página define su `title`, `description` y `canonical` con la API `Metadata` de Next. El layout aporta el `metadataBase`, Open Graph, Twitter Card y las palabras clave.

### El dominio se resuelve solo

```ts
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${...}`;
  if (process.env.VERCEL_URL) return `https://${...}`;
  return "http://localhost:3000";
}
```

Antes apuntaba a un dominio que aún no existe, lo que habría hecho que Google indexara mal el sitio. Ahora se adapta al despliegue. Cuando tengas dominio propio, basta con definir `NEXT_PUBLIC_SITE_URL`.

### Datos estructurados

| Esquema | Dónde |
|---|---|
| `Organization` | Layout, en todas las páginas |
| `FAQPage` | Home y `/faq` |

### Generados automáticamente

`sitemap.xml` y `robots.txt` con las rutas públicas. Las dos de registro llevan `robots: { index: false }`.

### Imagen Open Graph

1200 × 630 generada dinámicamente con `next/og` y los colores de marca. No hay que mantener un PNG a mano.

### Por qué la marca sigue siendo texto en los metadatos

El logotipo sustituye la palabra «GOGO» en 19 sitios del contenido visible, pero **nunca en metadatos**. Un atributo HTML no admite imágenes, y aunque las admitiera, Google necesita texto. Ver [11 · Multimedia](11-multimedia.md).

---

## Accesibilidad

### Estructura

- HTML semántico: `header`, `nav`, `main`, `section`, listas ordenadas y no ordenadas
- **Un solo `h1` por página**
- Enlace «Saltar al contenido» al principio

### Interacción

- Estado de foco visible y unificado mediante `:focus-visible`
- Navegación completa por teclado, incluido cerrar el menú móvil con `Escape`
- `aria-expanded`, `aria-controls`, `aria-current`, `role="tablist"`/`tab`/`tabpanel`
- Iconos decorativos marcados `aria-hidden`

### Formularios

Todos los campos llevan `label` asociada, `aria-invalid`, `aria-describedby` y `autoComplete`. Los errores se anuncian con `role="alert"`.

### Movimiento

`prefers-reduced-motion` se respeta en todas las animaciones. El plano con scroll llega a **no fijar la sección**, en lugar de limitarse a quitar el efecto.

### Contraste

Es donde hubo más trabajo. El blanco sobre `#F7500C` alcanza 3.44:1, por debajo del mínimo AA. La solución fue repartir roles: titulares grandes en blanco (cumplen el mínimo de 3:1 para texto grande) y cuerpo en `text-onBrand`, que da **5.9:1**. Detalle en [03 · Sistema de diseño](03-sistema-de-diseno.md).

---

## Rendimiento

### Pesos

| Página | Tamaño | First Load JS |
|---|---|---|
| Home | ~50 kB | ~221 kB |
| Páginas de contenido | ~1–3 kB | ~148–162 kB |
| Registro de restaurantes | ~9 kB | ~270 kB |
| Registro de repartidores | ~13 kB | ~274 kB |

Las rutas de registro pesan más por Supabase, React Hook Form, Zod y Leaflet, pero **solo se cargan ahí**: el resto de la web no los descarga.

### Qué se hizo

- **Las 15 rutas son estáticas.** Nada se renderiza en cada petición.
- **Fuentes autoalojadas** con `next/font`: sin peticiones externas ni salto de maquetación.
- **Imágenes por el optimizador de Next**, en WebP y a la resolución justa.
- **El plano con scroll carga progresivamente** y solo el juego de fotogramas que corresponde al dispositivo.
- **Los mockups del móvil son UI en HTML/CSS**, no capturas: cero peso de imagen y nítidos a cualquier resolución.
- **GSAP solo en la Home.** El resto de la web no lo descarga.
- **El scroll no provoca renders de React**: las animaciones de scroll manipulan el DOM directamente.

---

[← Multimedia](11-multimedia.md) · [Índice](README.md) · [Siguiente: Despliegue →](13-despliegue.md)
