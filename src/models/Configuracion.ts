import { Schema, model, models, type InferSchemaType } from "mongoose";

const ConfiguracionSchema = new Schema(
  {
    // Identidad
    nombre: { type: String, default: "Acueducto Comunitario" },
    siglas: { type: String, default: "ACUEDUCTO" },
    eslogan: { type: String, default: "Agua potable para nuestra comunidad" },
    anioFundacion: { type: Number, default: 1996 },
    vereda: { type: String, default: "Vereda (por definir)" },
    municipio: { type: String, default: "Municipio (por definir)" },
    departamento: { type: String, default: "Departamento (por definir)" },
    nit: { type: String, default: "" },

    // Contacto
    telefono: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    direccion: { type: String, default: "" },
    horarioAtencion: { type: String, default: "Lunes a viernes, 8:00 a.m. - 5:00 p.m." },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },

    // Contenido
    resenaHistorica: {
      type: String,
      default:
        "Escribe aqui la resena historica real del acueducto: como y por que se fundo, quienes lideraron el proceso y los hitos mas importantes desde su fundacion. Este texto es de ejemplo y debe reemplazarse desde el panel privado.",
    },
    mision: {
      type: String,
      default: "Texto de ejemplo: define aqui la mision del acueducto desde el panel privado.",
    },
    vision: {
      type: String,
      default: "Texto de ejemplo: define aqui la vision del acueducto desde el panel privado.",
    },

    // Marca
    colorPrimario: { type: String, default: "#1c65c9" },
    colorSecundario: { type: String, default: "#178a6a" },
  },
  { timestamps: true },
);

export type Configuracion = InferSchemaType<typeof ConfiguracionSchema>;

export default models.Configuracion || model("Configuracion", ConfiguracionSchema);
