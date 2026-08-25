# GOGO FOOD — Sitio web oficial

Sitio web de **GOGO FOOD**, la plataforma de delivery que conecta usuarios, restaurantes y repartidores.

Construido con **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**.

---

## Empezar

```bash
npm install
cp .env.example .env.local   # y rellenar las credenciales de Supabase
npm run dev                  # http://localhost:3000
```

Sin `.env.local` la web funciona, pero los formularios de registro no pueden enviar nada.

---

## 📖 Documentación

**La documentación completa está en [`documentacion/`](documentacion/README.md)**, dividida en 14 secciones.

| | Sección |
|---|---|
| 01 | [Visión general](documentacion/01-vision-general.md) |
| 02 | [Puesta en marcha](documentacion/02-puesta-en-marcha.md) |
| 03 | [Sistema de diseño](documentacion/03-sistema-de-diseno.md) |
| 04 | [Arquitectura](documentacion/04-arquitectura.md) |
| 05 | [Páginas y secciones](documentacion/05-paginas-y-secciones.md) |
| 06 | [Plano con scroll](documentacion/06-plano-con-scroll.md) |
| 07 | [Simulación de la app](documentacion/07-simulacion-de-la-app.md) |
| 08 | [Registro de restaurantes](documentacion/08-registro-de-restaurantes.md) |
| 09 | [Registro de repartidores](documentacion/09-registro-de-repartidores.md) |
| 10 | [Supabase y datos](documentacion/10-supabase-y-datos.md) |
| 11 | [Multimedia](documentacion/11-multimedia.md) |
| 12 | [SEO, accesibilidad y rendimiento](documentacion/12-seo-accesibilidad-rendimiento.md) |
| 13 | [Despliegue](documentacion/13-despliegue.md) |
| 14 | [Pendientes y decisiones](documentacion/14-pendientes-y-decisiones.md) |

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la compilación |
| `npm run lint` | ESLint |
| `npm run video` | Regenera los fotogramas del plano con scroll |
| `npm run demo` | Regenera el vídeo de la app |

---

## Enlaces

- **Sitio publicado:** https://pagina-web-gogo.vercel.app
- **Repositorio:** https://github.com/ldmh93/Pagina_web_GoGo

---

## Dos cosas que conviene saber de entrada

**Los dos registros están en modo simulación.** Recorren el flujo completo con toda su validación, pero no escriben en la base de datos. El motivo y cómo conectarlos: [10 · Supabase y datos](documentacion/10-supabase-y-datos.md).

**No se inventa información.** No hay precios, comisiones, cifras, coberturas ni condiciones legales que no existan realmente. Donde falta un dato aparece marcado como `[POR DEFINIR]`: [14 · Pendientes](documentacion/14-pendientes-y-decisiones.md).
