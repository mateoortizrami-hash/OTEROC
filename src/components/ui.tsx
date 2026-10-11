import type { InputHTMLAttributes, ReactNode } from "react";

export function Field({ label, name, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        id={name}
        name={name}
        aria-describedby={hint ? `${name}-hint` : undefined}
        className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 file:mr-3 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700"
        {...props}
      />
      {hint && <p id={`${name}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function SubmitButton({ pending, children, className = "" }: {
  pending: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-brand-700 px-5 py-2.5 font-semibold text-white hover:bg-brand-800 disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {pending && (
        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export function Alert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "success" }) {
  const styles =
    tone === "error"
      ? "bg-red-50 text-red-800 ring-red-200"
      : "bg-brand-50 text-brand-800 ring-brand-200";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-md px-4 py-3 text-sm ring-1 ${styles}`}>
      {children}
    </p>
  );
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeZone: "America/Bogota" }).format(new Date(iso));
}

export function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
