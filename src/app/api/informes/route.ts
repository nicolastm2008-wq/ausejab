import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Informe from "@/models/Informe";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  await connectDB();
  const informes = await Informe.find().sort({ anio: -1, createdAt: -1 });
  return NextResponse.json({ informes });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const { anio, tipo, titulo, descripcion, url, nombreArchivo, tamanioBytes } = body ?? {};

  if (!anio || !titulo || !url || !nombreArchivo) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  await connectDB();
  const informe = await Informe.create({
    anio: Number(anio),
    tipo,
    titulo,
    descripcion: descripcion ?? "",
    url,
    nombreArchivo,
    tamanioBytes: Number(tamanioBytes) || 0,
  });

  return NextResponse.json({ ok: true, informe }, { status: 201 });
}
