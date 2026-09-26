import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Usuario from "@/models/Usuario";
import { createSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña son obligatorios" }, { status: 400 });
  }

  await connectDB();
  const usuario = await Usuario.findOne({ email });

  if (!usuario || !usuario.activo) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(password, usuario.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  usuario.ultimoAcceso = new Date();
  await usuario.save();

  const token = await createSessionToken({
    userId: usuario._id.toString(),
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
  });

  const response = NextResponse.json({
    ok: true,
    usuario: { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
  });
  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}
