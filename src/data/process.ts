import type { LucideIcon } from "lucide-react";
import { ChefHat, PackageCheck, Search, ShoppingBag, Bike } from "lucide-react";

export type ProcessStep = {
  step: number;
  actor: "Usuario" | "Restaurante" | "Repartidor";
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Flujo completo de un pedido dentro del ecosistema GOGO. */
export const processSteps: ProcessStep[] = [
  {
    step: 1,
    actor: "Usuario",
    title: "Encuentra lo que quiere",
    description: "Explora los restaurantes y sus productos disponibles dentro de la plataforma.",
    icon: Search,
  },
  {
    step: 2,
    actor: "Usuario",
    title: "Realiza su pedido",
    description: "Arma el pedido, elige la dirección de entrega y confirma el pago desde la app.",
    icon: ShoppingBag,
  },
  {
    step: 3,
    actor: "Restaurante",
    title: "Recibe y prepara",
    description: "El restaurante recibe el pedido en su panel, lo confirma y comienza la preparación.",
    icon: ChefHat,
  },
  {
    step: 4,
    actor: "Repartidor",
    title: "Recoge el pedido",
    description: "Un repartidor acepta la solicitud, llega al restaurante y recoge el pedido.",
    icon: Bike,
  },
  {
    step: 5,
    actor: "Usuario",
    title: "El pedido llega",
    description: "El repartidor entrega en la dirección indicada y el pedido se marca como completado.",
    icon: PackageCheck,
  },
];
