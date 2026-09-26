import { getAvisoDestacado, getConfiguracion } from "@/lib/data";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import AvisoBanner from "@/components/site/AvisoBanner";
import WhatsAppButton from "@/components/site/WhatsAppButton";

// El contenido (historia, juntas, informes) se edita desde el panel privado,
// asi que estas paginas deben leerse siempre en vivo desde la base de datos.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [config, avisoDestacado] = await Promise.all([getConfiguracion(), getAvisoDestacado()]);

  return (
    <div className="flex min-h-screen flex-col">
      {avisoDestacado && <AvisoBanner aviso={avisoDestacado} />}
      <SiteHeader config={config} />
      <main className="flex-1">{children}</main>
      <SiteFooter config={config} />
      <WhatsAppButton whatsapp={config.whatsapp} />
    </div>
  );
}
