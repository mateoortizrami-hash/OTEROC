"use client";

import { useFormStatus } from "react-dom";

/** Botón de envío que pide confirmación antes de una acción destructiva. */
export function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Eliminando…" : children}
    </button>
  );
}
