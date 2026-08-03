import Link from "next/link";

export function CtaSection() {
  return (
    <section className="brand-mesh border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-cream md:text-5xl">
          Faça parte da LFUP.
        </h2>
        <p className="mx-auto mt-6 max-w-lg leading-relaxed text-cream/60">
          Aberta a todos os alunos com vínculo com a Universidade Positivo. Você
          entra como Trainee, participa de treinamentos e recebe orientação de
          analistas e diretores — com a possibilidade de crescer até cargos de
          liderança.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <Link
            href="/processo-seletivo"
            className="inline-flex items-center justify-center bg-cream px-8 py-4 text-sm font-semibold uppercase tracking-widest text-ink transition hover:bg-cream/80"
          >
            Inscreva-se agora
          </Link>
          <a
            href="#areas"
            className="text-sm uppercase tracking-widest text-cream/60 underline underline-offset-8 transition hover:text-cream"
          >
            Conheça as áreas
          </a>
        </div>
      </div>
    </section>
  );
}
