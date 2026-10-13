import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PredioModel from "@/models/Predio";
import { SUSCRIPTORES_DATA } from "../../../../scripts/suscriptores-data";

function cap(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("key") !== "ausavesjab2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await PredioModel.deleteMany({});

    const docs: object[] = [];
    for (const s of SUSCRIPTORES_DATA as readonly {
      nombre: string; cedula: string; telefono: string; email: string;
      sector: string; totalPuntos: number; requisitos: string;
      numInscripcion: string; predios: readonly string[];
      necesitaActualizar: boolean; notas: string;
    }[]) {
      const predios = s.predios.length > 0 ? [...s.predios] : [""];
      for (const predio of predios) {
        docs.push({
          nombreUsuario: cap(s.nombre),
          cedula: s.cedula,
          predio: cap(predio),
          sector: s.sector,
          vereda: "",
          codigoMedidor: "",
          estado: "Activo",
          telefono: s.telefono,
          email: s.email,
          requisitos: s.requisitos,
          numInscripcion: s.numInscripcion,
          necesitaActualizar: s.necesitaActualizar,
          notas: s.notas,
        });
      }
    }

    await PredioModel.insertMany(docs);
    const count = await PredioModel.countDocuments();
    return NextResponse.json({ ok: true, insertados: count });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
