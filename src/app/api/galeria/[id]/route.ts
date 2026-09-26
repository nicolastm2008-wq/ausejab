import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { connectDB } from "@/lib/db";
import FotoGaleria from "@/models/FotoGaleria";
import { requireSession } from "@/lib/require-session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();
  const foto = await FotoGaleria.findByIdAndDelete(id);

  if (foto?.url) {
    await del(foto.url).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
