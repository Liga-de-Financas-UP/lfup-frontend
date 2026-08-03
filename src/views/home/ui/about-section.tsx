import { SectionHeader } from "./section-header";

const stats = [
  { number: "50+", label: "Membros ativos" },
  { number: "8", label: "Diretorias" },
  { number: "6 anos", label: "De atuação" },
  { number: "100+", label: "Candidatos por PS" },
];

export function AboutSection() {
  return (
    <section className="border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-20">
          <div>
            <SectionHeader
              index="01"
              eyebrow="Sobre a LFUP"
              title="Formando os próximos líderes do mercado financeiro"
            />
            <div className="mt-6 max-w-lg space-y-4 leading-relaxed text-cream/60">
              <p>
                Fundada em 2019 pelo discente Flávio Biazin (Contábeis-Osório), a
                LFUP nasceu da necessidade dos alunos compreenderem em
                profundidade temas como finanças pessoais, finanças corporativas
                e finanças públicas, criando um espaço de aprendizado prático e
                colaborativo.
              </p>
              <p>
                Ao longo de sua trajetória, promoveu palestras, workshops e
                projetos de pesquisa, sempre aproximando o conhecimento acadêmico
                da realidade do mercado. Em 2025, completou 6 anos de história,
                marcada pela determinação e pelo compromisso de formar
                profissionais mais preparados para os desafios do mundo
                financeiro.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-cream/12 bg-cream/12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-ink-soft p-8 text-center"
              >
                <p className="text-4xl font-bold text-cream">{stat.number}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-cream/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
