"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Upload } from "lucide-react";
import type { FotoGaleriaPlain } from "@/lib/data";

export default function GaleriaManager({ fotos }: { fotos: FotoGaleriaPlain[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Selecciona una imagen");
      return;
    }
    if (!titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/galeria/upload", { method: "POST", body: formData });
    const uploadData = await uploadRes.json().catch(() => ({}));

    if (!uploadRes.ok) {
      setUploading(false);
      setError(uploadData.error ?? "No se pudo subir la imagen");
      return;
    }

    const createRes = await fetch("/api/galeria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion, url: uploadData.url }),
    });

    setUploading(false);

    if (!createRes.ok) {
      const data = await createRes.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar la foto");
      return;
    }

    setTitulo("");
    setDescripcion("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta foto de la galería?")) return;
    await fetch(`/api/galeria/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-slate-900">Subir foto</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Mantenimiento del tanque principal"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Descripción (opcional)</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Imagen (JPG, PNG o WEBP, máx. 8 MB)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-aqua-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-aqua-700"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-aqua-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-aqua-800 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" /> {uploading ? "Subiendo..." : "Subir foto"}
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fotos.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Aún no hay fotos en la galería.
          </p>
        )}
        {fotos.map((foto) => (
          <div key={foto._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <div className="relative h-40 w-full bg-slate-100">
              <Image src={foto.url} alt={foto.titulo} fill sizes="300px" className="object-cover" />
            </div>
            <div className="flex items-start justify-between gap-2 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{foto.titulo}</p>
                {foto.descripcion && <p className="mt-0.5 text-xs text-slate-500">{foto.descripcion}</p>}
              </div>
              <button
                onClick={() => handleDelete(foto._id)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                aria-label="Eliminar"
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
