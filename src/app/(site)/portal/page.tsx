import { PageTransition } from "@/components/page-transition";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function PortalLoginPage() {
  const { profile } = await getCurrentProfile();
  if (profile) redirect(profile.role === "admin" ? "/admin" : "/portal/certificados");

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portal del cliente</h1>
        <p className="mt-3 text-slate-600">
          Ingresa con tu correo y contraseña para ver y descargar tus certificados.
        </p>
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </PageTransition>
  );
}
