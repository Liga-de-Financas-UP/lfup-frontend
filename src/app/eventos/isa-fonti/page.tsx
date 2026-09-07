import type { Metadata } from "next";
import localFont from "next/font/local";
import { BIO_PHOTO, EVENT, EVENT_PHOTOS, LINKS, SPEAKER_PHOTO } from "./config";
import { PortraitMarquee, SpeakerPhoto } from "@/shared/ui/lp-media";
import { EventRegistrationForm } from "@/shared/ui/event-registration-form";

const gloucester = localFont({
  src: "../../fonts/gloucester-extra-condensed.ttf",
  display: "swap",
});

const DISPLAY_FONT = gloucester.style.fontFamily;

/*
 * Identidade da LP: papel quente, tinta quase preta e um vermelho garnet
 * discreto (aceno ao rubro-negro da trajetória dela no Flamengo Esports),
 * usado apenas em rótulos, sublinhados e palavras-chave.
 */

// Números que resumem a trajetória. Edite conforme atualizar.
const STATS = [
  { valor: "2M+", legenda: "seguidores acompanham sua trajetória" },
  { valor: "17 anos", legenda: "a idade em que entrou no competitivo" },
] as const;

export const metadata: Metadata = {
  title: "Dona do Jogo, com Isabelli Fontineli | LFUP",
  description:
    "Dona do Jogo: talk com Isabelli Fontineli, uma das maiores vozes do Free Fire no Brasil, sobre como ocupar espaços em indústrias dominadas por homens. Evento aberto, voltado ao público feminino, com inscrição. Semana Acadêmica da UP, realização LFUP.",
  openGraph: {
    title: "Dona do Jogo, um talk com Isabelli Fontineli",
    description:
      "Talk com Isabelli Fontineli, ex-jogadora profissional de Free Fire com passagens por B4 e Flamengo Esports, na Semana Acadêmica da Universidade Positivo. Evento aberto, voltado ao público feminino, com inscrição.",
  },
};

export default function IsaFontiPage() {
  return (
    <div className="min-h-screen bg-[#f7f2ec] font-sans text-[#1c1417] antialiased selection:bg-[#9E1B32] selection:text-white">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <span
            className="text-3xl lowercase leading-none"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "-0.02em" }}
          >
            lfup.
          </span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#9E1B32]">
            Semana Acadêmica
          </span>
        </div>
      </header>

      {/* Hero: split editorial. Foto sangrada na borda esquerda, título
          invadindo a imagem, conteúdo à direita (referência VendaMais). */}
      <section className="border-b border-black/10">
        <div className="grid md:min-h-[640px] md:grid-cols-[42%_1fr]">
          {/* Foto, colada na borda da tela */}
          <div className="relative aspect-[3/4] sm:aspect-[3/2] md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SPEAKER_PHOTO}
              alt="Isabelli Fontineli"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Mobile: eyebrow como recorte de papel sobre a foto */}
            <p className="absolute left-0 top-0 bg-[#f7f2ec] py-2.5 pl-6 pr-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#9E1B32] md:hidden">
              LFUP apresenta
            </p>
            <a
              href={LINKS.instagramIsa}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#9E1B32] md:left-4 md:right-auto"
            >
              @isaffonti
            </a>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col justify-center px-6 pb-14 md:py-20 md:pl-0 md:pr-10 lg:pr-20">
            <p className="hidden text-xs font-semibold uppercase tracking-[0.35em] text-[#9E1B32] md:block md:pl-14">
              LFUP apresenta
            </p>
            {/* Mobile: o título sobe e invade a foto; desktop: invade pela lateral */}
            <h1
              className="relative -mt-14 text-[22vw] uppercase leading-[0.82] md:-ml-20 md:mt-5 md:text-[8rem] lg:-ml-28 lg:text-[9.5rem]"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Dona
              <br />
              <span className="text-[#9E1B32]">do jogo</span>
            </h1>

            <div className="mt-10 max-w-lg space-y-3 text-sm leading-relaxed text-black/60 md:pl-14">
              <p className="text-lg leading-snug text-black md:text-xl">
                Disseram que o jogo não era para ela. Ela virou uma das maiores
                vozes do Free Fire no Brasil.
              </p>
              <p>
                Um talk aberto, voltado ao público feminino, sobre ocupar
                espaços em indústrias dominadas por homens.
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-black/45">
                {EVENT.local.nome} · {EVENT.semana} ·{" "}
                {EVENT.dataHora ?? "horário em breve"}
              </p>
            </div>

            <div className="mt-10 md:pl-14">
              <a
                href={LINKS.inscricao}
                className="inline-flex items-center justify-center bg-[#1c1417] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#f7f2ec] transition-colors hover:bg-[#9E1B32]"
              >
                Quero participar
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6">

        {/* Números */}
        <section className="py-12 md:py-16">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.legenda}>
                <dt
                  className="text-6xl leading-none md:text-7xl"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {s.valor}
                </dt>
                <dd className="mt-3 text-[11px] uppercase tracking-[0.2em] text-black/50">
                  {s.legenda}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* A convidada */}
        <section className="border-t border-black/10 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <div className="max-w-xs">
              <SpeakerPhoto
                src={BIO_PHOTO}
                alt="Isabelli Fontineli"
                tone="light"
                grayscale={false}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9E1B32]">
                A convidada
              </p>
              <h2
                className="mt-5 text-6xl uppercase leading-none md:text-7xl"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                <a
                  href={LINKS.instagramIsa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#9E1B32]"
                >
                  Isabelli Fontineli
                </a>
              </h2>
              <div className="mt-6 max-w-lg space-y-4 leading-relaxed text-black/65">
                <p>
                  Quando Isabelli começou a jogar Free Fire, aos 17 anos, ouviu
                  em casa que era perda de tempo. Hoje, mais de 2 milhões de
                  pessoas acompanham cada passo dela.
                </p>
                <p>
                  No competitivo, vestiu as cores da B4 Esports e do Flamengo
                  Esports, dois dos maiores nomes do e-sports brasileiro, em um
                  cenário onde mulheres precisam provar duas vezes que merecem
                  estar ali. Enfrentou a cobrança desproporcional, os ataques
                  públicos e a velha suposição de que o sucesso de uma mulher
                  nunca é mérito dela.
                </p>
                <p>
                  Pausou tudo pela maternidade. Voltou. Seguiu ocupando espaço.
                  É essa história que ela traz para o palco da Semana
                  Acadêmica: o que fica para qualquer mulher mirando uma
                  indústria que ainda não a espera.
                </p>
              </div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
                Free Fire · B4 Esports · Flamengo Esports
              </p>
            </div>
          </div>
        </section>

        {/* Fotos */}
        <section className="border-t border-black/10 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9E1B32]">
            Isabelli Fontineli
          </p>
          <div className="mt-8">
            <PortraitMarquee
              photos={EVENT_PHOTOS}
              emptyHint="public/eventos/isa-fonti/"
              tone="light"
            />
          </div>
        </section>

        {/* Manifesto */}
        <section className="border-t border-black/10 py-24 text-center md:py-32">
          <h2
            className="mx-auto max-w-3xl text-6xl uppercase leading-[0.9] md:text-8xl"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Espaço não se pede.
            <br />
            <span className="text-[#9E1B32]">Se ocupa.</span>
          </h2>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <a
              href={LINKS.inscricao}
              className="inline-flex items-center justify-center bg-[#1c1417] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#f7f2ec] transition-colors hover:bg-[#9E1B32]"
            >
              Quero participar
            </a>
            <a
              href={LINKS.instagramLfup}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-widest text-black/60 underline decoration-[#9E1B32]/60 underline-offset-8 transition hover:text-[#9E1B32]"
            >
              Seguir a LFUP
            </a>
          </div>
        </section>

        {/* Inscrição */}
        <section
          id="inscricao"
          className="scroll-mt-16 border-t border-black/10 py-20 md:py-28"
        >
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9E1B32]">
                Inscrição
              </p>
              <h2
                className="mt-5 text-6xl uppercase leading-none md:text-7xl"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                Garanta seu lugar
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-black/60">
                Evento aberto e voltado ao público feminino. Não é preciso ser
                membro da LFUP, mas as vagas são limitadas.
              </p>
            </div>
            <div className="md:pt-2">
              <EventRegistrationForm slug="isa-fonti" tone="light" />
            </div>
          </div>
        </section>

        {/* Informações */}
        <section className="grid border-t border-black/10 py-20 md:grid-cols-3 md:gap-12 md:py-28">
          <div className="py-4 md:py-0">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9E1B32]">
              Local
            </p>
            <p className="mt-4 font-semibold">{EVENT.local.nome}</p>
            <p className="mt-1 text-sm leading-relaxed text-black/60">
              {EVENT.local.endereco}
            </p>
            <a
              href={EVENT.local.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-black/60 underline decoration-[#9E1B32]/60 underline-offset-4 transition hover:text-[#9E1B32]"
            >
              Ver no mapa
            </a>
          </div>
          <div className="border-t border-black/10 py-4 md:border-none md:py-0">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9E1B32]">
              Data
            </p>
            <p className="mt-4 font-semibold">
              Semana Acadêmica · {EVENT.semana}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-black/60">
              {EVENT.dataHora ??
                "O dia e o horário do talk serão confirmados em breve."}
            </p>
          </div>
          <div className="border-t border-black/10 py-4 md:border-none md:py-0">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9E1B32]">
              Acesso
            </p>
            <p className="mt-4 font-semibold">
              Evento aberto, voltado ao público feminino
            </p>
            <p className="mt-1 text-sm leading-relaxed text-black/60">
              Não é preciso ser membro da LFUP para participar, mas é
              necessário se inscrever. As vagas são limitadas.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-black/40 md:flex-row">
          <p>Realização: Liga de Finanças da Universidade Positivo</p>
          <p>Semana Acadêmica · Universidade Positivo</p>
        </div>
      </footer>
    </div>
  );
}
