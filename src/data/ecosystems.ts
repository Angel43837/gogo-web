import type { LucideIcon } from "lucide-react";
import { Bike, Store, UtensilsCrossed } from "lucide-react";

export type Ecosystem = {
  id: "usuarios" | "restaurantes" | "repartidores";
  eyebrow: string;
  title: string;
  claim: string;
  description: string;
  bullets: string[];
  cta: { label: string; href: string };
  icon: LucideIcon;
};

export const ecosystems: Ecosystem[] = [
  {
    id: "usuarios",
    eyebrow: "Usuarios",
    title: "Descubre, pide y recibe.",
    claim: "Descubre, pide y recibe.",
    description:
      "Explora los restaurantes disponibles, arma tu pedido, paga desde la app y sigue tu entrega hasta la puerta.",
    bullets: [
      "Explora restaurantes y productos cerca de ti",
      "Arma tu pedido y paga desde la app",
      "Sigue el estado de tu pedido en tiempo real",
    ],
    cta: { label: "Quiero pedir", href: "/usuarios" },
    icon: UtensilsCrossed,
  },
  {
    id: "restaurantes",
    eyebrow: "Restaurantes",
    title: "Vende más y llega más lejos.",
    claim: "Vende más y llega más lejos.",
    description:
      "Publica tu carta, recibe pedidos desde la plataforma y apóyate en la red de repartidores GOGO para entregarlos.",
    bullets: [
      "Registra tu restaurante y publica tus productos",
      "Recibe y gestiona pedidos en un solo lugar",
      "Conecta con clientes que aún no te conocen",
    ],
    cta: { label: "Quiero registrar mi restaurante", href: "/restaurantes" },
    icon: Store,
  },
  {
    id: "repartidores",
    eyebrow: "Repartidores",
    title: "Tu moto. Tu tiempo. Tu oportunidad.",
    claim: "Tu moto. Tu tiempo. Tu oportunidad.",
    description:
      "Regístrate con tu motocicleta, recibe solicitudes de entrega y genera ingresos realizando repartos.",
    bullets: [
      "Regístrate con tu motocicleta",
      "Recibe solicitudes de entrega desde la app",
      "Recoge, entrega y genera ingresos por reparto",
    ],
    cta: { label: "Quiero repartir", href: "/repartidores" },
    icon: Bike,
  },
];
