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
    <section className="relative overflow-hidden bg-brand-900 py-16 text-white sm:py-20">
      {imageSrc && (
        <div className="absolute inset-0">
          <Image src={imageSrc} alt="" fill sizes="100vw" className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/95 via-brand-900/90 to-aqua-900/80" />
        </div>
      )}
      <div className="container-page relative z-10">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-200">
          {eyebrowIcon}
          {eyebrow}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-brand-100">{description}</p>}
      </div>
    </section>
  );
}
