import { PageTransition } from "@/components/page-transition";
import { requireClient } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";
import { site } from "@/lib/site";
import { CertificateList, type Certificate } from "./certificate-list";

export default async function CertificadosPage() {
  const { supabase, profile } = await requireClient();
  const hasAccess = profile.approved || profile.role === "admin";

  // RLS solo devuelve certificados a cuentas aprobadas.
  const { data: certificates, error } = hasAccess
    ? await supabase
        .from("certificates")
        .select("id, title, file_size, created_at")
        .order("created_at", { ascending: false })
        .returns<Certificate[]>()
    : { data: [], error: null };

  const contactLink = (
    <a href={`mailto:${site.contact.email}`} className="font-medium text-brand-700 hover:underline">
      {site.contact.email}
    </a>
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Certificados</h1>
            <p className="mt-2 text-slate-600">
              {profile.full_name ? `${profile.full_name} · ` : ""}{profile.email}
            </p>
          </div>
          <form action={signOut}>
            <button className="text-sm font-medium text-slate-600 hover:text-brand-700">Cerrar sesión</button>
          </form>
        </div>

        {!hasAccess ? (
          <div className="mt-10 rounded-xl bg-amber-50 p-8 text-center ring-1 ring-amber-200">
            <p className="font-medium text-slate-900">Tu cuenta está pendiente de aprobación.</p>
            <p className="mt-2 text-sm text-slate-600">
              OTEROC revisará tu registro y, una vez aprobado, aquí podrás ver y descargar los certificados. Si
              necesitas agilizarlo, escríbenos a {contactLink} o al {site.contact.phone}.
            </p>
          </div>
        ) : error ? (
          <p role="alert" className="mt-10 rounded-xl bg-red-50 p-6 text-red-800 ring-1 ring-red-200">
            No pudimos cargar los certificados. Intenta de nuevo en unos minutos.
          </p>
        ) : certificates.length === 0 ? (
          <div className="mt-10 rounded-xl bg-white p-8 text-center ring-1 ring-slate-200">
            <p className="font-medium text-slate-900">Aún no hay certificados publicados.</p>
            <p className="mt-2 text-sm text-slate-600">
              Cuando OTEROC cargue certificados aparecerán aquí. ¿Dudas? Escríbenos a {contactLink}.
            </p>
          </div>
        ) : (
          <CertificateList certificates={certificates} />
        )}
      </div>
    </PageTransition>
  );
}
