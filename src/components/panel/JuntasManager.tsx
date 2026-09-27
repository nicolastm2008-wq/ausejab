"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, Users, X } from "lucide-react";
import type { JuntaPlain } from "@/lib/data";

type Miembro = { nombre: string; cargo: string };
type FormState = {
  periodoInicio: string;
  periodoFin: string;
  colorAsociado: string;
  activa: boolean;
  notas: string;
  miembros: Miembro[];
};

const CARGOS_SUGERIDOS = ["Presidente", "Vicepresidente", "Tesorero", "Secretario", "Vocal", "Fiscal"];

function juntaToForm(junta?: JuntaPlain): FormState {
  return {
    periodoInicio: junta ? String(junta.periodoInicio) : "",
    periodoFin: junta ? String(junta.periodoFin) : "",
    colorAsociado: junta?.colorAsociado ?? "#1c65c9",
    activa: junta?.activa ?? false,
    notas: junta?.notas ?? "",
    miembros: junta?.miembros?.length ? junta.miembros.map((m) => ({ ...m })) : [{ nombre: "", cargo: "Presidente" }],
  };
}

export default function JuntasManager({ juntas }: { juntas: JuntaPlain[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(juntaToForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startCreate() {
    setForm(juntaToForm());
    setCreating(true);
    setEditingId(null);
    setError(null);
  }

  function startEdit(junta: JuntaPlain) {
    setForm(juntaToForm(junta));
    setEditingId(junta._id);
    setCreating(false);
    setError(null);
  }

  function cancel() {
    setCreating(false);
    setEditingId(null);
    setError(null);
  }

  function updateMiembro(index: number, field: keyof Miembro, value: string) {
    setForm((f) => ({
      ...f,
      miembros: f.miembros.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    }));
  }

  function addMiembro() {
    setForm((f) => ({ ...f, miembros: [...f.miembros, { nombre: "", cargo: "Vocal" }] }));
  }

  function removeMiembro(index: number) {
    setForm((f) => ({ ...f, miembros: f.miembros.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const payload = {
      periodoInicio: Number(form.periodoInicio),
      periodoFin: Number(form.periodoFin),
      colorAsociado: form.colorAsociado,
      activa: form.activa,
      notas: form.notas,
      miembros: form.miembros.filter((m) => m.nombre.trim()),
    };

    if (!payload.periodoInicio || !payload.periodoFin) {
      setError("Los años de inicio y fin del periodo son obligatorios");
      setSaving(false);
      return;
    }

    const url = editingId ? `/api/juntas/${editingId}` : "/api/juntas";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar la junta");
      return;
    }

    cancel();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta junta directiva? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/juntas/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const editorForm = creating || editingId ? (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-slate-900">
          {editingId ? "Editar junta directiva" : "Nueva junta directiva"}
        </h3>
        <button onClick={cancel} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Año inicio</label>
          <input
            type="number"
            value={form.periodoInicio}
            onChange={(e) => setForm((f) => ({ ...f, periodoInicio: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Año fin</label>
          <input
            type="number"
            value={form.periodoFin}
            onChange={(e) => setForm((f) => ({ ...f, periodoFin: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Color asociado</label>
          <input
            type="color"
            value={form.colorAsociado}
            onChange={(e) => setForm((f) => ({ ...f, colorAsociado: e.target.value }))}
            className="mt-1 h-9 w-full rounded-lg border border-slate-300"
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.activa}
              onChange={(e) => setForm((f) => ({ ...f, activa: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300"
            />
            Junta vigente
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-slate-700">Integrantes</label>
        <div className="mt-2 space-y-2">
          {form.miembros.map((m, idx) => (
            <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <input
                type="text"
                placeholder="Nombre completo"
                value={m.nombre}
                onChange={(e) => updateMiembro(idx, "nombre", e.target.value)}
                className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm sm:flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  list="cargos-sugeridos"
                  placeholder="Cargo"
                  value={m.cargo}
                  onChange={(e) => updateMiembro(idx, "cargo", e.target.value)}
                  className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-40"
                />
                <button
                  type="button"
                  onClick={() => removeMiembro(idx)}
                  className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <datalist id="cargos-sugeridos">
          {CARGOS_SUGERIDOS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <button
          type="button"
          onClick={addMiembro}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Agregar integrante
        </button>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-slate-700">Notas (opcional)</label>
        <textarea
          value={form.notas}
          onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
          rows={2}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
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
        <p className="text-sm text-slate-500">{juntas.length} periodo(s) registrados</p>
        {!creating && !editingId && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" /> Nueva junta
          </button>
        )}
      </div>

      {creating && editorForm}

      <div className="space-y-4">
        {juntas.map((junta) => (
          <div key={junta._id}>
            {editingId === junta._id ? (
              editorForm
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                <div className="h-1.5 w-full" style={{ backgroundColor: junta.colorAsociado }} />
                <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-display text-base font-semibold text-slate-900">
                      {junta.periodoInicio} - {junta.periodoFin}
                      {junta.activa && (
                        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Vigente
                        </span>
                      )}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <Users className="h-3.5 w-3.5" /> {junta.miembros.length} integrante(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(junta)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(junta._id)}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {juntas.length === 0 && !creating && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Aún no hay juntas registradas.
          </p>
        )}
      </div>
    </div>
  );
}
