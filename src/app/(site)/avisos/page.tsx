import { Megaphone } from "lucide-react";
import { getAvisos } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/site/PageHero";
import { AVISO_STYLES, type TipoAviso } from "@/lib/tipos-aviso";

export const metadata = { title: "Avisos" };

export default async function AvisosPage() {
  const avisos = (await getAvisos()).filter((a) => a.activo);

  return (
    <div>
      <PageHero
        eyebrow="Comunicados"
        eyebrowIcon={<Megaphone className="h-3.5 w-3.5" />}
        title="Avisos"
        description="Cortes programados, mantenimientos, la próxima asamblea y demás novedades del acueducto."
        imageSrc="/galeria-inicial/023.jpeg"
      />

      <section className="container-page py-14">
        <SectionHeading eyebrow="Comunicados vigentes" title="Todos los avisos activos" />

        {avisos.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-600">No hay avisos activos por el momento.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {avisos.map((a) => (
              <div key={a._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${AVISO_STYLES[a.tipo as TipoAviso]?.badge ?? "bg-slate-100 text-slate-600"}`}>
                    {a.tipo}
                  </span>
                  {a.fechaEvento && (
                    <span className="text-xs text-slate-500">
                      {new Date(a.fechaEvento).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>
                <p className="mt-2 font-display text-base font-semibold text-slate-900">{a.titulo}</p>
                <p className="mt-1 text-sm text-slate-600">{a.mensaje}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
