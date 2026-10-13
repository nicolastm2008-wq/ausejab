import { Users, MapPin, Home, RefreshCw } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSuscriptores, getEstadisticasSuscriptores } from "@/lib/data";
import SuscriptoresClient from "@/components/site/SuscriptoresClient";

export const metadata = { title: "Asociados y Predios" };
export const dynamic = "force-dynamic";

const SECTOR_COLORS: Record<string, string> = {
  Barroblanco: "bg-brand-50 text-brand-700 ring-brand-200",
  "Los Chaves": "bg-aqua-50 text-aqua-700 ring-aqua-200",
  "La Cruz": "bg-violet-50 text-violet-700 ring-violet-200",
  Centro: "bg-amber-50 text-amber-700 ring-amber-200",
  "Los Pinos": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Caselata: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default async function SuscriptoresPage() {
  const [suscriptores, stats] = await Promise.all([
    getSuscriptores(),
    getEstadisticasSuscriptores(),
  ]);

  return (
    <div>
      <PageHero
        eyebrow="Registro oficial"
        eyebrowIcon={<Users className="h-3 w-3" />}
        title="Asociados y Predios"
        description="Directorio de asociados del acueducto comunitario AUSAVESJAB organizados por sector."
      />

      <section className="container-page py-12">
        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 mx-auto">
              <Users className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-bold text-slate-900">{stats.total.toLocaleString("es-CO")}</p>
            <p className="text-sm text-slate-500 mt-1">Asociados registrados</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mx-auto">
              <Home className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-bold text-slate-900">{stats.totalPredios.toLocaleString("es-CO")}</p>
            <p className="text-sm text-slate-500 mt-1">Predios registrados</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700 mx-auto">
              <MapPin className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-bold text-slate-900">{stats.porSector.length}</p>
            <p className="text-sm text-slate-500 mt-1">Sectores atendidos</p>
          </div>
        </div>

        {/* Per-sector summary */}
        <SectionHeading eyebrow="Cobertura" title="Distribución por sector" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {stats.porSector.map((s) => (
            <div key={s.sector} className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${SECTOR_COLORS[s.sector] ?? "bg-slate-50 text-slate-700 ring-slate-200"}`}>
                  {s.sector}
                </span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.count}</p>
                  <p className="text-slate-500">asociados</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.predios}</p>
                  <p className="text-slate-500">predios</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full directory with client-side search/filter */}
        <SectionHeading
          eyebrow="Directorio"
          title="Listado de asociados"
          description="Busca por nombre, cédula o predio"
        />
        <SuscriptoresClient suscriptores={suscriptores} sectorColors={SECTOR_COLORS} />
      </section>
    </div>
  );
}
