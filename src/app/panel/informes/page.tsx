import { getInformes } from "@/lib/data";
import InformesManager from "@/components/panel/InformesManager";

export const metadata = { title: "Informes DIAN" };

export default async function PanelInformesPage() {
  const informes = await getInformes();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Informes y transparencia</h1>
      <p className="mt-1 text-sm text-slate-500">
        Sube las declaraciones DIAN, informes financieros y actas de asamblea. Quedan visibles para toda la comunidad.
      </p>
      <div className="mt-6">
        <InformesManager informes={informes} />
      </div>
    </div>
  );
}
