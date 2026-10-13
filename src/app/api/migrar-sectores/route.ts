import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SuscriptorModel from "@/models/Suscriptor";
import PredioModel from "@/models/Predio";

function capitalize(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("key") !== "ausavesjab2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const suscriptores = await SuscriptorModel.find();
    if (suscriptores.length === 0) {
      return NextResponse.json({ error: "No hay suscriptores para migrar" }, { status: 404 });
    }

    // Limpiar predios anteriores que vengan de la migración
    await PredioModel.deleteMany({});

    const prediosDocs: object[] = [];

    for (const s of suscriptores) {
      const nombre = capitalize(s.nombre || "");
      const notas = [
        s.cedula ? `Cédula: ${s.cedula}` : "",
        s.email ? `Email: ${s.email}` : "",
        s.requisitos && s.requisitos !== "COMPLETO" ? `Requisitos pendientes: ${s.requisitos}` : "",
        s.necesitaActualizar ? "Requiere actualización de datos" : "",
        s.notas || "",
      ]
        .filter(Boolean)
        .join(" | ");

      const predios = s.predios && s.predios.length > 0 ? s.predios : [""];

      for (const predio of predios) {
        prediosDocs.push({
          nombreUsuario: nombre,
          predio: capitalize(predio),
          sector: s.sector || "",
          vereda: "",
          codigoMedidor: "",
          estado: "Activo",
          telefono: s.telefono || "",
          notas,
        });
      }
    }

    await PredioModel.insertMany(prediosDocs);

    const count = await PredioModel.countDocuments();
    await SuscriptorModel.deleteMany({});

    return NextResponse.json({ ok: true, prediosInsertados: count, suscriptoresMigrados: suscriptores.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
