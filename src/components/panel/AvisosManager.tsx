"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Plus, Save, Trash2, X } from "lucide-react";
import type { AvisoPlain } from "@/lib/data";
import { AVISO_STYLES, TIPOS_AVISO } from "@/lib/tipos-aviso";

type FormState = {
  titulo: string;
  mensaje: string;
  tipo: string;
  fechaEvento: string;
  activo: boolean;
};

function emptyForm(): FormState {
  return { titulo: "", mensaje: "", tipo: "Informativo", fechaEvento: "", activo: true };
}

function avisoToForm(a: AvisoPlain): FormState {
  return {
    titulo: a.titulo,
    mensaje: a.mensaje,
    tipo: a.tipo,
    fechaEvento: a.fechaEvento ? a.fechaEvento.slice(0, 10) : "",
    activo: a.activo,
  };
}

export default function AvisosManager({ avisos }: { avisos: AvisoPlain[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startCreate() {
    setForm(emptyForm());
    setCreating(true);
    setEditingId(null);
    setError(null);
  }

  function startEdit(a: AvisoPlain) {
    setForm(avisoToForm(a));
    setEditingId(a._id);
    setCreating(false);
    setError(null);
  }

  function cancel() {
    setCreating(false);
    setEditingId(null);
    setError(null);
  }

  async function handleSave() {
    if (!form.titulo.trim() || !form.mensaje.trim()) {
      setError("Título y mensaje son obligatorios");
      return;
    }
    setSaving(true);
    setError(null);

    const url = editingId ? `/api/avisos/${editingId}` : "/api/avisos";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar el aviso");
      return;
    }

    cancel();
    router.refresh();
  }

  async function toggleActivo(a: AvisoPlain) {
    await fetch(`/api/avisos/${a._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...avisoToForm(a), activo: !a.activo }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este aviso?")) return;
    await fetch(`/api/avisos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const formulario = creating || editingId ? (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-slate-900">
          {editingId ? "Editar aviso" : "Nuevo aviso"}
        </h3>
        <button onClick={cancel} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">Título</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Tipo</label>
          <select
            value={form.tipo}
            onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {TIPOS_AVISO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Fecha (opcional)</label>
          <input
            type="date"
            value={form.fechaEvento}
            onChange={(e) => setForm((f) => ({ ...f, fechaEvento: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="text-sm font-medium text-slate-700">Mensaje</label>
          <textarea
            value={form.mensaje}
            onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300"
            />
            Visible en el sitio público
          </label>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar"}
        </button>
        <button onClick={cancel} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
          Cancelar
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{avisos.length} aviso(s)</p>
        {!creating && !editingId && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" /> Nuevo aviso
          </button>
        )}
      </div>

      {creating && formulario}

      <div className="space-y-3">
        {avisos.map((a) =>
          editingId === a._id ? (
            <div key={a._id}>{formulario}</div>
          ) : (
            <div key={a._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${AVISO_STYLES[a.tipo as keyof typeof AVISO_STYLES]?.badge ?? "bg-slate-100 text-slate-600"}`}>
                    {a.tipo}
                  </span>
                  {!a.activo && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Oculto</span>
                  )}
                  {a.fechaEvento && (
                    <span className="text-xs text-slate-500">{new Date(a.fechaEvento).toLocaleDateString("es-CO")}</span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900">{a.titulo}</p>
                <p className="text-sm text-slate-500">{a.mensaje}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActivo(a)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                  aria-label={a.activo ? "Ocultar" : "Mostrar"}
                >
                  {a.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => startEdit(a)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ),
        )}
        {avisos.length === 0 && !creating && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Aún no hay avisos.
          </p>
        )}
      </div>
    </div>
  );
}
