import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import JuntaDirectiva from "@/models/JuntaDirectiva";
import { requireSession } from "@/lib/require-session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  await connectDB();

  if (body.activa) {
    await JuntaDirectiva.updateMany({ _id: { $ne: id } }, { $set: { activa: false } });
  }

  const junta = await JuntaDirectiva.findByIdAndUpdate(
    id,
    {
      $set: {
        periodoInicio: Number(body.periodoInicio),
        periodoFin: Number(body.periodoFin),
        colorAsociado: body.colorAsociado,
        miembros: Array.isArray(body.miembros) ? body.miembros : [],
        notas: body.notas ?? "",
        activa: Boolean(body.activa),
      },
    },
    { new: true },
  );

  if (!junta) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true, junta });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();
  await JuntaDirectiva.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
