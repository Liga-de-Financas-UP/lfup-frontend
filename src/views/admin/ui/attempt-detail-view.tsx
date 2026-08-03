"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/shared/config/constants";
import {
  clearAdminSession,
  getAdminAttemptDetail,
  gradeAttempt,
  readAdminSession,
} from "@/shared/lib/admin-api";
import type {
  AdminAttemptDetail,
  GradeStatus,
} from "@/entities/admin/model/types";

type LoadState = "loading" | "loaded" | "unauthorized" | "error";

interface Props {
  attemptId: string;
}

export function AdminAttemptDetailView({ attemptId }: Props) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>("loading");
  const [detail, setDetail] = useState<AdminAttemptDetail | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Grading form
  const [gradeStatus, setGradeStatus] = useState<GradeStatus>("pending");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  async function load() {
    const session = readAdminSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    const res = await getAdminAttemptDetail(attemptId);
    if (!res.success || !res.data) {
      if (
        res.error === "Sessão expirada" ||
        res.error === "Não autenticado"
      ) {
        clearAdminSession();
        router.replace("/admin/login");
        return;
      }
      setErrorMsg(res.error || "Erro ao carregar tentativa.");
      setState("error");
      return;
    }
    setDetail(res.data);
    setGradeStatus(res.data.grade.status);
    setScore(res.data.grade.score ?? "");
    setNotes(res.data.grade.notes ?? "");
    setState("loaded");
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  async function handleGrade(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    const parsedScore = score.trim() === "" ? null : Number(score);
    if (parsedScore !== null && (Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100)) {
      setSaveMsg("Nota deve estar entre 0 e 100.");
      setSaving(false);
      return;
    }
    const res = await gradeAttempt(attemptId, {
      gradeStatus,
      score: parsedScore,
      gradeNotes: notes,
    });
    if (!res.success) {
      setSaveMsg(res.error || "Erro ao salvar avaliação.");
      setSaving(false);
      return;
    }
    setSaveMsg("Avaliação salva.");
    setSaving(false);
    await load();
  }

  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-neutral-400">Carregando…</p>
      </div>
    );
  }

  if (state === "error" || !detail) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-xl font-bold" style={{ color: BRAND.color.primary }}>
          Não foi possível carregar
        </h1>
        <p className="mt-2 text-sm text-gray-600">{errorMsg}</p>
        <Link
          href="/admin/provas"
          className="mt-4 inline-block text-sm underline"
          style={{ color: BRAND.color.primary }}
        >
          Voltar
        </Link>
      </div>
    );
  }

  const { candidate, attempt, questions, events } = detail;
  const answered = questions.filter((q) => q.answer.trim().length > 0).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10">
      <Link
        href="/admin/provas"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← Tentativas
      </Link>
      <div className="mt-3 border-b border-neutral-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {candidate.fullName ?? candidate.email}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {candidate.email} · RGM {candidate.rgm}
        </p>
      </div>

      <main className="mt-6 space-y-6">
        {/* Summary */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <MetaCard label="Status" value={attempt.status} />
          <MetaCard
            label="Violações"
            value={String(attempt.violationCount)}
            warn={attempt.violationCount > 0}
          />
          <MetaCard
            label="Respondidas"
            value={`${answered}/${questions.length}`}
          />
          <MetaCard
            label="Início"
            value={formatDateShort(attempt.startedAt)}
          />
          <MetaCard
            label={
              attempt.submittedAt
                ? "Envio"
                : attempt.terminatedAt
                  ? "Encerramento"
                  : "Limite"
            }
            value={formatDateShort(
              attempt.submittedAt ??
                attempt.terminatedAt ??
                attempt.endsAt,
            )}
          />
        </section>

        {/* Grading */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
          <h2
            className="text-base font-semibold"
            style={{ color: BRAND.color.primary }}
          >
            Avaliação
          </h2>
          <form onSubmit={handleGrade} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr,160px]">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  Status
                </Label>
                <select
                  value={gradeStatus}
                  onChange={(e) =>
                    setGradeStatus(e.target.value as GradeStatus)
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
                >
                  <option value="pending">Pendente</option>
                  <option value="reviewing">Em revisão</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Reprovado</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  Nota (0–100)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Ex: 85"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">
                Observações
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comentários da avaliação..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                className="h-9 rounded-full px-5 text-white"
                style={{ backgroundColor: BRAND.color.primary }}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar avaliação"}
              </Button>
              {saveMsg && (
                <span
                  className={`text-xs ${
                    saveMsg.includes("salva")
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {saveMsg}
                </span>
              )}
              {detail.grade.gradedAt && (
                <span className="text-xs text-gray-400">
                  Última avaliação:{" "}
                  {formatDateShort(detail.grade.gradedAt)}
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Answers */}
        <section className="space-y-3">
          <h2
            className="text-base font-semibold"
            style={{ color: BRAND.color.primary }}
          >
            Respostas ({answered}/{questions.length})
          </h2>
          {questions.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6"
            >
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                <span>Q{q.index + 1}</span>
                {q.areaName && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      color: BRAND.color.primary,
                      backgroundColor: `${BRAND.color.primary}15`,
                    }}
                  >
                    {q.areaName}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium leading-relaxed text-gray-900">
                {q.prompt}
              </p>
              <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm whitespace-pre-wrap text-gray-800">
                {q.answer.trim() ? (
                  q.answer
                ) : (
                  <span className="italic text-gray-400">Em branco</span>
                )}
              </div>
              {q.answer.trim() && (
                <p className="mt-2 text-right text-[11px] text-gray-400">
                  {q.answer.length} caracteres
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Events timeline */}
        <section>
          <h2
            className="text-base font-semibold"
            style={{ color: BRAND.color.primary }}
          >
            Linha do tempo ({events.length} eventos)
          </h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-xs">
              <thead className="text-left uppercase tracking-wider text-gray-500">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2">Quando</th>
                  <th className="px-3 py-2">Evento</th>
                  <th className="px-3 py-2">Q#</th>
                  <th className="px-3 py-2">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-gray-400"
                    >
                      Nenhum evento registrado.
                    </td>
                  </tr>
                ) : (
                  events.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-gray-50 last:border-b-0"
                    >
                      <td className="px-3 py-2 tabular-nums text-gray-500">
                        {formatTimeWithMs(e.createdAt)}
                      </td>
                      <td className="px-3 py-2">
                        <EventBadge type={e.eventType} />
                      </td>
                      <td className="px-3 py-2 tabular-nums text-gray-500">
                        {e.questionIndex !== null ? e.questionIndex + 1 : ""}
                      </td>
                      <td className="px-3 py-2 font-mono text-[10px] text-gray-500">
                        {e.details ? JSON.stringify(e.details) : ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function MetaCard({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
      <div
        className={`text-sm font-semibold ${warn ? "text-red-600" : "text-gray-900"}`}
      >
        {value}
      </div>
      <div className="text-[11px] text-gray-500">{label}</div>
    </div>
  );
}

function EventBadge({ type }: { type: string }) {
  const critical = new Set([
    "focus_lost",
    "tab_hidden",
    "violation_warned",
    "violation_terminated",
    "devtools_keybind",
    "devtools_detected",
    "terminated",
    "paste",
  ]);
  const ok = new Set(["submitted", "started", "focus_return", "tab_visible"]);
  const muted = new Set(["heartbeat", "autosave", "question_nav", "resize"]);
  let color = "#6b7280";
  let bg = "#f3f4f6";
  if (critical.has(type)) {
    color = "#b91c1c";
    bg = "#fee2e2";
  } else if (ok.has(type)) {
    color = "#047857";
    bg = "#d1fae5";
  } else if (muted.has(type)) {
    color = "#6b7280";
    bg = "#f3f4f6";
  }
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: bg, color }}
    >
      {type}
    </span>
  );
}

function formatDateShort(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    });
  } catch {
    return iso;
  }
}

function formatTimeWithMs(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  } catch {
    return iso;
  }
}
