import { Schema, model, models, type InferSchemaType } from "mongoose";

export const TIPOS_INFORME = [
  "Declaracion de Renta DIAN",
  "Rendicion de Cuentas",
  "Informe Financiero",
  "Acta de Asamblea",
  "Otro",
] as const;

const InformeSchema = new Schema(
  {
    anio: { type: Number, required: true },
    tipo: { type: String, enum: TIPOS_INFORME, default: "Declaracion de Renta DIAN" },
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "" },
    url: { type: String, required: true },
    nombreArchivo: { type: String, required: true },
    tamanioBytes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

InformeSchema.index({ anio: -1, tipo: 1 });

export type Informe = InferSchemaType<typeof InformeSchema>;

export default models.Informe || model("Informe", InformeSchema);
