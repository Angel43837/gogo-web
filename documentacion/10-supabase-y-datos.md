# 10 · Supabase y datos

[← Registro de repartidores](09-registro-de-repartidores.md) · [Índice](README.md) · [Siguiente: Multimedia →](11-multimedia.md)

---

## ⚠️ Es la base de PRODUCCIÓN

El proyecto de Supabase al que apunta la web es **el real de GOGO Food**. No hay entorno de pruebas separado. Cuando los registros se conecten, **cada envío creará una cuenta y un restaurante de verdad**, y cualquier alta de prueba habrá que borrarla a mano desde el panel.

## Configuración

```ts
// src/lib/supabase.ts
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

La **anon key es pública por diseño**: viaja al cliente y está protegida por las políticas RLS de Supabase. Aun así vive en `.env.local`, que no se versiona, para que no quede escrita en el repositorio.

Si falta la configuración, `supabaseConfigured` es `false` y los formularios lo advierten en pantalla en vez de fallar en silencio.

## El esquema actual

La tabla `restaurants` tiene **solo 15 columnas**:

```
id · name · description · address · emoji_icon · rating · likes
is_open · owner_id · lat · lng · image_url · zona · is_premium · categorias
```

Los repartidores **no tienen tabla propia**: viven en `auth.users` con el rol `repartidor_plus` y sus datos en los metadatos.

## Qué falta, exactamente

Esta es la razón por la que los dos registros están en modo simulación.

| Falta | Para qué |
|---|---|
| Columnas: marca, teléfono, ciudad, estado, CP, tipo, modalidad, horario, **estado de revisión** | Registro de restaurantes |
| Separar logo de portada | Solo existe un `image_url` |
| Tabla `drivers` | Registro de repartidores |
| Bucket público | Imágenes de restaurantes y foto de perfil |
| Bucket **privado** | Identificación y comprobante de domicilio |

## Las migraciones

Están escritas y listas en [`supabase/migrations/`](../supabase/migrations/):

| Archivo | Qué crea |
|---|---|
| `0001_registro_restaurantes.sql` | Columnas nuevas, tipo enum de estado, bucket `restaurantes` y sus políticas |
| `0002_registro_repartidores.sql` | Bucket **privado** `identificaciones`, bucket público `repartidores`, tabla `drivers` con RLS |

**Cómo aplicarlas:** panel de Supabase → SQL Editor → pegar el archivo → Run.

Son **aditivas e idempotentes**: solo crean lo que falta, no borran ni modifican nada existente, así que la app actual sigue funcionando igual. **Aun así, haz copia de seguridad antes.**

Después, poner `SIMULATION = false` en los dos asistentes.

## Decisiones de seguridad en las migraciones

**El bucket de identificaciones es privado.** Una identificación oficial y un comprobante de domicilio son datos personales sensibles: solo debe poder verlos su dueño y el personal de revisión con `service_role`. El de fotos de perfil sí es público, porque el cliente necesita reconocer al repartidor al llegar.

**El número de la identificación NO se almacena.** Con revisar la foto basta para validar, y guardarlo solo aumenta el daño si algún día hay una filtración. Si el negocio decide que hace falta, debe ir cifrado y con accesos auditados.

**El repartidor no puede cambiar su propio estado.** Hay policy de INSERT pero deliberadamente **ninguna de UPDATE**: los cambios de estado los hace el personal de revisión con `service_role`, que salta RLS.

## Limitaciones de la plataforma

Comprobadas contra el proyecto real:

| Función | Estado | Qué haría falta |
|---|---|---|
| Verificación de correo | **Desactivada** (`mailer_autoconfirm: true`) | Un interruptor en el panel — pero afecta también a la app actual |
| OTP por SMS | **No disponible** (proveedor de teléfono en `false`) | Credenciales de Twilio y configuración |
| Captcha anti-spam | No configurado | Clave de hCaptcha o Turnstile en el panel |

## Verificación de identidad automática

No existe una biblioteca que lo resuelva: es un servicio de pago (KYC). Los proveedores mexicanos especializados en INE son **Incode** y **MetaMap**; **Stripe Identity** sería la integración más rápida por haber ya cuenta de Stripe.

Se cobra **por verificación**, una sola vez por persona. Con el volumen actual —una ciudad pequeña— el gasto anual sería marginal, pero **por eso mismo la revisión manual probablemente basta**: treinta segundos por solicitud detectan los fraudes obvios, que a esa escala son casi todos.

**La pieza que falta en cualquier caso es la selfie con prueba de vida.** Sin ella ni la revisión manual sirve de mucho, porque el revisor ve una identificación y una foto subida de galería, que pueden ser de personas distintas.

## Después de conectar

> **Requiere tu decisión.** Para que el correo de recuperación de contraseña funcione, hay que añadir el dominio del sitio a las **Redirect URLs** del proyecto en Supabase.

---

[← Registro de repartidores](09-registro-de-repartidores.md) · [Índice](README.md) · [Siguiente: Multimedia →](11-multimedia.md)
