import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con la secret key: salta RLS. Úsalo SOLO después de verificar
 * que quien llama es admin (requireAdmin), y solo para la API de Auth.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
