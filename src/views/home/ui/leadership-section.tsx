import { BRAND } from "@/shared/config/constants";

const leaders = [
  {
    name: "Marlon Viesba",
    role: "Presidente",
    avatar: "https://assets.lfup.com.br/profiles/avatars/marlon.jpg",
    bio: "Business Intelligence no Bradesco, onde atuou na construção de visões analíticas, automação de processos e desenvolvimento de ferramentas de acompanhamento operacional com SQL, Python, Excel e JavaScript. Na LFUP, exerce liderança estratégica, definição de metas, governança e coordenação de projetos. Formado em Ciências Econômicas. CPA-20, Criptoativos, Risk Expert, Renda Fixa Expert e Excel Expert.",
  },
  {
    name: "Gabriel Guimarães",
    role: "Vice-Presidente",
    avatar: "https://assets.lfup.com.br/profiles/avatars/gabriel.jpg",
    bio: "CPA-20, com certificação em Análise de Crédito pela FGV. Atuou no Bradesco. Na LFUP, é responsável pela gestão integrada das áreas e suporte direto à presidência. Formado em Ciências Econômicas pela Universidade Positivo.",
  },
];

export function LeadershipSection() {
  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: BRAND.color.primary }}
          >
            Liderança
          </p>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-3xl"
            style={{ color: BRAND.color.primary }}
          >
            Quem conduz a LFUP
          </h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="rounded-2xl p-8 text-white"
              style={{ backgroundColor: BRAND.color.primary }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={leader.avatar}
                  alt={leader.name}
                  className="h-14 w-14 flex-shrink-0 rounded-full border-2 border-white/20 object-cover"
                />
                <div>
                  <p className="text-lg font-bold">{leader.name}</p>
                  <p className="text-sm font-medium text-white/60">
                    {leader.role}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/70">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
