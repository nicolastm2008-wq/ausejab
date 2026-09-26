import { Schema, model, models, type InferSchemaType } from "mongoose";

const FotoGaleriaSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "" },
    url: { type: String, required: true },
  },
  { timestamps: true },
);

export type FotoGaleria = InferSchemaType<typeof FotoGaleriaSchema>;

export default models.FotoGaleria || model("FotoGaleria", FotoGaleriaSchema);
