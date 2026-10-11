import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { AdminLoginForm } from "./admin-login-form";

export default async function AdminLoginPage() {
  const { profile } = await getCurrentProfile();
  if (profile?.role === "admin") redirect("/admin");

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <Image src="/brand/logo-mark.jpg" alt="Inversiones OTEROC" width={134} height={118} className="mx-auto h-32 w-auto" />
      <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">Administración</h1>
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <AdminLoginForm />
      </div>
    </main>
  );
}
