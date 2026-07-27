// Configuração central da LP do evento — edite aqui, sem mexer no layout.

export const EVENT = {
  titulo: "Oratória para Negócios",
  palestrante: "Diego Endrigo",
  cargoPalestrante: "Fundador & CEO da Utah Invest, escritório credenciado à XP",
  // Sem data definida ainda — quando tiver, preencha (ex.: "12 de agosto, 19h30")
  dataHora: null as string | null,
  local: {
    nome: "Âmbar",
    endereco: "Rua José Sikorski, 46 · Santo Inácio, Curitiba/PR",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%C3%82mbar+Rua+Jos%C3%A9+Sikorski+46+Curitiba",
  },
} as const;

// Links de inscrição — troque pelos formulários reais (Google Forms, Tally etc.)
export const LINKS = {
  inscricaoMembros: "#inscricao",
  listaDeEspera: "#inscricao",
  instagramLfup: "https://instagram.com/ligadefinancasup",
} as const;

// Fotos do último evento do Diego (landscape).
// Basta colocar os arquivos em public/lp/evento/ e listar aqui.
// Fotos que não existirem ainda são ignoradas automaticamente pelo carrossel.
export const EVENT_PHOTOS: { src: string; alt: string }[] = [
  {
    src: "/lp/evento/foto-1.jpg",
    alt: "Diego Endrigo palestrando para a plateia lotada no último evento",
  },
  {
    src: "/lp/evento/foto-2.jpg",
    alt: "Diego Endrigo ao microfone durante a palestra",
  },
  {
    src: "/lp/evento/foto-3.jpg",
    alt: "Diego Endrigo em dinâmica com participante da plateia",
  },
  {
    src: "/lp/evento/foto-4.jpg",
    alt: "Diego Endrigo conversando com participante do evento",
  },
];

// Foto do palestrante
export const SPEAKER_PHOTO = "/lp/evento/diego-endrigo.webp";

export const LOGOS = {
  lfup: "https://assets.lfup.com.br/institutional/logos/horizontal/logo.png",
  lfupBull: "https://assets.lfup.com.br/institutional/logos/lfup_bull.png",
  xp: "https://upload.wikimedia.org/wikipedia/commons/b/b2/XP_Inc._Logo.svg",
} as const;
