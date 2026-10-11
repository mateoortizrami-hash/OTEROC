import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteClientAccount } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/confirm-button";
import { formatDate } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { ApprovalButton } from "../../approval-button";
import { ResetPasswordForm } from "./reset-password-form";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ClientDetailPage({ params }: PageProps<"/admin/clientes/[id]">) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const { supabase } = await requireAdmin();
  const { data: client } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, approved, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!client || client.role !== "client") notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm font-medium text-brand-700 hover:underline">← Panel</Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-slate-900">{client.full_name ?? client.email}</h1>
            <p className="mt-1 text-slate-500">
              {client.email} · Registrado el {formatDate(client.created_at)}
            </p>
          </div>
          <form action={deleteClientAccount}>
            <input type="hidden" name="client_id" value={client.id} />
            <ConfirmButton
              message={`¿Eliminar la cuenta de ${client.email}? Ya no podrá ingresar al portal. Los certificados del inventario no se borran. Esta acción no se puede deshacer.`}
            >
              Eliminar cuenta
            </ConfirmButton>
          </form>
        </div>
      </div>

      <section
        aria-labelledby="estado"
        className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 id="estado" className="text-lg font-semibold text-slate-900">
            Acceso al inventario:{" "}
            <span className={client.approved ? "text-brand-700" : "text-amber-700"}>
              {client.approved ? "Aprobado" : "Pendiente"}
            </span>
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {client.approved
              ? "Puede ver y descargar todos los certificados."
              : "No ve ningún certificado hasta que lo apruebes."}
          </p>
        </div>
        <ApprovalButton clientId={client.id} approved={client.approved} />
      </section>

      <section aria-labelledby="acceso" className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
        <h2 id="acceso" className="text-lg font-semibold text-slate-900">Restablecer contraseña</h2>
        <p className="mt-1 mb-5 text-sm text-slate-500">
          Úsalo si el cliente olvidó su contraseña. La anterior deja de funcionar de inmediato.
        </p>
        <ResetPasswordForm clientId={client.id} />
      </section>
    </div>
  );
}
