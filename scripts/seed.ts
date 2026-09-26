import path from "node:path";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import Usuario from "../src/models/Usuario";
import Configuracion from "../src/models/Configuracion";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGODB_URI en .env.local");

  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const adminNombre = process.env.ADMIN_NAME ?? "Administrador";

  if (!adminEmail || !adminPassword) {
    throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD en .env.local antes de sembrar datos");
  }
  if (adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
  }

  await mongoose.connect(uri);
  console.log("Conectado a MongoDB");

  const existente = await Usuario.findOne({ email: adminEmail });
  if (existente) {
    existente.passwordHash = await bcrypt.hash(adminPassword, 12);
    existente.rol = "admin";
    existente.activo = true;
    await existente.save();
    console.log(`Usuario administrador actualizado: ${adminEmail}`);
  } else {
    await Usuario.create({
      nombre: adminNombre,
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      rol: "admin",
      activo: true,
    });
    console.log(`Usuario administrador creado: ${adminEmail}`);
  }

  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    await Configuracion.create({});
    console.log("Configuración inicial del sitio creada con valores de ejemplo (editables desde /panel/historia)");
  }

  await mongoose.disconnect();
  console.log("Listo. Ya puedes iniciar sesión en /panel/login con el correo y la contraseña definidos.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
