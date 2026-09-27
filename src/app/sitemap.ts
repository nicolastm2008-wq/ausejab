import type { MetadataRoute } from "next";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const RUTAS_PUBLICAS = [
  { path: "", priority: 1 },
  { path: "/historia", priority: 0.8 },
  { path: "/juntas-directivas", priority: 0.7 },
  { path: "/informes", priority: 0.8 },
  { path: "/avisos", priority: 0.7 },
  { path: "/cobertura", priority: 0.6 },
  { path: "/galeria", priority: 0.6 },
  { path: "/contacto", priority: 0.6 },
  { path: "/politica-de-datos", priority: 0.3 },
  { path: "/terminos-y-condiciones", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return RUTAS_PUBLICAS.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    priority,
  }));
}
