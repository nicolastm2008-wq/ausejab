"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCw, Download } from "lucide-react";
import type { SuscriptorPlain } from "@/lib/data";

const SECTORES = ["Todos", "Barroblanco", "Los Chaves", "La Cruz", "Centro", "Los Pinos", "Caselata"];

const SECTOR_COLOR: Record<string, string> = {
  Barroblanco: "bg-brand-50 text-brand-700 ring-brand-200",
  "Los Chaves": "bg-sky-50 text-sky-700 ring-sky-200",
  "La Cruz": "bg-violet-50 text-violet-700 ring-violet-200",
  Centro: "bg-amber-50 text-amber-700 ring-amber-200",
  "Los Pinos": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Caselata: "bg-rose-50 text-rose-700 ring-rose-200",
};

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function AsociadosClient({
  suscriptores,
  porSector,
}: {
  suscriptores: SuscriptorPlain[];
  porSector: { sector: string; count: number; predios: number }[];
}) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("Todos");
  const [page, setPage] = useState(1);
  const PER_PAGE = 50;

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return suscriptores.filter((s) => {
      if (sector !== "Todos" && s.sector !== sector) return false;
      if (!q) return true;
      return (
        normalize(s.nombre).includes(q) ||
        s.cedula.includes(q) ||
        s.predios.some((p) => normalize(p).includes(q)) ||
        (s.telefono && s.telefono.includes(q))
      );
    });
  }, [suscriptores, query, sector]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  function handleQuery(v: string) { setQuery(v); setPage(1); }
  function handleSector(v: string) { setSector(v); setPage(1); }

  function exportCSV() {
    const header = "Nombre,Cédula,Teléfono,Email,Sector,Predios,Requisitos,Actualizar\n";
    const rows = filtered.map((s) =>
      [
        `"${s.nombre}"`,
        s.cedula,
        s.telefono,
        s.email,
        s.sector,
        `"${s.predios.join("; ")}"`,
        s.requisitos,
        s.necesitaActualizar ? "Sí" : "No",
      ].join(",")
    );
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asociados-ausavesjab-${sector.toLowerCase().replace(/ /g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Sector mini-cards */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-6">
        {porSector.map((s) => (
          <button
            key={s.sector}
            onClick={() => handleSector(s.sector)}
            className={`rounded-xl border p-3 text-left transition-all ${
              sector === s.sector
                ? "border-brand-400 bg-brand-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${SECTOR_COLOR[s.sector] ?? "bg-slate-50 text-slate-700 ring-slate-200"}`}>
              {s.sector}
            </span>
            <p className="mt-2 text-lg font-bold text-slate-900">{s.count}</p>
            <p className="text-xs text-slate-500">{s.predios} predios</p>
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Nombre, cédula, teléfono o predio…"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SECTORES.map((s) => (
            <button
              key={s}
              onClick={() => handleSector(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${
                sector === s
                  ? "bg-brand-600 text-white ring-brand-600"
                  : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shrink-0"
        >
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        {filtered.length === suscriptores.length
          ? `${suscriptores.length} asociados`
          : `${filtered.length} de ${suscriptores.length}`}
        {totalPages > 1 && ` — pág. ${currentPage}/${totalPages}`}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Cédula</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Teléfono</th>
              <th className="px-4 py-3 text-left">Predios</th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">Sector</th>
              <th className="px-4 py-3 text-center hidden md:table-cell">Docs.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slice.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">Sin resultados</td>
              </tr>
            ) : (
              slice.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-slate-900 capitalize">{s.nombre.toLowerCase()}</p>
                    {s.necesitaActualizar && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <RefreshCw className="h-3 w-3" /> Actualizar
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-600 hidden sm:table-cell">{s.cedula || "—"}</td>
                  <td className="px-4 py-2.5 text-slate-600 hidden md:table-cell">{s.telefono || "—"}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {s.predios.length === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        s.predios.map((p, i) => (
                          <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 capitalize">
                            {p.toLowerCase()}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 hidden lg:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${SECTOR_COLOR[s.sector] ?? "bg-slate-50 text-slate-700 ring-slate-200"}`}>
                      {s.sector}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center hidden md:table-cell">
                    {s.requisitos === "COMPLETO" ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">✓</span>
                    ) : s.requisitos ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 ring-1 ring-amber-200">{s.requisitos}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50">
            Anterior
          </button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const pg = currentPage <= 4 ? i + 1 : currentPage - 3 + i;
            if (pg < 1 || pg > totalPages) return null;
            return (
              <button key={pg} onClick={() => setPage(pg)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${pg === currentPage ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 hover:bg-slate-50"}`}>
                {pg}
              </button>
            );
          })}
          <button disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
