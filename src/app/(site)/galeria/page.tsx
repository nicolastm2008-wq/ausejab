import Image from "next/image";
import { Camera } from "lucide-react";
import { getFotosGaleria } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/site/PageHero";

export const metadata = { title: "Galería" };

export default async function GaleriaPage() {
  const fotos = await getFotosGaleria();

  return (
    <div>
      <PageHero
        eyebrow="Trabajo comunitario"
        eyebrowIcon={<Camera className="h-3.5 w-3.5" />}
        title="Galería de obras"
        description="Mantenimientos, mejoras a la red y trabajo comunitario del acueducto."
        imageSrc="/galeria-inicial/016.jpeg"
      />

      <section className="container-page py-14">
        <SectionHeading eyebrow="Fotos" title="Lo que hemos hecho" />

        {fotos.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-600">Aún no hay fotos publicadas.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fotos.map((foto) => (
              <figure key={foto._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                <div className="relative h-48 w-full bg-slate-100">
                  <Image src={foto.url} alt={foto.titulo} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-4">
                  <p className="text-sm font-semibold text-slate-900">{foto.titulo}</p>
                  {foto.descripcion && <p className="mt-1 text-xs text-slate-500">{foto.descripcion}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
