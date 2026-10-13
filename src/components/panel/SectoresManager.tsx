"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Download, Pencil, Plus, RefreshCw, Save, Search, Trash2, X } from "lucide-react";
import type { PredioPlain } from "@/lib/data";
import { ESTADOS_PREDIO } from "@/lib/predio-fields";

type FormState = {
  nombreUsuario: string; cedula: string; predio: string; sector: string;
  vereda: string; codigoMedidor: string; estado: string; telefono: string;
  email: string; requisitos: string; numInscripcion: string;
  necesitaActualizar: boolean; notas: string;
};

const ESTADO_STYLES: Record<string, string> = {
  Activo: "bg-emerald-50 text-emerald-700",
  Inactivo: "bg-slate-100 text-slate-600",
  Suspendido: "bg-amber-50 text-amber-700",
  Retirado: "bg-red-50 text-red-700",
};

const REQ_STYLE = (r: string) =>
  r === "COMPLETO"
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : r
    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
    : "";

function emptyForm(): FormState {
  return { nombreUsuario: "", cedula: "", predio: "", sector: "", vereda: "",
    codigoMedidor: "", estado: "Activo", telefono: "", email: "",
    requisitos: "", numInscripcion: "", necesitaActualizar: false, notas: "" };
}

function toForm(p: PredioPlain): FormState {
  return { nombreUsuario: p.nombreUsuario, cedula: p.cedula ?? "", predio: p.predio,
    sector: p.sector, vereda: p.vereda, codigoMedidor: p.codigoMedidor,
    estado: p.estado || "Activo", telefono: p.telefono, email: p.email ?? "",
    requisitos: p.requisitos ?? "", numInscripcion: p.numInscripcion ?? "",
    necesitaActualizar: p.necesitaActualizar ?? false, notas: p.notas };
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const PER_PAGE = 50;

export default function SectoresManager({ predios }: { predios: PredioPlain[] }) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [filtroSector, setFiltroSector] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [soloActualizar, setSoloActualizar] = useState(false);
  const [pagina, setPagina] = useState(1);

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sectores = useMemo(
    () => Array.from(new Set(predios.map((p) => p.sector))).sort((a, b) => a.localeCompare(b)),
    [predios],
  );

  const filtrados = useMemo(() => {
    const q = normalize(busqueda.trim());
    return predios.filter((p) => {
      if (filtroSector && p.sector !== filtroSector) return false;
      if (filtroEstado && p.estado !== filtroEstado) return false;
      if (soloActualizar && !p.necesitaActualizar) return false;
      if (!q) return true;
      return (
        normalize(p.nombreUsuario).includes(q) ||
        (p.cedula && p.cedula.includes(q)) ||
        normalize(p.predio).includes(q) ||
        (p.telefono && p.telefono.includes(q)) ||
        (p.email && normalize(p.email).includes(q)) ||
        normalize(p.codigoMedidor).includes(q)
      );
    });
  }, [predios, busqueda, filtroSector, filtroEstado, soloActualizar]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginaActual = Math.min(pagina, totalPaginas);
  const slice = filtrados.slice((paginaActual - 1) * PER_PAGE, paginaActual * PER_PAGE);

  function handleBusqueda(v: string) { setBusqueda(v); setPagina(1); }
  function handleFiltroSector(v: string) { setFiltroSector(v); setPagina(1); }

  function startCreate() {
    setForm(emptyForm()); setCreating(true); setEditingId(null); setError(null);
  }
  function startEdit(p: PredioPlain) {
    setForm(toForm(p)); setEditingId(p._id); setCreating(false); setError(null);
    setExpandedId(null);
  }
  function cancel() { setCreating(false); setEditingId(null); setError(null); }

  async function handleSave() {
    if (!form.nombreUsuario.trim() || !form.sector.trim()) {
      setError("Nombre y sector son obligatorios"); return;
    }
    setSaving(true); setError(null);
    const url = editingId ? `/api/sectores/${editingId}` : "/api/sectores";
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar"); return;
    }
    cancel(); router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este registro?")) return;
    await fetch(`/api/sectores/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function exportCSV() {
    const header = "Nombre,Cédula,Teléfono,Email,Sector,Predio,Vereda,Medidor,Estado,Requisitos,N°Inscripción,Actualizar,Notas\n";
    const rows = filtrados.map((p) =>
      [
        `"${p.nombreUsuario}"`, p.cedula, p.telefono, p.email, p.sector,
        `"${p.predio}"`, p.vereda, p.codigoMedidor, p.estado,
        p.requisitos, p.numInscripcion, p.necesitaActualizar ? "Sí" : "No",
        `"${(p.notas || "").replace(/"/g, '""')}"`,
      ].join(",")
    );
    const blob = new Blob(["﻿" + header + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `sectores-ausavesjab${filtroSector ? "-" + filtroSector.toLowerCase().replace(/ /g, "-") : ""}.csv`,
    });
    a.click(); URL.revokeObjectURL(a.href);
  }

  const formPanel = (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-slate-900">
          {editingId ? "Editar registro" : "Nuevo registro"}
        </h3>
        <button onClick={cancel} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Nombre del asociado *", key: "nombreUsuario" },
          { label: "Cédula", key: "cedula" },
          { label: "Sector *", key: "sector", datalist: "sectores-existentes" },
          { label: "Nombre del predio", key: "predio" },
          { label: "Teléfono", key: "telefono" },
          { label: "Correo electrónico", key: "email" },
          { label: "Vereda", key: "vereda" },
          { label: "Código de medidor", key: "codigoMedidor" },
          { label: "N° de inscripción", key: "numInscripcion" },
          { label: "Requisitos", key: "requisitos" },
        ].map(({ label, key, datalist }) => (
          <div key={key}>
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <input
              type="text"
              value={(form as unknown as Record<string, string>)[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              list={datalist}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium text-slate-700">Estado</label>
          <select
            value={form.estado}
            onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {ESTADOS_PREDIO.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            id="chk-actualizar"
            checked={form.necesitaActualizar}
            onChange={(e) => setForm((f) => ({ ...f, necesitaActualizar: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-brand-600"
          />
          <label htmlFor="chk-actualizar" className="text-sm font-medium text-slate-700">
            Requiere actualizar datos
          </label>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-sm font-medium text-slate-700">Notas</label>
          <textarea
            value={form.notas}
            onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <datalist id="sectores-existentes">
        {sectores.map((s) => <option key={s} value={s} />)}
      </datalist>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
          <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar"}
        </button>
        <button onClick={cancel} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
          Cancelar
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={busqueda} onChange={(e) => handleBusqueda(e.target.value)}
            placeholder="Nombre, cédula, teléfono, predio…"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm" />
        </div>
        <select value={filtroSector} onChange={(e) => handleFiltroSector(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">Todos los sectores</option>
          {sectores.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">Todos los estados</option>
          {ESTADOS_PREDIO.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" checked={soloActualizar} onChange={(e) => { setSoloActualizar(e.target.checked); setPagina(1); }}
            className="h-4 w-4 rounded border-slate-300 text-amber-600" />
          Solo pendientes de actualizar
        </label>
        <div className="flex gap-2 ml-auto">
          <button onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" /> CSV
          </button>
          {!creating && !editingId && (
            <button onClick={startCreate}
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
              <Plus className="h-4 w-4" /> Nuevo
            </button>
          )}
        </div>
      </div>

      {creating && formPanel}

      <p className="text-sm text-slate-500">
        {filtrados.length} de {predios.length} registro(s)
        {soloActualizar && ` — ${filtrados.filter((p) => p.necesitaActualizar).length} pendientes`}
        {totalPaginas > 1 && ` — pág. ${paginaActual}/${totalPaginas}`}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3 font-medium">Asociado</th>
              <th className="px-3 py-3 font-medium">Cédula</th>
              <th className="px-3 py-3 font-medium">Teléfono</th>
              <th className="px-3 py-3 font-medium">Sector</th>
              <th className="px-3 py-3 font-medium">Predio</th>
              <th className="px-3 py-3 font-medium">Requisitos</th>
              <th className="px-3 py-3 font-medium">Estado</th>
              <th className="px-3 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slice.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">Sin resultados.</td></tr>
            )}
            {slice.map((p) =>
              editingId === p._id ? (
                <tr key={p._id}>
                  <td colSpan={8} className="p-4">{formPanel}</td>
                </tr>
              ) : (
                <>
                  <tr key={p._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {expandedId === p._id ? <ChevronUp className="h-3 w-3 text-slate-400 shrink-0" /> : <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />}
                        <span className="font-medium text-slate-900">{p.nombreUsuario}</span>
                        {p.necesitaActualizar && <span title="Requiere actualización"><RefreshCw className="h-3 w-3 text-amber-500 shrink-0" /></span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-600 text-xs">{p.cedula || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-600">{p.telefono || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-600">{p.sector}</td>
                    <td className="px-3 py-2.5 text-slate-600">{p.predio || "—"}</td>
                    <td className="px-3 py-2.5">
                      {p.requisitos ? (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${REQ_STYLE(p.requisitos)}`}>
                          {p.requisitos === "COMPLETO" ? "✓ Completo" : `Req. ${p.requisitos}`}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_STYLES[p.estado] ?? "bg-slate-100 text-slate-600"}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => startEdit(p)}
                          className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-700" aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="rounded-full p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === p._id && (
                    <tr key={p._id + "-detail"} className="bg-slate-50/60">
                      <td colSpan={8} className="px-6 py-3">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs sm:grid-cols-3 lg:grid-cols-4">
                          {p.email && <div><span className="text-slate-400">Email:</span> <span className="text-slate-700">{p.email}</span></div>}
                          {p.numInscripcion && <div><span className="text-slate-400">N° inscripción:</span> <span className="text-slate-700">{p.numInscripcion}</span></div>}
                          {p.vereda && <div><span className="text-slate-400">Vereda:</span> <span className="text-slate-700">{p.vereda}</span></div>}
                          {p.codigoMedidor && <div><span className="text-slate-400">Medidor:</span> <span className="font-mono text-slate-700">{p.codigoMedidor}</span></div>}
                          {p.notas && <div className="col-span-2 lg:col-span-4"><span className="text-slate-400">Notas:</span> <span className="text-slate-700">{p.notas}</span></div>}
                          {!p.email && !p.numInscripcion && !p.vereda && !p.codigoMedidor && !p.notas && (
                            <span className="text-slate-400">Sin datos adicionales</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={paginaActual === 1} onClick={() => setPagina((p) => p - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50">Anterior</button>
          {Array.from({ length: Math.min(7, totalPaginas) }, (_, i) => {
            const pg = paginaActual <= 4 ? i + 1 : paginaActual - 3 + i;
            if (pg < 1 || pg > totalPaginas) return null;
            return (
              <button key={pg} onClick={() => setPagina(pg)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${pg === paginaActual ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 hover:bg-slate-50"}`}>
                {pg}
              </button>
            );
          })}
          <button disabled={paginaActual === totalPaginas} onClick={() => setPagina((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50">Siguiente</button>
        </div>
      )}
    </div>
  );
}
