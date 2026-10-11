"use client";

import { useState } from "react";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

function generatePassword(length = 10) {
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** Campo de contraseña visible (el admin la comparte con el cliente) con botón para generarla. */
export function PasswordField({ label = "Contraseña", id = "password" }: { label?: string; id?: string }) {
  const [value, setValue] = useState("");

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1.5 flex gap-2">
        <input
          id={id}
          name="password"
          type="text"
          required
          minLength={8}
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-describedby={`${id}-hint`}
          className="block w-full rounded-md border border-slate-300 px-3 py-2.5 font-mono text-base text-slate-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
        <button
          type="button"
          onClick={() => setValue(generatePassword())}
          className="shrink-0 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Generar
        </button>
      </div>
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
        Mínimo 8 caracteres. Cópiala antes de guardar para compartirla con el cliente.
      </p>
    </div>
  );
}
