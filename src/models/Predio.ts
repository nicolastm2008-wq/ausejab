import { Schema, model, models, type InferSchemaType } from "mongoose";
import { ESTADOS_PREDIO } from "@/lib/predio-fields";

export { ESTADOS_PREDIO };

const PredioSchema = new Schema(
  {
    nombreUsuario: { type: String, required: true, trim: true },
    predio: { type: String, default: "", trim: true },
    sector: { type: String, required: true, trim: true },
    vereda: { type: String, default: "", trim: true },
    codigoMedidor: { type: String, default: "", trim: true },
    estado: { type: String, enum: ESTADOS_PREDIO, default: "Activo" },
    telefono: { type: String, default: "", trim: true },
    notas: { type: String, default: "" },
  },
  { timestamps: true },
);

PredioSchema.index({ sector: 1 });
PredioSchema.index({ estado: 1 });
PredioSchema.index({ nombreUsuario: "text", predio: "text", codigoMedidor: "text" });

export type Predio = InferSchemaType<typeof PredioSchema>;

export default models.Predio || model("Predio", PredioSchema);
