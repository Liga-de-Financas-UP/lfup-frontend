import { BRAND } from "@/shared/config/constants";
import type { Process } from "@/entities/department/model/types";

interface PsHeroProps {
  process: Process | null;
}

export function PsHero({ process }: PsHeroProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-16 text-center md:px-8 md:pt-24">
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: BRAND.color.primary }}
      >
        Processo Seletivo
      </p>
      <h1
        className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
        style={{ color: BRAND.color.primary }}
      >
        {process?.name || "Processo Seletivo LFUP"}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-gray-400">
        {process?.description ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Escolha a área de interesse e preencha o formulário."}
      </p>
    </section>
  );
}
