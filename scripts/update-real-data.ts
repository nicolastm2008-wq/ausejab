import path from "node:path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import Configuracion from "../src/models/Configuracion";

const resenaHistorica = `La Asociación de Usuarios del Servicio de Acueducto Vereda San Jorge y Barroblanco (AUSAVESJAB) nació a comienzos de la década de 1980, impulsada por la comunidad de la Vereda San Jorge del municipio de Zipaquirá, ante la necesidad de contar con un servicio de agua potable propio. Su principal gestor fue el señor Jaime García (q.e.p.d.), quien lideró los esfuerzos colectivos que permitieron constituir formalmente la asociación mediante documento privado el 26 de mayo de 1996, siendo inscrita ante la Cámara de Comercio de Bogotá el 17 de febrero de 1998 con el número S0007371.

El sistema de acueducto capta el agua en la bocatoma ubicada sobre la quebrada que nace entre los sectores de Ventalarga y Empalizado, dentro del municipio de Zipaquirá. Desde allí, el recurso hídrico recorre aproximadamente 14 kilómetros de red de conducción hasta llegar a la planta de tratamiento situada en el sector denominado "Alto del Gallo", en la Vereda San Jorge, donde se somete a los procesos de potabilización necesarios para garantizar su calidad.

La asociación cuenta con laboratorio propio para el análisis y control de la calidad del agua, y distribuye el servicio a través de ocho ramales que cubren las diferentes zonas de las veredas San Jorge y Barroblanco. Actualmente atiende a cerca de 1.000 usuarios, beneficiando a más de 6.000 personas que dependen del sistema para su abastecimiento de agua potable.

A lo largo de su historia, AUSAVESJAB ha mantenido un compromiso permanente con la sostenibilidad del recurso hídrico, promoviendo acciones de protección de cuencas y reforestación en las áreas de influencia del sistema. La asociación está vigilada por la Superintendencia de Servicios Públicos Domiciliarios y opera bajo los principios de participación comunitaria, transparencia y servicio a la comunidad.

En la actualidad, la asociación continúa su labor bajo la presidencia del señor Oswaldo García García, quien lidera el equipo directivo conformado por representantes elegidos por la asamblea de usuarios, con el propósito de garantizar el acceso al agua potable como derecho fundamental de las familias de las veredas San Jorge y Barroblanco de Zipaquirá, Cundinamarca.`;

const mision = `Prestar el servicio de acueducto a las veredas San Jorge y Barroblanco del municipio de Zipaquirá con agua de calidad, operando, manteniendo y mejorando el sistema de abastecimiento de manera sostenible, con responsabilidad ambiental y participación comunitaria.`;

const vision = `Ser una organización comunitaria modelo en la prestación del servicio de agua potable, reconocida por su gestión eficiente, la protección de las fuentes hídricas y el bienestar permanente de los usuarios de las veredas San Jorge y Barroblanco.`;

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGODB_URI en .env.local");

  await mongoose.connect(uri);
  console.log("Conectado a MongoDB");

  const result = await Configuracion.findOneAndUpdate(
    {},
    {
      $set: {
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
        resenaHistorica,
        mision,
        vision,
      },
    },
    { new: true, upsert: true }
  );

  console.log("Configuración actualizada:", result?.nombre);
  await mongoose.disconnect();
  console.log("Listo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
