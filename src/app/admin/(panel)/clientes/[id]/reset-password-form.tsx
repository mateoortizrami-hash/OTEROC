"use client";

import { useActionState } from "react";
import { resetClientPassword } from "@/app/actions/admin";
import { PasswordField } from "@/components/password-field";
import { Alert, SubmitButton } from "@/components/ui";

export function ResetPasswordForm({ clientId }: { clientId: string }) {
  const [state, action, pending] = useActionState(resetClientPassword, undefined);

  return (
    <form action={action} key={state?.success} className="space-y-4">
      <input type="hidden" name="client_id" value={clientId} />
      <PasswordField label="Nueva contraseña" id="reset-password" />
      {state?.error && <Alert>{state.error}</Alert>}
      {state?.success && <Alert tone="success">{state.success}</Alert>}
      <SubmitButton pending={pending}>Cambiar contraseña</SubmitButton>
    </form>
  );
}
