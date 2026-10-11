import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Supabase (plan gratuito) pausa el proyecto tras 7 días sin actividad.
 * Vercel Cron llama a esta ruta una vez al día (ver vercel.json) y hace una consulta mínima.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { error } = await createAdminClient()
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
