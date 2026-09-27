import { Droplets } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-brand-700">
      <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-brand-50">
        <Droplets className="h-6 w-6 animate-bounce" />
      </span>
      <p className="text-sm text-slate-500">Cargando...</p>
    </div>
  );
}
