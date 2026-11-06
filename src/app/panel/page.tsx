import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileText, MapPinned, Settings, Users } from "lucide-react";
import { getConfiguracion, getInformes, getJuntas, getPredios } from "@/lib/data";

export const metadata = { title: "Resumen" };

export default async function PanelDashboardPage() {
  const [config, juntas, informes, predios] = await Promise.all([
    getConfiguracion(),
    getJuntas(),
    getInformes(),
    getPredios(),
  ]);

  const juntaActual = juntas.find((j) => j.activa);
  const sectores = new Set(predios.map((p) => p.sector)).size;
  const pendientesActualizar = predios.filter((p) => p.necesitaActualizar).length;
  const activos = predios.filter((p) => p.estado === "Activo").length;
  const suspendidos = predios.filter((p) => p.estado === "Suspendido").length;

  const statCards = [
    {
      href: "/panel/juntas",
      icon: Users,
      color: "bg-brand-50 text-brand-700",
      title: "Juntas directivas",
      value: `${juntas.length}`,
      hint: juntaActual ? `Vigente: ${juntaActual.periodoInicio}–${juntaActual.periodoFin}` : "Ninguna marcada como vigente",
    },
    {
      href: "/panel/sectores",
      icon: MapPinned,
      color: "bg-aqua-50 text-aqua-700",
      title: "Usuarios registrados",
      value: `${predios.length}`,
      hint: `${sectores} sector(es)`,
    },
    {
      href: "/panel/informes",
      icon: FileText,
      color: "bg-violet-50 text-violet-700",
      title: "Documentos publicados",
      value: `${informes.length}`,
      hint: "Estatutos, actas, Cámara de Comercio…",
    },
    {
      href: "/panel/historia",
      icon: Settings,
      color: "bg-slate-100 text-slate-600",
      title: "Identidad del sitio",
      value: config.siglas || config.nombre,
      hint: "Nombre, colores, historia, contacto",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Resumen</h1>
      <p className="mt-1 text-sm text-slate-500">Estado actual del contenido del acueducto.</p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-md"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-xl font-semibold text-slate-900">{card.value}</p>
            <p className="text-sm font-medium text-slate-600">{card.title}</p>
            <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
          </Link>
        ))}
      </div>

      {/* Estado de sectores */}
      {predios.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="font-display text-base font-semibold text-slate-900">Estado de usuarios</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">
              <p className="font-display text-2xl font-bold text-emerald-700">{activos}</p>
              <p className="mt-0.5 text-xs font-medium text-emerald-600">Activos</p>
            </div>
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-center">
              <p className="font-display text-2xl font-bold text-amber-700">{suspendidos}</p>
              <p className="mt-0.5 text-xs font-medium text-amber-600">Suspendidos</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="font-display text-2xl font-bold text-slate-700">
                {predios.length - activos - suspendidos}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Otros estados</p>
            </div>
            <Link
              href="/panel/sectores?actualizar=1"
              className={`rounded-xl px-4 py-3 text-center transition-colors hover:opacity-90 ${
                pendientesActualizar > 0 ? "bg-red-50" : "bg-slate-50"
              }`}
            >
              <p className={`font-display text-2xl font-bold ${pendientesActualizar > 0 ? "text-red-700" : "text-slate-400"}`}>
                {pendientesActualizar}
              </p>
              <p className={`mt-0.5 text-xs font-medium ${pendientesActualizar > 0 ? "text-red-600" : "text-slate-400"}`}>
                Pendientes de actualizar
              </p>
            </Link>
          </div>
          {pendientesActualizar > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                {pendientesActualizar} usuario(s) tienen datos incompletos.{" "}
                <Link href="/panel/sectores?actualizar=1" className="font-semibold underline-offset-2 hover:underline">
                  Ver listado →
                </Link>
              </span>
            </div>
          )}
          {pendientesActualizar === 0 && predios.length > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Todos los usuarios tienen sus datos completos.</span>
            </div>
          )}
        </div>
      )}

      {/* Primeros pasos */}
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">Primeros pasos</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-slate-600">
          <li>Edita el nombre, colores y reseña histórica en <Link href="/panel/historia" className="text-brand-700 hover:underline">Identidad e historia</Link>.</li>
          <li>Registra cada periodo desde {config.anioFundacion} en <Link href="/panel/juntas" className="text-brand-700 hover:underline">Juntas directivas</Link>.</li>
          <li>Importa el Excel de sectores o carga los usuarios uno por uno en <Link href="/panel/sectores" className="text-brand-700 hover:underline">Sectores</Link>.</li>
          <li>Sube estatutos, actas, Cámara de Comercio y demás documentos en <Link href="/panel/informes" className="text-brand-700 hover:underline">Documentos</Link>.</li>
        </ul>
      </div>
    </div>
  );
}
