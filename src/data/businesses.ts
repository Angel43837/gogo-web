import type { LucideIcon } from "lucide-react";
import { ClipboardList, Bike, Store, TrendingUp, Users } from "lucide-react";

export type BusinessBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/**
 * Beneficios cualitativos únicamente.
 * No se incluyen comisiones, precios, porcentajes, número de clientes ni cobertura:
 * esa información aún no está definida.
 */
export const businessBenefits: BusinessBenefit[] = [
  {
    title: "Presencia en la plataforma",
    description:
      "Tu restaurante y tus productos aparecen dentro de GOGO, disponibles para quienes usan la app.",
    icon: Store,
  },
  {
    title: "Recibe pedidos",
    description:
      "Los pedidos llegan directo a tu panel para que los confirmes y prepares sin fricción.",
    icon: ClipboardList,
  },
  {
    title: "Nuevos clientes",
    description:
      "Conecta con personas que buscan opciones cerca y todavía no conocen tu restaurante.",
    icon: Users,
  },
  {
    title: "Servicio de entrega",
    description:
      "Apóyate en la red de repartidores GOGO para llevar los pedidos hasta el cliente.",
    icon: Bike,
  },
  {
    title: "Más alcance",
    description:
      "Amplía el alcance de tu restaurante más allá de quienes pasan por la puerta.",
    icon: TrendingUp,
  },
];

export type BusinessStep = { step: number; title: string; description: string };

export const businessOnboarding: BusinessStep[] = [
  { step: 1, title: "Registra tu restaurante", description: "Comparte los datos básicos de tu restaurante." },
  { step: 2, title: "Completa tu perfil", description: "Agrega tu información, horarios y datos de contacto." },
  { step: 3, title: "Publica tus productos", description: "Carga tu carta o catálogo con precios y descripciones." },
  { step: 4, title: "Empieza a recibir pedidos", description: "Una vez validado tu restaurante, comienzas a operar en GOGO." },
];
