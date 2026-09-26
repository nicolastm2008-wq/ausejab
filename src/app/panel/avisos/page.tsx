import { getAvisos } from "@/lib/data";
import AvisosManager from "@/components/panel/AvisosManager";

export const metadata = { title: "Avisos" };

export default async function PanelAvisosPage() {
  const avisos = await getAvisos();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Avisos</h1>
      <p className="mt-1 text-sm text-slate-500">
        Cortes programados, mantenimientos, la próxima asamblea o cualquier novedad. El aviso activo
        más próximo se muestra como banner en todo el sitio público.
      </p>
      <div className="mt-6">
        <AvisosManager avisos={avisos} />
      </div>
    </div>
  );
}
