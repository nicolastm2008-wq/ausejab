import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUsuarios } from "@/lib/data";
import UsuariosManager from "@/components/panel/UsuariosManager";

export const metadata = { title: "Usuarios internos" };

export default async function PanelUsuariosPage() {
  const session = await getSession();
  if (!session || session.rol !== "admin") {
    redirect("/panel");
  }

  const usuarios = await getUsuarios();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Usuarios internos</h1>
      <p className="mt-1 text-sm text-slate-500">
        Administra quién tiene acceso al panel privado del acueducto.
      </p>
      <div className="mt-6">
        <UsuariosManager usuarios={usuarios} currentUserId={session.userId} />
      </div>
    </div>
  );
}
