import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase del navegador.
 *
 * ATENCIÓN: apunta al proyecto de PRODUCCIÓN de GOGO Food. Los formularios
 * de registro crean cuentas y restaurantes DE VERDAD, no hay entorno de
 * pruebas separado. Cualquier alta hecha probando hay que borrarla a mano.
 *
 * La anon key es pública por diseño (viaja al cliente y está protegida por
 * las políticas RLS de Supabase); vive en `.env.local`, que no se versiona.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = supabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/** URL de la app principal, a donde se manda al usuario tras registrarse. */
export const mainAppUrl =
  process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "";

/** Construye un enlace a una ruta de la app principal. */
export const mainAppLink = (path: string) => (mainAppUrl ? `${mainAppUrl}${path}` : null);
