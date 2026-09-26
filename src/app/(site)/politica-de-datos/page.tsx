import { ShieldCheck } from "lucide-react";
import { getConfiguracion } from "@/lib/data";

export const metadata = { title: "Política de Datos" };

export default async function PoliticaDatosPage() {
  const config = await getConfiguracion();
  const parrafos = config.politicaDatos.split(/\n+/).filter(Boolean);

  return (
    <div>
      <section className="bg-brand-900 py-16 text-white">
        <div className="container-page">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Legal
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Política de tratamiento de datos
          </h1>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="prose-content max-w-3xl">
          {parrafos.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
