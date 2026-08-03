import { SectionHeader } from "./section-header";

const milestones = [
  {
    year: "2019",
    title: "Fundação",
    description:
      "Nasce o CFUP (Clube de Finanças UP), fundado na Osório pelo discente Flávio Biazin.",
  },
  {
    year: "2021",
    title: "Estatuto",
    description: "Criação do Estatuto oficial da Liga de Finanças.",
  },
  {
    year: "2023",
    title: "Atualização",
    description: "Atualização do Estatuto para acompanhar o crescimento da Liga.",
  },
  {
    year: "2025",
    title: "Reorganização",
    description:
      "Reorganização estratégica, kit de onboarding, plano de carreira e fortalecimento da cultura.",
  },
];

export function TimelineSection() {
  return (
    <section className="border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <SectionHeader
          index="06"
          eyebrow="Nossa história"
          title="Linha do tempo"
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-cream/12 bg-cream/12 md:grid-cols-4">
          {milestones.map((m) => (
            <div key={m.year} className="bg-ink-soft p-6">
              <span className="font-display text-5xl leading-none text-sage">
                {m.year}
              </span>
              <h3 className="mt-4 text-base font-semibold text-cream">
                {m.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/55">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
