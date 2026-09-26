"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Upload } from "lucide-react";
import type { InformePlain } from "@/lib/data";

const TIPOS_INFORME = [
  "Declaracion de Renta DIAN",
  "Rendicion de Cuentas",
  "Informe Financiero",
  "Acta de Asamblea",
  "Otro",
];

function formatBytes(bytes: number) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function InformesManager({ informes }: { informes: InformePlain[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anio, setAnio] = useState(String(new Date().getFullYear()));
  const [tipo, setTipo] = useState(TIPOS_INFORME[0]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Selecciona un archivo PDF");
      return;
    }
    if (!titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    const uploadData = await uploadRes.json().catch(() => ({}));

    if (!uploadRes.ok) {
      setUploading(false);
      setError(uploadData.error ?? "No se pudo subir el archivo");
      return;
    }

    const createRes = await fetch("/api/informes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anio: Number(anio),
        tipo,
        titulo,
        descripcion,
        url: uploadData.url,
        nombreArchivo: uploadData.nombreArchivo,
        tamanioBytes: uploadData.tamanioBytes,
      }),
    });

    setUploading(false);

    if (!createRes.ok) {
      const data = await createRes.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar el informe");
      return;
    }

    setTitulo("");
    setDescripcion("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este informe? El archivo también se borrará del almacenamiento.")) return;
    await fetch(`/api/informes/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-slate-900">Subir nuevo informe</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Año</label>
            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Tipo de documento</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {TIPOS_INFORME.map((t) => (
                <option key={t} value={t}>
                  {t.replace("Declaracion", "Declaración").replace("Rendicion", "Rendición")}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Declaración de renta año gravable 2025"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Descripción (opcional)</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Archivo PDF (máx. 15 MB)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" /> {uploading ? "Subiendo..." : "Subir informe"}
        </button>
      </form>

      <div className="space-y-3">
        {informes.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Aún no hay informes publicados.
          </p>
        )}
        {informes.map((inf) => (
          <div
            key={inf._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{inf.titulo}</p>
                <p className="text-xs text-slate-500">
                  {inf.anio} &middot; {inf.tipo} &middot; {formatBytes(inf.tamanioBytes)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={inf.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Ver
              </a>
              <button
                onClick={() => handleDelete(inf._id)}
                className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"
                aria-label="Eliminar informe"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
