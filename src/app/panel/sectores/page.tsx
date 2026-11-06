import { getPredios } from "@/lib/data";
import SectoresImportador from "@/components/panel/SectoresImportador";
import SectoresManager from "@/components/panel/SectoresManager";

export const metadata = { title: "Sectores" };

export default async function PanelSectoresPage() {
  const predios = await getPredios();

  const porSector = predios.reduce<Record<string, number>>((acc, p) => {
    acc[p.sector] = (acc[p.sector] ?? 0) + 1;
    return acc;
  }, {});
  const sectorList = Object.entries(porSector).sort((a, b) => b[1] - a[1]);
  const pendientes = predios.filter((p) => p.necesitaActualizar).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Sectores</h1>
      <p className="mt-1 text-sm text-slate-500">
        Usuarios y predios del acueducto agrupados por sector. Se puede buscar, filtrar y mantener todo desde aquí.
      </p>

      {/* Resumen por sector */}
      {sectorList.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {sectorList.map(([sector, count]) => (
            <span
              key={sector}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-soft"
            >
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              {sector}
              <span className="ml-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                {count}
              </span>
            </span>
          ))}
          {pendientes > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              ⚠ {pendientes} pendiente{pendientes !== 1 ? "s" : ""} de actualizar
            </span>
          )}
        </div>
      )}

      <div className="mt-6">
        <SectoresImportador />
      </div>

      <div className="mt-6">
        <SectoresManager predios={predios} />
      </div>
    </div>
  );
}
