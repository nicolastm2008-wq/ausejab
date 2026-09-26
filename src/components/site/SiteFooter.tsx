import Link from "next/link";
import { Droplets, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import type { ConfiguracionPlain } from "@/lib/data";

export default function SiteFooter({ config }: { config: ConfiguracionPlain }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
              <Droplets className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-semibold text-white">{config.nombre}</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">{config.eslogan}</p>
          <p className="mt-1 text-sm text-slate-500">
            {config.vereda}, {config.municipio}, {config.departamento}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Enlaces
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/historia" className="hover:text-white">Nuestra historia</Link></li>
            <li><Link href="/juntas-directivas" className="hover:text-white">Juntas directivas</Link></li>
            <li><Link href="/informes" className="hover:text-white">Documentos y transparencia</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            <li><Link href="/panel" className="hover:text-white">Acceso equipo interno</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {config.telefono && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-400" /> {config.telefono}
              </li>
            )}
            {config.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400" /> {config.email}
              </li>
            )}
            {config.direccion && (
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-400" /> {config.direccion}
              </li>
            )}
          </ul>
          <div className="mt-4 flex gap-3">
            {config.facebook && (
              <a href={config.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-slate-800 p-2 hover:bg-brand-700">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {config.instagram && (
              <a href={config.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-slate-800 p-2 hover:bg-brand-700">
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4">
        <p className="container-page text-center text-xs text-slate-500">
          &copy; {year} {config.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
