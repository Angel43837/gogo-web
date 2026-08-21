import type { LucideIcon } from "lucide-react";
import { HardHat, PackageCheck, ShieldCheck, TrafficCone } from "lucide-react";
import { PENDING } from "@/lib/utils";

export type DriverStep = {
  step: number;
  title: string;
  description: string;
  /** true cuando la condición exacta todavía la define el equipo de GOGO. */
  pending?: boolean;
};

/**
 * Proceso de alta de repartidores.
 * No se prometen ingresos, horarios, bonos ni condiciones laborales:
 * esa información aún no está definida.
 */
export const driverOnboarding: DriverStep[] = [
  { step: 1, title: "Regístrate", description: "Crea tu cuenta de repartidor en GOGO." },
  { step: 2, title: "Completa tu información", description: "Agrega tus datos personales y los de tu motocicleta." },
  {
    step: 3,
    title: "Envía la documentación requerida",
    description: `Adjunta los documentos solicitados. Requisitos exactos: ${PENDING}.`,
    pending: true,
  },
  { step: 4, title: "Espera la validación", description: "El equipo de GOGO revisa tu solicitud." },
  { step: 5, title: "Activa tu cuenta", description: "Al ser aprobado, tu cuenta queda activa en la plataforma." },
  { step: 6, title: "Comienza a repartir", description: "Recibe solicitudes de entrega y realiza tus repartos." },
];

export type DriverRequirement = { label: string; pending: boolean };

/** Requisitos: se muestran como pendientes hasta que GOGO los confirme. */
export const driverRequirements: DriverRequirement[] = [
  { label: "Motocicleta propia", pending: false },
  { label: "Smartphone con conexión a internet", pending: false },
  { label: "Documentación de identidad", pending: true },
  { label: "Documentación del vehículo", pending: true },
  { label: "Edad mínima", pending: true },
];

export type DriverCommitment = {
  id: string;
  title: string;
  detail: string;
  icon: LucideIcon;
};

/**
 * Compromiso de seguridad que acepta el repartidor al darse de alta.
 *
 * Son obligaciones de sentido común y de tránsito (el casco y el reglamento
 * son obligatorios por ley en México), no políticas internas inventadas:
 * las condiciones concretas de GOGO todavía no están definidas.
 */
export const driverCommitments: DriverCommitment[] = [
  {
    id: "casco",
    title: "Casco siempre puesto",
    detail: "En todos los repartos, sin excepción. Es tu protección y es obligatorio por ley.",
    icon: HardHat,
  },
  {
    id: "transito",
    title: "Respetar el reglamento de tránsito",
    detail: "Semáforos, sentidos, límites de velocidad y peatones. Ninguna entrega vale un accidente.",
    icon: TrafficCone,
  },
  {
    id: "conduccion",
    title: "Conducir con precaución",
    detail: "Sin usar el teléfono en marcha: revisa la app detenido y en un lugar seguro.",
    icon: ShieldCheck,
  },
  {
    id: "pedido",
    title: "Cuidar el pedido",
    detail: "Transporta la comida cerrada y estable para que llegue igual que salió del restaurante.",
    icon: PackageCheck,
  },
];

export type RiderPerk = { emoji: string; label: string; detail: string };

/**
 * Programa GOGO Riders.
 * Se describe QUÉ es cada elemento, sin montos ni mecánicas concretas:
 * eso todavía lo define el equipo de GOGO.
 */
export const riderPerks: RiderPerk[] = [
  { emoji: "🪙", label: "Coins", detail: "Se acumulan con tu actividad" },
  { emoji: "🏆", label: "Retos", detail: "Objetivos dentro de la app" },
  { emoji: "⭐", label: "Niveles", detail: "Avanzan según tu constancia" },
  { emoji: "💸", label: "Retiros", detail: "Consulta y cobra desde la app" },
];
