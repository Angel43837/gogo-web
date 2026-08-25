# 01 · Visión general

[← Índice](README.md) · [Siguiente: Puesta en marcha →](02-puesta-en-marcha.md)

---

## Qué es este proyecto

El **sitio web oficial de GOGO FOOD**: la cara pública de la plataforma de delivery. No es la aplicación en sí, sino la web que la presenta y capta a sus tres tipos de participante.

## El ecosistema

GOGO conecta a tres grupos en una misma plataforma:

| Participante | Qué hace |
|---|---|
| **Usuarios** | Descubren restaurantes, piden, pagan y siguen su entrega |
| **Restaurantes** | Publican su carta, reciben pedidos y los preparan |
| **Repartidores** | Recogen los pedidos y los entregan en moto, coche o bici |

## Qué hace la web

- Presenta GOGO y explica cómo funciona
- Muestra las tres formas de participar
- Promueve la descarga de la aplicación
- **Registra restaurantes** mediante un asistente de 5 pasos
- **Registra repartidores** mediante un asistente de 6 pasos

## Qué NO hace la web

Esto es deliberado y conviene tenerlo claro:

- **No administra restaurantes.** Ni menú, ni productos, ni precios, ni horarios detallados, ni pedidos. Todo eso vive en la app para restaurantes.
- **No opera entregas.** Conectarse, aceptar pedidos, navegar y cobrar son funciones de la app para repartidores.
- **No procesa pagos.**

El recorrido de la web termina donde empieza la app:

```
REGISTRAR → VALIDAR → CREAR CUENTA → ENVIAR A REVISIÓN → INFORMAR
```

## Tecnología

| Capa | Herramienta |
|---|---|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Animación general | Framer Motion |
| Animación por scroll | GSAP + ScrollTrigger |
| Iconos | Lucide React |
| Formularios | React Hook Form + Zod |
| Backend | Supabase |
| Mapas | Leaflet + OpenStreetMap |

## Estado actual

- **13 commits**, 15 rutas, todas generadas de forma estática
- `build` y `lint` pasan sin errores ni avisos
- Publicado en Vercel con despliegue automático desde GitHub
- Los **dos registros están en modo simulación**: recorren el flujo completo pero no escriben en la base de datos. Ver [08](08-registro-de-restaurantes.md) y [09](09-registro-de-repartidores.md).

## Identidad de marca

- **Naranja oficial:** `#F7500C`
- **Acento:** celeste `#99D4F2`, tomado del propio logotipo
- **Logotipo:** archivos oficiales sin recolorear ni deformar

Detalle completo en [03 · Sistema de diseño](03-sistema-de-diseno.md).

## Regla que atraviesa todo el proyecto

**No se inventa información.** En ninguna parte de la web hay precios, comisiones, ganancias, número de usuarios, cobertura, tiempos de entrega, promociones, estadísticas, testimonios, teléfonos ni redes sociales que no existan realmente.

Donde falta un dato se usa la constante `PENDING` (`[POR DEFINIR]`) o el componente `PendingTag`, visibles para el lector. Ver [14 · Pendientes](14-pendientes-y-decisiones.md).

---

[← Índice](README.md) · [Siguiente: Puesta en marcha →](02-puesta-en-marcha.md)
