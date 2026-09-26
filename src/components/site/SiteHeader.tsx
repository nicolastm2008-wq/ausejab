"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Droplets, Menu, X } from "lucide-react";
import type { ConfiguracionPlain } from "@/lib/data";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/historia", label: "Historia" },
  { href: "/juntas-directivas", label: "Juntas Directivas" },
  { href: "/informes", label: "Informes" },
  { href: "/contacto", label: "Contacto" },
];

export default function SiteHeader({ config }: { config: ConfiguracionPlain }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft">
            <Droplets className="h-5 w-5" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-sm font-semibold text-slate-900 lg:text-base">
              {config.nombre}
            </span>
            <span className="hidden text-[11px] uppercase tracking-wide text-slate-500 xl:block">
              {config.municipio} &middot; desde {config.anioFundacion}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/panel"
            className="ml-2 whitespace-nowrap rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-brand-800"
          >
            Acceso interno
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/panel"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white"
            >
              Acceso interno
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
