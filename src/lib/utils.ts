import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases de Tailwind resolviendo conflictos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Marcador de contenido que el equipo de GOGO todavía no ha definido.
 * Se usa en lugar de inventar cifras, precios, coberturas o promociones.
 */
export const PENDING = "[POR DEFINIR]" as const;
