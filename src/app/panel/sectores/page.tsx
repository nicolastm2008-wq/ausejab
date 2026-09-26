import { getPredios } from "@/lib/data";
import SectoresImportador from "@/components/panel/SectoresImportador";
import SectoresManager from "@/components/panel/SectoresManager";

export const metadata = { title: "Sectores" };

export default async function PanelSectoresPage() {
  const predios = await getPredios();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Sectores</h1>
      <p className="mt-1 text-sm text-slate-500">
        Usuarios y predios del acueducto agrupados por sector. Reemplaza el Excel de sectores: se
        puede buscar, filtrar y mantener todo desde aquí.
      </p>

      <div className="mt-6">
        <SectoresImportador />
      </div>

      <div className="mt-6">
        <SectoresManager predios={predios} />
      </div>
    </div>
  );
}
