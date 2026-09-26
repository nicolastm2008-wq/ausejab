"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import { AVISO_STYLES, type TipoAviso } from "@/lib/tipos-aviso";
import type { AvisoPlain } from "@/lib/data";

export default function AvisoBanner({ aviso }: { aviso: AvisoPlain }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const estilo = AVISO_STYLES[aviso.tipo as TipoAviso]?.banner ?? "bg-brand-700";
  const fecha = aviso.fechaEvento
    ? new Date(aviso.fechaEvento).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className={`${estilo} text-white`}>
      <div className="container-page flex items-center gap-3 py-2.5 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p className="flex-1">
          <span className="font-semibold">{aviso.titulo}.</span> <span className="opacity-90">{aviso.mensaje}</span>
          {fecha && <span className="ml-1 opacity-90">({fecha})</span>}{" "}
          <Link href="/avisos" className="underline underline-offset-2 hover:opacity-80">
            Ver todos los avisos
          </Link>
        </p>
        <button
          onClick={() => setVisible(false)}
          aria-label="Cerrar aviso"
          className="shrink-0 rounded-full p-1 hover:bg-white/15"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
