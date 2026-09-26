import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Predio from "@/models/Predio";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  await connectDB();
  const predios = await Predio.find().sort({ sector: 1, nombreUsuario: 1 });
  return NextResponse.json({ predios });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const nombreUsuario = typeof body?.nombreUsuario === "string" ? body.nombreUsuario.trim() : "";
  const sector = typeof body?.sector === "string" ? body.sector.trim() : "";

  if (!nombreUsuario || !sector) {
    return NextResponse.json({ error: "Nombre del usuario y sector son obligatorios" }, { status: 400 });
  }

  await connectDB();
  const predio = await Predio.create({
    nombreUsuario,
    sector,
    predio: body?.predio ?? "",
    vereda: body?.vereda ?? "",
    codigoMedidor: body?.codigoMedidor ?? "",
    estado: body?.estado || "Activo",
    telefono: body?.telefono ?? "",
    notas: body?.notas ?? "",
  });

  return NextResponse.json({ ok: true, predio }, { status: 201 });
}
