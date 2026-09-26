import { Schema, model, models, type InferSchemaType } from "mongoose";

const UsuarioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    rol: { type: String, enum: ["admin", "editor"], default: "editor" },
    activo: { type: Boolean, default: true },
    ultimoAcceso: { type: Date },
  },
  { timestamps: true },
);

export type Usuario = InferSchemaType<typeof UsuarioSchema>;

export default models.Usuario || model("Usuario", UsuarioSchema);
