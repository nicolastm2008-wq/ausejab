import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Usuario from "@/models/Usuario";
import Configuracion from "@/models/Configuracion";
import JuntaDirectiva from "@/models/JuntaDirectiva";
import Informe from "@/models/Informe";

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  const expected = process.env.INIT_SECRET;
  if (!expected || key !== expected) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();

  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const adminNombre = process.env.ADMIN_NAME ?? "Administrador";

  let adminCreado = false;
  if (adminEmail && adminPassword.length >= 8) {
    const existe = await Usuario.findOne({ email: adminEmail });
    if (!existe) {
      await Usuario.create({
        nombre: adminNombre,
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 12),
        rol: "admin",
        activo: true,
      });
      adminCreado = true;
    }
  }

  const resenaHistorica = [
    "La Asociación de Usuarios del Servicio de Acueducto Vereda San Jorge y Barroblanco (AUSAVESJAB) nació a comienzos de la década de 1980, impulsada por la comunidad de la Vereda San Jorge del municipio de Zipaquirá, ante la necesidad de contar con un servicio de agua potable propio. Su principal gestor fue el señor Jaime García (q.e.p.d.), quien lideró los esfuerzos colectivos que permitieron constituir formalmente la asociación mediante documento privado el 26 de mayo de 1996, siendo inscrita ante la Cámara de Comercio de Bogotá el 17 de febrero de 1998 con el número S0007371.",
    "El sistema de acueducto capta el agua en la bocatoma ubicada sobre la quebrada que nace entre los sectores de Ventalarga y Empalizado, dentro del municipio de Zipaquirá. Desde allí, el recurso hídrico recorre aproximadamente 14 kilómetros de red de conducción hasta llegar a la planta de tratamiento situada en el sector denominado Alto del Gallo, en la Vereda San Jorge, donde se somete a los procesos de potabilización necesarios para garantizar su calidad.",
    "La asociación cuenta con laboratorio propio para el análisis y control de la calidad del agua, y distribuye el servicio a través de ocho ramales que cubren las diferentes zonas de las veredas San Jorge y Barroblanco. Actualmente atiende a cerca de 1.000 usuarios, beneficiando a más de 6.000 personas que dependen del sistema para su abastecimiento de agua potable.",
    "A lo largo de su historia, AUSAVESJAB ha mantenido un compromiso permanente con la sostenibilidad del recurso hídrico, promoviendo acciones de protección de cuencas y reforestación en las áreas de influencia del sistema. La asociación está vigilada por la Superintendencia de Servicios Públicos Domiciliarios y opera bajo los principios de participación comunitaria, transparencia y servicio a la comunidad.",
    "En la actualidad, la asociación continúa su labor bajo la presidencia del señor Oswaldo García García, quien lidera el equipo directivo conformado por representantes elegidos por la asamblea de usuarios, con el propósito de garantizar el acceso al agua potable como derecho fundamental de las familias de las veredas San Jorge y Barroblanco de Zipaquirá, Cundinamarca.",
  ].join("\n\n");

  const config = await Configuracion.findOne();
  const configActualizada = !config || !config.telefono;
  await Configuracion.findOneAndUpdate(
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
        mision: "Prestar el servicio de acueducto a las veredas San Jorge y Barroblanco del municipio de Zipaquirá con agua de calidad, operando, manteniendo y mejorando el sistema de abastecimiento de manera sostenible, con responsabilidad ambiental y participación comunitaria.",
        vision: "Ser una organización comunitaria modelo en la prestación del servicio de agua potable, reconocida por su gestión eficiente, la protección de las fuentes hídricas y el bienestar permanente de los usuarios de las veredas San Jorge y Barroblanco.",
      },
    },
    { upsert: true }
  );

  const junta = await JuntaDirectiva.findOneAndUpdate(
    { periodoInicio: 2024 },
    {
      $set: {
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
      },
    },
    { upsert: true, new: true }
  );

  const ccUrl = process.env.CC_PDF_URL ?? "#pendiente";
  const ccExiste = await Informe.countDocuments({ tipo: "Certificado Cámara de Comercio" });
  if (!ccExiste) {
    await Informe.create({
      anio: 2026,
      tipo: "Certificado Cámara de Comercio",
      titulo: "Certificado de Existencia y Representación Legal – Agosto 2026",
      descripcion: "Certificado expedido por la Cámara de Comercio de Bogotá. NIT: 832.002.842-2. Inscripción S0007371.",
      url: ccUrl,
      nombreArchivo: "camara-comercio-agosto-2026.pdf",
      tamanioBytes: 0,
    });
  }

  const estExiste = await Informe.countDocuments({ tipo: "Estatutos" });
  if (!estExiste) {
    await Informe.create({
      anio: 2025,
      tipo: "Estatutos",
      titulo: "Estatutos AUSAVESJAB – Reforma Acta 222",
      descripcion: "Estatutos vigentes reformados mediante Acta 222 del 8 de junio de 2025. Suba el PDF desde el panel para activar la descarga.",
      url: "#pendiente",
      nombreArchivo: "estatutos-ausavesjab-2025.pdf",
      tamanioBytes: 0,
    });
  }

  return NextResponse.json({
    ok: true,
    adminCreado,
    configActualizada,
    junta: junta ? `${junta.periodoInicio}-${junta.periodoFin}` : null,
  });
}
