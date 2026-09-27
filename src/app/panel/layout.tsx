import Link from "next/link";
import {
  Droplets,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  MapPinned,
  Megaphone,
  Scale,
  Settings,
  Users,
  UserCog,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getConfiguracion } from "@/lib/data";
import LogoutButton from "@/components/panel/LogoutButton";
import PanelMobileNav from "@/components/panel/PanelMobileNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const config = await getConfiguracion();

  // El middleware ya protege /panel/**, pero /panel/login no requiere sesion.
  if (!session) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  const links = [
    { href: "/panel", label: "Resumen", icon: LayoutDashboard },
    { href: "/panel/historia", label: "Identidad e historia", icon: Settings },
    { href: "/panel/avisos", label: "Avisos", icon: Megaphone },
    { href: "/panel/juntas", label: "Juntas directivas", icon: Users },
    { href: "/panel/sectores", label: "Sectores", icon: MapPinned },
    { href: "/panel/informes", label: "Documentos", icon: FileText },
    { href: "/panel/galeria", label: "Galería", icon: ImageIcon },
    { href: "/panel/legal", label: "Política de datos y términos", icon: Scale },
    ...(session.rol === "admin"
      ? [{ href: "/panel/usuarios", label: "Usuarios internos", icon: UserCog }]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          {config.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={config.logoUrl} alt={config.nombre} className="h-11 w-auto object-contain" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
              <Droplets className="h-5 w-5" />
            </span>
          )}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            >
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <Link href="/" className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100">
            ← Volver al sitio público
          </Link>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
          <div className="flex items-center gap-1">
            <PanelMobileNav
              links={links.map((link) => ({
                href: link.href,
                label: link.label,
                icon: <link.icon className="h-4 w-4" />,
              }))}
            />
            <p className="text-sm text-slate-500">
              Bienvenido, <span className="font-semibold text-slate-900">{session.nombre}</span>{" "}
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                {session.rol}
              </span>
            </p>
          </div>
          <LogoutButton />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
