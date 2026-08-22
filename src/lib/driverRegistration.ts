import { z } from "zod";
import { mexicanStates } from "@/data/restaurantRegistration";
import { vehicleTypes } from "@/data/driverRegistration";
import { passwordField, phoneField } from "@/lib/validation";

/* ==========================================================================
   Validación del registro de repartidores.
   Un esquema por paso: solo se valida lo que el usuario tiene delante.
   ========================================================================== */

/* --- Paso 1: datos personales -------------------------------------------- */

export const driverStep1Schema = z
  .object({
    firstName: z.string().trim().min(2, "Escribe tu nombre"),
    lastName: z.string().trim().min(2, "Escribe tu apellido"),
    phone: phoneField,
    email: z.string().trim().min(1, "El correo es obligatorio").email("Correo no válido"),
    password: passwordField,
    confirm: z.string().min(1, "Repite la contraseña"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

/* --- Paso 2: ubicación ---------------------------------------------------- */

export const driverStep2Schema = z.object({
  city: z.string().trim().min(2, "Escribe tu ciudad"),
  state: z.enum(mexicanStates, { message: "Elige tu estado" }),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

/* --- Paso 3: medio de transporte ------------------------------------------ */

const vehicleValues = vehicleTypes.map((v) => v.value) as [string, ...string[]];

export const driverStep3Schema = z.object({
  vehicle: z.enum(vehicleValues, { message: "Elige cómo harás tus entregas" }),
});

/* --- Paso 5: términos ----------------------------------------------------- */

export const driverTermsSchema = z.object({
  acceptTerms: z.literal(true, {
    message: "Debes aceptar los términos para finalizar el registro",
  }),
  acceptSafety: z.literal(true, {
    message: "Debes aceptar las reglas de seguridad",
  }),
});

/* --- Tipos ---------------------------------------------------------------- */

export type DriverStep1 = z.infer<typeof driverStep1Schema>;
export type DriverStep2 = z.infer<typeof driverStep2Schema>;
export type DriverStep3 = z.infer<typeof driverStep3Schema>;

export type DriverDraft = {
  step: number;
  step1: Partial<Omit<DriverStep1, "password" | "confirm">>;
  step2: Partial<DriverStep2>;
  step3: Partial<DriverStep3>;
  savedAt: string;
};

/* --------------------------------------------------------------------------
   Guardado automático del progreso
   -------------------------------------------------------------------------- */

const DRAFT_KEY = "gogo:registro-repartidor";

/**
 * Guarda el avance en el navegador.
 * NUNCA se guardan la contraseña ni la fotografía.
 */
export function saveDriverDraft(draft: DriverDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* Modo privado o almacenamiento lleno: el registro sigue funcionando. */
  }
}

export function loadDriverDraft(): DriverDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as DriverDraft) : null;
  } catch {
    return null;
  }
}

export function clearDriverDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* Sin consecuencias. */
  }
}
