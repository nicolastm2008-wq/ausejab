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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: config.nombre,
    alternateName: config.siglas || undefined,
    description: config.eslogan,
    foundingDate: config.anioFundacion ? `${config.anioFundacion}` : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: config.municipio,
      addressRegion: config.departamento,
      streetAddress: config.direccion || config.vereda,
      addressCountry: "CO",
    },
    telephone: config.telefono || undefined,
    email: config.email || undefined,
    logo: config.logoUrl || undefined,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {avisoDestacado && <AvisoBanner aviso={avisoDestacado} />}
      <SiteHeader config={config} />
      <main className="flex-1">{children}</main>
      <SiteFooter config={config} />
      <WhatsAppButton whatsapp={config.whatsapp} />
    </div>
  );
}
