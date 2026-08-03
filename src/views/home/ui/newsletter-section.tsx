"use client";

import { useState, type FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

type Status = "idle" | "loading" | "success" | "pending" | "error";

// Lê UTMs da URL atual para preservar a atribuição da campanha de origem.
function readUtms() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => p.get(k) ?? undefined;
  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
  };
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...readUtms() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Não foi possível cadastrar agora.");
        return;
      }

      if (data.pending) {
        setStatus("pending");
        setMessage("Quase lá! Confirme o cadastro no e-mail que enviamos.");
      } else {
        setStatus("success");
        setMessage("Pronto! Você está na lista.");
      }
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Falha de conexão. Tente novamente.");
    }
  }

  const done = status === "success" || status === "pending";

  return (
    <section className="brand-mesh-soft border-b border-cream/15 bg-ink">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 md:grid-cols-[1fr_auto] md:items-center md:py-8">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/50">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage" />
            Newsletter semanal
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/70">
            As notícias e os conteúdos da semana do mercado financeiro, direto no
            seu e-mail. De alunos, para alunos.
          </p>
        </div>

        {done ? (
          <p className="text-sm font-medium text-sage md:text-right">{message}</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Seu e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              className="h-12 w-full min-w-0 border border-cream/25 bg-transparent px-4 text-sm text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-cream sm:w-72"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-12 shrink-0 bg-cream px-6 text-xs font-semibold uppercase tracking-widest text-ink transition hover:bg-cream/80 disabled:opacity-60"
            >
              {status === "loading" ? "Enviando..." : "Assinar"}
            </button>
          </form>
        )}
      </div>
      {status === "error" && (
        <div className="mx-auto max-w-5xl px-6 pb-4">
          <p className="text-xs text-red-300">{message}</p>
        </div>
      )}
    </section>
  );
}
