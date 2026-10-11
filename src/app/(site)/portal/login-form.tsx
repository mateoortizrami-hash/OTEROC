"use client";

import { useActionState } from "react";
import { signInClient } from "@/app/actions/admin";
import { NavLink as Link } from "@/components/nav-link";
import { Alert, Field, SubmitButton } from "@/components/ui";
import { site } from "@/lib/site";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInClient, undefined);

  return (
    <form action={action} className="space-y-5">
      <Field label="Correo electrónico" name="email" type="email" autoComplete="username" required />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" required />
      {state?.error && <Alert>{state.error}</Alert>}
      <SubmitButton pending={pending} className="w-full">Ingresar</SubmitButton>
      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <Link href="/portal/registro" className="font-medium text-brand-700 hover:underline">Regístrate</Link>
      </p>
      <p className="text-center text-sm text-slate-500">
        ¿Olvidaste tu contraseña? Escríbenos a{" "}
        <a href={`mailto:${site.contact.email}`} className="font-medium text-brand-700 hover:underline">
          {site.contact.email}
        </a>
      </p>
    </form>
  );
}
