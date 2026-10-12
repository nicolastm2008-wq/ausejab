import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { put } from "@vercel/blob";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import Informe from "../src/models/Informe";

async function uploadFile(filePath: string, destName: string) {
  const buffer = fs.readFileSync(filePath);
  const file = new File([buffer], destName, { type: "application/pdf" });
  const blob = await put(`informes/${Date.now()}-${destName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return { url: blob.url, tamanioBytes: buffer.length };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGODB_URI");

  await mongoose.connect(uri);
  console.log("Conectado a MongoDB");

  // 1. Subir Cámara de Comercio
  const ccPath = "C:/Users/User/Downloads/Camara de comercio Agosto.pdf";
  if (fs.existsSync(ccPath)) {
    console.log("Subiendo Cámara de Comercio...");
    const { url, tamanioBytes } = await uploadFile(ccPath, "camara-comercio-agosto-2026.pdf");
    console.log("URL:", url);
    await Informe.findOneAndUpdate(
      { tipo: "Certificado Cámara de Comercio" },
      { $set: { url, tamanioBytes, descripcion: "Certificado de Existencia y Representación Legal expedido por la Cámara de Comercio de Bogotá. NIT: 832.002.842-2. Inscripción S0007371. Vigencia agosto 2026." } }
    );
    console.log("Cámara de Comercio actualizada en MongoDB.");
  } else {
    console.log("No se encontró el archivo CC en:", ccPath);
  }

  await mongoose.disconnect();
  console.log("Listo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
