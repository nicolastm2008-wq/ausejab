import { BookOpen, Compass, Target } from "lucide-react";
import { getConfiguracion } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Nuestra historia" };

export default async function HistoriaPage() {
  const config = await getConfiguracion();
  const parrafos = config.resenaHistorica.split(/\n+/).filter(Boolean);

  return (
    <div>
      <PageHero
        eyebrow={`Desde ${config.anioFundacion}`}
        title="Nuestra historia"
        description={`El camino recorrido por ${config.siglas || config.nombre} para llevar agua potable a ${config.vereda}.`}
        imageSrc="/galeria-inicial/06.jpeg"
      />

      <section className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Reseña histórica" title="Cómo empezó todo" />
            <div className="prose-content mt-6">
              {parrafos.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <BookOpen className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold text-slate-900">Fundación</h3>
              <p className="mt-1 text-sm text-slate-600">
                Constituido en {config.anioFundacion} por la comunidad de {config.vereda}.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold text-slate-900">Misión</h3>
              <p className="mt-1 text-sm text-slate-600">{config.mision}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                <Compass className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold text-slate-900">Visión</h3>
              <p className="mt-1 text-sm text-slate-600">{config.vision}</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
