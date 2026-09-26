import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Usuario from "@/models/Usuario";
import { requireAdmin } from "@/lib/require-session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.nombre === "string" && body.nombre.trim()) update.nombre = body.nombre.trim();
  if (body.rol === "admin" || body.rol === "editor") update.rol = body.rol;
  if (typeof body.activo === "boolean") {
    if (id === auth.session.userId && body.activo === false) {
      return NextResponse.json({ error: "No puedes desactivar tu propia cuenta" }, { status: 400 });
    }
    update.activo = body.activo;
  }
  if (typeof body.password === "string" && body.password.length >= 8) {
    update.passwordHash = await bcrypt.hash(body.password, 12);
  }

  await connectDB();
  const usuario = await Usuario.findByIdAndUpdate(id, { $set: update }, { new: true }).select(
    "-passwordHash",
  );

  if (!usuario) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, usuario });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  if (id === auth.session.userId) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 });
  }

  await connectDB();
  await Usuario.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
