"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

export default function LegalForm({
  politicaDatos,
  terminosCondiciones,
}: {
  politicaDatos: string;
  terminosCondiciones: string;
}) {
  const router = useRouter();
  const [politica, setPolitica] = useState(politicaDatos);
  const [terminos, setTerminos] = useState(terminosCondiciones);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ politicaDatos: politica, terminosCondiciones: terminos }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage({ type: "error", text: data.error ?? "No se pudo guardar" });
      return;
    }

    setMessage({ type: "ok", text: "Cambios guardados correctamente" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        El texto por defecto es un punto de partida general, no asesoría legal. Antes de publicar,
        conviene que un abogado lo revise para el caso puntual del acueducto.
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-slate-900">
          Política de tratamiento de datos
        </h2>
        <textarea
          value={politica}
          onChange={(e) => setPolitica(e.target.value)}
          rows={10}
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-slate-900">Términos y condiciones</h2>
        <textarea
          value={terminos}
          onChange={(e) => setTerminos(e.target.value)}
          rows={10}
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {message && (
          <span className={`text-sm ${message.type === "ok" ? "text-emerald-600" : "text-red-600"}`}>
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
