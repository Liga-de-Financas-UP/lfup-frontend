import { SectionHeader } from "./section-header";

const decola = [
  {
    letter: "D",
    word: "Disciplina",
    text: "Disciplina e comprometimento não são opção, são nosso jeito de jogar.",
  },
  {
    letter: "E",
    word: "Excelência",
    text: "Misturamos estudo e mercado como ninguém — sempre buscando dar o nosso melhor.",
  },
  {
    letter: "C",
    word: "Conexão",
    text: "Networking que realmente importa: gente, ideias e oportunidades conectadas.",
  },
  {
    letter: "O",
    word: "Orgulho",
    text: "Quem vive a Liga, sabe o que é fazer parte de algo maior.",
  },
  {
    letter: "L",
    word: "Limpo",
    text: "Ética, transparência e respeito: porque ganhar é bom, mas ganhar certo é melhor.",
  },
  {
    letter: "A",
    word: "Aprender",
    text: "Aqui o conhecimento não tem fim: teoria, prática e aquele toque de mercado real.",
  },
];

export function CultureSection() {
  return (
    <section className="border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <SectionHeader
          index="04"
          eyebrow="Cultura"
          title="DECOLA"
          description="Nosso acróstico cultural que guia tudo o que fazemos na Liga."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {decola.map((item) => (
            <div
              key={item.letter}
              className="flex gap-5 rounded-2xl border border-cream/12 bg-ink-soft p-6"
            >
              <span
                className="font-display text-5xl leading-none text-sage"
                style={{ letterSpacing: "-0.02em" }}
              >
                {item.letter}
              </span>
              <div>
                <p className="text-sm font-semibold text-cream">{item.word}</p>
                <p className="mt-1 text-sm leading-relaxed text-cream/55">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
