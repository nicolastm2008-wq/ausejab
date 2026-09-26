"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { ConfiguracionPlain } from "@/lib/data";

type Props = { configuracion: ConfiguracionPlain };

const CAMPOS_TEXTO: { name: keyof ConfiguracionPlain; label: string; type?: string }[] = [
  { name: "nombre", label: "Nombre oficial del acueducto" },
  { name: "siglas", label: "Siglas" },
  { name: "eslogan", label: "Eslogan" },
  { name: "anioFundacion", label: "Año de fundación", type: "number" },
  { name: "vereda", label: "Vereda" },
  { name: "municipio", label: "Municipio" },
  { name: "departamento", label: "Departamento" },
  { name: "nit", label: "NIT" },
];

const CAMPOS_CONTACTO: { name: keyof ConfiguracionPlain; label: string }[] = [
  { name: "telefono", label: "Teléfono" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "email", label: "Correo electrónico" },
  { name: "direccion", label: "Dirección" },
  { name: "horarioAtencion", label: "Horario de atención" },
  { name: "facebook", label: "URL de Facebook" },
  { name: "instagram", label: "URL de Instagram" },
];

export default function ConfiguracionForm({ configuracion }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const { _id, createdAt, updatedAt, ...editable } = configuracion as typeof configuracion &
      Record<string, unknown>;
    return editable as Record<string, string | number>;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function update(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-slate-900">Identidad</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CAMPOS_TEXTO.map((campo) => (
            <div key={campo.name}>
              <label className="text-sm font-medium text-slate-700">{campo.label}</label>
              <input
                type={campo.type ?? "text"}
                value={values[campo.name] as string | number}
                onChange={(e) => update(campo.name, e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Color primario</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={values.colorPrimario as string}
                onChange={(e) => update("colorPrimario", e.target.value)}
                className="h-10 w-14 rounded border border-slate-300"
              />
              <span className="text-sm text-slate-500">{values.colorPrimario as string}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Color secundario</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={values.colorSecundario as string}
                onChange={(e) => update("colorSecundario", e.target.value)}
                className="h-10 w-14 rounded border border-slate-300"
              />
              <span className="text-sm text-slate-500">{values.colorSecundario as string}</span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Los colores de marca son de referencia; para aplicarlos en todo el diseño se requiere un ajuste de estilos.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-slate-900">Reseña histórica y propósito</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Reseña histórica</label>
            <textarea
              value={values.resenaHistorica as string}
              onChange={(e) => update("resenaHistorica", e.target.value)}
              rows={8}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="Separa los párrafos con una línea en blanco"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Misión</label>
              <textarea
                value={values.mision as string}
                onChange={(e) => update("mision", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Visión</label>
              <textarea
                value={values.vision as string}
                onChange={(e) => update("vision", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-slate-900">Contacto</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CAMPOS_CONTACTO.map((campo) => (
            <div key={campo.name}>
              <label className="text-sm font-medium text-slate-700">{campo.label}</label>
              <input
                type="text"
                value={values[campo.name] as string}
                onChange={(e) => update(campo.name, e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          ))}
        </div>
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
