import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/widgets/page-container";
import { SOCIAL_LINKS } from "@/shared/config/constants";
import { EVENTOS, type EventoAgenda } from "./config";

export const metadata: Metadata = {
  title: "Eventos | LFUP",
  description:
    "Agenda de eventos da Liga de Finanças da Universidade Positivo: palestras, visitas a escritórios e dinâmicas com profissionais do mercado financeiro.",
  openGraph: {
    title: "Eventos da LFUP",
    description:
      "Palestras, visitas a escritórios e dinâmicas com profissionais do mercado financeiro, organizadas pela Liga de Finanças da UP.",
  },
};

function EventoRow({ evento }: { evento: EventoAgenda }) {
  const inner = (
    <div className="grid gap-6 py-10 md:grid-cols-[110px_1fr_170px] md:gap-10 md:py-12">
      {/* Data */}
      <div>
        <p className="font-display text-5xl leading-none text-sage">
          {evento.dia}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-cream/45">
          {evento.mes}
        </p>
      </div>

      {/* Conteúdo */}
      <div className="max-w-xl">
        <h2 className="text-xl font-semibold leading-tight tracking-tight text-cream transition group-hover:text-sage md:text-2xl">
          {evento.titulo}
        </h2>
        {evento.subtitulo && (
          <p className="mt-1 text-sm text-cream/60">{evento.subtitulo}</p>
        )}
        <p className="mt-4 text-sm leading-relaxed text-cream/60">
          {evento.descricao}
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-cream/45">
          {evento.local} · {evento.dataExtenso}
        </p>
      </div>

      {/* Status */}
      <div className="md:pt-1 md:text-right">
        {evento.href ? (
          <span className="text-xs font-semibold uppercase tracking-widest text-cream underline underline-offset-8 transition group-hover:text-sage">
            Ver evento
          </span>
        ) : (
          <span className="text-xs uppercase tracking-widest text-cream/40">
            Em breve
          </span>
        )}
      </div>
    </div>
  );

  if (evento.href) {
    return (
      <Link href={evento.href} className="group block border-t border-cream/15">
        {inner}
      </Link>
    );
  }

  return <div className="border-t border-cream/15">{inner}</div>;
}

export default function EventosPage() {
  return (
    <PageContainer>
      {/* Hero */}
      <section className="border-b border-cream/15">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p className="text-[11px] uppercase tracking-[0.3em] text-cream/50">
            Agenda · segundo semestre
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-cream md:text-6xl">
            Eventos{" "}
            <span className="font-light text-cream/70">da Liga</span>
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed text-cream/60">
            Palestras, visitas a escritórios e dinâmicas com profissionais do
            mercado financeiro. Membros da LFUP têm vaga garantida; parte das
            vagas é aberta à comunidade por lista de espera.
          </p>
        </div>
      </section>

      {/* Agenda */}
      <section>
        <div className="mx-auto max-w-5xl px-6">
          {EVENTOS.map((evento) => (
            <EventoRow key={`${evento.mes}-${evento.dia}`} evento={evento} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-cream/15">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-cream md:text-3xl">
            Quer ser avisado antes da divulgação geral?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/60">
            As inscrições de cada evento abrem primeiro para membros. Siga a
            Liga no Instagram para acompanhar a abertura das listas de espera.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/processo-seletivo"
              className="inline-flex items-center justify-center bg-cream px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink transition hover:bg-cream/80"
            >
              Quero ser membro
            </Link>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest text-cream/60 underline underline-offset-8 transition hover:text-cream"
            >
              @ligadefinancasup
            </a>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
