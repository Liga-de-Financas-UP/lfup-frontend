// Agenda de eventos da LFUP — edite aqui, sem mexer no layout.
// Ordem de exibição = ordem do array.

export type EventoStatus = "inscricoes" | "em-breve";

export interface EventoAgenda {
  /** Dia(s) para o bloco de data, ex.: "26", "22–24" */
  dia: string;
  /** Mês abreviado, ex.: "set", "out" */
  mes: string;
  /** Data por extenso exibida na linha de detalhes, ex.: "sexta-feira, 26 de setembro" */
  dataExtenso: string;
  titulo: string;
  /** Complemento do título, ex.: nome do palestrante/parceiro */
  subtitulo?: string;
  descricao: string;
  local: string;
  /** LP do evento — null enquanto não existir */
  href: string | null;
  status: EventoStatus;
}

export const EVENTOS: EventoAgenda[] = [
  {
    dia: "22–24",
    mes: "set",
    dataExtenso: "22 a 24 de setembro",
    titulo: "Semana Acadêmica",
    subtitulo: "Dona do Jogo: talk com Isabelli Fontineli",
    descricao:
      "Talk aberto, voltado ao público feminino, sobre como ocupar espaços em indústrias dominadas por homens. Isabelli Fontineli virou uma das maiores vozes do Free Fire no Brasil, com passagens por B4 e Flamengo Esports e mais de 2 milhões de seguidores nas redes.",
    local: "Universidade Positivo · Curitiba/PR",
    href: "/eventos/isa-fonti",
    status: "inscricoes",
  },
  {
    dia: "26",
    mes: "set",
    dataExtenso: "26 de setembro",
    titulo: "Visita e palestra: Macroeconomia",
    subtitulo: "com a SVN Investimentos",
    descricao:
      "Visita ao escritório da SVN em Curitiba, com palestra sobre macroeconomia e o cenário atual de mercado.",
    local: "SVN Investimentos · Curitiba/PR",
    href: null,
    status: "em-breve",
  },
  {
    dia: "10",
    mes: "out",
    dataExtenso: "10 de outubro",
    titulo: "Oratória para Negócios",
    subtitulo: "com Diego Endrigo, fundador e CEO da Utah Invest (XP)",
    descricao:
      "Como falar para gerar confiança e fechar negócios, na prática, com quem construiu carreira de empacotador de supermercado a CEO de escritório credenciado à XP.",
    local: "Escritório Utah Investimentos · Curitiba/PR",
    href: "/eventos/oratoria-para-negocios",
    status: "inscricoes",
  },
  {
    dia: "fim",
    mes: "out",
    dataExtenso: "final de outubro",
    titulo: "Dinâmica de Asset & M&A",
    subtitulo: "com a FinQ Investimentos",
    descricao:
      "Dinâmica prática sobre o dia a dia de uma asset e operações de M&A, conduzida em parceria com a FinQ Investimentos.",
    local: "Local a confirmar · Curitiba/PR",
    href: null,
    status: "em-breve",
  },
];
