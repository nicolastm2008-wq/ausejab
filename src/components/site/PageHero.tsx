import Image from "next/image";
import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  imageSrc,
}: {
  eyebrow: string;
  eyebrowIcon?: ReactNode;
  title: string;
  description?: ReactNode;
  imageSrc?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900 pb-20 pt-16 text-white sm:pb-24 sm:pt-20">
      {imageSrc && (
        <div className="absolute inset-0">
          <Image src={imageSrc} alt="" fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/95 via-brand-900/88 to-aqua-900/80" />
        </div>
      )}
      <div className="container-page relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-200 ring-1 ring-white/20">
          {eyebrowIcon}
          {eyebrow}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base text-brand-100/90">{description}</p>}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 h-12 bg-wave-pattern bg-repeat-x bg-bottom opacity-90" />
    </section>
  );
}
