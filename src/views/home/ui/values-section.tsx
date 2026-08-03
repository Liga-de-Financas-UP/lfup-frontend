import { SectionHeader } from "./section-header";

const values = [
  "Aprendizado Contínuo",
  "Excelência Acadêmica e Profissional",
  "Colaboração e Trabalho em Equipe",
  "Ética e Transparência",
  "Networking e Conexões de Valor",
  "Disciplina e Comprometimento",
  "Orgulho de Pertencer",
];

export function ValuesSection() {
  return (
    <section className="border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <SectionHeader index="05" eyebrow="Nossos valores" title="O que nos move" />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <div
              key={value}
              className="flex items-center gap-4 rounded-2xl border border-cream/12 bg-ink-soft px-5 py-4 transition-colors hover:border-cream/30"
            >
              <span className="text-sm font-semibold tabular-nums text-sage">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-cream">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
