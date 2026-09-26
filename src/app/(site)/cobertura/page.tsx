import { MapPinned, Users } from "lucide-react";
import { getCobertura, getConfiguracion } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "Cobertura" };

export default async function CoberturaPage() {
  const [cobertura, config] = await Promise.all([getCobertura(), getConfiguracion()]);
  const totalUsuarios = cobertura.reduce((acc, c) => acc + c.usuarios, 0);

  return (
    <div>
      <section className="bg-brand-900 py-16 text-white">
        <div className="container-page">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-200">
            <MapPinned className="h-3.5 w-3.5" /> Zona de servicio
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Cobertura</h1>
          <p className="mt-3 max-w-2xl text-brand-100">
            Sectores y veredas que abastece {config.nombre}, con base en los usuarios registrados.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionHeading
          eyebrow="Sectores registrados"
          title={`${cobertura.length} sector(es) · ${totalUsuarios} usuario(s)`}
        />

        {cobertura.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-600">
              Aún no hay sectores cargados. Se registran desde el panel privado.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cobertura.map((c) => (
              <div key={c.sector} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <MapPinned className="h-5 w-5" />
                </span>
                <p className="mt-3 font-display text-base font-semibold text-slate-900">{c.sector}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Users className="h-3.5 w-3.5" /> {c.usuarios} usuario(s)
                </p>
                {c.veredas.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">Veredas: {c.veredas.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
