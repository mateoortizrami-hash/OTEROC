import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Chequeo optimista: redirige al login si no hay sesión.
// La autorización real (rol admin / dueño del certificado) se valida en el servidor y en RLS.
export async function proxy(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAdminArea = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isClientArea = pathname.startsWith("/portal/") && pathname !== "/portal/registro";

  if (!isAuthenticated && (isAdminArea || isClientArea)) {
    const loginPath = isAdminArea ? "/admin/login" : "/portal";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*", "/api/:path*"],
};
