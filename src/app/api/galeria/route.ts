import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FotoGaleria from "@/models/FotoGaleria";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  await connectDB();
  const fotos = await FotoGaleria.find().sort({ createdAt: -1 });
  return NextResponse.json({ fotos });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const titulo = typeof body?.titulo === "string" ? body.titulo.trim() : "";
  const url = typeof body?.url === "string" ? body.url : "";

  if (!titulo || !url) {
    return NextResponse.json({ error: "Título y url son obligatorios" }, { status: 400 });
  }

  await connectDB();
  const foto = await FotoGaleria.create({
    titulo,
    descripcion: body?.descripcion ?? "",
    url,
  });

  return NextResponse.json({ ok: true, foto }, { status: 201 });
}
