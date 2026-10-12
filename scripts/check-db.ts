import path from "node:path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import Informe from "../src/models/Informe";
import Configuracion from "../src/models/Configuracion";
import JuntaDirectiva from "../src/models/JuntaDirectiva";

async function main() {
  const uri = process.env.MONGODB_URI;
  console.log("URI:", uri?.slice(0, 40) + "...");
  await mongoose.connect(uri!);

  const informes = await Informe.find({});
  console.log("Informes:", informes.length, informes.map(i => ({ tipo: i.tipo, url: i.url?.slice(0, 50) })));

  const config = await Configuracion.findOne({}, { nombre: 1, nit: 1, telefono: 1, email: 1 });
  console.log("Config:", config);

  const juntas = await JuntaDirectiva.find({});
  console.log("Juntas:", juntas.length, juntas.map(j => ({ periodo: `${j.periodoInicio}-${j.periodoFin}`, activa: j.activa, miembros: j.miembros?.length })));

  await mongoose.disconnect();
}

main().catch(console.error);
