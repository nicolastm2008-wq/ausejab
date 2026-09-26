import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import JuntaDirectiva from "@/models/JuntaDirectiva";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  await connectDB();
  const juntas = await JuntaDirectiva.find().sort({ periodoInicio: -1 });
  return NextResponse.json({ juntas });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const periodoInicio = Number(body?.periodoInicio);
  const periodoFin = Number(body?.periodoFin);

  if (!Number.isFinite(periodoInicio) || !Number.isFinite(periodoFin)) {
    return NextResponse.json({ error: "periodoInicio y periodoFin son obligatorios" }, { status: 400 });
  }

  await connectDB();

  if (body?.activa) {
    await JuntaDirectiva.updateMany({}, { $set: { activa: false } });
  }

  const junta = await JuntaDirectiva.create({
    periodoInicio,
    periodoFin,
    colorAsociado: typeof body?.colorAsociado === "string" ? body.colorAsociado : "#1c65c9",
    miembros: Array.isArray(body?.miembros) ? body.miembros : [],
    notas: typeof body?.notas === "string" ? body.notas : "",
    activa: Boolean(body?.activa),
  });

  return NextResponse.json({ ok: true, junta }, { status: 201 });
}
