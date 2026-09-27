import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getConfiguracion } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Contacto" };

export default async function ContactoPage() {
  const config = await getConfiguracion();

  const items = [
    { icon: Phone, label: "Teléfono", value: config.telefono || "Por definir" },
    { icon: Mail, label: "Correo electrónico", value: config.email || "Por definir" },
    { icon: MapPin, label: "Dirección", value: config.direccion || "Por definir" },
    { icon: Clock, label: "Horario de atención", value: config.horarioAtencion },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Estamos para servirte"
        title="Contacto"
        description={`Comunícate con ${config.siglas || config.nombre} para peticiones, quejas, reclamos o sugerencias.`}
        imageSrc="/galeria-inicial/013.jpeg"
      />

      <section className="container-page py-14">
        <SectionHeading eyebrow="Información" title="Datos de contacto" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="font-display text-base font-semibold text-slate-900">
            {config.vereda}, {config.municipio}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{config.departamento}, Colombia</p>
          {config.nit && <p className="mt-3 text-xs text-slate-400">NIT: {config.nit}</p>}
        </div>
      </section>
    </div>
  );
}
