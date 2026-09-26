import { Schema, model, models, type InferSchemaType } from "mongoose";
import { TIPOS_INFORME } from "@/lib/tipos-informe";

export { TIPOS_INFORME };

const InformeSchema = new Schema(
  {
    anio: { type: Number, required: true },
    tipo: { type: String, enum: TIPOS_INFORME, default: "Estatutos" },
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
