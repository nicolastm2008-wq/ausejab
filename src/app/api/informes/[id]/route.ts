import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { connectDB } from "@/lib/db";
import Informe from "@/models/Informe";
import { requireSession } from "@/lib/require-session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();
  const informe = await Informe.findByIdAndDelete(id);

  if (informe?.url) {
    await del(informe.url).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
