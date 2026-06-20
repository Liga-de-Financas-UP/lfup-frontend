import { BRAND } from "@/shared/config/constants";

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
    <section className="border-t border-gray-100 bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: BRAND.color.primary }}
          >
            Nossa história
          </p>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-3xl"
            style={{ color: BRAND.color.primary }}
          >
            Linha do tempo
          </h2>
        </div>
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="relative space-y-8 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-gray-200">
            {milestones.map((m) => (
              <div key={m.year} className="relative">
                <div
                  className="absolute -left-8 top-1 h-[7px] w-[7px] rounded-full"
                  style={{ backgroundColor: BRAND.color.primary }}
                />
                <div className="rounded-xl border border-gray-100 bg-white p-6">
                  <span
                    className="text-xs font-bold"
                    style={{ color: BRAND.color.primary }}
                  >
                    {m.year}
                  </span>
                  <h3
                    className="mt-1 text-base font-semibold"
                    style={{ color: BRAND.color.primary }}
                  >
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-400">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
