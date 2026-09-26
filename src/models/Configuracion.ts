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
    logoUrl: { type: String, default: "" },
    colorPrimario: { type: String, default: "#1c65c9" },
    colorSecundario: { type: String, default: "#178a6a" },

    // Legal
    politicaDatos: {
      type: String,
      default:
        "Texto de ejemplo, revisar con un abogado antes de publicar. " +
        "Este acueducto trata los datos personales de sus usuarios (nombre, direccion del predio, " +
        "telefono y consumo) unicamente para la prestacion del servicio de acueducto, la facturacion, " +
        "la atencion de peticiones, quejas y reclamos, y el cumplimiento de obligaciones legales ante " +
        "la Superintendencia de Servicios Publicos Domiciliarios y la DIAN, conforme a la Ley 1581 de 2012 " +
        "y el Decreto 1377 de 2013. Los datos no se venden ni se comparten con terceros distintos a las " +
        "entidades de control que los exijan por ley. Todo usuario puede solicitar conocer, actualizar, " +
        "rectificar o eliminar sus datos escribiendo a los canales de contacto de esta pagina.",
    },
    terminosCondiciones: {
      type: String,
      default:
        "Texto de ejemplo, revisar con un abogado antes de publicar. " +
        "El uso de este sitio web implica la aceptacion de estos terminos. La informacion publicada " +
        "(historia, juntas directivas, informes y documentos) es de caracter informativo y de " +
        "transparencia frente a la comunidad de usuarios del acueducto. El acceso al panel privado " +
        "esta reservado al equipo interno autorizado. El acueducto no se hace responsable por el uso " +
        "indebido de la informacion publicada ni por interrupciones del servicio causadas por terceros " +
        "ajenos a su control. Para dudas sobre estos terminos, comunicarse por los canales de contacto.",
    },
  },
  { timestamps: true },
);

export type Configuracion = InferSchemaType<typeof ConfiguracionSchema>;

export default models.Configuracion || model("Configuracion", ConfiguracionSchema);
