import Link from "next/link";
import { ArrowLeft, Droplets } from "lucide-react";
import { getConfiguracion } from "@/lib/data";

export default async function NotFound() {
  const config = await getConfiguracion();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-aqua-800 px-4 text-center text-white">
      {config.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={config.logoUrl} alt={config.nombre} className="h-16 w-auto object-contain" />
      ) : (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
          <Droplets className="h-7 w-7" />
        </span>
      )}

      <p className="mt-8 font-display text-7xl font-bold">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold">Esta página no existe</h1>
      <p className="mt-2 max-w-sm text-brand-100">
        Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-800 shadow-soft transition-transform hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </Link>
    </div>
  );
}
