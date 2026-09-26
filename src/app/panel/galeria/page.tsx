import { getFotosGaleria } from "@/lib/data";
import GaleriaManager from "@/components/panel/GaleriaManager";

export const metadata = { title: "Galería" };

export default async function PanelGaleriaPage() {
  const fotos = await getFotosGaleria();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Galería de obras</h1>
      <p className="mt-1 text-sm text-slate-500">
        Fotos de mantenimientos, mejoras a la red y trabajo comunitario. Se muestran en la galería
        pública del sitio.
      </p>
      <div className="mt-6">
        <GaleriaManager fotos={fotos} />
      </div>
    </div>
  );
}
