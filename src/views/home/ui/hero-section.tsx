import Link from "next/link";

const META = [
  { k: "6 anos", v: "de atuação" },
  { k: "50+", v: "membros ativos" },
];

export function HeroSection() {
  return (
    <section className="brand-mesh relative overflow-hidden border-b border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <p className="text-[11px] uppercase tracking-[0.3em] text-cream/50">
          Por alunos, para alunos
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-cream md:text-6xl">
          Liga de Finanças{" "}
          <span className="font-light text-cream/70">
            da Universidade Positivo
          </span>
        </h1>

        <p className="mt-6 max-w-xl leading-relaxed text-cream/60">
          Associação formada por alunos da Universidade Positivo, dedicada a
          analisar o mercado financeiro, estimular a educação financeira e
          conectar as pessoas certas na hora certa.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/processo-seletivo"
            className="inline-flex items-center justify-center bg-cream px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink transition hover:bg-cream/80"
          >
            Processo seletivo
          </Link>
          <a
            href="#areas"
            className="text-xs uppercase tracking-widest text-cream/60 underline underline-offset-8 transition hover:text-cream"
          >
            Conheça as áreas
          </a>
        </div>

        <dl className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-cream/15 pt-8">
          {META.map((m) => (
            <div key={m.k} className="flex items-baseline gap-2">
              <dt className="text-xl font-semibold text-cream">{m.k}</dt>
              <dd className="text-xs uppercase tracking-wider text-cream/45">
                {m.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
