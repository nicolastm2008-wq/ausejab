import { Schema, model, models, type InferSchemaType } from "mongoose";

const MiembroSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const JuntaDirectivaSchema = new Schema(
  {
    periodoInicio: { type: Number, required: true },
    periodoFin: { type: Number, required: true },
    colorAsociado: { type: String, default: "#1c65c9" },
    miembros: { type: [MiembroSchema], default: [] },
    notas: { type: String, default: "" },
    activa: { type: Boolean, default: false },
  },
  { timestamps: true },
);

JuntaDirectivaSchema.index({ periodoInicio: -1 });

export type JuntaDirectiva = InferSchemaType<typeof JuntaDirectivaSchema>;

export default models.JuntaDirectiva || model("JuntaDirectiva", JuntaDirectivaSchema);
