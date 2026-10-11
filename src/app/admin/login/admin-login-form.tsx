"use client";

import { useActionState } from "react";
import { signInAdmin } from "@/app/actions/admin";
import { Alert, Field, SubmitButton } from "@/components/ui";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(signInAdmin, undefined);

  return (
    <form action={action} className="space-y-5">
      <Field label="Correo electrónico" name="email" type="email" autoComplete="username" required />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" required />
      {state?.error && <Alert>{state.error}</Alert>}
      <SubmitButton pending={pending} className="w-full">Ingresar</SubmitButton>
    </form>
  );
}
