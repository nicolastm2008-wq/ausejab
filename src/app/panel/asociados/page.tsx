import { getSuscriptores, getEstadisticasSuscriptores } from "@/lib/data";
import AsociadosClient from "@/components/panel/AsociadosClient";

export const metadata = { title: "Asociados" };
export const dynamic = "force-dynamic";

export default async function PanelAsociadosPage() {
  const [suscriptores, stats] = await Promise.all([
    getSuscriptores(),
    getEstadisticasSuscriptores(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Asociados y predios</h1>
      <p className="mt-1 text-sm text-slate-500">
        Registro completo de asociados del acueducto. Datos privados — solo visible para el equipo interno.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft text-center">
          <p className="text-3xl font-bold text-slate-900">{stats.total.toLocaleString("es-CO")}</p>
          <p className="text-sm text-slate-500 mt-1">Asociados</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft text-center">
          <p className="text-3xl font-bold text-slate-900">{stats.totalPredios.toLocaleString("es-CO")}</p>
          <p className="text-sm text-slate-500 mt-1">Predios</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft text-center">
          <p className="text-3xl font-bold text-slate-900">{stats.porSector.length}</p>
          <p className="text-sm text-slate-500 mt-1">Sectores</p>
        </div>
      </div>

      <div className="mt-8">
        <AsociadosClient suscriptores={suscriptores} porSector={stats.porSector} />
      </div>
    </div>
  );
}
