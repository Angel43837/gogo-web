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

/* --------------------------------------------------------------------------
   Identificación oficial
   -------------------------------------------------------------------------- */

/**
 * Documentos admitidos para verificar la identidad.
 * NO se incluye la licencia de conducir a propósito: aunque en México es una
 * identificación válida, el encargo pidió expresamente no solicitarla.
 */
export const idTypes = [
  { value: "ine", label: "INE / IFE", detail: "Credencial para votar vigente" },
  { value: "pasaporte", label: "Pasaporte", detail: "Pasaporte mexicano vigente" },
  { value: "cedula", label: "Cédula profesional", detail: "Emitida por la SEP" },
] as const;

export type IdTypeValue = (typeof idTypes)[number]["value"];

export const idGuidelines = {
  front: {
    title: "Identificación — frente",
    hint: "Horizontal, mínimo 1200 px de ancho",
    do: [
      "Documento completo dentro del encuadre",
      "Texto y fotografía perfectamente legibles",
      "Buena iluminación, sin reflejos ni sombras",
      "Documento vigente",
    ],
    dont: [
      "Fotos borrosas o movidas",
      "Esquinas del documento cortadas",
      "Reflejos del flash sobre el plástico",
      "Fotocopias o capturas de pantalla",
    ],
  },
  back: {
    title: "Identificación — reverso",
    hint: "Horizontal, mínimo 1200 px de ancho",
    do: [
      "Reverso completo y enfocado",
      "Código de barras o QR legible",
      "Buena iluminación",
    ],
    dont: ["Fotos borrosas", "Documento parcialmente fuera del encuadre", "Fotocopias"],
  },
} as const;

/* --------------------------------------------------------------------------
   Deslinde de responsabilidad
   -------------------------------------------------------------------------- */

export type DisclaimerPoint = {
  id: string;
  title: string;
  detail: string;
  /** true cuando el punto NO puede publicarse sin revisión de un abogado. */
  needsLegalReview?: boolean;
};

/**
 * ATENCIÓN — BORRADOR. Requiere revisión legal antes de publicarse.
 *
 * Estos puntos describen quién asume qué durante el reparto. Los marcados con
 * `needsLegalReview` tocan materia laboral y de seguridad social: en México la
 * regulación de las personas trabajadoras de plataformas digitales cambió
 * recientemente, así que su redacción definitiva debe confirmarla un abogado.
 * No son un texto legal válido tal cual están.
 */
export const driverDisclaimer: DisclaimerPoint[] = [
  {
    id: "vehiculo",
    title: "El vehículo es tuyo y corre por tu cuenta",
    detail:
      "El mantenimiento, el combustible, las reparaciones y la verificación del vehículo que uses para repartir son responsabilidad tuya. GOGO no aporta ni repara vehículos.",
  },
  {
    id: "equipo",
    title: "Tu equipo de protección es tu responsabilidad",
    detail:
      "El casco y cualquier otro equipo de seguridad los provees y mantienes tú. GOGO no los suministra ni verifica su estado en cada entrega.",
  },
  {
    id: "transito",
    title: "Las infracciones de tránsito son personales",
    detail:
      "Las multas, sanciones o consecuencias derivadas de incumplir el reglamento de tránsito son tuyas. GOGO no las cubre ni las gestiona.",
  },
  {
    id: "conduccion",
    title: "Tú decides cómo y cuándo conduces",
    detail:
      "Ninguna entrega justifica correr riesgos. GOGO no exige tiempos que obliguen a infringir la ley, y no se responsabiliza de decisiones de conducción tomadas por el repartidor.",
  },
  {
    id: "pertenencias",
    title: "Tus objetos personales",
    detail:
      "GOGO no responde por la pérdida, robo o daño de tus pertenencias, tu teléfono o tu vehículo durante los repartos.",
  },
  {
    id: "accidentes",
    title: "Accidentes y cobertura durante el reparto",
    detail:
      "El alcance de la cobertura en caso de accidente durante una entrega todavía está por definir. Se publicará aquí cuando esté confirmado.",
    needsLegalReview: true,
  },
  {
    id: "relacion",
    title: "Naturaleza de la relación con la plataforma",
    detail:
      "La figura bajo la que colaboras con GOGO y las obligaciones que de ella se derivan están pendientes de definición.",
    needsLegalReview: true,
  },
  {
    id: "fiscal",
    title: "Obligaciones fiscales",
    detail:
      "El tratamiento fiscal de tus ingresos por reparto está pendiente de definición.",
    needsLegalReview: true,
  },
];
