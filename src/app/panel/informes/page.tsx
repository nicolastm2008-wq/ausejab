import { getInformes } from "@/lib/data";
import InformesManager from "@/components/panel/InformesManager";

export const metadata = { title: "Documentos" };

export default async function PanelInformesPage() {
  const informes = await getInformes();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Documentos y transparencia</h1>
      <p className="mt-1 text-sm text-slate-500">
        Sube estatutos, actas de asamblea, el certificado de Cámara de Comercio, declaraciones DIAN e
        informes financieros. Quedan visibles para toda la comunidad.
      </p>
      <div className="mt-6">
        <InformesManager informes={informes} />
      </div>
    </div>
  );
}
