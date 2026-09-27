"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import type { PredioPlain } from "@/lib/data";
import { ESTADOS_PREDIO } from "@/lib/predio-fields";

type FormState = {
  nombreUsuario: string;
  sector: string;
  predio: string;
  vereda: string;
  codigoMedidor: string;
  estado: string;
  telefono: string;
  notas: string;
};

const ESTADO_STYLES: Record<string, string> = {
  Activo: "bg-emerald-50 text-emerald-700",
  Inactivo: "bg-slate-100 text-slate-600",
  Suspendido: "bg-amber-50 text-amber-700",
  Retirado: "bg-red-50 text-red-700",
};

function emptyForm(): FormState {
  return {
    nombreUsuario: "",
    sector: "",
    predio: "",
    vereda: "",
    codigoMedidor: "",
    estado: "Activo",
    telefono: "",
    notas: "",
  };
}

function predioToForm(p: PredioPlain): FormState {
  return {
    nombreUsuario: p.nombreUsuario,
    sector: p.sector,
    predio: p.predio,
    vereda: p.vereda,
    codigoMedidor: p.codigoMedidor,
    estado: p.estado || "Activo",
    telefono: p.telefono,
    notas: p.notas,
  };
}

export default function SectoresManager({ predios }: { predios: PredioPlain[] }) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [filtroSector, setFiltroSector] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectores = useMemo(
    () => Array.from(new Set(predios.map((p) => p.sector))).sort((a, b) => a.localeCompare(b)),
    [predios],
  );

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return predios.filter((p) => {
      if (filtroSector && p.sector !== filtroSector) return false;
      if (filtroEstado && p.estado !== filtroEstado) return false;
      if (!q) return true;
      return (
        p.nombreUsuario.toLowerCase().includes(q) ||
        p.predio.toLowerCase().includes(q) ||
        p.codigoMedidor.toLowerCase().includes(q) ||
        p.vereda.toLowerCase().includes(q)
      );
    });
  }, [predios, busqueda, filtroSector, filtroEstado]);

  function startCreate() {
    setForm(emptyForm());
    setCreating(true);
    setEditingId(null);
    setError(null);
  }

  function startEdit(p: PredioPlain) {
    setForm(predioToForm(p));
    setEditingId(p._id);
    setCreating(false);
    setError(null);
  }

  function cancel() {
    setCreating(false);
    setEditingId(null);
    setError(null);
  }

  async function handleSave() {
    if (!form.nombreUsuario.trim() || !form.sector.trim()) {
      setError("Nombre del usuario y sector son obligatorios");
      return;
    }
    setSaving(true);
    setError(null);

    const url = editingId ? `/api/sectores/${editingId}` : "/api/sectores";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar el registro");
      return;
    }

    cancel();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este registro del sector? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/sectores/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const form_ = creating || editingId ? (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-slate-900">
          {editingId ? "Editar registro" : "Nuevo registro"}
        </h3>
        <button onClick={cancel} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-slate-700">Nombre del usuario</label>
          <input
            type="text"
            value={form.nombreUsuario}
            onChange={(e) => setForm((f) => ({ ...f, nombreUsuario: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Sector</label>
          <input
            type="text"
            value={form.sector}
            onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
            list="sectores-existentes"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <datalist id="sectores-existentes">
            {sectores.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Estado</label>
          <select
            value={form.estado}
            onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {ESTADOS_PREDIO.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Predio / dirección</label>
          <input
            type="text"
            value={form.predio}
            onChange={(e) => setForm((f) => ({ ...f, predio: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Vereda</label>
          <input
            type="text"
            value={form.vereda}
            onChange={(e) => setForm((f) => ({ ...f, vereda: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Código de medidor</label>
          <input
            type="text"
            value={form.codigoMedidor}
            onChange={(e) => setForm((f) => ({ ...f, codigoMedidor: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Teléfono</label>
          <input
            type="text"
            value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-sm font-medium text-slate-700">Notas (opcional)</label>
          <textarea
            value={form.notas}
            onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
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
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:min-w-[200px] sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, predio, medidor o vereda..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={filtroSector}
          onChange={(e) => setFiltroSector(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-auto"
        >
          <option value="">Todos los sectores</option>
          {sectores.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-auto"
        >
          <option value="">Todos los estados</option>
          {ESTADOS_PREDIO.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        {!creating && !editingId && (
          <button
            onClick={startCreate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Nuevo registro
          </button>
        )}
      </div>

      {creating && form_}

      <p className="text-sm text-slate-500">
        {filtrados.length} de {predios.length} registro(s)
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Sector</th>
              <th className="px-4 py-3 font-medium">Predio</th>
              <th className="px-4 py-3 font-medium">Medidor</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.map((p) =>
              editingId === p._id ? (
                <tr key={p._id}>
                  <td colSpan={6} className="p-4">
                    {form_}
                  </td>
                </tr>
              ) : (
                <tr key={p._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.nombreUsuario}</td>
                  <td className="px-4 py-3 text-slate-600">{p.sector}</td>
                  <td className="px-4 py-3 text-slate-600">{p.predio || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{p.codigoMedidor || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_STYLES[p.estado] ?? "bg-slate-100 text-slate-600"}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-700"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="rounded-full p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  No hay registros que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
