import { getJuntas } from "@/lib/data";
import JuntasManager from "@/components/panel/JuntasManager";

export const metadata = { title: "Juntas directivas" };

export default async function PanelJuntasPage() {
  const juntas = await getJuntas();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Juntas directivas</h1>
      <p className="mt-1 text-sm text-slate-500">
        Registra cada periodo de 4 años desde la fundación, sus integrantes y un color de identificación.
      </p>
      <div className="mt-6">
        <JuntasManager juntas={juntas} />
      </div>
    </div>
  );
}
