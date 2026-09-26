import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/lib/auth";

export async function requireSession(): Promise<
  { session: SessionPayload; error: null } | { session: null; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireAdmin(): Promise<
  { session: SessionPayload; error: null } | { session: null; error: NextResponse }
> {
  const result = await requireSession();
  if (result.error) return result;
  if (result.session.rol !== "admin") {
    return {
      session: null,
      error: NextResponse.json({ error: "Se requiere rol de administrador" }, { status: 403 }),
    };
  }
  return result;
}
