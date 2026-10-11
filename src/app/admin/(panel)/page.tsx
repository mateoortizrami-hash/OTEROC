import Link from "next/link";
import { deleteCertificate } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/confirm-button";
import { formatDate, formatSize } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { ApprovalButton } from "./approval-button";
import { UploadCertificatesForm } from "./upload-certificates-form";

type ClientRow = { id: string; email: string; full_name: string | null; approved: boolean; created_at: string };
type Certificate = { id: string; title: string; file_size: number; created_at: string };

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [{ data: clients }, { data: certificates }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, approved, created_at")
      .eq("role", "client")
      .order("created_at", { ascending: false })
      .returns<ClientRow[]>(),
    supabase
      .from("certificates")
      .select("id, title, file_size, created_at")
      .order("created_at", { ascending: false })
      .returns<Certificate[]>(),
  ]);

  const pending = (clients ?? []).filter((c) => !c.approved);
  const stats = [
    { label: "Certificados en el inventario", value: certificates?.length ?? 0 },
    { label: "Clientes aprobados", value: (clients?.length ?? 0) - pending.length },
    { label: "Pendientes de aprobación", value: pending.length },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-slate-900">Panel</h1>

      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
            <dt className="text-sm text-slate-500">{s.label}</dt>
            <dd className="mt-2 text-3xl font-bold text-slate-900">{s.value}</dd>
          </div>
        ))}
      </dl>

      {pending.length > 0 && (
        <section aria-labelledby="pendientes" className="rounded-xl bg-amber-50 p-6 ring-1 ring-amber-200">
          <h2 id="pendientes" className="text-lg font-semibold text-slate-900">
            Cuentas pendientes de aprobación ({pending.length})
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Al aprobar una cuenta, esa persona podrá ver y descargar todos los certificados. Confirma primero que
            sea un cliente de OTEROC.
          </p>
          <ul className="mt-4 divide-y divide-amber-200 overflow-hidden rounded-lg bg-white ring-1 ring-amber-200">
            {pending.map((c) => (
              <li key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{c.full_name ?? c.email}</p>
                  <p className="truncate text-sm text-slate-500">
                    {c.email} · Registrado el {formatDate(c.created_at)}
                  </p>
                </div>
                <ApprovalButton clientId={c.id} approved={false} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="cargar" className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
        <h2 id="cargar" className="text-lg font-semibold text-slate-900">Cargar certificados</h2>
        <p className="mt-1 mb-5 text-sm text-slate-500">
          Puedes seleccionar varios PDF a la vez (máx. 10 MB cada uno). Todos los clientes aprobados los verán de
          inmediato.
        </p>
        <UploadCertificatesForm />
      </section>

      <section aria-labelledby="inventario">
        <h2 id="inventario" className="text-lg font-semibold text-slate-900">
          Inventario de certificados ({certificates?.length ?? 0})
        </h2>
        {!certificates?.length ? (
          <p className="mt-4 rounded-xl bg-white p-6 text-slate-500 ring-1 ring-slate-200">
            Aún no hay certificados cargados.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
            {certificates.map((c) => (
              <li key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{c.title}</p>
                  <p className="text-sm text-slate-500">
                    {formatDate(c.created_at)} · {formatSize(c.file_size)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <a
                    href={`/api/certificados/${c.id}`}
                    target="_blank"
                    rel="noopener"
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Ver
                  </a>
                  <form action={deleteCertificate}>
                    <input type="hidden" name="certificate_id" value={c.id} />
                    <ConfirmButton
                      message={`¿Eliminar el certificado "${c.title}"? Ningún cliente podrá descargarlo. Esta acción no se puede deshacer.`}
                    >
                      Eliminar
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="clientes">
        <h2 id="clientes" className="text-lg font-semibold text-slate-900">Clientes ({clients?.length ?? 0})</h2>
        {!clients?.length ? (
          <p className="mt-4 rounded-xl bg-white p-6 text-slate-500 ring-1 ring-slate-200">
            Aún no hay clientes registrados. Comparte el enlace del portal para que creen su cuenta.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
            {clients.map((c) => (
              <li key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <Link href={`/admin/clientes/${c.id}`} className="min-w-0 hover:underline">
                  <p className="truncate font-medium text-slate-900">{c.full_name ?? c.email}</p>
                  <p className="truncate text-sm text-slate-500">
                    {c.full_name ? `${c.email} · ` : ""}Desde {formatDate(c.created_at)}
                  </p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      c.approved ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {c.approved ? "Aprobado" : "Pendiente"}
                  </span>
                  <ApprovalButton clientId={c.id} approved={c.approved} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
