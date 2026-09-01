import { supabase } from "@/lib/supabase";
import type { PickedImage, Step1, Step2, Step3 } from "@/lib/restaurantRegistration";
import type { DriverStep1, DriverStep2, DriverStep3, DriverStep4 } from "@/lib/driverRegistration";

/* ==========================================================================
   Envío real a Supabase — cuenta + alta + imágenes.

   Antes de esto, `handleSubmit()` en los dos asistentes solo simulaba (o,
   en la rama "real", mostraba "no habilitado todavía" sin escribir nada).
   Este archivo es la implementación real que faltaba.

   Patrón compartido con los dos:
     1. Crear la cuenta (auth.signUp) con el rol correcto en user_metadata.
        Un trigger en la base de datos (sync_role_to_app_metadata) copia
        role/restaurant_id a app_metadata, que es lo que de verdad leen las
        políticas de seguridad — sin este paso la cuenta quedaría creada
        pero sin permisos reales en la app.
     2. Subir las imágenes al bucket correspondiente, en una carpeta con el
        propio uid del usuario (así las políticas de Storage por carpeta
        dejan subir/ver solo lo suyo).
     3. Insertar la fila (restaurants / drivers) con las URLs/rutas ya
        subidas.

   Si el paso 2 o 3 falla después de haber creado la cuenta, no se puede
   "deshacer" el signUp desde el cliente (no hay endpoint para eso sin la
   service_role key, que nunca debe vivir en el navegador) — se avisa con
   un mensaje claro en vez de fallar en silencio, para que el usuario sepa
   qué pasó y pueda escribir a soporte si hace falta.
   ========================================================================== */

function assertConfigured() {
  if (!supabase) {
    throw new Error("Supabase no está configurado en este entorno (falta .env.local).");
  }
}

/** Convierte el DataURL guardado en PickedImage a un Blob subible. */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

function extFromMime(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

async function uploadImage(bucket: string, path: string, image: PickedImage): Promise<string> {
  assertConfigured();
  const blob = await dataUrlToBlob(image.preview);
  const ext = extFromMime(blob.type || "image/jpeg");
  const fullPath = `${path}.${ext}`;
  const { error } = await supabase!.storage.from(bucket).upload(fullPath, blob, {
    contentType: blob.type || "image/jpeg",
    upsert: true,
  });
  if (error) throw new Error(`No se pudo subir la imagen (${bucket}/${fullPath}): ${error.message}`);
  return fullPath;
}

/** Genera un id de restaurante legible y único, estilo `r_tacoschuy_a3f1`. */
function makeRestaurantId(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `r_${slug || "restaurante"}_${suffix}`;
}

/* --- Restaurantes --------------------------------------------------------- */

export async function submitRestaurantRegistration(
  step1: Step1,
  step2: Step2,
  step3: Step3,
  logo: PickedImage | null,
  cover: PickedImage | null,
): Promise<void> {
  assertConfigured();
  const restaurantId = makeRestaurantId(step2.restaurantName);

  // 1. Cuenta — con el rol y el restaurant_id ya en user_metadata, para que
  // el trigger de la base de datos los copie a app_metadata de inmediato.
  const { data: signUpData, error: signUpError } = await supabase!.auth.signUp({
    email: step1.email,
    password: step1.password,
    options: {
      data: {
        role: "dueno",
        restaurant_id: restaurantId,
        name: step1.ownerName,
      },
    },
  });
  if (signUpError) throw new Error(`No se pudo crear la cuenta: ${signUpError.message}`);
  const userId = signUpData.user?.id;
  if (!userId) throw new Error("No se pudo crear la cuenta: respuesta inesperada del servidor.");

  // El token de la sesión recién creada NO trae todavía el app_metadata que
  // acaba de escribir el trigger de la base de datos (auth.signUp emite el
  // JWT con el estado de ANTES del trigger) — sin refrescar, la política de
  // seguridad de "restaurants" ve a este usuario como si no fuera dueño
  // todavía y rechaza el insert de abajo.
  const { error: refreshError } = await supabase!.auth.refreshSession();
  if (refreshError) {
    throw new Error(`Tu cuenta ya se creó, pero no se pudo continuar el registro: ${refreshError.message}`);
  }

  // 2. Imágenes — en una carpeta con el propio uid (política de Storage por
  // carpeta), no con el restaurantId, porque uid es lo único garantizado
  // disponible como identidad verificada en este punto.
  let logoUrl: string | null = null;
  let coverUrl: string | null = null;
  try {
    if (logo) {
      const path = await uploadImage("restaurantes", `${userId}/logo`, logo);
      logoUrl = supabase!.storage.from("restaurantes").getPublicUrl(path).data.publicUrl;
    }
    if (cover) {
      const path = await uploadImage("restaurantes", `${userId}/portada`, cover);
      coverUrl = supabase!.storage.from("restaurantes").getPublicUrl(path).data.publicUrl;
    }
  } catch (e) {
    throw new Error(
      `Tu cuenta ya se creó, pero no se pudieron subir las imágenes: ${
        e instanceof Error ? e.message : e
      }. Puedes agregarlas después desde tu panel de restaurante.`,
    );
  }

  // 3. Fila del restaurante.
  const { error: insertError } = await supabase!.from("restaurants").insert({
    id: restaurantId,
    name: step2.restaurantName,
    brand_name: step2.brandName || null,
    categorias: step2.categories,
    phone: step2.restaurantPhone,
    address: step2.address,
    city: step2.city,
    state: step2.state,
    postal_code: step2.postalCode,
    lat: step2.lat ?? null,
    lng: step2.lng ?? null,
    establishment_type: step3.establishmentType,
    modality: step3.modality,
    description: step3.description,
    open_days: step3.openDays,
    open_time: step3.openTime,
    close_time: step3.closeTime,
    logo_url: logoUrl,
    cover_url: coverUrl,
    image_url: logoUrl,
    owner_id: userId,
    owner_name: step1.ownerName,
    owner_phone: step1.ownerPhone,
    is_open: false,
    terms_accepted_at: new Date().toISOString(),
    submitted_at: new Date().toISOString(),
  });
  if (insertError) {
    throw new Error(
      `Tu cuenta ya se creó, pero no se pudo guardar el restaurante: ${insertError.message}. Escríbenos para terminar tu alta a mano.`,
    );
  }
}

/* --- Repartidores ---------------------------------------------------------- */

export async function submitDriverRegistration(
  step1: DriverStep1,
  step2: DriverStep2,
  step3: DriverStep3,
  step4: DriverStep4,
  photo: PickedImage | null,
  idFront: PickedImage | null,
  idBack: PickedImage | null,
  proofOfAddress: PickedImage | null,
): Promise<void> {
  assertConfigured();

  const { data: signUpData, error: signUpError } = await supabase!.auth.signUp({
    email: step1.email,
    password: step1.password,
    options: {
      data: {
        role: "repartidor_plus",
        name: `${step1.firstName} ${step1.lastName}`.trim(),
      },
    },
  });
  if (signUpError) throw new Error(`No se pudo crear la cuenta: ${signUpError.message}`);
  const userId = signUpData.user?.id;
  if (!userId) throw new Error("No se pudo crear la cuenta: respuesta inesperada del servidor.");

  // Mismo motivo que en el registro de restaurantes: el JWT recién emitido
  // no trae todavía el app_metadata que puso el trigger, hace falta un
  // refresh antes de poder subir imágenes/insertar con las políticas de
  // seguridad correctas.
  const { error: refreshError } = await supabase!.auth.refreshSession();
  if (refreshError) {
    throw new Error(`Tu cuenta ya se creó, pero no se pudo continuar el registro: ${refreshError.message}`);
  }

  let photoUrl: string | null = null;
  let idFrontPath: string | null = null;
  let idBackPath: string | null = null;
  let proofPath: string | null = null;
  try {
    if (photo) {
      const path = await uploadImage("repartidores", `${userId}/perfil`, photo);
      photoUrl = supabase!.storage.from("repartidores").getPublicUrl(path).data.publicUrl;
    }
    // Identificación y comprobante van al bucket PRIVADO — se guarda solo
    // la ruta, nunca una URL pública (el bucket no la tiene).
    if (idFront) idFrontPath = await uploadImage("identificaciones", `${userId}/frente`, idFront);
    if (idBack) idBackPath = await uploadImage("identificaciones", `${userId}/reverso`, idBack);
    if (proofOfAddress) {
      proofPath = await uploadImage("identificaciones", `${userId}/domicilio`, proofOfAddress);
    }
  } catch (e) {
    throw new Error(
      `Tu cuenta ya se creó, pero no se pudieron subir tus documentos: ${
        e instanceof Error ? e.message : e
      }. Contáctanos para terminar tu registro.`,
    );
  }

  const now = new Date().toISOString();
  const { error: insertError } = await supabase!.from("drivers").insert({
    id: userId,
    first_name: step1.firstName,
    last_name: step1.lastName,
    phone: step1.phone,
    email: step1.email,
    city: step2.city,
    state: step2.state,
    lat: step2.lat ?? null,
    lng: step2.lng ?? null,
    vehicle: step3.vehicle,
    id_type: step4.idType,
    id_front_path: idFrontPath,
    id_back_path: idBackPath,
    proof_of_address_path: proofPath,
    photo_url: photoUrl,
    safety_ack_at: now,
    disclaimer_ack_at: now,
    terms_ack_at: now,
  });
  if (insertError) {
    throw new Error(
      `Tu cuenta ya se creó, pero no se pudo guardar tu registro: ${insertError.message}. Contáctanos para terminarlo a mano.`,
    );
  }
}
