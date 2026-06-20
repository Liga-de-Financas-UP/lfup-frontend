"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/shared/config/constants";
import {
  clearExamSession,
  getExamAttempt,
  logExamEvent,
  readExamSession,
  saveExamAnswer,
  submitExam,
} from "@/shared/lib/exam-api";
import { useAntiCheat, clarityEvent } from "@/shared/hooks/use-anti-cheat";
import { useCountdown } from "@/shared/hooks/use-countdown";
import type {
  ExamAttemptView,
  ExamEventResult,
  ExamEventType,
  ExamQuestionView,
} from "@/entities/exam/model/types";

const AUTOSAVE_DEBOUNCE_MS = 1200;
const WHATSAPP = "5541998582154";
const WHATSAPP_DISPLAY = "+55 41 99858-2154";

type LoadState = "loading" | "loaded" | "error" | "unauthorized";

export function ProvaSalaView() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>("loading");
  const [view, setView] = useState<ExamAttemptView | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [warning, setWarning] = useState<{
    violationCount: number;
    threshold: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const answersRef = useRef<Record<string, string>>({});
  const pendingTimerRef = useRef<number | null>(null);
  const attemptIdRef = useRef<string | null>(null);
  const terminatedRef = useRef(false);
  const lastViolationCountRef = useRef(0);

  // ─── Load attempt ───────────────────────────────────────────────────────

  useEffect(() => {
    const session = readExamSession();
    if (!session) {
      setState("unauthorized");
      return;
    }
    attemptIdRef.current = session.attemptId;

    void (async () => {
      const res = await getExamAttempt(session.attemptId);
      if (!res.success || !res.data) {
        setState("error");
        setErrorMsg(res.error || "Não foi possível carregar a prova.");
        return;
      }
      const attemptView = res.data;
      answersRef.current = {};
      for (const q of attemptView.questions) {
        answersRef.current[q.id] = q.answer;
      }
      lastViolationCountRef.current = attemptView.attempt.violationCount;
      setView(attemptView);
      setState("loaded");

      const st = attemptView.attempt.status;
      if (st !== "in_progress") {
        terminatedRef.current = true;
        clearExamSession();
        router.replace(`/prova/encerrada?status=${st}`);
      }
    })();
  }, [router]);

  // ─── Anti-cheat sender ──────────────────────────────────────────────────

  const handleEventResult = useCallback(
    (result: ExamEventResult | undefined) => {
      if (!result) return;
      if (result.terminated && !terminatedRef.current) {
        terminatedRef.current = true;
        clearExamSession();
        router.replace("/prova/encerrada?status=terminated");
        return;
      }
      // Only surface the warning when the server-side count actually increased
      // on this particular event. Otherwise any API round-trip (autosave,
      // question_nav, heartbeat) would re-open the modal.
      if (
        !result.terminated &&
        view &&
        result.violationCount > lastViolationCountRef.current
      ) {
        lastViolationCountRef.current = result.violationCount;
        setWarning({
          violationCount: result.violationCount,
          threshold: view.config.maxViolations,
        });
      } else if (result.violationCount > lastViolationCountRef.current) {
        lastViolationCountRef.current = result.violationCount;
      }
    },
    [router, view],
  );

  const sendEvent = useCallback(
    (type: ExamEventType, details?: Record<string, unknown>) => {
      const attemptId = attemptIdRef.current;
      if (!attemptId) return;
      void (async () => {
        const res = await logExamEvent(attemptId, type, currentIndex, details);
        handleEventResult(res.data);
      })();
    },
    [currentIndex, handleEventResult],
  );

  const antiCheat = useAntiCheat({
    enabled: state === "loaded" && !terminatedRef.current,
    send: sendEvent,
    onViolation: () => {
      // handled via terminatedRef in handleEventResult
    },
  });

  // ─── Countdown ──────────────────────────────────────────────────────────

  const endsAt = view?.attempt.endsAt ?? null;
  const { minutes, seconds, expired } = useCountdown(endsAt);

  useEffect(() => {
    if (state !== "loaded") return;
    if (!expired || terminatedRef.current) return;
    terminatedRef.current = true;
    void (async () => {
      if (attemptIdRef.current) {
        await submitExam(attemptIdRef.current);
      }
      clearExamSession();
      router.replace("/prova/encerrada?status=expired");
    })();
  }, [expired, state, router]);

  // ─── Autosave ───────────────────────────────────────────────────────────

  const scheduleAutosave = useCallback(
    (questionId: string) => {
      if (pendingTimerRef.current) window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = window.setTimeout(async () => {
        const attemptId = attemptIdRef.current;
        if (!attemptId) return;
        setSaveStatus("saving");
        const res = await saveExamAnswer(
          attemptId,
          questionId,
          answersRef.current[questionId] ?? "",
        );
        setSaveStatus(res.success ? "saved" : "error");
        sendEvent("autosave");
      }, AUTOSAVE_DEBOUNCE_MS);
    },
    [sendEvent],
  );

  const flushAutosave = useCallback(async (questionId?: string) => {
    if (pendingTimerRef.current) {
      window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    const attemptId = attemptIdRef.current;
    if (!attemptId || !questionId) return;
    setSaveStatus("saving");
    const res = await saveExamAnswer(
      attemptId,
      questionId,
      answersRef.current[questionId] ?? "",
    );
    setSaveStatus(res.success ? "saved" : "error");
  }, []);

  // ─── Fullscreen request (desktop only) ─────────────────────────────────

  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  useEffect(() => {
    if (state !== "loaded") return;
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    if (document.fullscreenElement) return;
    setShowFullscreenPrompt(true);
  }, [state]);

  async function enterFullscreen() {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* ignore — user may have denied */
    }
    setShowFullscreenPrompt(false);
  }

  // ─── Navigation ─────────────────────────────────────────────────────────

  const current = view?.questions[currentIndex];
  const total = view?.questions.length ?? 0;

  async function goTo(index: number) {
    if (!view) return;
    if (index < 0 || index >= view.questions.length) return;
    const currentId = current?.id;
    await flushAutosave(currentId);
    sendEvent("question_nav", { from: currentIndex, to: index });
    clarityEvent("question_nav", { to: index });
    setCurrentIndex(index);
  }

  function requestSubmit() {
    setSubmitConfirmOpen(true);
  }

  async function confirmSubmit() {
    if (!view) return;
    setSubmitConfirmOpen(false);
    setSubmitting(true);
    await flushAutosave(current?.id);
    const res = await submitExam(view.attempt.id);
    if (!res.success) {
      setErrorMsg(res.error || "Erro ao enviar a prova.");
      setSubmitting(false);
      return;
    }
    terminatedRef.current = true;
    clearExamSession();
    router.replace("/prova/encerrada?status=submitted");
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  if (state === "loading") {
    return (
      <FullscreenFrame>
        <p className="text-sm text-gray-400">Carregando prova...</p>
      </FullscreenFrame>
    );
  }

  if (state === "unauthorized") {
    return (
      <FullscreenFrame>
        <h1
          className="text-xl font-bold"
          style={{ color: BRAND.color.primary }}
        >
          Sessão não encontrada
        </h1>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          Vá até a página inicial da prova para se identificar e começar.
        </p>
        <Button
          className="mt-6 h-10 rounded-full px-6 text-white"
          style={{ backgroundColor: BRAND.color.primary }}
          onClick={() => router.push("/prova")}
        >
          Ir para a prova
        </Button>
      </FullscreenFrame>
    );
  }

  if (state === "error") {
    return (
      <FullscreenFrame>
        <h1
          className="text-xl font-bold"
          style={{ color: BRAND.color.primary }}
        >
          Erro
        </h1>
        <p className="mt-2 max-w-md text-sm text-gray-500">{errorMsg}</p>
        <p className="mt-4 text-xs text-gray-400">
          Se isso se repetir, mande mensagem para{" "}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {WHATSAPP_DISPLAY}
          </a>
        </p>
      </FullscreenFrame>
    );
  }

  if (!view || !current) return null;

  const progress = ((currentIndex + 1) / total) * 100;
  const answered = Object.values(answersRef.current).filter(
    (t) => t.trim().length > 0,
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] select-none">
      <Header
        configName={view.config.name}
        candidateName={view.candidate.fullName ?? view.candidate.email}
        minutes={minutes}
        seconds={seconds}
        saveStatus={saveStatus}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-8 md:py-12">
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Pergunta <strong>{currentIndex + 1}</strong> de {total}
          </span>
          {current.areaName && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                color: BRAND.color.primary,
                backgroundColor: `${BRAND.color.primary}15`,
              }}
            >
              {current.areaName}
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <QuestionBlock
            question={current}
            initialAnswer={answersRef.current[current.id] ?? ""}
            onChange={(val) => {
              answersRef.current[current.id] = val;
              setSaveStatus("idle");
              scheduleAutosave(current.id);
            }}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full px-5"
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            Anterior
          </Button>
          <p className="text-xs text-gray-400">
            {answered} de {total} com texto preenchido
          </p>
          {currentIndex < total - 1 ? (
            <Button
              type="button"
              className="h-10 rounded-full px-5 text-white"
              style={{ backgroundColor: BRAND.color.primary }}
              onClick={() => goTo(currentIndex + 1)}
            >
              Próxima
            </Button>
          ) : (
            <Button
              type="button"
              className="h-10 rounded-full px-5 text-white"
              style={{ backgroundColor: BRAND.color.primary }}
              onClick={requestSubmit}
              disabled={submitting}
            >
              {submitting ? "Enviando..." : "Enviar prova"}
            </Button>
          )}
        </div>

        {errorMsg && (
          <p className="mt-3 text-sm text-red-600">{errorMsg}</p>
        )}
      </main>

      {/* Progress bar at bottom */}
      <div
        className="sticky bottom-0 z-20 h-1.5 w-full bg-gray-100"
        aria-hidden
      >
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: BRAND.color.primary,
          }}
        />
      </div>

      {warning && !terminatedRef.current && (
        <WarningModal
          violationCount={warning.violationCount}
          threshold={warning.threshold}
          onDismiss={() => setWarning(null)}
        />
      )}

      {showFullscreenPrompt && !terminatedRef.current && (
        <FullscreenPrompt
          onAccept={enterFullscreen}
          onSkip={() => setShowFullscreenPrompt(false)}
        />
      )}

      {submitConfirmOpen && (
        <SubmitConfirmModal
          answered={answered}
          total={total}
          onCancel={() => setSubmitConfirmOpen(false)}
          onConfirm={confirmSubmit}
        />
      )}
    </div>
  );
}

function Header({
  configName,
  candidateName,
  minutes,
  seconds,
  saveStatus,
}: {
  configName: string;
  candidateName: string;
  minutes: number;
  seconds: number;
  saveStatus: "idle" | "saving" | "saved" | "error";
}) {
  const danger = minutes < 5;
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: BRAND.color.primary }}
          >
            {configName}
          </p>
          <p className="text-xs text-gray-400">{candidateName}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {saveStatus === "saving"
              ? "Salvando..."
              : saveStatus === "saved"
                ? "Salvo"
                : saveStatus === "error"
                  ? "Falha ao salvar"
                  : ""}
          </span>
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold tabular-nums ${
              danger ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-900"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${danger ? "bg-red-500" : "bg-green-500"}`}
            />
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>
      </div>
    </header>
  );
}

function QuestionBlock({
  question,
  initialAnswer,
  onChange,
}: {
  question: ExamQuestionView;
  initialAnswer: string;
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState(initialAnswer);
  useEffect(() => {
    setValue(initialAnswer);
  }, [question.id, initialAnswer]);

  return (
    <div className="space-y-5">
      <div>
        <p
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: BRAND.color.primary }}
        >
          Questão {question.index + 1}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-gray-900">
          {question.prompt}
        </p>
      </div>
      <Textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Sua resposta..."
        rows={10}
        className="min-h-40 select-text"
      />
      <p className="text-right text-xs text-gray-400">{value.length} caracteres</p>
    </div>
  );
}

function WarningModal({
  violationCount,
  threshold,
  onDismiss,
}: {
  violationCount: number;
  threshold: number;
  onDismiss: () => void;
}) {
  const remaining = Math.max(0, threshold + 1 - violationCount);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-8">
        <h2 className="text-xl font-bold text-red-600">Aviso: troca de foco detectada</h2>
        <p className="mt-3 text-sm text-gray-700">
          Você saiu da janela da prova. Se isso acontecer{" "}
          <strong>mais {remaining} vez</strong>, sua prova será encerrada
          automaticamente e você não poderá refazê-la.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Feche outras abas, desative notificações e, se possível, use apenas
          um monitor com a prova em tela cheia (F11).
        </p>
        <Button
          className="mt-5 h-10 w-full rounded-full text-white"
          style={{ backgroundColor: BRAND.color.primary }}
          onClick={onDismiss}
        >
          Entendi
        </Button>
      </div>
    </div>
  );
}

function SubmitConfirmModal({
  answered,
  total,
  onCancel,
  onConfirm,
}: {
  answered: number;
  total: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const unanswered = total - answered;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-8">
        <h2
          className="text-lg font-bold"
          style={{ color: BRAND.color.primary }}
        >
          Enviar prova?
        </h2>
        <p className="mt-3 text-sm text-gray-700">
          Depois de enviar, você não pode alterar as respostas.
        </p>
        {unanswered > 0 && (
          <p className="mt-2 text-sm text-amber-700">
            Você deixou <strong>{unanswered}</strong> pergunta(s) em branco.
            Nenhuma é obrigatória, mas confira antes se foi intencional.
          </p>
        )}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 rounded-full"
            onClick={onCancel}
          >
            Continuar editando
          </Button>
          <Button
            type="button"
            className="h-10 flex-1 rounded-full text-white"
            style={{ backgroundColor: BRAND.color.primary }}
            onClick={onConfirm}
          >
            Enviar agora
          </Button>
        </div>
      </div>
    </div>
  );
}

function FullscreenPrompt({
  onAccept,
  onSkip,
}: {
  onAccept: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-8">
        <h2
          className="text-lg font-bold"
          style={{ color: BRAND.color.primary }}
        >
          Entrar em tela cheia
        </h2>
        <p className="mt-3 text-sm text-gray-700">
          Para evitar distrações, recomendamos fazer a prova em tela cheia.
          Você também pode pressionar <strong>F11</strong> a qualquer momento.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Se você tiver um segundo monitor ligado, desconecte-o antes de
          começar — qualquer troca de janela é registrada como violação.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 rounded-full"
            onClick={onSkip}
          >
            Agora não
          </Button>
          <Button
            type="button"
            className="h-10 flex-1 rounded-full text-white"
            style={{ backgroundColor: BRAND.color.primary }}
            onClick={onAccept}
          >
            Entrar em tela cheia
          </Button>
        </div>
      </div>
    </div>
  );
}

function FullscreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 text-center">
      {children}
    </div>
  );
}
