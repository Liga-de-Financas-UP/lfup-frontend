import Link from "next/link";
import { SafeImage } from "@/shared/ui/safe-image";
import { images } from "@/shared/config/images";
import { BRAND } from "@/shared/config/constants";

export function HeroSection() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center md:px-8 md:py-32">
      <SafeImage
        src={images.logo}
        alt={BRAND.name}
        width={72}
        height={72}
        className="mb-8 h-[72px] w-auto"
        unoptimized
      />
      <h1
        className="text-4xl font-bold leading-tight tracking-tight md:text-6xl"
        style={{ color: BRAND.color.primary }}
      >
        Liga de Finanças
        <br />
        <span className="font-light">da Universidade Positivo</span>
      </h1>
      <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-400 md:text-lg">
        A LFUP é uma associação formada por alunos da Universidade Positivo, dedicada a analisar o mercado financeiro, estimular a educação financeira e agregar experiências para o crescimento pessoal e profissional. Nosso lema: &ldquo;conhecer pessoas certas na hora certa.&rdquo;
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/processo-seletivo"
          className="rounded-full px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: BRAND.color.primary }}
        >
          Processo Seletivo
        </Link>
        <a
          href="#areas"
          className="rounded-full border px-8 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ color: BRAND.color.primary, borderColor: BRAND.color.primary }}
        >
          Conheça as áreas
        </a>
      </div>
    </section>
  );
}
