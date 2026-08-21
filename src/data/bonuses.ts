import type { LucideIcon } from "lucide-react";
import { Bike, Gift, Store, Ticket } from "lucide-react";

export type Bonus = {
  id: string;
  audience: "Usuarios" | "Restaurantes" | "Repartidores";
  title: string;
  description: string;
  icon: LucideIcon;
  /** Estructura lista; el valor y las condiciones los define el equipo de GOGO. */
  status: "pending";
};

/**
 * ATENCIÓN: no hay promociones activas definidas.
 * Estas tarjetas son la arquitectura visual lista para recibir bonos reales.
 * No contienen cantidades, porcentajes ni condiciones.
 */
export const bonuses: Bonus[] = [
  {
    id: "bienvenida",
    audience: "Usuarios",
    title: "Bono de bienvenida",
    description: "Beneficio para quienes usan GOGO por primera vez.",
    icon: Gift,
    status: "pending",
  },
  {
    id: "usuarios",
    audience: "Usuarios",
    title: "Promociones para usuarios",
    description: "Campañas y beneficios recurrentes dentro de la app.",
    icon: Ticket,
    status: "pending",
  },
  {
    id: "repartidores",
    audience: "Repartidores",
    title: "Incentivos para repartidores",
    description: "Estímulos asociados a la actividad de reparto.",
    icon: Bike,
    status: "pending",
  },
  {
    id: "restaurantes",
    audience: "Restaurantes",
    title: "Promociones de restaurantes",
    description: "Acciones para impulsar la visibilidad de los restaurantes.",
    icon: Store,
    status: "pending",
  },
];
