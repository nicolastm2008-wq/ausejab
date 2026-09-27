import { Scale } from "lucide-react";
import { getConfiguracion } from "@/lib/data";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Términos y Condiciones" };

export default async function TerminosPage() {
  const config = await getConfiguracion();
  const parrafos = config.terminosCondiciones.split(/\n+/).filter(Boolean);
  const actualizado = new Date(config.updatedAt as unknown as string).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <PageHero eyebrow="Legal" eyebrowIcon={<Scale className="h-3.5 w-3.5" />} title="Términos y condiciones" />

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
