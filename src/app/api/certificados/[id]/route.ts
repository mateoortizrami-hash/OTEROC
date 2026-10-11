import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SIGNED_URL_TTL_SECONDS = 60;

/**
 * Entrega un certificado: valida sesión y propiedad (vía RLS) y redirige a una
 * URL firmada que expira en 60 s. Nunca se expone la ruta real del archivo.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/certificados/[id]">) {
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return notFound();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // Si el certificado no es del usuario (y no es admin), RLS no lo devuelve.
  const { data: certificate } = await supabase
    .from("certificates")
    .select("title, file_path")
    .eq("id", id)
    .maybeSingle();
  if (!certificate) return notFound();

  const download = request.nextUrl.searchParams.has("descargar")
    ? `${slugify(certificate.title)}.pdf`
    : false;

  const { data: signed, error } = await supabase.storage
    .from("certificates")
    .createSignedUrl(certificate.file_path, SIGNED_URL_TTL_SECONDS, { download });
  if (error || !signed) return notFound();

  const response = NextResponse.redirect(signed.signedUrl, 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function notFound() {
  return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 });
}

function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
      .slice(0, 80) || "certificado"
  );
}
