import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getConfiguracion } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Contacto" };

export default async function ContactoPage() {
  const config = await getConfiguracion();

  const waNumber = config.whatsapp?.replace(/\D/g, "");
  const waLink = waNumber ? `https://wa.me/57${waNumber}` : null;

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
          {config.telefono && (
            <a
              href={`tel:${config.telefono}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Phone className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Teléfono</h3>
              <p className="mt-1 text-sm font-medium text-slate-900">{config.telefono}</p>
            </a>
          )}

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-soft hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <MessageCircle className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">WhatsApp</h3>
              <p className="mt-1 text-sm font-medium text-slate-900">{config.whatsapp}</p>
            </a>
          )}

          {config.email && (
            <a
              href={`mailto:${config.email}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Mail className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Correo electrónico</h3>
              <p className="mt-1 text-sm font-medium text-slate-900 break-all">{config.email}</p>
            </a>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Clock className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Horario de atención</h3>
            <p className="mt-1 text-sm font-medium text-slate-900">{config.horarioAtencion}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                {config.direccion || `Vereda ${config.vereda}`}
              </h3>
              <p className="mt-0.5 text-sm text-slate-600">
                {config.municipio}, {config.departamento}, Colombia
              </p>
              {config.nit && (
                <p className="mt-3 text-xs text-slate-400">NIT: {config.nit}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
