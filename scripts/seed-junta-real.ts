import path from "node:path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import Junta from "../src/models/JuntaDirectiva";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGODB_URI en .env.local");

  await mongoose.connect(uri);
  console.log("Conectado a MongoDB");

  // Ver si ya hay juntas
  const existentes = await Junta.find({});
  console.log(`Juntas existentes: ${existentes.length}`);

  // Crear la junta vigente según la Cámara de Comercio (nombrada Nov 24, 2024)
  const juntaVigente = await Junta.findOneAndUpdate(
    { periodoInicio: 2024, activa: true },
    {
      $set: {
        periodoInicio: 2024,
        periodoFin: 2026,
        colorAsociado: "#1c65c9",
        activa: true,
        notas: "Junta directiva registrada en Cámara de Comercio. Acta de nombramiento: Nov 24, 2024. Estatutos reformados por Acta 222 del 8 de junio de 2025.",
        miembros: [
          { nombre: "Oswaldo García García", cargo: "Presidente" },
          { nombre: "Jose Reyes Fandiño", cargo: "Vicepresidente" },
          { nombre: "Carlos Julio Triviño López", cargo: "Vocal" },
          { nombre: "María Delia Martínez de Ramos", cargo: "Vocal" },
        ],
      },
    },
    { new: true, upsert: true }
  );

  console.log("Junta vigente creada/actualizada:", juntaVigente?.periodoInicio, "-", juntaVigente?.periodoFin);

  // Desactivar cualquier otra junta activa
  await Junta.updateMany(
    { _id: { $ne: juntaVigente?._id }, activa: true },
    { $set: { activa: false } }
  );

  await mongoose.disconnect();
  console.log("Listo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
