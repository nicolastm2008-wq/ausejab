export const TIPOS_INFORME = [
  "Estatutos",
  "Certificado Cámara de Comercio",
  "Acta de Asamblea",
  "Resultados de Calidad del Agua",
  "Declaración de Renta DIAN",
  "Rendición de Cuentas",
  "Informe Financiero",
  "Otro",
] as const;

export type TipoInforme = (typeof TIPOS_INFORME)[number];
