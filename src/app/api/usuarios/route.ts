import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Usuario from "@/models/Usuario";
import { requireAdmin } from "@/lib/require-session";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  await connectDB();
  const usuarios = await Usuario.find().select("-passwordHash").sort({ createdAt: -1 });
  return NextResponse.json({ usuarios });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const rol = body?.rol === "admin" ? "admin" : "editor";

  if (!nombre || !email || password.length < 8) {
    return NextResponse.json(
      { error: "Nombre, correo y una contraseña de al menos 8 caracteres son obligatorios" },
      { status: 400 },
    );
  }

  await connectDB();
  const existente = await Usuario.findOne({ email });
  if (existente) {
    return NextResponse.json({ error: "Ya existe un usuario con ese correo" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const usuario = await Usuario.create({ nombre, email, passwordHash, rol, activo: true });

  return NextResponse.json(
    { ok: true, usuario: { _id: usuario._id, nombre, email, rol } },
    { status: 201 },
  );
}
