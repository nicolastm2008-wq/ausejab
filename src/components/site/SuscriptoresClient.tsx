"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCw } from "lucide-react";
import type { SuscriptorPlain } from "@/lib/data";

const SECTORES = ["Todos", "Barroblanco", "Los Chaves", "La Cruz", "Centro", "Los Pinos", "Caselata"];

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function SuscriptoresClient({
  suscriptores,
  sectorColors,
}: {
  suscriptores: SuscriptorPlain[];
  sectorColors: Record<string, string>;
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
        s.predios.some((p) => normalize(p).includes(q))
      );
    });
  }, [suscriptores, query, sector]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  function handleQuery(v: string) {
    setQuery(v);
    setPage(1);
  }
  function handleSector(v: string) {
    setSector(v);
    setPage(1);
  }

  return (
    <div className="mt-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar nombre, cédula o predio…"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-soft placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SECTORES.map((s) => (
            <button
              key={s}
              onClick={() => handleSector(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${
                sector === s
                  ? (sectorColors[s] ?? "bg-brand-600 text-white ring-brand-600") + " !bg-brand-600 !text-white !ring-brand-600"
                  : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500 mb-3">
        {filtered.length === suscriptores.length
          ? `${suscriptores.length} asociados en total`
          : `${filtered.length} de ${suscriptores.length} asociados`}
        {totalPages > 1 && ` — página ${currentPage} de ${totalPages}`}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Cédula</th>
              <th className="px-4 py-3 text-left">Predios</th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">Sector</th>
              <th className="px-4 py-3 text-center hidden md:table-cell">Estado docs.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slice.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  Sin resultados para &ldquo;{query}&rdquo;
                </td>
              </tr>
            ) : (
              slice.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 capitalize">{s.nombre.toLowerCase()}</p>
                    {s.necesitaActualizar && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                        <RefreshCw className="h-3 w-3" /> Actualizar datos
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 hidden sm:table-cell">{s.cedula || "—"}</td>
                  <td className="px-4 py-3">
                    {s.predios.length === 0 ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {s.predios.map((p, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 capitalize"
                          >
                            {p.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${sectorColors[s.sector] ?? "bg-slate-50 text-slate-700 ring-slate-200"}`}>
                      {s.sector}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    {s.requisitos === "COMPLETO" ? (
                      <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Completo
                      </span>
                    ) : s.requisitos ? (
                      <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 ring-1 ring-amber-200">
                        Req. {s.requisitos}
                      </span>
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
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50"
          >
            Anterior
          </button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const pg = currentPage <= 4 ? i + 1 : currentPage - 3 + i;
            if (pg < 1 || pg > totalPages) return null;
            return (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  pg === currentPage
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                {pg}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
