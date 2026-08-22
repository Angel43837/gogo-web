import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Ban,
  FileEdit,
  Hourglass,
  PauseCircle,
  PlayCircle,
  Send,
  UserCheck,
} from "lucide-react";

/* ==========================================================================
   Contenido del registro de repartidores.
   Editable desde aquí, sin tocar los componentes del asistente.
   ========================================================================== */

/**
 * Medios de transporte admitidos.
 * La estructura está preparada para ampliar: basta con añadir una entrada.
 * El vehículo solo sirve para decidir qué pedidos y zonas encajan con el
 * repartidor — NO se piden documentos ni licencia en el registro web.
 */
export const vehicleTypes = [
  {
    value: "motocicleta",
    emoji: "🏍️",
    label: "Motocicleta",
    detail: "Mayor alcance y más pedidos por jornada",
  },
  {
    value: "automovil",
    emoji: "🚗",
    label: "Automóvil",
    detail: "Ideal para pedidos grandes o de varios restaurantes",
  },
  {
    value: "bicicleta",
    emoji: "🚲",
    label: "Bicicleta",
    detail: "Perfecta para distancias cortas dentro del centro",
  },
] as const;

export type VehicleValue = (typeof vehicleTypes)[number]["value"];

/* --------------------------------------------------------------------------
   Estados del repartidor en la plataforma
   -------------------------------------------------------------------------- */

export type DriverStatus =
  | "registro_iniciado"
  | "registro_completado"
  | "cuenta_pendiente"
  | "en_revision"
  | "requiere_correccion"
  | "aprobado"
  | "activo"
  | "suspendido"
  | "desactivado";

export type DriverStatusDefinition = {
  id: DriverStatus;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: string;
};

export const driverStatuses: DriverStatusDefinition[] = [
  {
    id: "registro_iniciado",
    label: "Registro iniciado",
    description: "El registro se empezó pero aún no se ha enviado.",
    icon: FileEdit,
    tone: "bg-surface text-muted border-border",
  },
  {
    id: "registro_completado",
    label: "Registro completado",
    description: "Se enviaron todos los datos requeridos.",
    icon: Send,
    tone: "bg-primary/10 text-primary border-primary/25",
  },
  {
    id: "cuenta_pendiente",
    label: "Cuenta pendiente",
    description: "Falta confirmar el correo para activar la cuenta.",
    icon: Hourglass,
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "en_revision",
    label: "En revisión",
    description: "El equipo de GOGO está validando tu información.",
    icon: Hourglass,
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "requiere_correccion",
    label: "Requiere corrección",
    description: "Hay datos que debes corregir antes de continuar.",
    icon: FileEdit,
    tone: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    id: "aprobado",
    label: "Aprobado",
    description: "Tu solicitud fue aceptada. Ya puedes entrar a la app.",
    icon: BadgeCheck,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "activo",
    label: "Activo",
    description: "Puedes conectarte y recibir solicitudes de entrega.",
    icon: PlayCircle,
    tone: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
  {
    id: "suspendido",
    label: "Suspendido",
    description: "La cuenta está pausada temporalmente por la plataforma.",
    icon: PauseCircle,
    tone: "bg-orange-50 text-orange-800 border-orange-300",
  },
  {
    id: "desactivado",
    label: "Desactivado",
    description: "La cuenta ya no opera en la plataforma.",
    icon: Ban,
    tone: "bg-red-50 text-red-700 border-red-200",
  },
];

export const driverStatusById = Object.fromEntries(
  driverStatuses.map((s) => [s.id, s]),
) as Record<DriverStatus, DriverStatusDefinition>;

/** Camino normal del alta. El resto son desvíos. */
export const driverMainFlow: DriverStatus[] = [
  "registro_iniciado",
  "registro_completado",
  "cuenta_pendiente",
  "en_revision",
  "aprobado",
  "activo",
];

/* --------------------------------------------------------------------------
   Recomendaciones para la foto de perfil
   -------------------------------------------------------------------------- */

export const photoGuideline = {
  title: "Foto de perfil",
  hint: "Cuadrada, mínimo 400 × 400 px",
  icon: UserCheck,
  do: [
    "Rostro visible y centrado",
    "Buena iluminación, preferentemente de día",
    "Imagen nítida y reciente",
    "Fondo sencillo",
  ],
  dont: [
    "Fotos borrosas o muy oscuras",
    "Lentes oscuros o gorra que tape la cara",
    "Filtros que cambien tus rasgos",
    "Logotipos o imágenes donde no se te identifique",
  ],
} as const;
