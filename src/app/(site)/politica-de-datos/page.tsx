import { ShieldCheck } from "lucide-react";
import { getConfiguracion } from "@/lib/data";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Política de Datos" };

export default async function PoliticaDatosPage() {
  const config = await getConfiguracion();
  const parrafos = config.politicaDatos.split(/\n+/).filter(Boolean);
  const actualizado = new Date(config.updatedAt as unknown as string).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <PageHero
        eyebrow="Legal"
        eyebrowIcon={<ShieldCheck className="h-3.5 w-3.5" />}
        title="Política de tratamiento de datos"
      />

      <section className="container-page py-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Última actualización: {actualizado}
          </p>
          <div className="prose-content mt-4">
            {parrafos.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
