export const BRAND = {
  name: "LFUP",
  fullName: "Liga de Finanças da Universidade Positivo",
  domain: "lfup.com.br",
  color: {
    // Paleta do brand book: ink navy-teal + creme + sage
    primary: "#0b1920",
    primaryLight: "#14262e",
    accent: "#7fa189",
    cream: "#ece7d1",
    blue: "#244a6b",
    bg: "#0b1920",
    bgMuted: "#14262e",
    textPrimary: "#ece7d1",
    textSecondary: "rgba(236,231,209,0.6)",
    border: "rgba(236,231,209,0.14)",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/processo-seletivo", label: "Processo Seletivo" },
] as const;

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/ligadefinancasup",
  linkedin: "https://linkedin.com/company/lfup",
} as const;
