import { SectionHeader } from "./section-header";

const leaders = [
  {
    name: "Geraldo Mazzini",
    role: "Presidente",
    avatar: "/team/geraldo.jpg",
    bio: (
      <>
        Aos 24 anos, cursou economia, construiu do zero a área de tecnologia do{" "}
        <a
          href="https://thenews.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-cream underline underline-offset-2 hover:text-cream/70"
        >
          the news
        </a>
        , maior jornal digital da América Latina, e fundou a empresa que viria a
        se tornar a{" "}
        <a
          href="https://www.instagram.com/notjournal.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-cream underline underline-offset-2 hover:text-cream/70"
        >
          Not Journal
        </a>
        . No currículo, passagens pelo Corinthians e pela Rappi e um ano vivendo
        em Londres. Mentor de startups no SebraePR, integrou o Instituto
        Formação de Líderes (IFL) de Curitiba.
      </>
    ),
  },
  {
    name: "João Mota",
    role: "Vice-Presidente",
    avatar: "/team/joao.jpg",
    bio: "Estudante de Administração na Universidade Positivo, entrou na LFUP como trainee de Marketing em 2025 e, poucos meses depois, assumiu a diretoria da área. Hoje, como Vice-Presidente, também é Secretário-Geral do Diretório Central dos Estudantes da Universidade. No mercado, atua com consultoria tributária no setor comercial.",
  },
];

export function LeadershipSection() {
  return (
    <section className="border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <SectionHeader index="03" eyebrow="Liderança" title="Quem conduz a LFUP" />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="rounded-2xl border border-cream/12 bg-ink-soft p-8"
            >
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={leader.avatar}
                  alt={leader.name}
                  className="h-14 w-14 flex-shrink-0 rounded-full border border-cream/20 object-cover"
                />
                <div>
                  <p className="text-lg font-bold text-cream">{leader.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-sage">
                    {leader.role}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-cream/65">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
