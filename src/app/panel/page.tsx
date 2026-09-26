import Link from "next/link";
import { FileText, Settings, Users } from "lucide-react";
import { getConfiguracion, getInformes, getJuntas } from "@/lib/data";

export const metadata = { title: "Resumen" };

export default async function PanelDashboardPage() {
  const [config, juntas, informes] = await Promise.all([
    getConfiguracion(),
    getJuntas(),
    getInformes(),
  ]);

  const juntaActual = juntas.find((j) => j.activa);

  const cards = [
    {
      href: "/panel/juntas",
      icon: Users,
      title: "Juntas directivas",
      value: `${juntas.length}`,
      hint: juntaActual ? `Vigente: ${juntaActual.periodoInicio}-${juntaActual.periodoFin}` : "Ninguna marcada como vigente",
    },
    {
      href: "/panel/informes",
      icon: FileText,
      title: "Informes publicados",
      value: `${informes.length}`,
      hint: "DIAN, financieros y actas",
    },
    {
      href: "/panel/historia",
      icon: Settings,
      title: "Identidad del sitio",
      value: config.nombre,
      hint: "Nombre, colores, historia, contacto",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Resumen</h1>
      <p className="mt-1 text-sm text-slate-500">
        Estado actual del contenido público del sitio.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <card.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-xl font-semibold text-slate-900">{card.value}</p>
            <p className="text-sm font-medium text-slate-600">{card.title}</p>
            <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">Primeros pasos</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-slate-600">
          <li>Edita el nombre, colores y reseña histórica en <Link href="/panel/historia" className="text-brand-700 hover:underline">Identidad e historia</Link>.</li>
          <li>Registra cada periodo desde {config.anioFundacion} en <Link href="/panel/juntas" className="text-brand-700 hover:underline">Juntas directivas</Link>.</li>
          <li>Sube las declaraciones DIAN y demás informes en <Link href="/panel/informes" className="text-brand-700 hover:underline">Informes DIAN</Link>.</li>
        </ul>
      </div>
    </div>
  );
}
