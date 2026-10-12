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
    await Configuracion.create({
      nombre: "Asociación de Usuarios del Servicio de Acueducto Vereda San Jorge y Barroblanco",
      siglas: "AUSAVESJAB",
      eslogan: "Agua potable para las veredas San Jorge y Barroblanco",
      anioFundacion: 1996,
      vereda: "San Jorge y Barroblanco",
      municipio: "Zipaquirá",
      departamento: "Cundinamarca",
      nit: "832.002.842-2",
      telefono: "3105798892",
      whatsapp: "3133680344",
      email: "ausavesjab23@gmail.com",
      direccion: "Vereda San Jorge, Zipaquirá, Cundinamarca",
      horarioAtencion: "Lunes a viernes, 8:00 a.m. - 5:00 p.m.",
      resenaHistorica: `La Asociación de Usuarios del Servicio de Acueducto Vereda San Jorge y Barroblanco (AUSAVESJAB) nació a comienzos de la década de 1980, impulsada por la comunidad de la Vereda San Jorge del municipio de Zipaquirá, ante la necesidad de contar con un servicio de agua potable propio. Su principal gestor fue el señor Jaime García (q.e.p.d.), quien lideró los esfuerzos colectivos que permitieron constituir formalmente la asociación mediante documento privado el 26 de mayo de 1996, siendo inscrita ante la Cámara de Comercio de Bogotá el 17 de febrero de 1998 con el número S0007371.\n\nEl sistema de acueducto capta el agua en la bocatoma ubicada sobre la quebrada que nace entre los sectores de Ventalarga y Empalizado, dentro del municipio de Zipaquirá. Desde allí, el recurso hídrico recorre aproximadamente 14 kilómetros de red de conducción hasta llegar a la planta de tratamiento situada en el sector denominado "Alto del Gallo", en la Vereda San Jorge, donde se somete a los procesos de potabilización necesarios para garantizar su calidad.\n\nLa asociación cuenta con laboratorio propio para el análisis y control de la calidad del agua, y distribuye el servicio a través de ocho ramales que cubren las diferentes zonas de las veredas San Jorge y Barroblanco. Actualmente atiende a cerca de 1.000 usuarios, beneficiando a más de 6.000 personas que dependen del sistema para su abastecimiento de agua potable.\n\nA lo largo de su historia, AUSAVESJAB ha mantenido un compromiso permanente con la sostenibilidad del recurso hídrico, promoviendo acciones de protección de cuencas y reforestación en las áreas de influencia del sistema. La asociación está vigilada por la Superintendencia de Servicios Públicos Domiciliarios y opera bajo los principios de participación comunitaria, transparencia y servicio a la comunidad.\n\nEn la actualidad, la asociación continúa su labor bajo la presidencia del señor Oswaldo García García, quien lidera el equipo directivo conformado por representantes elegidos por la asamblea de usuarios, con el propósito de garantizar el acceso al agua potable como derecho fundamental de las familias de las veredas San Jorge y Barroblanco de Zipaquirá, Cundinamarca.`,
      mision: "Prestar el servicio de acueducto a las veredas San Jorge y Barroblanco del municipio de Zipaquirá con agua de calidad, operando, manteniendo y mejorando el sistema de abastecimiento de manera sostenible, con responsabilidad ambiental y participación comunitaria.",
      vision: "Ser una organización comunitaria modelo en la prestación del servicio de agua potable, reconocida por su gestión eficiente, la protección de las fuentes hídricas y el bienestar permanente de los usuarios de las veredas San Jorge y Barroblanco.",
    });
    console.log("Configuración real de AUSAVESJAB creada.");
  }

  // Junta directiva vigente
  const JuntaDirectiva = (await import("../src/models/JuntaDirectiva")).default;
  const juntaExistente = await JuntaDirectiva.findOne({ periodoInicio: 2024 });
  if (!juntaExistente) {
    await JuntaDirectiva.create({
      periodoInicio: 2024,
      periodoFin: 2026,
      colorAsociado: "#1c65c9",
      activa: true,
      notas: "Nombramiento Nov 24, 2024. Estatutos reformados Acta 222, jun 8 2025.",
      miembros: [
        { nombre: "Oswaldo García García", cargo: "Presidente" },
        { nombre: "Jose Reyes Fandiño", cargo: "Vicepresidente" },
        { nombre: "Carlos Julio Triviño López", cargo: "Vocal" },
        { nombre: "María Delia Martínez de Ramos", cargo: "Vocal" },
      ],
    });
    console.log("Junta directiva 2024-2026 creada.");
  }

  // Informes
  const Informe = (await import("../src/models/Informe")).default;
  const ccExistente = await Informe.findOne({ tipo: "Certificado Cámara de Comercio" });
  if (!ccExistente) {
    await Informe.create({
      anio: 2026,
      tipo: "Certificado Cámara de Comercio",
      titulo: "Certificado de Existencia y Representación Legal – Agosto 2026",
      descripcion: "Certificado expedido por la Cámara de Comercio de Bogotá. NIT: 832.002.842-2. Inscripción S0007371.",
      url: process.env.CC_PDF_URL ?? "#pendiente",
      nombreArchivo: "camara-comercio-agosto-2026.pdf",
      tamanioBytes: 0,
    });
    console.log("Informe Cámara de Comercio creado.");
  }

  const estExistente = await Informe.findOne({ tipo: "Estatutos" });
  if (!estExistente) {
    await Informe.create({
      anio: 2025,
      tipo: "Estatutos",
      titulo: "Estatutos AUSAVESJAB – Reforma Acta 222",
      descripcion: "Estatutos vigentes reformados mediante Acta 222 del 8 de junio de 2025. Suba el PDF desde el panel para activar la descarga.",
      url: "#pendiente",
      nombreArchivo: "estatutos-ausavesjab-2025.pdf",
      tamanioBytes: 0,
    });
    console.log("Informe Estatutos creado.");
  }

  await mongoose.disconnect();
  console.log("Listo. Ya puedes iniciar sesión en /panel/login con el correo y la contraseña definidos.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
