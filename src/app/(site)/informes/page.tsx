import Link from "next/link";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { getInformes } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Documentos y Transparencia" };

function formatBytes(bytes: number) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default async function InformesPage() {
  const informes = await getInformes();

  const anios = Array.from(new Set(informes.map((i) => i.anio))).sort((a, b) => b - a);

  return (
    <div>
      <PageHero
        eyebrow="Transparencia"
        eyebrowIcon={<ShieldCheck className="h-3.5 w-3.5" />}
        title="Documentos y transparencia"
        description="Estatutos, actas de asamblea, certificado de Cámara de Comercio, declaraciones DIAN e informes financieros, organizados por año. Documentos públicos para consulta y descarga de toda la comunidad."
        imageSrc="/galeria-inicial/017.jpeg"
      />

      <section className="container-page py-14">
        <SectionHeading eyebrow="Documentos públicos" title="Todos los informes" />

        {informes.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm text-slate-600">
              Todavía no hay documentos publicados. El equipo interno puede subir los PDF
              (estatutos, actas, Cámara de Comercio, DIAN, financieros) desde el{" "}
              <Link href="/panel" className="font-medium text-brand-700 hover:underline">
                panel privado
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {anios.map((anio) => (
              <div key={anio}>
                <h3 className="font-display text-lg font-semibold text-slate-900">{anio}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {informes
                    .filter((i) => i.anio === anio)
                    .map((inf) => (
                      <a
                        key={inf._id}
                        href={inf.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                            <FileText className="h-5 w-5" />
                          </span>
                          <Download className="h-4 w-4 text-slate-400 transition-colors group-hover:text-brand-700" />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                            {inf.tipo}
                          </p>
                          <p className="mt-0.5 font-medium text-slate-900">{inf.titulo}</p>
                          {inf.descripcion && (
                            <p className="mt-1 text-xs text-slate-500">{inf.descripcion}</p>
                          )}
                        </div>
                        {inf.tamanioBytes > 0 && (
                          <span className="text-xs text-slate-400">{formatBytes(inf.tamanioBytes)}</span>
                        )}
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
