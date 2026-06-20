"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/shared/config/constants";
import {
  getExamConfig,
  getExamStatus,
  saveExamSession,
  startExamAttempt,
} from "@/shared/lib/exam-api";
import type {
  ExamArea,
  ExamConfig,
} from "@/entities/exam/model/types";

const WHATSAPP = "5541998582154";
const WHATSAPP_DISPLAY = "+55 41 99858-2154";

export function ProvaIntroView() {
  const router = useRouter();
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"intro" | "identify">("intro");

  const [form, setForm] = useState({
    email: "",
    rgm: "",
    fullName: "",
    phone: "",
  });
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await getExamConfig();
      setConfig(res.data ?? null);
      setLoading(false);
    })();
  }, []);

  const openNow = config?.isOpenNow ?? false;
  const windowLabel = useMemo(() => {
    if (!config) return "";
    const from = new Date(config.availableFrom).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    });
    const until = new Date(config.availableUntil).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    });
    return `${from} — ${until}`;
  }, [config]);

  const areasWithExam = (config?.areas ?? []).filter((a) => true);
  const questionsTotal = config && selectedAreas.length > 0
    ? selectedAreas.length === 1
      ? config.questionsPerArea * config.maxAreas
      : config.questionsPerArea * selectedAreas.length
    : 0;

  function toggleArea(areaId: string) {
    setSelectedAreas((prev) => {
      if (prev.includes(areaId)) return prev.filter((x) => x !== areaId);
      if (!config) return prev;
      if (prev.length >= config.maxAreas) return prev;
      return [...prev, areaId];
    });
  }

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!config) return;
    if (!openNow) {
      setErrorMsg(
        "A prova ainda não está liberada. Ela só pode ser realizada dentro da janela definida.",
      );
      return;
    }
    if (!form.email || !form.rgm || !form.fullName) {
      setErrorMsg("Email, RGM e nome completo são obrigatórios.");
      return;
    }
    if (selectedAreas.length === 0) {
      setErrorMsg("Selecione ao menos uma área.");
      return;
    }

    setSubmitting(true);
    setCheckingStatus(true);
    try {
      const status = await getExamStatus(
        form.email.trim().toLowerCase(),
        form.rgm.trim(),
      );
      setCheckingStatus(false);
      if (status.data?.hasAttempt && status.data.attempt) {
        const st = status.data.attempt.status;
        if (st === "submitted" || st === "terminated" || st === "expired") {
          setSubmitting(false);
          router.push(`/prova/encerrada?status=${st}`);
          return;
        }
      }

      const res = await startExamAttempt({
        email: form.email.trim().toLowerCase(),
        rgm: form.rgm.trim(),
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        areaIds: selectedAreas,
      });

      if (!res.success || !res.data) {
        setErrorMsg(res.error || "Erro ao iniciar a prova.");
        setSubmitting(false);
        return;
      }

      if (!res.data.token || !res.data.attempt?.id || !res.data.candidate) {
        setErrorMsg("Resposta incompleta do servidor. Tente novamente.");
        setSubmitting(false);
        return;
      }

      saveExamSession(res.data.token, res.data.attempt.id, {
        email: res.data.candidate.email,
        rgm: res.data.candidate.rgm,
        fullName: res.data.candidate.fullName,
      });
      router.push("/prova/sala");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErrorMsg(`Falha ao iniciar: ${msg}. Tente de novo.`);
      setSubmitting(false);
      setCheckingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <p className="text-sm text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h1
          className="text-2xl font-bold"
          style={{ color: BRAND.color.primary }}
        >
          Nenhuma prova ativa no momento.
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Dúvidas? Mande mensagem para{" "}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            className="underline"
            target="_blank"
            rel="noreferrer"
            style={{ color: BRAND.color.primary }}
          >
            {WHATSAPP_DISPLAY}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10">
        <p
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: BRAND.color.primary }}
        >
          Liga de Finanças da UP · Processo Seletivo
        </p>
        <h1
          className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
          style={{ color: BRAND.color.primary }}
        >
          {config.name}
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Janela: <strong>{windowLabel}</strong> (horário de Brasília)
        </p>
      </header>

      {step === "intro" ? (
        <IntroRules
          config={config}
          openNow={openNow}
          onContinue={() => setStep("identify")}
        />
      ) : (
        <form
          onSubmit={handleStart}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 md:p-8"
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: BRAND.color.primary }}
            >
              Identificação
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Os dados abaixo são usados para autenticar sua prova. Use o email
              e RGM (número de matrícula) que você usa na UP.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email institucional *">
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="seu@up.com.br"
                required
              />
            </Field>
            <Field label="RGM (número de matrícula) *">
              <Input
                value={form.rgm}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rgm: e.target.value }))
                }
                placeholder="Ex: 12345678"
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome completo *">
              <Input
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                placeholder="Seu nome completo"
                required
              />
            </Field>
            <Field label="Telefone (opcional)">
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="(41) 99999-9999"
              />
            </Field>
          </div>

          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: BRAND.color.primary }}
            >
              Áreas de interesse
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Selecione até {config.maxAreas} área(s). Com {config.maxAreas}{" "}
              áreas, você responde {config.questionsPerArea} perguntas de cada.
              Com 1 área, você responde{" "}
              {config.questionsPerArea * config.maxAreas} perguntas dessa área.
            </p>
            <p className="mt-2 text-xs text-amber-700">
              As áreas <strong>Gestão de Pessoas</strong> e{" "}
              <strong>Marketing</strong> não têm prova neste processo.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {areasWithExam.map((area) => (
                <AreaCard
                  key={area.id}
                  area={area}
                  selected={selectedAreas.includes(area.id)}
                  disabled={
                    !selectedAreas.includes(area.id) &&
                    selectedAreas.length >= config.maxAreas
                  }
                  onToggle={() => toggleArea(area.id)}
                />
              ))}
              {areasWithExam.length === 0 && (
                <p className="text-xs text-gray-400 sm:col-span-2">
                  Nenhuma área disponível ainda.
                </p>
              )}
            </div>
            {selectedAreas.length > 0 && (
              <p className="mt-3 text-xs text-gray-500">
                Você responderá <strong>{questionsTotal}</strong> perguntas.
              </p>
            )}
          </div>

          {errorMsg && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-6"
              onClick={() => setStep("intro")}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              className="h-11 flex-1 rounded-full px-6 text-white"
              style={{ backgroundColor: BRAND.color.primary }}
              disabled={submitting || !openNow}
            >
              {submitting
                ? checkingStatus
                  ? "Verificando..."
                  : "Iniciando prova..."
                : openNow
                  ? "Iniciar prova"
                  : "Prova fora da janela"}
            </Button>
          </div>

          <p className="text-xs text-gray-400">
            Dúvidas ou erros:{" "}
            <a
              href={`https://wa.me/${WHATSAPP}`}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </p>
        </form>
      )}
    </div>
  );
}

function IntroRules({
  config,
  openNow,
  onContinue,
}: {
  config: ExamConfig;
  openNow: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
      <div>
        <h2
          className="text-xl font-semibold"
          style={{ color: BRAND.color.primary }}
        >
          Antes de começar, leia tudo com atenção.
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          A prova é parte do nosso processo seletivo. Nenhuma questão é
          obrigatória para passar — o que a gente avalia é conhecimento e
          dedicação. Responda com calma e no seu próprio jeito.
        </p>
      </div>

      <Rules
        items={[
          <span key="time">
            <strong>{config.durationMinutes} minutos</strong> de duração. O
            cronômetro começa quando você clicar em "Iniciar prova".
          </span>,
          <span key="count">
            <strong>
              {config.questionsPerArea * config.maxAreas} perguntas
            </strong>{" "}
            no total — 1 área (todas) ou 2 áreas ({config.questionsPerArea} de
            cada). Todas são de preencher texto.
          </span>,
          <span key="tab">
            Não troque de aba ou janela. No primeiro aviso você recebe um
            alerta; no <strong>segundo, a prova é encerrada</strong> e não pode
            ser refeita.
          </span>,
          <span key="fs">
            Recomendamos usar o <strong>computador em tela cheia (F11)</strong>,
            com <strong>apenas um monitor conectado</strong> (remova o segundo
            monitor antes de começar).
          </span>,
          <span key="mobile">
            Se estiver pelo celular, tudo bem — só mantenha a aba da prova
            aberta e em primeiro plano. Ligações e notificações também contam
            como trocar de aba.
          </span>,
          <span key="tools">
            Não abra o console/devtools do navegador. Qualquer tentativa é
            registrada.
          </span>,
          <span key="save">
            Suas respostas são salvas automaticamente enquanto você digita. Se
            cair a internet, a sessão é retomada ao voltar — o cronômetro não
            pausa.
          </span>,
          <span key="window">
            Só é possível fazer a prova dentro da janela definida. Fora disso,
            o acesso é bloqueado.
          </span>,
          <span key="help">
            Dúvidas ou erros técnicos:{" "}
            <a
              href={`https://wa.me/${WHATSAPP}`}
              className="underline"
              target="_blank"
              rel="noreferrer"
              style={{ color: BRAND.color.primary }}
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            .
          </span>,
        ]}
      />

      {!openNow && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          A prova ainda está fora da janela de aplicação. Você poderá iniciar
          somente entre a data e horário informados acima.
        </div>
      )}

      <Button
        type="button"
        className="h-11 w-full rounded-full px-6 text-white"
        style={{ backgroundColor: BRAND.color.primary }}
        onClick={onContinue}
      >
        Entendi, continuar
      </Button>
    </div>
  );
}

function Rules({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm text-gray-700">
          <span
            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: BRAND.color.primary }}
          />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function AreaCard({
  area,
  selected,
  disabled,
  onToggle,
}: {
  area: ExamArea;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`rounded-xl border p-4 text-left transition-all ${
        selected
          ? "border-[#100843] bg-[#100843]/5"
          : disabled
            ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50"
            : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-sm font-semibold"
          style={{
            color: selected ? BRAND.color.primary : undefined,
          }}
        >
          {area.name}
        </p>
        <span
          className={`h-4 w-4 rounded-full border transition-colors ${
            selected ? "border-[#100843] bg-[#100843]" : "border-gray-300"
          }`}
        />
      </div>
      {area.description && (
        <p className="mt-1 text-xs text-gray-500">{area.description}</p>
      )}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-500">{label}</Label>
      {children}
    </div>
  );
}
