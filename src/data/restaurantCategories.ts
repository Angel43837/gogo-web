/**
 * Lista fija de categorías de restaurante — a propósito NO es texto libre.
 * Así el filtro por categorías que ve el cliente es consistente entre
 * restaurantes, en vez de que cada dueño invente sus propios nombres.
 *
 * Para sumar una categoría basta con añadirla aquí; no hay que tocar la
 * base de datos.
 */
export const restaurantCategories = [
  "Comida rápida",
  "Bebidas",
  "Postres",
  "Antojitos mexicanos",
  "Mariscos",
  "Pizza",
  "Comida asiática",
] as const;
