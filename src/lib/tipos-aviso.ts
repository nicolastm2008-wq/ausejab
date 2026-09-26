export const TIPOS_AVISO = [
  "Informativo",
  "Corte Programado",
  "Mantenimiento",
  "Asamblea",
  "Emergencia",
] as const;

export type TipoAviso = (typeof TIPOS_AVISO)[number];

export const AVISO_STYLES: Record<TipoAviso, { badge: string; banner: string }> = {
  Informativo: { badge: "bg-brand-50 text-brand-700", banner: "bg-brand-700" },
  "Corte Programado": { badge: "bg-amber-50 text-amber-700", banner: "bg-amber-600" },
  Mantenimiento: { badge: "bg-aqua-50 text-aqua-700", banner: "bg-aqua-700" },
  Asamblea: { badge: "bg-violet-50 text-violet-700", banner: "bg-violet-700" },
  Emergencia: { badge: "bg-red-50 text-red-700", banner: "bg-red-700" },
};
