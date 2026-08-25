# 08 · Registro de restaurantes

[← Simulación de la app](07-simulacion-de-la-app.md) · [Índice](README.md) · [Siguiente: Registro de repartidores →](09-registro-de-repartidores.md)

---

Ruta: **`/registro/restaurante`** · Componente: [`RestaurantWizard.tsx`](../src/components/forms/RestaurantWizard.tsx)

Asistente de 5 pasos inspirado en el alta de Rappi y Uber Eats, adaptado al sistema propio.

## ⚠️ Modo simulación

```ts
const SIMULATION = true;
```

En `true` el asistente **valida todo y muestra el flujo completo, pero no escribe en Supabase**. Hay un aviso ámbar visible en pantalla.

No es un descuido: la base de datos todavía no tiene las columnas necesarias ni un bucket para las imágenes. Ver [10 · Supabase](10-supabase-y-datos.md).

**Para conectarlo:** aplicar la migración `0001`, crear el bucket y poner la constante en `false`.

## Los 5 pasos

### 1 · Datos del responsable

Nombre, teléfono, correo y contraseña, con **medidor de fuerza en vivo**: 8 caracteres, mayúscula, minúscula y número. Cada requisito se marca en verde según lo cumples.

Supabase acepta 6 caracteres por defecto; aquí se exige más porque esta cuenta administra un negocio.

### 2 · Datos del restaurante

Nombre comercial, marca (solo si difiere), **categorías**, teléfono propio, dirección, ciudad, estado, código postal y **ubicación en un mapa real**.

El mapa es Leaflet con OpenStreetMap. Puedes arrastrar el marcador, tocar el mapa, usar tu ubicación o buscar la dirección escrita. Muestra en vivo a qué **zona de servicio** cae el punto (Maravatío o Acámbaro).

Las **26 categorías** están agrupadas en seis secciones para que la lista siga siendo legible:

| Sección | Categorías |
|---|---|
| Cocina mexicana | Tacos · Antojitos mexicanos · Birria · Carnitas · Barbacoa · Pozole y menudo · Tortas · Mariscos |
| Comida rápida | Comida rápida · Hamburguesas · Hot dogs · Alitas · Pizza · Pollo asado |
| Internacional | Comida asiática · Sushi · Comida italiana · Parrilla y cortes |
| Dulce y panadería | Postres · Panadería y pastelería · Nieves y helados |
| Bebidas | Bebidas · Café |
| Otras opciones | Desayunos · Comida corrida · Vegetariana y saludable |

> **Requiere tu decisión.** Esta lista está **duplicada** en la app principal (`lib/core/restaurant_categories.dart`). Si no se añaden allí las 19 nuevas, un restaurante podrá etiquetarse como «Birria» pero el cliente no verá ese filtro.

### 3 · Información del negocio

Tipo de establecimiento, modalidad, descripción con contador de 280 caracteres y horario habitual con selector de días.

### 4 · Logo y portada

Arrastrar y soltar, con las recomendaciones visibles **antes** de subir. Valida de verdad: formato, peso máximo (5 MB) y **dimensiones reales del archivo**. Avisa si el logo no es cuadrado o la portada no es horizontal.

| | Mínimo | Recomendado |
|---|---|---|
| Logo | 400 × 400 px | Cuadrado, PNG o JPG |
| Portada | 1200 px de ancho | Horizontal 16:9 |

Ninguna es obligatoria para enviar.

### 5 · Revisa y confirma

Resumen por secciones con botón **Editar** en cada una, y la casilla obligatoria que enlaza a los tres documentos legales.

## Lo que NO se pide

Por indicación expresa: **RFC, documentos fiscales, menú, productos, precios ni fotografías de platillos.** Todo eso se completa después desde la app para restaurantes, y así se le explica al usuario dentro del propio paso 3.

## Al terminar

Pantalla de confirmación con el mensaje de registro completado, el botón de descarga de la app (deshabilitado, porque aún no existe) y la **línea de tiempo de los 7 estados**, con el actual marcado.

## Los 7 estados

```
Registro iniciado → Registro completado → En revisión → Aprobado → Activo
                                              ↓
                          Requiere corrección · Rechazado
```

«Requiere corrección» y «Rechazado» son desvíos, no pasos, y se muestran aparte. Cuando el estado es «Requiere corrección», el componente ya muestra el detalle de qué hay que arreglar.

## Guardado automático

El avance se guarda en `localStorage` para poder retomarlo. **La contraseña y las imágenes nunca se guardan**, y se avisa de ello al recuperar el borrador.

---

[← Simulación de la app](07-simulacion-de-la-app.md) · [Índice](README.md) · [Siguiente: Registro de repartidores →](09-registro-de-repartidores.md)
