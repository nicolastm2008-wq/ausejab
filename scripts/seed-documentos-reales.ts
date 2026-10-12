import path from "node:path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import Informe from "../src/models/Informe";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGODB_URI en .env.local");

  await mongoose.connect(uri);
  console.log("Conectado a MongoDB");

  const existentes = await Informe.find({});
  console.log(`Documentos existentes: ${existentes.length}`);

  // Sólo crear si no hay ninguno todavía para no duplicar
  if (existentes.length === 0) {
    // Entrada placeholder para estatutos - el PDF real se subirá desde el panel
    await Informe.create({
      anio: 2025,
      tipo: "Estatutos",
      titulo: "Estatutos AUSAVESJAB – Reforma Acta 222",
      descripcion: "Estatutos vigentes de la asociación, reformados mediante Acta 222 del 8 de junio de 2025. Suba el PDF desde el panel para activar la descarga.",
      url: "#pendiente",
      nombreArchivo: "estatutos-ausavesjab-2025.pdf",
      tamanioBytes: 0,
    });

    await Informe.create({
      anio: 2026,
      tipo: "Certificado Cámara de Comercio",
      titulo: "Certificado de Existencia y Representación Legal – Agosto 2026",
      descripcion: "Certificado expedido por la Cámara de Comercio de Bogotá. NIT: 832.002.842-2. Inscripción S0007371. Vigencia: agosto 2026. Suba el PDF desde el panel para activar la descarga.",
      url: "#pendiente",
      nombreArchivo: "camara-comercio-agosto-2026.pdf",
      tamanioBytes: 0,
    });

    console.log("Documentos placeholder creados.");
  } else {
    console.log("Ya hay documentos, no se crean duplicados.");
  }

  await mongoose.disconnect();
  console.log("Listo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
