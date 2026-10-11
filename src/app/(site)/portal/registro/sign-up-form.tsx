"use client";

import { useActionState } from "react";
import { signUpClient } from "@/app/actions/admin";
import { NavLink as Link } from "@/components/nav-link";
import { Alert, Field, SubmitButton } from "@/components/ui";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpClient, undefined);

  return (
    <form action={action} className="space-y-5">
      <Field label="Nombre o empresa" name="full_name" autoComplete="organization" required maxLength={120} />
      <Field label="Correo electrónico" name="email" type="email" autoComplete="email" required />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="Mínimo 8 caracteres."
      />
      <Field
        label="Confirmar contraseña"
        name="password_confirm"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      {state?.error && <Alert>{state.error}</Alert>}
      <SubmitButton pending={pending} className="w-full">Crear cuenta</SubmitButton>
      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/portal" className="font-medium text-brand-700 hover:underline">Inicia sesión</Link>
      </p>
    </form>
  );
}
