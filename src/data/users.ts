import type { LucideIcon } from "lucide-react";
import { CreditCard, MapPin, PackageCheck, Search, ShoppingCart } from "lucide-react";

export type UserStep = {
  id: string;
  label: string;
  headline: string;
  description: string;
  icon: LucideIcon;
};

/** "Todo lo que necesitas, en unos cuantos pasos." */
export const userJourney: UserStep[] = [
  {
    id: "descubre",
    label: "Descubre",
    headline: "Todo lo que hay cerca, en una sola pantalla",
    description:
      "Navega entre los restaurantes disponibles en la plataforma y encuentra lo que se te antoja.",
    icon: Search,
  },
  {
    id: "elige",
    label: "Elige",
    headline: "Arma tu pedido a tu manera",
    description:
      "Revisa el menú, elige productos y ajusta tu pedido antes de confirmarlo.",
    icon: ShoppingCart,
  },
  {
    id: "pide",
    label: "Pide",
    headline: "Confirma y paga desde la app",
    description:
      "Indica tu dirección de entrega y completa el pedido sin salir de GOGO.",
    icon: CreditCard,
  },
  {
    id: "sigue",
    label: "Sigue",
    headline: "Sabes en todo momento dónde va",
    description:
      "Consulta el estado de tu pedido: en preparación, recogido y en camino.",
    icon: MapPin,
  },
  {
    id: "recibe",
    label: "Recibe",
    headline: "Llega a tu puerta",
    description:
      "El repartidor entrega en la dirección indicada y tu pedido se marca como completado.",
    icon: PackageCheck,
  },
];
