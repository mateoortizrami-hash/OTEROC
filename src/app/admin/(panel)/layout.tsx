import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/brand/logo-mark.jpg" alt="" width={134} height={118} className="h-14 w-auto" />
            <span className="font-semibold text-slate-900">Administración</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-slate-500 sm:inline">{profile.email}</span>
            <form action={signOut}>
              <button className="font-medium text-slate-600 hover:text-brand-700">Cerrar sesión</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
    </>
  );
}
