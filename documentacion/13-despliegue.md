# 13 · Despliegue

[← SEO, accesibilidad y rendimiento](12-seo-accesibilidad-rendimiento.md) · [Índice](README.md) · [Siguiente: Pendientes y decisiones →](14-pendientes-y-decisiones.md)

---

## Dónde está publicado

| | |
|---|---|
| **Sitio** | https://pagina-web-gogo.vercel.app |
| **Repositorio** | https://github.com/ldmh93/Pagina_web_GoGo (privado) |
| **Proyecto en Vercel** | `pagina-web-gogo`, equipo LUIGIS |

## Despliegue automático

El proyecto de Vercel está conectado al repositorio de GitHub. **Cada push a `main` despliega automáticamente.** No hay que ejecutar nada.

Una compilación completa tarda unos 35 segundos.

## Variables de entorno en Vercel

Cargadas y cifradas en los tres entornos (producción, preview y desarrollo):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAIN_APP_URL`

`NEXT_PUBLIC_SITE_URL` no está definida a propósito: sin ella, el dominio se detecta solo desde Vercel. Solo hará falta cuando exista dominio propio.

Para verlas o cambiarlas:

```bash
npx vercel env ls --scope luigis
```

## Publicar cambios

```bash
git add -A
git commit -m "descripción"
git push
```

**Comprueba siempre que `npm run build` pasa antes de subir.** Si el build falla, el despliegue falla.

Recuerda que compilar mientras el servidor de desarrollo está encendido corrompe la carpeta `.next`. El orden correcto es: detener el servidor → compilar → subir → volver a arrancar.

## Clonar en otra máquina

```bash
git clone https://github.com/ldmh93/Pagina_web_GoGo.git
cd Pagina_web_GoGo
npm install
cp .env.example .env.local   # y pegar las credenciales
npm run dev
```

## Qué se versiona y qué no

**Sí se versiona**, incluyendo los vídeos fuente: sin ellos, `npm run video` y `npm run demo` no podrían regenerar el material. Son unos 7 MB de los ~13 MB del repositorio.

**No se versiona:** `node_modules`, `.next`, `.vercel`, `tsconfig.tsbuildinfo` y **`.env.local`**.

## Seguridad de las credenciales

Antes de cada push conviene verificar que no se cuela ninguna clave. Este
comando compara contra la clave real de tu `.env.local`, sin escribirla en
ningún sitio:

```bash
set -a && . ./.env.local && set +a
git diff origin/main..main | grep -c "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

Debe devolver `0`. Se ha comprobado en todos los push hasta ahora.

> No busques por el prefijo `eyJhbGci...`: es solo la cabecera común a todos
> los JWT y da falsos positivos. Compara siempre contra la clave completa.

El repositorio es **privado**, pero eso no sustituye a mantener las claves fuera del código: guárdalas en un gestor de contraseñas o en las variables de entorno del hosting.

## Pendientes de despliegue

> **Requiere tu decisión.**
>
> 1. **El sitio es público y los registros están en simulación.** Cuando se conecten, cualquiera con el enlace podrá crear cuentas reales. Si prefieres mantenerlo oculto mientras lo revisas, Vercel permite protegerlo con contraseña.
> 2. **Dominio propio.** Cuando lo tengas, se añade en Vercel y se define `NEXT_PUBLIC_SITE_URL`.
> 3. **Redirect URLs en Supabase**, para que funcione la recuperación de contraseña.

---

[← SEO, accesibilidad y rendimiento](12-seo-accesibilidad-rendimiento.md) · [Índice](README.md) · [Siguiente: Pendientes y decisiones →](14-pendientes-y-decisiones.md)
