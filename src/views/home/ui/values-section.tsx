import { BRAND } from "@/shared/config/constants";

const values = [
  "Aprendizado Contínuo",
  "Excelência Acadêmica e Profissional",
  "Colaboração e Trabalho em Equipe",
  "Ética e Transparência",
  "Networking e Conexões de Valor",
  "Disciplina e Comprometimento",
  "Orgulho de Pertencer",
];

export function ValuesSection() {
  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: BRAND.color.primary }}
          >
            Nossos valores
          </p>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-3xl"
            style={{ color: BRAND.color.primary }}
          >
            O que nos move
          </h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <div
              key={value}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-5 py-4 transition-all hover:border-gray-200 hover:shadow-sm"
            >
              <span
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: BRAND.color.primary }}
              >
                {i + 1}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: BRAND.color.primary }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
