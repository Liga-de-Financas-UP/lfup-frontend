"use client";

import { useState, type FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

type Tone = "dark" | "light";
type Status = "idle" | "loading" | "confirmed" | "waitlisted" | "error";

interface Props {
  /** Slug do evento no backend (ex.: "isa-fonti") */
  slug: string;
  tone?: Tone;
  /** Exibe a pergunta "Sou membro da LFUP" (eventos fechados com lista de espera) */
  askMember?: boolean;
}

/**
 * Formulário de inscrição das LPs de evento.
 * POST {API_URL}/registrations/{slug} — ver backend/src/routes/registrations.ts
 */
export function EventRegistrationForm({
  slug,
  tone = "dark",
  askMember = false,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const dark = tone === "dark";
  const label = `block text-[11px] uppercase tracking-[0.25em] ${dark ? "text-white/50" : "text-black/50"}`;
  const input = `mt-2 w-full border-b bg-transparent pb-2.5 text-base outline-none transition-colors ${
    dark
      ? "border-white/25 text-white placeholder:text-white/30 focus:border-white"
      : "border-black/25 text-black placeholder:text-black/30 focus:border-black"
  }`;
  const button = `inline-flex w-full items-center justify-center px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-colors disabled:opacity-60 sm:w-auto ${
    dark
      ? "bg-white text-black hover:bg-white/80"
      : "bg-[#1c1417] text-[#f7f2ec] hover:bg-[#9E1B32]"
  }`;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/registrations/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, isMember, website }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Não foi possível concluir agora. Tente novamente.");
        return;
      }

      const st = data.data?.status;
      if (data.data?.alreadyRegistered) {
        setStatus(st === "waitlisted" ? "waitlisted" : "confirmed");
        setMessage(
          st === "waitlisted"
            ? "Esse e-mail já está na lista de espera. Avisaremos se abrir vaga."
            : "Esse e-mail já está inscrito. Te esperamos lá!",
        );
      } else if (st === "waitlisted") {
        setStatus("waitlisted");
        setMessage("Você entrou na lista de espera. Avisaremos se abrir vaga.");
      } else {
        setStatus("confirmed");
        setMessage("Inscrição confirmada! Te esperamos lá.");
      }
    } catch {
      setStatus("error");
      setMessage("Falha de conexão. Tente novamente.");
    }
  }

  if (status === "confirmed" || status === "waitlisted") {
    return (
      <div
        className={`border px-6 py-8 text-center ${dark ? "border-white/20" : "border-black/15"}`}
      >
        <p className="text-lg font-semibold">{message}</p>
        <p className={`mt-2 text-sm ${dark ? "text-white/50" : "text-black/50"}`}>
          Guarde a data. Qualquer novidade chega pelo e-mail informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      <div>
        <label htmlFor={`${slug}-nome`} className={label}>
          Nome completo
        </label>
        <input
          id={`${slug}-nome`}
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Seu nome e sobrenome"
          className={input}
        />
      </div>

      <div>
        <label htmlFor={`${slug}-email`} className={label}>
          E-mail
        </label>
        <input
          id={`${slug}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          className={input}
        />
      </div>

      <div>
        <label htmlFor={`${slug}-phone`} className={label}>
          WhatsApp
        </label>
        <input
          id={`${slug}-phone`}
          type="tel"
          required
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(41) 99999-9999"
          className={input}
        />
      </div>

      {askMember && (
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={isMember}
            onChange={(e) => setIsMember(e.target.checked)}
            className={`h-4 w-4 accent-current ${dark ? "text-white" : "text-[#9E1B32]"}`}
          />
          <span className={dark ? "text-white/70" : "text-black/70"}>
            Sou membro da LFUP
          </span>
        </label>
      )}

      {/* Honeypot anti-spam: invisível para humanos, bots preenchem */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label htmlFor={`${slug}-website`}>Website</label>
        <input
          id={`${slug}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="pt-2">
        <button type="submit" disabled={status === "loading"} className={button}>
          {status === "loading" ? "Enviando..." : "Confirmar inscrição"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-[#9E1B32]" role="alert">
          {message}
        </p>
      )}

      <p className={`text-xs leading-relaxed ${dark ? "text-white/35" : "text-black/40"}`}>
        Usamos seus dados apenas para organizar o evento e avisar sobre ele.
      </p>
    </form>
  );
}
