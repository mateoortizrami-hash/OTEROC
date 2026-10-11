import { PageTransition } from "@/components/page-transition";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { SignUpForm } from "./sign-up-form";

export default async function RegistroPage() {
  const { profile } = await getCurrentProfile();
  if (profile) redirect(profile.role === "admin" ? "/admin" : "/portal/certificados");

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Crear cuenta</h1>
        <p className="mt-3 text-slate-600">
          Regístrate para consultar los certificados que OTEROC emita a tu nombre o al de tu empresa.
        </p>
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <SignUpForm />
        </div>
      </div>
    </PageTransition>
  );
}
