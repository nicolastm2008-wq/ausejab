"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShieldCheck, Trash2, UserX, X } from "lucide-react";
import type { UsuarioPlain } from "@/lib/data";

export default function UsuariosManager({
  usuarios,
  currentUserId,
}: {
  usuarios: UsuarioPlain[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"admin" | "editor">("editor");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, rol }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo crear el usuario");
      return;
    }

    setNombre("");
    setEmail("");
    setPassword("");
    setRol("editor");
    setCreating(false);
    router.refresh();
  }

  async function toggleActivo(usuario: UsuarioPlain) {
    await fetch(`/api/usuarios/${usuario._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !usuario.activo }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este usuario del panel interno?")) return;
    await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{usuarios.length} cuenta(s) del equipo interno</p>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" /> Nuevo usuario
          </button>
        )}
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-brand-200 bg-brand-50/40 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-slate-900">Nuevo usuario interno</h3>
            <button type="button" onClick={() => setCreating(false)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Nombre</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Contraseña temporal</label>
              <input
                type="text"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Rol</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as "admin" | "editor")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {saving ? "Creando..." : "Crear usuario"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {usuarios.map((u) => (
          <div key={u._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                {u.nombre}
                {u.rol === "admin" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                    <ShieldCheck className="h-3 w-3" /> Admin
                  </span>
                )}
                {!u.activo && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    Inactivo
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActivo(u)}
                disabled={u._id === currentUserId}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <UserX className="h-3.5 w-3.5" /> {u.activo ? "Desactivar" : "Activar"}
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                disabled={u._id === currentUserId}
                className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                aria-label="Eliminar usuario"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
