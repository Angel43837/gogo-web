# 14 · Pendientes y decisiones

[← Despliegue](13-despliegue.md) · [Índice](README.md)

---

## Pendiente de definir por el negocio

Nada de esto está inventado en la web. Donde falta el dato, aparece marcado como `[POR DEFINIR]`.

| Tema | Dónde se edita |
|---|---|
| Enlaces de App Store y Google Play | `appStores` en [`src/lib/site.ts`](../src/lib/site.ts) — cambiar `href: null` por la URL |
| Dominio oficial | Variable `NEXT_PUBLIC_SITE_URL` |
| Correo, teléfono y redes sociales | [`src/app/contacto/page.tsx`](../src/app/contacto/page.tsx) y el footer |
| Requisitos y documentos de repartidores | [`src/data/drivers.ts`](../src/data/drivers.ts) |
| Bonos: importes y condiciones | [`src/data/bonuses.ts`](../src/data/bonuses.ts) |
| Condiciones comerciales para restaurantes | [`src/data/businesses.ts`](../src/data/businesses.ts) |
| Textos legales (4 documentos) | [`src/app/legal/`](../src/app/legal/) |
| Capturas reales de la app | Sustituir los mockups por `next/image` con `priority` |

---

## Requiere tu decisión

Ordenado por lo que más pesa.

### 1 · El deslinde de responsabilidad necesita un abogado

Tres puntos —cobertura en accidentes, naturaleza de la relación y obligaciones fiscales— tocan materia laboral y de seguridad social. En México esa regulación cambió recientemente. **Un texto mal redactado puede ser nulo y exponerte más que no tenerlo.** Están marcados como «por definir» a propósito.

→ [09 · Registro de repartidores](09-registro-de-repartidores.md)

### 2 · Falta la selfie con prueba de vida

Con aprobación automática y sin verificar que la persona es quien dice ser, **cualquiera puede darse de alta con la identificación de otro** y salir a repartir a domicilios particulares. Subir una foto del INE no prueba nada.

Se puede añadir usando la cámara del dispositivo, sin proveedor externo ni coste.

→ [10 · Supabase y datos](10-supabase-y-datos.md)

### 3 · Marca de tercero en la grabación de la app

En el vídeo del recorrido de compra aparece de forma persistente una marca de tercero. Mostrarla en la web de GOGO da a entender un acuerdo comercial. Si no lo hay, conviene desenfocarla o cortar el clip.

→ [07 · Simulación de la app](07-simulacion-de-la-app.md)

### 4 · Sincronizar las categorías con la app principal

Las 26 categorías están **duplicadas** en `lib/core/restaurant_categories.dart`. Si no se añaden allí las 19 nuevas, un restaurante podrá etiquetarse como «Birria» pero el cliente no verá ese filtro.

→ [08 · Registro de restaurantes](08-registro-de-restaurantes.md)

### 5 · Conectar los registros

Aplicar las dos migraciones y poner `SIMULATION = false`. Haz copia de seguridad antes: es la base de producción.

→ [10 · Supabase y datos](10-supabase-y-datos.md)

### 6 · Verificación de correo y OTP

La verificación de correo está desactivada en Supabase; activarla afecta también a la app actual. El OTP por SMS necesita credenciales de Twilio.

### 7 · La frase durante los 17 segundos

Mientras corre la espera cosmética se muestra «El equipo de GOGO está validando tu información». Como no ocurre, es una afirmación falsa dentro de un flujo de verificación de identidad. Algo como «Estamos preparando tu cuenta» consigue el mismo efecto sin dejar por escrito una revisión que no se hizo.

→ [09 · Registro de repartidores](09-registro-de-repartidores.md)

---

## Decisiones tomadas y por qué

Para que nadie las deshaga sin conocer el motivo.

| Decisión | Motivo |
|---|---|
| **Los tramos oscuros son negro, no naranja quemado** | Un naranja apagado ensucia la marca; el negro hace que el `#F7500C` destaque |
| **Cuerpo de texto oscuro sobre naranja** | El blanco sobre `#F7500C` da 3.44:1, por debajo del mínimo legible |
| **El plano con scroll usa imágenes, no vídeo** | Con vídeo se congela: cada salto obliga a decodificar desde el keyframe anterior |
| **9 fps en los fotogramas del scroll** | El ritmo lo marca el scroll, no un reloj: no se percibe como cámara lenta |
| **Mapas con OpenStreetMap, no Google** | No necesita clave de API: un secreto menos que gestionar |
| **Nominatim en vez de Google Geocoding** | Mismo motivo |
| **El borrador no guarda la contraseña** | Seguridad, y se avisa al usuario |
| **El número de identificación no se almacena** | Revisar la foto basta; guardarlo aumenta el daño de una filtración |
| **Bucket de identificaciones privado** | Dato personal sensible |
| **Sin policy de UPDATE para el repartidor** | Si no, cualquiera se aprueba solo manipulando la petición |
| **Nombres de restaurante ficticios en los mockups** | No implicar alianzas comerciales inexistentes |
| **Avatar neutro, no una fotografía real** | No usar la imagen de una persona identificable |
| **Los pasos 4 y 7 del encargo de repartidores se fusionaron** | Pedían datos ya recogidos; repetirlos contradice «no saturar al usuario» |
| **Los metadatos siguen en texto** | Un atributo HTML no admite imágenes, y Google necesita texto |
| **El Hero conserva su texto** | Por indicación expresa |
| **La navbar usa el lockup apilado** | Por indicación expresa: es el oficial para ese sitio |

---

## Preparado para el futuro

Rutas ya reservadas y tipadas en `futureRoutes`:

`/registro` · `/login` · `/descarga` · `/checkout` · `/pago` · `/promociones` · `/dashboard`

**La Home no depende de ningún formulario.** Los CTA apuntan a rutas, no a componentes, así que se pueden conectar funnels sin tocarla.

En [`src/data/driverOperations.ts`](../src/data/driverOperations.ts) están tipados los estados de disponibilidad y las 9 etapas del ciclo de vida de un pedido, para que la app y el panel administrativo usen los mismos identificadores que la web.

---

[← Despliegue](13-despliegue.md) · [Índice](README.md)
