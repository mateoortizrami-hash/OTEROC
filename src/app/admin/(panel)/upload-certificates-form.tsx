"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { registerCertificates, type UploadedFile } from "@/app/actions/admin";
import { Alert, SubmitButton, formatSize } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 20;

type Selected = { file: File; title: string };

async function isPdf(file: File) {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return String.fromCharCode(...header) === "%PDF-";
}

export function UploadCertificatesForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Selected[]>([]);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  async function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStatus(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length > MAX_FILES) {
      e.target.value = "";
      return setStatus({ tone: "error", text: `Máximo ${MAX_FILES} archivos por carga.` });
    }
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        e.target.value = "";
        return setStatus({ tone: "error", text: `"${file.name}" supera el límite de 10 MB.` });
      }
      if (!(await isPdf(file))) {
        e.target.value = "";
        return setStatus({ tone: "error", text: `"${file.name}" no es un PDF válido.` });
      }
    }
    setSelected(files.map((file) => ({ file, title: file.name.replace(/\.pdf$/i, "") })));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected.length) return setStatus({ tone: "error", text: "Selecciona al menos un PDF." });
    if (selected.some((s) => !s.title.trim())) {
      return setStatus({ tone: "error", text: "Todos los certificados necesitan un nombre." });
    }

    setStatus(null);
    const supabase = createClient();
    const uploaded: UploadedFile[] = [];

    for (const [i, { file, title }] of selected.entries()) {
      setProgress(`Subiendo ${i + 1} de ${selected.length}…`);
      const path = `${crypto.randomUUID()}.pdf`;
      const { error } = await supabase.storage
        .from("certificates")
        .upload(path, file, { contentType: "application/pdf", upsert: false });
      if (error) {
        if (uploaded.length) await supabase.storage.from("certificates").remove(uploaded.map((u) => u.path));
        setProgress(null);
        return setStatus({ tone: "error", text: `No se pudo subir "${file.name}". Intenta de nuevo.` });
      }
      uploaded.push({ path, title: title.trim(), size: file.size });
    }

    setProgress("Guardando…");
    const result = await registerCertificates(uploaded);
    setProgress(null);

    if (result?.error) return setStatus({ tone: "error", text: result.error });
    setStatus({ tone: "success", text: result?.success ?? "Guardado." });
    setSelected([]);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="files" className="block text-sm font-medium text-slate-700">Archivos PDF</label>
        <input
          ref={inputRef}
          id="files"
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={onFilesChange}
          disabled={progress !== null}
          className="mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
        />
      </div>

      {selected.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">Nombre visible para el cliente</legend>
          {selected.map((s, i) => (
            <div key={`${s.file.name}-${i}`} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <input
                aria-label={`Nombre del certificado ${s.file.name}`}
                value={s.title}
                maxLength={200}
                onChange={(e) =>
                  setSelected((prev) => prev.map((p, j) => (j === i ? { ...p, title: e.target.value } : p)))
                }
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
              <span className="shrink-0 text-xs text-slate-500">{formatSize(s.file.size)}</span>
            </div>
          ))}
        </fieldset>
      )}

      {status && <Alert tone={status.tone}>{status.text}</Alert>}

      <SubmitButton pending={progress !== null}>
        {progress ?? (selected.length > 1 ? `Guardar ${selected.length} certificados` : "Guardar certificado")}
      </SubmitButton>
    </form>
  );
}
