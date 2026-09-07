// Configuração central da LP do talk com Isabelli Fontineli. Edite aqui, sem mexer no layout.

export const EVENT = {
  titulo: "Dona do Jogo",
  convidada: "Isabelli Fontineli",
  cargoConvidada:
    "Influenciadora e ex-jogadora profissional de Free Fire (B4 e Flamengo Esports)",
  // Talk dentro da Semana Acadêmica. Preencha o dia/horário exato quando confirmado
  // (ex.: "23 de setembro, 19h30")
  dataHora: null as string | null,
  semana: "22 a 24 de setembro",
  local: {
    nome: "Universidade Positivo",
    endereco: "R. Prof. Pedro Viriato Parigot de Souza, 5300 · Curitiba/PR",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Universidade+Positivo+Curitiba",
  },
} as const;

// Links de inscrição. Troque pelos formulários reais (Google Forms, Tally etc.)
export const LINKS = {
  inscricao: "#inscricao",
  instagramLfup: "https://instagram.com/ligadefinancasup",
  instagramIsa: "https://instagram.com/isaffonti",
} as const;

// Fotos em retrato (4:5), exibidas no carrossel automático.
// Coloque os arquivos em public/eventos/isa-fonti/ e liste aqui.
// Fotos que não existirem ainda são ignoradas automaticamente.
export const EVENT_PHOTOS: { src: string; alt: string }[] = [
  {
    src: "/eventos/isa-fonti/foto-flamengo.jpg",
    alt: "Isabelli Fontineli com a camisa do Flamengo Esports",
  },
  {
    src: "/eventos/isa-fonti/foto-nfa.jpg",
    alt: "Isabelli Fontineli comentando na NFA",
  },
  {
    src: "/eventos/isa-fonti/foto-tiktok.jpg",
    alt: "Isabelli Fontineli em conteúdo para o TikTok",
  },
];

// Foto da convidada no hero (retrato 4:5)
export const SPEAKER_PHOTO = "/eventos/isa-fonti/isa-fonti.jpg";

// Foto da seção "A convidada" (retrato 4:5) — diferente da do hero para não repetir
export const BIO_PHOTO = "/eventos/isa-fonti/foto-flamengo.jpg";

export const LOGOS = {
  lfup: "https://assets.lfup.com.br/institutional/logos/horizontal/logo.png",
  lfupBull: "https://assets.lfup.com.br/institutional/logos/lfup_bull.png",
} as const;
