import { getConfiguracion } from "@/lib/data";
import ConfiguracionForm from "@/components/panel/ConfiguracionForm";

export const metadata = { title: "Identidad e historia" };

export default async function PanelHistoriaPage() {
  const configuracion = await getConfiguracion();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Identidad e historia</h1>
      <p className="mt-1 text-sm text-slate-500">
        Esta información se muestra en el sitio público: inicio, reseña histórica y contacto.
      </p>
      <div className="mt-6 max-w-3xl">
        <ConfiguracionForm configuracion={configuracion} />
      </div>
    </div>
  );
}
