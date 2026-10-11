import { setClientApproval } from "@/app/actions/admin";

/** Botón para aprobar o revocar el acceso de una cuenta al inventario. */
export function ApprovalButton({ clientId, approved }: { clientId: string; approved: boolean }) {
  return (
    <form action={setClientApproval}>
      <input type="hidden" name="client_id" value={clientId} />
      <input type="hidden" name="approved" value={String(!approved)} />
      <button
        className={
          approved
            ? "rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            : "rounded-md bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-800"
        }
      >
        {approved ? "Revocar acceso" : "Aprobar"}
      </button>
    </form>
  );
}
