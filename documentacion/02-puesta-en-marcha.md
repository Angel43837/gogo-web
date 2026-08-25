# 02 · Puesta en marcha

[← Visión general](01-vision-general.md) · [Índice](README.md) · [Siguiente: Sistema de diseño →](03-sistema-de-diseno.md)

---

## Requisitos

- **Node.js 20 o superior** (el proyecto se ha desarrollado con la 24)
- npm

No hace falta instalar ffmpeg: viene como dependencia de desarrollo.

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre http://localhost:3000

**Sin `.env.local` la web funciona igual**, pero los dos formularios de registro se muestran con un aviso y no pueden enviar nada. Ver [10 · Supabase](10-supabase-y-datos.md).

## Variables de entorno

Todas van en `.env.local`, que **no se versiona**.

| Variable | Para qué sirve | Obligatoria |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Proyecto de Supabase | Sí, para los registros |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública, protegida por RLS | Sí, para los registros |
| `NEXT_PUBLIC_MAIN_APP_URL` | App principal, a donde se envía al usuario tras registrarse | No |
| `NEXT_PUBLIC_SITE_URL` | Dominio propio para canonical, sitemap y Open Graph | No, en Vercel se detecta solo |

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la compilación de producción |
| `npm run lint` | ESLint |
| `npm run video` | Regenera los fotogramas del plano con scroll |
| `npm run demo` | Regenera el vídeo de la app |

Los dos últimos solo hacen falta si cambias los archivos fuente de vídeo. Ver [11 · Multimedia](11-multimedia.md).

## Usar otro puerto

```bash
npx next dev -p 3001
```

## Probar desde el móvil

El servidor de desarrollo también escucha en la red local. Al arrancar imprime algo como:

```
- Network: http://192.168.1.8:3000
```

Abre esa dirección desde el teléfono, conectado al mismo wifi. Es la forma correcta de comprobar el diseño responsive, el mapa y el plano con scroll.

## Problemas frecuentes

**El navegador no abre localhost.** Lo más habitual es que el servidor se haya detenido. `npm run build` y `npm run dev` comparten la carpeta `.next`, así que compilar mientras el servidor está encendido lo corrompe. Solución: detener el servidor, compilar y volver a arrancarlo.

**Errores raros de módulos tras compilar.** Misma causa. Se arregla así:

```bash
rm -rf .next
npm run dev
```

**El arranque en frío tarda.** La primera vez son unos 25 segundos, y cada página compila al primer acceso. A partir de ahí va inmediato.

**El mapa tarda un segundo.** Carga las teselas de OpenStreetMap desde internet la primera vez.

---

[← Visión general](01-vision-general.md) · [Índice](README.md) · [Siguiente: Sistema de diseño →](03-sistema-de-diseno.md)
