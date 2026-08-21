import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  FileEdit,
  Hourglass,
  PlayCircle,
  Send,
  XCircle,
} from "lucide-react";

/* ==========================================================================
   Contenido del registro de restaurantes.
   Todo lo editable vive aquí para no tocar los componentes del formulario.
   ========================================================================== */

/** Modalidad del negocio (paso 3). */
export const businessModalities = [
  "Restaurante",
  "Cafetería",
  "Repostería",
  "Comida rápida",
  "Postres",
  "Otro",
] as const;

/** Tipo de establecimiento (paso 3). */
export const establishmentTypes = [
  { value: "local", label: "Local con comedor", detail: "Los clientes pueden comer en el sitio" },
  { value: "llevar", label: "Solo para llevar", detail: "Sin mesas, únicamente pedidos" },
  { value: "cocina", label: "Cocina exclusiva de delivery", detail: "Sin atención al público" },
  { value: "movil", label: "Food truck o puesto", detail: "Punto de venta móvil" },
] as const;

/** Días de la semana para el horario habitual. */
export const weekDays = [
  { value: "lun", label: "L", full: "Lunes" },
  { value: "mar", label: "M", full: "Martes" },
  { value: "mie", label: "X", full: "Miércoles" },
  { value: "jue", label: "J", full: "Jueves" },
  { value: "vie", label: "V", full: "Viernes" },
  { value: "sab", label: "S", full: "Sábado" },
  { value: "dom", label: "D", full: "Domingo" },
] as const;

/** Estados de México, para el campo del paso 2. */
export const mexicanStates = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

/* --------------------------------------------------------------------------
   Estados del restaurante dentro de la plataforma
   -------------------------------------------------------------------------- */

export type RestaurantStatus =
  | "registro_iniciado"
  | "registro_completado"
  | "en_revision"
  | "aprobado"
  | "requiere_correccion"
  | "rechazado"
  | "activo";

export type StatusDefinition = {
  id: RestaurantStatus;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Clases de color para la insignia. */
  tone: string;
};

/** Ciclo de vida del alta de un restaurante. */
export const restaurantStatuses: StatusDefinition[] = [
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
    id: "en_revision",
    label: "En revisión",
    description: "El equipo de GOGO está validando la información.",
    icon: Hourglass,
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "aprobado",
    label: "Aprobado",
    description: "La solicitud fue aceptada. Falta activar la cuenta en la app.",
    icon: ClipboardCheck,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "requiere_correccion",
    label: "Requiere corrección",
    description: "Hay datos que deben corregirse antes de continuar.",
    icon: FileEdit,
    tone: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    id: "rechazado",
    label: "Rechazado",
    description: "La solicitud no cumple los requisitos de la plataforma.",
    icon: XCircle,
    tone: "bg-red-50 text-red-700 border-red-200",
  },
  {
    id: "activo",
    label: "Activo",
    description: "El restaurante ya opera y recibe pedidos en GOGO.",
    icon: PlayCircle,
    tone: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
];

export const statusById = Object.fromEntries(
  restaurantStatuses.map((s) => [s.id, s]),
) as Record<RestaurantStatus, StatusDefinition>;

/* --------------------------------------------------------------------------
   Recomendaciones para las imágenes (paso 4)
   -------------------------------------------------------------------------- */

export const imageGuidelines = {
  logo: {
    title: "Logo del negocio",
    hint: "Cuadrado, mínimo 400 × 400 px",
    do: [
      "Usa PNG o JPG con buena resolución",
      "Preferentemente cuadrado (1:1)",
      "Que se reconozca fácilmente en tamaño pequeño",
      "Fondo limpio, sin elementos alrededor",
    ],
    dont: [
      "Imágenes borrosas o pixeladas",
      "Fotos tomadas a una pantalla",
      "Capturas recortadas de redes sociales",
    ],
  },
  cover: {
    title: "Imagen de portada",
    hint: "Horizontal, mínimo 1200 × 675 px",
    do: [
      "Fotografía nítida y bien iluminada",
      "Que represente tu comida o tu local",
      "Formato horizontal (16:9)",
    ],
    dont: [
      "Fotos oscuras o desenfocadas",
      "Imágenes con mucho texto encima",
      "Marcas de agua de terceros o bancos de imágenes",
    ],
  },
} as const;

/** Límites de las imágenes que se aceptan en el paso 4. */
export const imageLimits = {
  maxBytes: 5 * 1024 * 1024,
  accept: ["image/png", "image/jpeg", "image/webp"],
  minLogo: 400,
  minCoverWidth: 1200,
} as const;
