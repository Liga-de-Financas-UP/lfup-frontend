import { BRAND } from "@/shared/config/constants";

const stats = [
  { number: "50+", label: "Membros ativos" },
  { number: "8", label: "Diretorias" },
  { number: "6 anos", label: "De atuação" },
  { number: "100+", label: "Candidatos por PS" },
];

export function AboutSection() {
  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: BRAND.color.primary }}
            >
              Sobre a LFUP
            </p>
            <h2
              className="mt-3 text-2xl font-bold tracking-tight md:text-3xl"
              style={{ color: BRAND.color.primary }}
            >
              Formando os próximos líderes do mercado financeiro
            </h2>
            <p className="mt-5 leading-relaxed text-gray-400">
              Fundada em 2019 pelo discente Flávio Biazin (Contábeis-Osório), a
              LFUP nasceu da necessidade dos alunos compreenderem em profundidade
              temas como finanças pessoais, finanças corporativas e finanças
              públicas, criando um espaço de aprendizado prático e colaborativo.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              Ao longo de sua trajetória, a LFUP tem promovido palestras,
              workshops e projetos de pesquisa, sempre com o objetivo de
              aproximar o conhecimento acadêmico da realidade do mercado. Em
              2025, completamos 6 anos de história, marcada pela determinação,
              pelo crescimento coletivo e pelo compromisso de formar alunos em
              profissionais mais preparados para os desafios do mundo financeiro.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-100 bg-white p-6 text-center transition-shadow hover:shadow-sm"
              >
                <p
                  className="text-3xl font-bold"
                  style={{ color: BRAND.color.primary }}
                >
                  {stat.number}
                </p>
                <p className="mt-1 text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
