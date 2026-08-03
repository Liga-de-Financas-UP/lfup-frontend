import type { Process } from "@/entities/department/model/types";

interface PsHeroProps {
  process: Process | null;
}

const META = [
  { k: "8", v: "áreas de atuação" },
  { k: "Alunos UP", v: "@up.edu.br · @cs.up.edu.br" },
  { k: "100% online", v: "inscrição pelo site" },
];

export function PsHero({ process }: PsHeroProps) {
  return (
    <section className="brand-mesh border-b border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.35em] text-cream/50">
            Processo Seletivo
          </p>
          {process?.semester && (
            <span className="rounded-full border border-cream/20 px-2.5 py-0.5 text-[11px] font-medium text-cream/70">
              {process.semester}
            </span>
          )}
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-cream md:text-6xl">
          Inscrições abertas.
        </h1>

        <p className="mt-5 max-w-xl leading-relaxed text-cream/60">
          {process?.description ||
            "Escolha a sua área de interesse e preencha o formulário. É por aqui que começa a sua trajetória na LFUP."}
        </p>

        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-cream/15 pt-6">
          {META.map((m) => (
            <div key={m.v}>
              <dt className="text-lg font-semibold text-cream">{m.k}</dt>
              <dd className="text-xs uppercase tracking-wider text-cream/45">
                {m.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
