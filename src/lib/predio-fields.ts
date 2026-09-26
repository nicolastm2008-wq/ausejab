export const ESTADOS_PREDIO = ["Activo", "Inactivo", "Suspendido", "Retirado"] as const;
export type EstadoPredio = (typeof ESTADOS_PREDIO)[number];

export const PREDIO_FIELDS = [
  { key: "nombreUsuario", label: "Nombre del usuario", required: true },
  { key: "sector", label: "Sector", required: true },
  { key: "predio", label: "Predio / dirección", required: false },
  { key: "vereda", label: "Vereda", required: false },
  { key: "codigoMedidor", label: "Código de medidor", required: false },
  { key: "estado", label: "Estado", required: false },
  { key: "telefono", label: "Teléfono", required: false },
  { key: "notas", label: "Notas", required: false },
] as const;

export type PredioFieldKey = (typeof PREDIO_FIELDS)[number]["key"];
