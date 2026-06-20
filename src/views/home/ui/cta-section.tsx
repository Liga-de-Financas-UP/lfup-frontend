import Link from "next/link";
import { BRAND } from "@/shared/config/constants";

export function CtaSection() {
  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-8 md:py-28">
        <h2
          className="text-2xl font-bold tracking-tight md:text-3xl"
          style={{ color: BRAND.color.primary }}
        >
          Faça parte da LFUP
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-gray-400">
          A LFUP está aberta a todos os alunos com vínculo com a Universidade
          Positivo. Ao entrar, você inicia como Trainee, participando de
          treinamentos e recebendo orientação dos analistas e diretores, com a
          possibilidade de crescer até cargos de liderança. Inscreva-se no nosso
          processo seletivo.
        </p>
        <Link
          href="/processo-seletivo"
          className="mt-8 inline-block rounded-full px-10 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: BRAND.color.primary }}
        >
          Inscreva-se agora
        </Link>
      </div>
    </section>
  );
}
