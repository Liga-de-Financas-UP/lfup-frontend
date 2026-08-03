"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  AdminButton,
  AdminPage,
  AdminSelect,
  Pagination,
  SearchInput,
  StatTile,
} from "./admin-ui";
import {
  getAdminAttempts,
  getAdminExamConfig,
} from "@/shared/lib/admin-api";
import type {
  AdminAttemptRow,
  AttemptStatus,
  GradeStatus,
} from "@/entities/admin/model/types";
import type { ExamConfig } from "@/entities/exam/model/types";

type LoadState = "loading" | "loaded" | "error";
const PER_PAGE = 15;

export function AdminAttemptsListView() {
  const [state, setState] = useState<LoadState>("loading");
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [attempts, setAttempts] = useState<AdminAttemptRow[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<GradeStatus | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AttemptStatus | "all">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
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
        setErrorMsg(attRes.error || "Erro ao carregar tentativas.");
        setState("error");
        return;
      }
      setAttempts(attRes.data ?? []);
      setState("loaded");
    })();
  }, []);

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

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  useEffect(() => setPage(1), [search, gradeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = attempts.length;
    const submitted = attempts.filter((a) => a.status === "submitted").length;
    const terminated = attempts.filter((a) => a.status === "terminated").length;
    const pending = attempts.filter((a) => a.gradeStatus === "pending").length;
    return { total, submitted, terminated, pending };
  }, [attempts]);

  if (state === "loading")
    return (
      <AdminPage title="Provas">
        <p className="py-12 text-center text-sm text-neutral-400">Carregando…</p>
      </AdminPage>
    );

  if (state === "error")
    return (
      <AdminPage title="Provas">
        <p className="py-12 text-center text-sm text-neutral-500">{errorMsg}</p>
      </AdminPage>
    );

  return (
    <AdminPage
      title="Provas"
      subtitle={config ? `Tentativas — ${config.name}` : undefined}
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total" value={stats.total} />
        <StatTile label="Enviadas" value={stats.submitted} accent="#16a34a" />
        <StatTile label="Encerradas" value={stats.terminated} accent="#dc2626" />
        <StatTile label="A avaliar" value={stats.pending} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome, e-mail ou RGM…"
          className="min-w-[220px] flex-1"
        />
        <AdminSelect
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as AttemptStatus | "all")}
        >
          <option value="all">Todos os status</option>
          <option value="in_progress">Em andamento</option>
          <option value="submitted">Enviada</option>
          <option value="terminated">Encerrada</option>
          <option value="expired">Expirada</option>
        </AdminSelect>
        <AdminSelect
          value={gradeFilter}
          onChange={(v) => setGradeFilter(v as GradeStatus | "all")}
        >
          <option value="all">Todas as avaliações</option>
          <option value="pending">Pendente</option>
          <option value="reviewing">Em revisão</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Reprovado</option>
        </AdminSelect>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-[11px] uppercase tracking-wider text-neutral-400">
              <th className="px-4 py-3 font-medium">Candidato</th>
              <th className="px-4 py-3 font-medium">RGM</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Viol.</th>
              <th className="px-4 py-3 font-medium">Avaliação</th>
              <th className="px-4 py-3 font-medium">Nota</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-neutral-400">
                  Nenhuma tentativa encontrada.
                </td>
              </tr>
            ) : (
              paged.map((a, i) => (
                <tr
                  key={a.id}
                  className="admin-rise border-b border-neutral-100 transition-colors last:border-b-0 hover:bg-neutral-50"
                  style={{ animationDelay: `${Math.min(i, 12) * 20}ms` }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">
                      {a.candidateName ?? "(sem nome)"}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {a.candidateEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                    {a.candidateRgm}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600">
                    {a.violationCount}
                  </td>
                  <td className="px-4 py-3">
                    <GradeBadge status={a.gradeStatus} />
                  </td>
                  <td className="px-4 py-3 tabular-nums text-neutral-700">
                    {a.score ? Number(a.score).toFixed(1) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/provas/detalhe?id=${a.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-neutral-900 hover:underline"
                    >
                      Detalhes <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={safePage}
        pageCount={pageCount}
        total={filtered.length}
        perPage={PER_PAGE}
        onPage={setPage}
      />
    </AdminPage>
  );
}

function StatusBadge({ status }: { status: AttemptStatus }) {
  const styles: Record<AttemptStatus, { bg: string; color: string; label: string }> = {
    in_progress: { bg: "#3b82f615", color: "#1d4ed8", label: "Em andamento" },
    submitted: { bg: "#16a34a15", color: "#15803d", label: "Enviada" },
    terminated: { bg: "#dc262615", color: "#b91c1c", label: "Encerrada" },
    expired: { bg: "#d9770615", color: "#a16207", label: "Expirada" },
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
    pending: { bg: "#f5f5f5", color: "#737373", label: "Pendente" },
    reviewing: { bg: "#d9770615", color: "#92400e", label: "Em revisão" },
    approved: { bg: "#16a34a15", color: "#15803d", label: "Aprovado" },
    rejected: { bg: "#dc262615", color: "#b91c1c", label: "Reprovado" },
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
