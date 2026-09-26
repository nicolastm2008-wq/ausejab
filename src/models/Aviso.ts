import { Schema, model, models, type InferSchemaType } from "mongoose";
import { TIPOS_AVISO } from "@/lib/tipos-aviso";

export { TIPOS_AVISO };

const AvisoSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    mensaje: { type: String, required: true, trim: true },
    tipo: { type: String, enum: TIPOS_AVISO, default: "Informativo" },
    fechaEvento: { type: Date },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

AvisoSchema.index({ activo: 1, createdAt: -1 });

export type Aviso = InferSchemaType<typeof AvisoSchema>;

export default models.Aviso || model("Aviso", AvisoSchema);
