import { BRAND } from "@/shared/config/constants";

const roles = [
  {
    title: "Conselho",
    description:
      "Professores da Business School e ex-membros de liderança. Órgão consultivo.",
  },
  {
    title: "Presidente",
    description:
      "Lidera a visão estratégica. Obrigatoriamente aluno da Business School.",
  },
  {
    title: "Vice-Presidente",
    description:
      "Gestão integrada das áreas. Obrigatoriamente aluno da Business School.",
  },
  {
    title: "Diretor de área",
    description:
      "Lidera sua especialidade. Pode ser aluno da UP ou profissional do mercado.",
  },
  {
    title: "Analista",
    description:
      "Produção e suporte técnico. Elabora conteúdos e relatórios.",
  },
  {
    title: "Trainee",
    description: "Membro em formação. Participa de treinamentos.",
  },
  {
    title: "Membro",
    description: "Alocado em área de especialidade. Qualquer aluno da UP.",
  },
];

export function StructureSection() {
  return (
    <section className="border-t border-gray-100 bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: BRAND.color.primary }}
          >
            Organização
          </p>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-3xl"
            style={{ color: BRAND.color.primary }}
          >
            Estrutura da Liga
          </h2>
        </div>
        <div className="mx-auto mt-14 max-w-2xl space-y-3">
          {roles.map((role, i) => (
            <div
              key={role.title}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white px-6 py-5 transition-all hover:border-gray-200 hover:shadow-sm"
            >
              <div
                className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: BRAND.color.primary }}
              />
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: BRAND.color.primary }}
                >
                  {role.title}
                </p>
                <p className="mt-0.5 text-sm text-gray-400">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
