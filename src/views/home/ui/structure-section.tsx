import { SectionHeader } from "./section-header";

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
    description: "Produção e suporte técnico. Elabora conteúdos e relatórios.",
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
    <section className="border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <SectionHeader
          index="07"
          eyebrow="Organização"
          title="Estrutura da Liga"
        />
        <div className="mt-14 divide-y divide-cream/12 border-y border-cream/12">
          {roles.map((role) => (
            <div
              key={role.title}
              className="grid gap-2 py-5 md:grid-cols-[220px_1fr] md:gap-8"
            >
              <p className="text-base font-semibold text-cream">{role.title}</p>
              <p className="text-sm leading-relaxed text-cream/55">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
