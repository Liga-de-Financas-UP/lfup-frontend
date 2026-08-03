interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}

/** Cabeçalho editorial consistente para as seções da home. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="font-display text-lg leading-none text-sage">
          {index}
        </span>
        <span className="text-[11px] uppercase tracking-[0.3em] text-cream/45">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-cream md:text-[2.5rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-relaxed text-cream/60">{description}</p>
      )}
    </div>
  );
}
