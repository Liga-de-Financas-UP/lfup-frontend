"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/shared/config/constants";
import { clearExamSession } from "@/shared/lib/exam-api";

const WHATSAPP = "5541998582154";
const WHATSAPP_DISPLAY = "+55 41 99858-2154";

type Status = "submitted" | "terminated" | "expired" | "unknown";

function parseStatus(): Status {
  if (typeof window === "undefined") return "unknown";
  const params = new URLSearchParams(window.location.search);
  const s = params.get("status");
  if (s === "submitted" || s === "terminated" || s === "expired") return s;
  return "unknown";
}

export function ProvaEncerradaView() {
  const [status, setStatus] = useState<Status>("unknown");

  useEffect(() => {
    setStatus(parseStatus());
    clearExamSession();
  }, []);

  const copy = messageFor(status);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-16 text-center">
      <div className="max-w-md">
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: copy.iconBg }}
        >
          <span className="text-2xl">{copy.icon}</span>
        </div>
        <h1
          className="text-2xl font-bold tracking-tight md:text-3xl"
          style={{ color: BRAND.color.primary }}
        >
          {copy.title}
        </h1>
        <p className="mt-3 text-sm text-gray-600">{copy.body}</p>
        <p className="mt-6 text-xs text-gray-400">
          Dúvidas:{" "}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
            style={{ color: BRAND.color.primary }}
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </p>
        <Button
          className="mt-6 h-10 rounded-full px-6 text-white"
          style={{ backgroundColor: BRAND.color.primary }}
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "/";
          }}
        >
          Voltar para o início
        </Button>
      </div>
    </div>
  );
}

function messageFor(status: Status) {
  switch (status) {
    case "submitted":
      return {
        icon: "✓",
        iconBg: "#10b98120",
        title: "Prova enviada com sucesso.",
        body: "Obrigado por dedicar o seu tempo. Em breve a gente entra em contato com os próximos passos do processo seletivo.",
      };
    case "terminated":
      return {
        icon: "!",
        iconBg: "#ef444420",
        title: "Sua prova foi encerrada.",
        body: "Detectamos trocas de janela/aba acima do limite permitido. As respostas que você já preencheu foram salvas, mas não é possível refazer a prova. Se acha que foi engano, fale com a gente pelo WhatsApp.",
      };
    case "expired":
      return {
        icon: "⏱",
        iconBg: "#f59e0b20",
        title: "Tempo encerrado.",
        body: "O cronômetro chegou ao fim antes do envio. As respostas que você preencheu foram salvas automaticamente e serão avaliadas mesmo assim.",
      };
    default:
      return {
        icon: "·",
        iconBg: "#9ca3af20",
        title: "Prova encerrada.",
        body: "Esta prova não está mais acessível. Em caso de dúvida, fale com a gente pelo WhatsApp.",
      };
  }
}
