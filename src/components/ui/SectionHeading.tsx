export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-slate-600">{description}</p>}
    </div>
  );
}
