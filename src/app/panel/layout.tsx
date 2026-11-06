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
import PanelNavLink from "@/components/panel/PanelNavLink";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const config = await getConfiguracion();

  // El middleware ya protege /panel/**, pero /panel/login no requiere sesion.
  if (!session) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  const groups = [
    {
      label: null,
      items: [{ href: "/panel", label: "Resumen", icon: LayoutDashboard, exact: true }],
    },
    {
      label: "Contenido",
      items: [
        { href: "/panel/historia", label: "Identidad e historia", icon: Settings, exact: false },
        { href: "/panel/avisos", label: "Avisos", icon: Megaphone, exact: false },
        { href: "/panel/juntas", label: "Juntas directivas", icon: Users, exact: false },
        { href: "/panel/sectores", label: "Sectores", icon: MapPinned, exact: false },
        { href: "/panel/informes", label: "Documentos", icon: FileText, exact: false },
        { href: "/panel/galeria", label: "Galería", icon: ImageIcon, exact: false },
      ],
    },
    {
      label: "Administración",
      items: [
        { href: "/panel/legal", label: "Política y términos", icon: Scale, exact: false },
        ...(session.rol === "admin"
          ? [{ href: "/panel/usuarios", label: "Usuarios internos", icon: UserCog, exact: false }]
          : []),
      ],
    },
  ];
  const links = groups.flatMap((g) => g.items);

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
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-5" : ""}>
              {group.label && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((link) => (
                  <PanelNavLink key={link.href} href={link.href} exact={link.exact ?? false}>
                    <link.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </PanelNavLink>
                ))}
              </div>
            </div>
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
