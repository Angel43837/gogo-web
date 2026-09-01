import { supabase } from "@/lib/supabase";

/* ==========================================================================
   Login del repartidor independiente (repartidor_plus) + tienda de coins.

   Mismo patrón que realSubmission.ts: assertConfigured() al inicio de cada
   función, errores como oraciones completas en español. A diferencia del
   registro, aquí NO hace falta el refreshSession() de después de signUp —
   signInWithPassword emite el JWT de una cuenta que ya existe, cuyo
   app_metadata ya quedó sincronizado por el trigger desde que se registró.

   La tienda habla directo con las mismas tablas/función que ya usa la app
   (rider_stats, rider_store_items, la función increment_rider_stats) — no
   hay nada nuevo del lado de Supabase, solo un segundo lugar desde donde se
   leen/escriben.
   ========================================================================== */

function assertConfigured() {
  if (!supabase) {
    throw new Error("Supabase no está configurado en este entorno (falta .env.local).");
  }
}

export type RiderSession = {
  userId: string;
  email: string | null;
};

/** Inicia sesión como repartidor independiente. Rechaza cualquier otra cuenta. */
export async function signInRider(email: string, password: string): Promise<RiderSession> {
  assertConfigured();
  const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
  if (error) throw new Error("Correo o contraseña incorrectos.");
  const user = data.user;
  if (!user) throw new Error("No se pudo iniciar sesión: respuesta inesperada del servidor.");

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined;
  if (role !== "repartidor_plus") {
    await supabase!.auth.signOut();
    throw new Error(
      "Esta cuenta no es de repartidor independiente. Usa el correo con el que te registraste en GOGO Riders.",
    );
  }
  return { userId: user.id, email: user.email ?? null };
}

/** Sesión activa, solo si es de un repartidor independiente — null en cualquier otro caso. */
export async function getRiderSession(): Promise<RiderSession | null> {
  assertConfigured();
  const { data } = await supabase!.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined;
  if (role !== "repartidor_plus") return null;
  return { userId: user.id, email: user.email ?? null };
}

export async function signOutRider(): Promise<void> {
  assertConfigured();
  await supabase!.auth.signOut();
}

/* --- Tienda de coins --------------------------------------------------- */

export type RiderStoreItem = {
  id: string;
  emoji: string;
  name: string;
  description: string;
  costCoins: number;
  imageUrl: string;
};

export async function getRiderCoins(userId: string): Promise<number> {
  assertConfigured();
  const { data, error } = await supabase!
    .from("rider_stats")
    .select("coins")
    .eq("rider_id", userId)
    .maybeSingle();
  if (error) throw new Error(`No se pudo cargar tu saldo: ${error.message}`);
  return (data?.coins as number | undefined) ?? 0;
}

export async function getRiderStoreItems(): Promise<RiderStoreItem[]> {
  assertConfigured();
  const { data, error } = await supabase!
    .from("rider_store_items")
    .select("id, emoji, name, description, cost_coins, image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`No se pudo cargar la tienda: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    emoji: (row.emoji as string) || "🎁",
    name: row.name as string,
    description: (row.description as string) || "",
    costCoins: (row.cost_coins as number) ?? 0,
    imageUrl: (row.image_url as string) || "",
  }));
}

/**
 * Canjea un premio — misma función (increment_rider_stats) que usa la app
 * para sumar/restar coins, aquí con el costo en negativo. No hay validación
 * de saldo suficiente del lado del servidor (tampoco la había antes en la
 * app): el saldo se revisa en la pantalla antes de permitir el canje.
 */
export async function redeemRiderStoreItem(userId: string, costCoins: number): Promise<void> {
  assertConfigured();
  const { error } = await supabase!.rpc("increment_rider_stats", {
    p_rider_id: userId,
    p_coins_add: -costCoins,
    p_repartos_add: 0,
    p_dinero_add: 0,
  });
  if (error) throw new Error(`No se pudo canjear: ${error.message}`);
}
