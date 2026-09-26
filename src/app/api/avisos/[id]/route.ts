import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Aviso from "@/models/Aviso";
import { requireSession } from "@/lib/require-session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const titulo = typeof body.titulo === "string" ? body.titulo.trim() : "";
  const mensaje = typeof body.mensaje === "string" ? body.mensaje.trim() : "";
  if (!titulo || !mensaje) {
    return NextResponse.json({ error: "Título y mensaje son obligatorios" }, { status: 400 });
  }

  await connectDB();
  const aviso = await Aviso.findByIdAndUpdate(
    id,
    {
      $set: {
        titulo,
        mensaje,
        tipo: body.tipo || "Informativo",
        fechaEvento: body.fechaEvento ? new Date(body.fechaEvento) : undefined,
        activo: Boolean(body.activo),
      },
    },
    { new: true },
  );

  if (!aviso) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, aviso });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();
  await Aviso.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
