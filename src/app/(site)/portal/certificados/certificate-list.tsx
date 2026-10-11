"use client";

import { useMemo, useState } from "react";
import { formatDate, formatSize } from "@/components/ui";

export type Certificate = { id: string; title: string; file_size: number; created_at: string };

const normalize = (v: string) => v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function CertificateList({ certificates }: { certificates: Certificate[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return q ? certificates.filter((c) => normalize(c.title).includes(q)) : certificates;
  }, [certificates, query]);

  return (
    <div className="mt-10">
      <label htmlFor="buscar" className="sr-only">Buscar certificado</label>
      <input
        id="buscar"
        type="search"
        placeholder="Buscar por nombre…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      />
      <p className="mt-3 text-sm text-slate-500" aria-live="polite">
        {query ? `${filtered.length} de ${certificates.length} certificados` : `${certificates.length} certificados`}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-4 rounded-xl bg-white p-6 text-center text-slate-500 ring-1 ring-slate-200">
          Ningún certificado coincide con “{query}”.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          {filtered.map((c) => (
            <li key={c.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{c.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Publicado el {formatDate(c.created_at)} · PDF · {formatSize(c.file_size)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <a
                  href={`/api/certificados/${c.id}`}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-none"
                >
                  Ver
                </a>
                <a
                  href={`/api/certificados/${c.id}?descargar=1`}
                  className="flex-1 rounded-md bg-brand-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-800 sm:flex-none"
                >
                  Descargar
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
