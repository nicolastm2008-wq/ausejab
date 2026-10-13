import { Schema, model, models, type InferSchemaType } from "mongoose";

const SuscriptorSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    cedula: { type: String, default: "", trim: true },
    telefono: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    sector: { type: String, required: true, trim: true },
    totalPuntos: { type: Number, default: 1 },
    requisitos: { type: String, default: "", trim: true },
    numInscripcion: { type: String, default: "", trim: true },
    predios: { type: [String], default: [] },
    necesitaActualizar: { type: Boolean, default: false },
    notas: { type: String, default: "" },
  },
  { timestamps: true },
);

SuscriptorSchema.index({ sector: 1 });
SuscriptorSchema.index({ nombre: "text", cedula: "text", predios: "text" });

export type Suscriptor = InferSchemaType<typeof SuscriptorSchema>;

export default models.Suscriptor || model("Suscriptor", SuscriptorSchema);
