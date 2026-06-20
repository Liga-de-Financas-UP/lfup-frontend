import { BRAND } from "@/shared/config/constants";

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
    <section className="border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: BRAND.color.primary }}
          >
            Cultura
          </p>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-3xl"
            style={{ color: BRAND.color.primary }}
          >
            DECOLA
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-gray-400">
            Nosso acróstico cultural que guia tudo o que fazemos na Liga.
          </p>
        </div>
        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {decola.map((item) => (
            <div
              key={item.letter}
              className="flex gap-5 rounded-xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-sm"
            >
              <span
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: BRAND.color.primary }}
              >
                {item.letter}
              </span>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: BRAND.color.primary }}
                >
                  {item.word}
                </p>
                <p className="mt-1 text-sm text-gray-400">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
