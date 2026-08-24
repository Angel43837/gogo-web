/**
 * Lista fija de categorías de restaurante — a propósito NO es texto libre.
 * Así el filtro por categorías que ve el cliente es consistente entre
 * restaurantes, en vez de que cada dueño invente sus propios nombres.
 *
 * Las categorías se agrupan solo para poder leerlas en pantalla: lo que se
 * guarda en la columna `categorias` sigue siendo la cadena de texto tal cual.
 *
 * ⚠️ Esta lista está DUPLICADA en la app principal
 * (`lib/core/restaurant_categories.dart`). Si añades una aquí, añádela
 * también allí, o el cliente no verá el filtro correspondiente.
 */
export const restaurantCategoryGroups = [
  {
    label: "Cocina mexicana",
    items: [
      "Tacos",
      "Antojitos mexicanos",
      "Birria",
      "Carnitas",
      "Barbacoa",
      "Pozole y menudo",
      "Tortas",
      "Mariscos",
    ],
  },
  {
    label: "Comida rápida",
    items: ["Comida rápida", "Hamburguesas", "Hot dogs", "Alitas", "Pizza", "Pollo asado"],
  },
  {
    label: "Internacional",
    items: ["Comida asiática", "Sushi", "Comida italiana", "Parrilla y cortes"],
  },
  {
    label: "Dulce y panadería",
    items: ["Postres", "Panadería y pastelería", "Nieves y helados"],
  },
  {
    label: "Bebidas",
    items: ["Bebidas", "Café"],
  },
  {
    label: "Otras opciones",
    items: ["Desayunos", "Comida corrida", "Vegetariana y saludable"],
  },
] as const;

/** Lista plana, para validar y para guardar en la base de datos. */
export const restaurantCategories = restaurantCategoryGroups.flatMap((g) => g.items) as string[];
