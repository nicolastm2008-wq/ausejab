import { getConfiguracion } from "@/lib/data";
import LegalForm from "@/components/panel/LegalForm";

export const metadata = { title: "Legal" };

export default async function PanelLegalPage() {
  const config = await getConfiguracion();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Política de datos y términos</h1>
      <p className="mt-1 text-sm text-slate-500">
        Estos textos se muestran en las páginas públicas de política de tratamiento de datos y
        términos y condiciones.
      </p>
      <div className="mt-6 max-w-3xl">
        <LegalForm politicaDatos={config.politicaDatos} terminosCondiciones={config.terminosCondiciones} />
      </div>
    </div>
  );
}
