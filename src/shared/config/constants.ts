export const BRAND = {
  name: "LFUP",
  fullName: "Liga de Finanças da Universidade Positivo",
  domain: "lfup.com.br",
  color: {
    primary: "#100843",
    primaryLight: "#1a0d5e",
    accent: "#100843",
    bg: "#ffffff",
    bgMuted: "#fafafa",
    textPrimary: "#100843",
    textSecondary: "#6b7280",
    border: "#f3f4f6",
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
