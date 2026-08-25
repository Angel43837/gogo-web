# 09 · Registro de repartidores

[← Registro de restaurantes](08-registro-de-restaurantes.md) · [Índice](README.md) · [Siguiente: Supabase y datos →](10-supabase-y-datos.md)

---

Ruta: **`/registro/repartidor`** · Componente: [`DriverWizard.tsx`](../src/components/forms/DriverWizard.tsx)

Asistente de 6 pasos. Reutiliza todo el sistema del asistente de restaurantes: `Stepper`, campos, cargador de imágenes y mapa. **No hay sistemas paralelos.**

## ⚠️ Modo simulación

Igual que el de restaurantes: `SIMULATION = true`, con aviso visible. No crea cuentas.

## Los 6 pasos

### 1 · Datos personales

Nombre, apellido, teléfono, correo y contraseña con el mismo medidor de fuerza.

### 2 · Ubicación

Ciudad, estado y, opcionalmente, marcar la zona en el mapa.

**No se pide el domicilio particular.** Para operar basta con saber en qué ciudad trabajará. La ubicación en tiempo real la pide la app, no la web, y solo mientras el repartidor está conectado. Se explica en el propio paso.

### 3 · Medio de transporte

Motocicleta, automóvil o bicicleta, en tarjetas grandes con iconos de línea en naranja de marca. La lista está en datos, así que **añadir otra modalidad es una línea**.

> Lucide no incluye icono de motocicleta. Se dibujó uno propio en [`src/components/ui/icons.tsx`](../src/components/ui/icons.tsx) siguiendo su misma rejilla de 24×24 y grosor de trazo.

### 4 · Identificación y domicilio

- **Tipo de documento:** INE/IFE, pasaporte o licencia de conducir
- **Número** del documento
- **Fotografía de las dos caras**, obligatorias
- **Comprobante de domicilio**, obligatorio: sirve recibo de luz, agua, teléfono, gas, predial, estado de cuenta o contrato de arrendamiento

La licencia entra aquí **como documento de identidad**, no como papel del vehículo.

Incluye un bloque explicando qué se hace con los datos: solo se usan para verificar, no se comparten con clientes ni restaurantes, y no aparecen en el perfil público.

> **Limitación técnica.** El cargador acepta **solo imágenes** (PNG, JPG, WebP), no PDF. La mayoría fotografía el recibo, así que en la práctica funciona.

### 5 · Foto de perfil

Con las recomendaciones completas: rostro visible, buena luz, nítida, sin lentes oscuros, sin logotipos. Validación real del archivo y vista previa circular.

Es opcional para enviar, avisando de que la cuenta no se activa sin ella.

### 6 · Revisa y confirma

Resumen editable, **reglas de seguridad**, **deslinde de responsabilidad** y términos. Hacen falta **tres aceptaciones** para poder finalizar.

## Lo que NO se pide

**Licencia como documento del vehículo, tarjeta de circulación, papeles del vehículo ni RFC.** El medio de transporte solo sirve para asignar pedidos y zonas adecuadas.

## Reglas de seguridad

Cuatro compromisos con casilla obligatoria:

| Regla | Detalle |
|---|---|
| **Casco siempre puesto** | En todos los repartos. Es protección y es obligatorio por ley |
| **Respetar el reglamento de tránsito** | Ninguna entrega vale un accidente |
| **Conducir con precaución** | Sin usar el teléfono en marcha |
| **Cuidar el pedido** | Transportarlo cerrado y estable |

Al aceptar se guarda `safety_ack_at` con la fecha, para que quede constancia.

## Deslinde de responsabilidad

> **⚠️ BORRADOR. Requiere revisión legal antes de publicarse.**

Cinco puntos están redactados porque son hechos operativos claros: el vehículo y su mantenimiento corren por cuenta del repartidor, el equipo de protección lo provee él, las multas son personales, él decide cómo conduce, y GOGO no responde por sus objetos personales.

**Tres puntos quedan marcados como «por definir» a propósito**: cobertura en caso de accidente, naturaleza de la relación con la plataforma y obligaciones fiscales.

No es pereza. Son los tres que tocan **materia laboral y de seguridad social**, y en México la regulación de las personas trabajadoras de plataformas digitales cambió recientemente. Un texto que afirme «no existe relación laboral» o «no nos hacemos responsables de accidentes» puede ser **inválido y volverse en contra**: si un juez lo declara nulo, expone más que no haberlo escrito.

Cuando tengas el texto validado por un abogado laboralista, se cambia en [`src/data/driverRegistration.ts`](../src/data/driverRegistration.ts).

## Política de aprobación

Configurable desde una constante:

```ts
export const approvalMode = "diferida" as ApprovalMode;
export const approvalDelaySeconds = 17;
```

| Modo | Comportamiento |
|---|---|
| `manual` | Queda «en revisión» hasta que alguien lo apruebe |
| `automatica` | Queda «aprobado» al enviar |
| `diferida` | Queda «en revisión» y pasa a «aprobado» tras el tiempo indicado |

**Actualmente: `diferida`, 17 segundos.** La pantalla final muestra una cuenta atrás que cambia sola a «Aprobado».

Esa espera es **cosmética**: nadie revisa nada durante esos segundos. En producción la cuenta queda aprobada en la base de datos desde el primer momento y esto solo retrasa lo que ve el repartidor.

> **Importante para producción.** La aprobación **no puede decidirse en el navegador**: si el cliente envía el estado, cualquiera se aprueba manipulando la petición. Por eso la migración pone `default 'aprobado'` en la base de datos y **no crea policy de UPDATE** para el repartidor.

> **Requiere tu decisión.** Con aprobación automática y **sin selfie en vivo**, cualquiera puede darse de alta con la identificación de otra persona. La selfie con cámara se puede añadir sin coste ni proveedor externo, y es la pieza que hace defendible aprobar automáticamente.

## Los 9 estados

```
Registro iniciado → Registro completado → Cuenta pendiente
  → En revisión → Aprobado → Activo
              ↓
  Requiere corrección · Suspendido · Desactivado
```

La pantalla final muestra también qué pasa cuando la cuenta está activa: 🔴 Desconectado / 🟢 Disponible, y que **solo se comparte ubicación mientras está disponible**.

## Arquitectura operativa preparada

[`src/data/driverOperations.ts`](../src/data/driverOperations.ts) tipa los estados de disponibilidad y **las 9 etapas del ciclo de vida de un pedido**:

```
Pedido recibido → Buscando repartidor → Repartidor asignado → Repartidor aceptó
  → En camino al restaurante → En el restaurante → Pedido recogido
  → En camino al cliente → Entregado
```

Incluye quién hace avanzar cada etapa y en cuáles debe compartirse ubicación. **No se construyó nada de eso en la web** —es función de la app—, pero así los tres proyectos usan los mismos identificadores.

---

[← Registro de restaurantes](08-registro-de-restaurantes.md) · [Índice](README.md) · [Siguiente: Supabase y datos →](10-supabase-y-datos.md)
