import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { getConfiguracion } from "@/lib/data";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display" });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfiguracion();
  const nombreCorto = config.siglas || config.nombre;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: config.nombre, template: `%s | ${nombreCorto}` },
    description: config.eslogan,
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: nombreCorto,
      title: config.nombre,
      description: config.eslogan,
      images: config.logoUrl ? [{ url: config.logoUrl, width: 600, height: 312, alt: config.nombre }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: config.nombre,
      description: config.eslogan,
      images: config.logoUrl ? [config.logoUrl] : [],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
