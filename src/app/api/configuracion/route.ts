import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ConfiguracionModel from "@/models/Configuracion";
import { requireSession } from "@/lib/require-session";

const CAMPOS_EDITABLES = [
  "nombre",
  "siglas",
  "eslogan",
  "anioFundacion",
  "vereda",
  "municipio",
  "departamento",
  "nit",
  "telefono",
  "whatsapp",
  "email",
  "direccion",
  "horarioAtencion",
  "facebook",
  "instagram",
  "resenaHistorica",
  "mision",
  "vision",
  "colorPrimario",
  "colorSecundario",
] as const;

export async function PUT(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (campo in body) update[campo] = body[campo];
  }

  await connectDB();
  let doc = await ConfiguracionModel.findOne();
  if (!doc) {
    doc = await ConfiguracionModel.create(update);
  } else {
    doc.set(update);
    await doc.save();
  }

  return NextResponse.json({ ok: true, configuracion: doc });
}
