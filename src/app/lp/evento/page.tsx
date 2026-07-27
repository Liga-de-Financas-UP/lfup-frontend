import type { Metadata } from "next";
import localFont from "next/font/local";
import { EVENT, EVENT_PHOTOS, LINKS, LOGOS, SPEAKER_PHOTO } from "./config";
import { PhotoCarousel, SpeakerPhoto } from "./media";

const gloucester = localFont({
  src: "./fonts/gloucester-extra-condensed.ttf",
  display: "swap",
});

const LFUP_WORDMARK_FONT = gloucester.style.fontFamily;

export const metadata: Metadata = {
  title: "Oratória para Negócios com Diego Endrigo | LFUP",
  description:
    "Palestra presencial no Âmbar, em Curitiba: oratória voltada a negócios com Diego Endrigo, fundador e CEO da Utah Invest (XP). Realização Liga de Finanças da Universidade Positivo.",
  openGraph: {
    title: "Oratória para Negócios com Diego Endrigo (Utah Invest | XP)",
    description:
      "Evento presencial da LFUP no Âmbar, Curitiba. Vagas garantidas para membros; lista de espera aberta.",
  },
};

export default function EventoPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white antialiased selection:bg-white selection:text-black">
      {/* Header */}
      <header className="border-b border-white/15">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <span
            className="text-3xl lowercase leading-none text-white"
            style={{
              fontFamily: LFUP_WORDMARK_FONT,
              letterSpacing: "-0.02em",
            }}
          >
            lfup.
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGOS.xp}
            alt="XP"
            className="h-4 w-auto brightness-0 invert"
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* Hero */}
        <section className="py-24 md:py-36">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">
            LFUP × XP apresentam
          </p>
          <h1 className="mt-8 text-[13vw] font-black uppercase leading-[0.95] tracking-tight md:text-8xl">
            Oratória
            <br />
            <span className="font-extralight tracking-normal text-white/90">
              para negócios
            </span>
          </h1>

          <div className="mt-12 space-y-1.5 text-sm leading-relaxed text-white/60">
            <p className="text-base text-white">
              Diego Endrigo
              <span className="text-white/50">
                , fundador e CEO da Utah Invest, escritório credenciado à XP
              </span>
            </p>
            <p>
              {EVENT.local.nome}, Curitiba ·{" "}
              {EVENT.dataHora ?? "data e horário em breve"}
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <a
              href={LINKS.inscricaoMembros}
              className="inline-flex items-center justify-center bg-white px-8 py-4 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-white/80"
            >
              Sou membro · confirmar presença
            </a>
            <a
              href={LINKS.listaDeEspera}
              className="text-sm uppercase tracking-widest text-white/60 underline underline-offset-8 transition hover:text-white"
            >
              Não sou membro · lista de espera
            </a>
          </div>
        </section>

        {/* Palestrante */}
        <section className="border-t border-white/15 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <div className="max-w-xs">
              <SpeakerPhoto src={SPEAKER_PHOTO} alt="Diego Endrigo" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                O palestrante
              </p>
              <h2 className="mt-6 text-3xl font-bold leading-tight md:text-4xl">
                Diego Endrigo
              </h2>
              <div className="mt-6 max-w-lg space-y-4 leading-relaxed text-white/60">
                <p>
                  Começou a vida profissional como empacotador de supermercado.
                  Passou 15 anos em bancos como Itaú, Santander e Safra, até
                  chegar à XP. Em 2023, fundou a Utah Invest, escritório de
                  investimentos credenciado à XP, em Curitiba.
                </p>
                <p>
                  Nessa trajetória, uma habilidade sustentou cada salto: saber
                  falar para gerar confiança e fechar negócios. É o que ele vem
                  ensinar, na prática, para quem está começando a construir
                  carreira.
                </p>
              </div>
              <p className="mt-8 text-xs uppercase tracking-[0.25em] text-white/35">
                CFP® · Utah Invest · XP · Itaú · Santander · Safra
              </p>
            </div>
          </div>
        </section>

        {/* Fotos */}
        <section className="border-t border-white/15 py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">
            O último evento
          </p>
          <div className="mt-8">
            <PhotoCarousel photos={EVENT_PHOTOS} />
          </div>
        </section>

        {/* Informações */}
        <section className="grid border-t border-white/15 py-20 md:grid-cols-3 md:gap-12 md:py-28">
          <div className="py-4 md:py-0">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Local
            </p>
            <p className="mt-4 font-semibold">{EVENT.local.nome}</p>
            <p className="mt-1 text-sm leading-relaxed text-white/60">
              {EVENT.local.endereco}
            </p>
            <a
              href={EVENT.local.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-white/60 underline underline-offset-4 transition hover:text-white"
            >
              Ver no mapa
            </a>
          </div>
          <div className="border-t border-white/15 py-4 md:border-none md:py-0">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Data
            </p>
            <p className="mt-4 font-semibold">
              {EVENT.dataHora ?? "Em breve"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/60">
              Inscritos são avisados antes da divulgação geral.
            </p>
          </div>
          <div className="border-t border-white/15 py-4 md:border-none md:py-0">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Acesso
            </p>
            <p className="mt-4 font-semibold">Membros: vaga garantida</p>
            <p className="mt-1 text-sm leading-relaxed text-white/60">
              O evento é fechado para membros da LFUP. Um número reduzido de
              vagas será liberado para a lista de espera, por ordem de
              inscrição.
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-white/15 py-24 text-center md:py-32">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
            A data ainda não saiu. A lista de espera já.
          </h2>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <a
              href={LINKS.inscricaoMembros}
              className="inline-flex items-center justify-center bg-white px-8 py-4 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-white/80"
            >
              Confirmar presença
            </a>
            <a
              href={LINKS.listaDeEspera}
              className="text-sm uppercase tracking-widest text-white/60 underline underline-offset-8 transition hover:text-white"
            >
              Entrar na lista de espera
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/15">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-white/35 md:flex-row">
          <p>Realização: Liga de Finanças da Universidade Positivo</p>
          <p>XP e Utah Invest são marcas de seus respectivos titulares.</p>
        </div>
      </footer>
    </div>
  );
}
