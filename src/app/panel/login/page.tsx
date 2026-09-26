import { Suspense } from "react";
import LoginForm from "@/components/panel/LoginForm";

export const metadata = { title: "Acceso interno" };

export default function PanelLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-aqua-800 px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
