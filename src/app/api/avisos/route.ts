import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Aviso from "@/models/Aviso";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  await connectDB();
  const avisos = await Aviso.find().sort({ activo: -1, fechaEvento: 1, createdAt: -1 });
  return NextResponse.json({ avisos });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const titulo = typeof body?.titulo === "string" ? body.titulo.trim() : "";
  const mensaje = typeof body?.mensaje === "string" ? body.mensaje.trim() : "";

  if (!titulo || !mensaje) {
    return NextResponse.json({ error: "Título y mensaje son obligatorios" }, { status: 400 });
  }

  await connectDB();
  const aviso = await Aviso.create({
    titulo,
    mensaje,
    tipo: body?.tipo || "Informativo",
    fechaEvento: body?.fechaEvento ? new Date(body.fechaEvento) : undefined,
    activo: body?.activo !== false,
  });

  return NextResponse.json({ ok: true, aviso }, { status: 201 });
}
