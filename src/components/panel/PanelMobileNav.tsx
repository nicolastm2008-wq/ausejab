"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

type LinkItem = { href: string; label: string; icon: ReactNode };

export default function PanelMobileNav({ links }: { links: LinkItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menú del panel"
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-16 z-40 border-b border-slate-200 bg-white shadow-soft">
          <div className="space-y-1 px-3 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              ← Volver al sitio público
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
