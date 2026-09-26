import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Predio from "@/models/Predio";
import { ESTADOS_PREDIO } from "@/lib/predio-fields";
import { requireSession } from "@/lib/require-session";

const MAX_REGISTROS = 5000;

type FilaImportada = {
  nombreUsuario?: string;
  sector?: string;
  predio?: string;
  vereda?: string;
  codigoMedidor?: string;
  estado?: string;
  telefono?: string;
  notas?: string;
};

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const filas: FilaImportada[] = Array.isArray(body?.registros) ? body.registros : [];

  if (filas.length === 0) {
    return NextResponse.json({ error: "No hay registros para importar" }, { status: 400 });
  }
  if (filas.length > MAX_REGISTROS) {
    return NextResponse.json({ error: `Máximo ${MAX_REGISTROS} registros por importación` }, { status: 400 });
  }

  const validos: (Required<Omit<FilaImportada, "estado">> & { estado: string })[] = [];
  const omitidos: { fila: number; motivo: string }[] = [];

  filas.forEach((fila, index) => {
    const nombreUsuario = (fila.nombreUsuario ?? "").trim();
    const sector = (fila.sector ?? "").trim();

    if (!nombreUsuario || !sector) {
      omitidos.push({ fila: index + 1, motivo: "Falta nombre del usuario o sector" });
      return;
    }

    const estadoCrudo = (fila.estado ?? "").trim();
    const estado = (ESTADOS_PREDIO as readonly string[]).includes(estadoCrudo) ? estadoCrudo : "Activo";

    validos.push({
      nombreUsuario,
      sector,
      predio: (fila.predio ?? "").trim(),
      vereda: (fila.vereda ?? "").trim(),
      codigoMedidor: (fila.codigoMedidor ?? "").trim(),
      estado,
      telefono: (fila.telefono ?? "").trim(),
      notas: (fila.notas ?? "").trim(),
    });
  });

  if (validos.length === 0) {
    return NextResponse.json(
      { error: "Ningún registro tiene nombre del usuario y sector válidos", omitidos },
      { status: 400 },
    );
  }

  await connectDB();
  const creados = await Predio.insertMany(validos, { ordered: false });

  return NextResponse.json({
    ok: true,
    creados: creados.length,
    omitidos,
  });
}
