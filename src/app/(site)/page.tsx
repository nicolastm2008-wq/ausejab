import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Droplets,
  FileText,
  Landmark,
  MapPinned,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getCobertura, getConfiguracion, getFotosGaleria, getInformes, getJuntas } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default async function HomePage() {
  const [config, juntas, informes, cobertura, fotos] = await Promise.all([
    getConfiguracion(),
    getJuntas(),
    getInformes(),
    getCobertura(),
    getFotosGaleria(),
  ]);

  const juntaActual = juntas.find((j) => j.activa) ?? juntas[0];
  const anioActual = new Date().getFullYear();
  const antiguedad = anioActual - config.anioFundacion;
  const ultimosInformes = informes.slice(0, 3);
  const fotosDestacadas = fotos.slice(0, 4);
  const usuariosRegistrados = cobertura.reduce((acc, c) => acc + c.usuarios, 0);

  const accesos = [
    {
      href: "/historia",
      title: "Reseña histórica",
      desc: "Cómo nació el acueducto y su misión y visión.",
      icon: <Landmark className="h-5 w-5" />,
    },
    {
      href: "/juntas-directivas",
      title: "Juntas directivas",
      desc: `Cada periodo desde ${config.anioFundacion}, con sus integrantes.`,
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/informes",
      title: "Documentos",
      desc: "Estatutos, actas, Cámara de Comercio e informes por año.",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/avisos",
      title: "Avisos",
      desc: "Cortes, mantenimientos y novedades del servicio.",
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      href: "/cobertura",
      title: "Cobertura",
      desc: "Sectores y veredas que abastece el acueducto.",
      icon: <MapPinned className="h-5 w-5" />,
    },
    {
      href: "/galeria",
      title: "Galería",
      desc: "Fotos de mantenimientos y trabajo comunitario.",
      icon: <Camera className="h-5 w-5" />,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="/galeria-inicial/020.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/95 via-brand-900/90 to-aqua-900/85" />
        </div>

        <div className="container-page relative z-10 grid gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-brand-100 ring-1 ring-white/20">
              <Droplets className="h-3.5 w-3.5" /> Sirviendo desde {config.anioFundacion}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {config.siglas || config.nombre}
            </h1>
            {config.siglas && (
              <p className="mt-2 max-w-xl text-base font-medium text-brand-100">{config.nombre}</p>
            )}
            <p className="mt-4 max-w-xl text-lg text-brand-100">{config.eslogan}</p>
            <p className="mt-2 max-w-xl text-sm text-brand-200">
              {config.vereda}, {config.municipio} &mdash; {config.departamento}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/historia"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-800 shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Conoce nuestra historia <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/informes"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Ver informes y transparencia
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={<Landmark className="h-5 w-5" />} label="Años de servicio" value={`${antiguedad}+`} />
            <StatCard icon={<Users className="h-5 w-5" />} label="Usuarios registrados" value={`${usuariosRegistrados}`} />
            <StatCard icon={<MapPinned className="h-5 w-5" />} label="Sectores cubiertos" value={`${cobertura.length}`} />
            <StatCard icon={<FileText className="h-5 w-5" />} label="Documentos publicados" value={`${informes.length}`} />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-wave-pattern bg-repeat-x bg-bottom opacity-90" />
      </section>

      {/* Accesos rapidos */}
      <section className="container-page -mt-8 grid gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {accesos.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative z-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              {item.icon}
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
              Ver más <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      {/* Quienes somos */}
      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
            <Image
              src="/galeria-inicial/010.jpeg"
              alt="Control de calidad del agua realizado por el equipo del acueducto"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Quiénes somos"
              title={`${antiguedad}+ años cuidando el agua de nuestra comunidad`}
            />
            <p className="mt-4 text-slate-600">
              Desde {config.anioFundacion}, {config.siglas || config.nombre} administra el servicio de
              acueducto para las familias de {config.vereda}, en {config.municipio}, {config.departamento}.
              Nos encargamos del mantenimiento de la red, del control de calidad del agua y de la
              administración transparente del servicio frente a la comunidad de usuarios.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-brand-50 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <p className="text-sm text-brand-800">{config.eslogan}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/historia"
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
              >
                Nuestra historia <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Junta actual */}
      {juntaActual && (
        <section className="container-page py-16">
          <SectionHeading
            eyebrow="Gobierno actual"
            title="Junta Directiva vigente"
            description="Periodo en ejercicio, elegido por la Asamblea General de usuarios."
          />
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <div className="h-1.5 w-full" style={{ backgroundColor: juntaActual.colorAsociado }} />
            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {juntaActual.miembros.length === 0 && (
                <p className="text-sm text-slate-500">
                  Aún no se han cargado los integrantes de esta junta. Se pueden agregar desde el panel privado.
                </p>
              )}
              {juntaActual.miembros.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: juntaActual.colorAsociado }}
                  >
                    {m.nombre.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{m.nombre}</p>
                    <p className="text-xs text-slate-500">{m.cargo}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-right">
              <Link href="/juntas-directivas" className="text-sm font-medium text-brand-700 hover:underline">
                Ver todas las juntas desde {config.anioFundacion} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Galeria destacada */}
      {fotosDestacadas.length > 0 && (
        <section className="bg-slate-100/70 py-16">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Trabajo comunitario" title="Nuestro trabajo en fotos" />
              <Link href="/galeria" className="text-sm font-medium text-brand-700 hover:underline">
                Ver galería completa →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {fotosDestacadas.map((foto) => (
                <Link
                  key={foto._id}
                  href="/galeria"
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-soft"
                >
                  <Image
                    src={foto.url}
                    alt={foto.titulo}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-xs font-medium text-white">{foto.titulo}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ultimos informes */}
      {ultimosInformes.length > 0 && (
        <section className="py-16">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Transparencia"
                title="Últimos documentos publicados"
                description="Estatutos, actas, declaraciones DIAN y demás informes."
              />
              <Link href="/informes" className="text-sm font-medium text-brand-700 hover:underline">
                Ver todos los documentos →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {ultimosInformes.map((inf) => (
                <a
                  key={inf._id}
                  href={inf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                    <FileText className="h-3 w-3" /> {inf.anio}
                  </span>
                  <p className="font-medium text-slate-900">{inf.titulo}</p>
                  <p className="text-xs text-slate-500">{inf.tipo}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
        {icon}
      </span>
      <p className="mt-3 font-display text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-brand-100">{label}</p>
    </div>
  );
}
