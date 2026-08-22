import { z } from "zod";

/* ==========================================================================
   Validaciones compartidas por los dos registros (restaurantes y repartidores).
   ========================================================================== */

/** Teléfono mexicano: 10 dígitos, admitiendo espacios, guiones y prefijo 52. */
export const phoneField = z
  .string()
  .trim()
  .min(1, "El teléfono es obligatorio")
  .refine((v) => {
    const digits = v.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 12 && digits.startsWith("52"));
  }, "Escribe un teléfono de 10 dígitos");

/**
 * Contraseña: mínimo 8 caracteres con mayúscula, minúscula y número.
 * Supabase acepta 6 por defecto; aquí se exige más porque estas cuentas
 * dan acceso a operar dentro de la plataforma.
 */
export const passwordField = z
  .string()
  .min(8, "Usa al menos 8 caracteres")
  .refine((v) => /[a-z]/.test(v), "Añade al menos una letra minúscula")
  .refine((v) => /[A-Z]/.test(v), "Añade al menos una letra mayúscula")
  .refine((v) => /\d/.test(v), "Añade al menos un número");

/** Desglose de la fuerza de la contraseña, para el medidor visual. */
export function passwordStrength(value: string) {
  const checks = [
    { id: "length", label: "8 caracteres o más", ok: value.length >= 8 },
    { id: "lower", label: "Una minúscula", ok: /[a-z]/.test(value) },
    { id: "upper", label: "Una mayúscula", ok: /[A-Z]/.test(value) },
    { id: "digit", label: "Un número", ok: /\d/.test(value) },
  ];
  return { checks, score: checks.filter((c) => c.ok).length, max: checks.length };
}
