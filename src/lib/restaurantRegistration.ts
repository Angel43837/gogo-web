import { z } from "zod";
import { businessModalities, establishmentTypes, mexicanStates } from "@/data/restaurantRegistration";

/* ==========================================================================
   Validación del registro de restaurantes.

   Un esquema por paso: así se valida solo lo que el usuario tiene delante y
   no se le muestran errores de campos que todavía no ha visto.
   ========================================================================== */

/** Teléfono mexicano: 10 dígitos, admitiendo espacios, guiones y prefijo. */
const phone = z
  .string()
  .trim()
  .min(1, "El teléfono es obligatorio")
  .refine((v) => {
    const digits = v.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 12 && digits.startsWith("52"));
  }, "Escribe un teléfono de 10 dígitos");

/**
 * Contraseña: mínimo 8 caracteres con mayúscula, minúscula y número.
 * Supabase acepta 6 por defecto; aquí se exige más porque esta cuenta
 * administra un negocio.
 */
const password = z
  .string()
  .min(8, "Usa al menos 8 caracteres")
  .refine((v) => /[a-z]/.test(v), "Añade al menos una letra minúscula")
  .refine((v) => /[A-Z]/.test(v), "Añade al menos una letra mayúscula")
  .refine((v) => /\d/.test(v), "Añade al menos un número");

/** Fuerza de la contraseña, para el medidor visual. */
export function passwordStrength(value: string) {
  const checks = [
    { id: "length", label: "8 caracteres o más", ok: value.length >= 8 },
    { id: "lower", label: "Una minúscula", ok: /[a-z]/.test(value) },
    { id: "upper", label: "Una mayúscula", ok: /[A-Z]/.test(value) },
    { id: "digit", label: "Un número", ok: /\d/.test(value) },
  ];
  const score = checks.filter((c) => c.ok).length;
  return { checks, score, max: checks.length };
}

/* --- Paso 1: responsable ------------------------------------------------ */

export const step1Schema = z
  .object({
    ownerName: z.string().trim().min(3, "Escribe el nombre completo del responsable"),
    ownerPhone: phone,
    email: z.string().trim().min(1, "El correo es obligatorio").email("Correo no válido"),
    password,
    confirm: z.string().min(1, "Repite la contraseña"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

/* --- Paso 2: datos del restaurante -------------------------------------- */

export const step2Schema = z.object({
  restaurantName: z.string().trim().min(2, "Escribe el nombre comercial"),
  brandName: z.string().trim().optional(),
  categories: z.array(z.string()).min(1, "Elige al menos una categoría"),
  restaurantPhone: phone,
  address: z.string().trim().min(6, "Escribe la dirección del establecimiento"),
  city: z.string().trim().min(2, "Escribe la ciudad"),
  state: z.enum(mexicanStates, { message: "Elige el estado" }),
  postalCode: z
    .string()
    .trim()
    .refine((v) => /^\d{5}$/.test(v), "El código postal debe tener 5 dígitos"),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

/* --- Paso 3: información básica del negocio ----------------------------- */

const establishmentValues = establishmentTypes.map((t) => t.value) as [string, ...string[]];

export const step3Schema = z.object({
  establishmentType: z.enum(establishmentValues, { message: "Elige el tipo de establecimiento" }),
  modality: z.enum(businessModalities, { message: "Elige la modalidad del negocio" }),
  description: z
    .string()
    .trim()
    .min(20, "Cuenta un poco más: al menos 20 caracteres")
    .max(280, "Máximo 280 caracteres"),
  openDays: z.array(z.string()).min(1, "Elige al menos un día"),
  openTime: z.string().min(1, "Indica la hora de apertura"),
  closeTime: z.string().min(1, "Indica la hora de cierre"),
});

/* --- Paso 5: confirmación ------------------------------------------------ */

export const step5Schema = z.object({
  acceptTerms: z.literal(true, {
    message: "Debes aceptar los términos para enviar el registro",
  }),
});

/* --- Tipos --------------------------------------------------------------- */

export type Step1 = z.infer<typeof step1Schema>;
export type Step2 = z.infer<typeof step2Schema>;
export type Step3 = z.infer<typeof step3Schema>;

/** Imagen elegida en el paso 4, con su vista previa. */
export type PickedImage = {
  name: string;
  size: number;
  width: number;
  height: number;
  /** DataURL para la vista previa. */
  preview: string;
};

export type RegistrationDraft = {
  step: number;
  step1: Partial<Omit<Step1, "password" | "confirm">>;
  step2: Partial<Step2>;
  step3: Partial<Step3>;
  savedAt: string;
};

/* --------------------------------------------------------------------------
   Guardado automático del progreso
   -------------------------------------------------------------------------- */

const DRAFT_KEY = "gogo:registro-restaurante";

/**
 * Guarda el avance en el navegador para poder retomarlo.
 * NUNCA se guardan la contraseña ni las imágenes: la primera por seguridad,
 * las segundas porque no caben en localStorage.
 */
export function saveDraft(draft: RegistrationDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* Modo privado o almacenamiento lleno: el registro sigue funcionando. */
  }
}

export function loadDraft(): RegistrationDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as RegistrationDraft) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* Sin consecuencias. */
  }
}
