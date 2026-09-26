import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Predio from "@/models/Predio";
import { requireSession } from "@/lib/require-session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const nombreUsuario = typeof body.nombreUsuario === "string" ? body.nombreUsuario.trim() : "";
  const sector = typeof body.sector === "string" ? body.sector.trim() : "";
  if (!nombreUsuario || !sector) {
    return NextResponse.json({ error: "Nombre del usuario y sector son obligatorios" }, { status: 400 });
  }

  await connectDB();
  const predio = await Predio.findByIdAndUpdate(
    id,
    {
      $set: {
        nombreUsuario,
        sector,
        predio: body.predio ?? "",
        vereda: body.vereda ?? "",
        codigoMedidor: body.codigoMedidor ?? "",
        estado: body.estado || "Activo",
        telefono: body.telefono ?? "",
        notas: body.notas ?? "",
      },
    },
    { new: true },
  );

  if (!predio) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, predio });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();
  await Predio.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
