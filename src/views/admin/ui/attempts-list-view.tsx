"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/shared/config/constants";
import {
  clearAdminSession,
  getAdminAttempts,
  getAdminExamConfig,
  readAdminSession,
} from "@/shared/lib/admin-api";
import type {
  AdminAttemptRow,
  AttemptStatus,
  GradeStatus,
} from "@/entities/admin/model/types";
import type { ExamConfig } from "@/entities/exam/model/types";

type LoadState = "loading" | "loaded" | "unauthorized" | "error";

export function AdminAttemptsListView() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>("loading");
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [attempts, setAttempts] = useState<AdminAttemptRow[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<GradeStatus | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AttemptStatus | "all">("all");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const session = readAdminSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setUserName(session.user?.name ?? session.user?.email ?? "");

    void (async () => {
      const cfgRes = await getAdminExamConfig();
      if (!cfgRes.success || !cfgRes.data) {
        setErrorMsg("Nenhuma prova ativa configurada.");
        setState("error");
        return;
      }
      setConfig(cfgRes.data);

      const attRes = await getAdminAttempts(cfgRes.data.id);
      if (!attRes.success) {
        if (
          attRes.error === "Sessão expirada" ||
          attRes.error === "Não autenticado"
        ) {
          clearAdminSession();
          router.replace("/admin/login");
          return;
        }
        setErrorMsg(attRes.error || "Erro ao carregar tentativas.");
        setState("error");
        return;
      }
      setAttempts(attRes.data ?? []);
      setState("loaded");
    })();
  }, [router]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return attempts.filter((a) => {
      if (gradeFilter !== "all" && a.gradeStatus !== gradeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      return (
        a.candidateEmail.toLowerCase().includes(q) ||
        (a.candidateName?.toLowerCase().includes(q) ?? false) ||
        a.candidateRgm.toLowerCase().includes(q)
      );
    });
  }, [attempts, search, gradeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = attempts.length;
    const submitted = attempts.filter((a) => a.status === "submitted").length;
    const terminated = attempts.filter((a) => a.status === "terminated").length;
    const expired = attempts.filter((a) => a.status === "expired").length;
    const inProgress = attempts.filter((a) => a.status === "in_progress").length;
    const pending = attempts.filter((a) => a.gradeStatus === "pending").length;
    return { total, submitted, terminated, expired, inProgress, pending };
  }, [attempts]);

  function handleLogout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <p className="text-sm text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-xl font-bold" style={{ color: BRAND.color.primary }}>
          Não foi possível carregar
        </h1>
        <p className="mt-2 text-sm text-gray-600">{errorMsg}</p>
        <Button
          className="mt-4 h-10 rounded-full px-5"
          variant="outline"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: BRAND.color.primary }}
            >
              LFUP · Admin
            </p>
            <h1
              className="text-lg font-bold tracking-tight"
              style={{ color: BRAND.color.primary }}
            >
              Tentativas — {config?.name}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="hidden md:inline">{userName}</span>
            <Button
              variant="outline"
              className="h-8 rounded-full px-4"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6">
          <Stat label="Total" value={stats.total} />
          <Stat label="Enviadas" value={stats.submitted} color="#10b981" />
          <Stat label="Em andamento" value={stats.inProgress} color="#3b82f6" />
          <Stat label="Encerradas" value={stats.terminated} color="#ef4444" />
          <Stat label="Expiradas" value={stats.expired} color="#f59e0b" />
          <Stat
            label="A avaliar"
            value={stats.pending}
            color={BRAND.color.primary}
          />
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder="Buscar por nome, email ou RGM"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AttemptStatus | "all")}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
          >
            <option value="all">Todos os status</option>
            <option value="in_progress">Em andamento</option>
            <option value="submitted">Enviada</option>
            <option value="terminated">Encerrada</option>
            <option value="expired">Expirada</option>
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value as GradeStatus | "all")}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
          >
            <option value="all">Todas as avaliações</option>
            <option value="pending">Pendente</option>
            <option value="reviewing">Em revisão</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Reprovado</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-gray-500">
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3">Candidato</th>
                <th className="px-4 py-3">RGM</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Viol.</th>
                <th className="px-4 py-3">Enviada</th>
                <th className="px-4 py-3">Avaliação</th>
                <th className="px-4 py-3">Nota</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    Nenhuma tentativa encontrada.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {a.candidateName ?? "(sem nome)"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {a.candidateEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {a.candidateRgm}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-600">
                      {a.violationCount}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 tabular-nums">
                      {a.submittedAt
                        ? formatDateShort(a.submittedAt)
                        : a.terminatedAt
                          ? formatDateShort(a.terminatedAt)
                          : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <GradeBadge status={a.gradeStatus} />
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {a.score ? Number(a.score).toFixed(1) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/provas/detalhe?id=${a.id}`}
                        className="text-xs font-medium underline"
                        style={{ color: BRAND.color.primary }}
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
      <div className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: AttemptStatus }) {
  const styles: Record<AttemptStatus, { bg: string; color: string; label: string }> = {
    in_progress: { bg: "#3b82f615", color: "#1d4ed8", label: "Em andamento" },
    submitted: { bg: "#10b98115", color: "#047857", label: "Enviada" },
    terminated: { bg: "#ef444415", color: "#b91c1c", label: "Encerrada" },
    expired: { bg: "#f59e0b15", color: "#a16207", label: "Expirada" },
  };
  const s = styles[status];
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function GradeBadge({ status }: { status: GradeStatus }) {
  const styles: Record<GradeStatus, { bg: string; color: string; label: string }> = {
    pending: { bg: "#f3f4f6", color: "#6b7280", label: "Pendente" },
    reviewing: { bg: "#fef3c715", color: "#92400e", label: "Em revisão" },
    approved: { bg: "#10b98115", color: "#047857", label: "Aprovado" },
    rejected: { bg: "#ef444415", color: "#b91c1c", label: "Reprovado" },
  };
  const s = styles[status];
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
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
