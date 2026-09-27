import Link from "next/link";
import { CalendarRange, Users } from "lucide-react";
import { getConfiguracion, getJuntas, type JuntaPlain } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Juntas Directivas" };

export default async function JuntasDirectivasPage() {
  const [config, juntas] = await Promise.all([getConfiguracion(), getJuntas()]);

  const anioActual = new Date().getFullYear();
  const periodos: { periodoInicio: number; periodoFin: number }[] = [];
  for (let inicio = config.anioFundacion; inicio < anioActual + 4; inicio += 4) {
    periodos.push({ periodoInicio: inicio, periodoFin: inicio + 4 });
  }
  periodos.reverse();

  const juntasPorPeriodo = new Map<number, JuntaPlain>();
  juntas.forEach((j) => juntasPorPeriodo.set(j.periodoInicio, j));

  return (
    <div>
      <PageHero
        eyebrow="Gobierno comunitario"
        title="Juntas Directivas"
        description={`Cada periodo dura 4 años y es elegido por la Asamblea General de usuarios, desde la fundación en ${config.anioFundacion} hasta hoy.`}
        imageSrc="/galeria-inicial/08.jpeg"
      />

      <section className="container-page py-14">
        <SectionHeading
          eyebrow="Línea de tiempo"
          title="Periodos administrativos"
          description="Cada color identifica a la junta de ese periodo."
        />

        <div className="relative mt-10 space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-slate-200 sm:before:left-6">
          {periodos.map((periodo) => {
            const junta = juntasPorPeriodo.get(periodo.periodoInicio);
            const color = junta?.colorAsociado ?? "#94a3b8";
            const vigente = periodo.periodoInicio <= anioActual && anioActual < periodo.periodoFin;

            return (
              <div key={periodo.periodoInicio} className="relative pl-12 sm:pl-16">
                <span
                  className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-soft sm:h-12 sm:w-12"
                  style={{ backgroundColor: color }}
                >
                  <CalendarRange className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
                    <p className="font-display text-base font-semibold text-slate-900">
                      Periodo {periodo.periodoInicio} &ndash; {periodo.periodoFin}
                    </p>
                    {vigente && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Junta vigente
                      </span>
                    )}
                  </div>

                  <div className="px-5 py-4">
                    {!junta && (
                      <p className="text-sm text-slate-500">
                        Este periodo aún no ha sido registrado.{" "}
                        <Link href="/panel" className="font-medium text-brand-700 hover:underline">
                          Se puede cargar desde el panel privado.
                        </Link>
                      </p>
                    )}

                    {junta && junta.miembros.length === 0 && (
                      <p className="text-sm text-slate-500">
                        Periodo registrado, pero aún sin integrantes cargados.
                      </p>
                    )}

                    {junta && junta.miembros.length > 0 && (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {junta.miembros.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                              style={{ backgroundColor: color }}
                            >
                              {m.nombre.charAt(0)}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{m.nombre}</p>
                              <p className="text-xs text-slate-500">{m.cargo}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {junta?.notas && (
                      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                        {junta.notas}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <Users className="h-5 w-5 shrink-0 text-brand-600" />
          <p className="text-sm text-slate-600">
            ¿Falta un periodo o un integrante? El equipo interno puede agregarlo, editarlo o
            asignarle un color desde el <Link href="/panel" className="font-medium text-brand-700 hover:underline">panel privado</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
