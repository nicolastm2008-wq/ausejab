import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UsuarioModel from "@/models/Usuario";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("key") !== "ausavesjab2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const newPassword = "Acueducto2026!";
    const hash = await bcrypt.hash(newPassword, 12);
    const user = await UsuarioModel.findOneAndUpdate(
      { rol: "admin" },
      { passwordHash: hash },
      { new: true }
    );
    if (!user) return NextResponse.json({ error: "No admin found" }, { status: 404 });
    return NextResponse.json({ ok: true, email: user.email, newPassword });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
