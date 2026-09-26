import { getConfiguracion } from "@/lib/data";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

// El contenido (historia, juntas, informes) se edita desde el panel privado,
// asi que estas paginas deben leerse siempre en vivo desde la base de datos.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfiguracion();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader config={config} />
      <main className="flex-1">{children}</main>
      <SiteFooter config={config} />
    </div>
  );
}
