"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import {
  AdminPage,
  AdminSelect,
  Pagination,
  SearchInput,
  StatTile,
} from "./admin-ui";
import {
  getAdminProcesses,
  getProcessApplications,
  updateApplicationStatus,
  type AdminApplication,
  type AdminProcess,
  type ApplicationStatus,
} from "@/shared/lib/admin-api";

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "reviewing", label: "Em análise" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Reprovado" },
];

const STATUS_BADGE: Record<ApplicationStatus, { bg: string; color: string }> = {
  pending: { bg: "#f5f5f5", color: "#737373" },
  reviewing: { bg: "#d9770615", color: "#92400e" },
  approved: { bg: "#16a34a15", color: "#15803d" },
  rejected: { bg: "#dc262615", color: "#b91c1c" },
};

const PER_PAGE = 12;

export function ApplicationsView() {
  const [processes, setProcesses] = useState<AdminProcess[]>([]);
  const [processId, setProcessId] = useState<string>("");
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Carrega processos e seleciona o ativo
  useEffect(() => {
    void (async () => {
      const res = await getAdminProcesses();
      if (!res.success) {
        setError(res.error || "Erro ao carregar processos.");
        setLoading(false);
        return;
      }
      const list = res.data ?? [];
      setProcesses(list);
      const active = list.find((p) => p.isActive) ?? list[0];
      if (active) setProcessId(active.id);
      else setLoading(false);
    })();
  }, []);

  // Carrega inscrições do processo selecionado
  useEffect(() => {
    if (!processId) return;
    setLoading(true);
    void (async () => {
      const res = await getProcessApplications(processId);
      if (!res.success) setError(res.error || "Erro ao carregar inscrições.");
      else {
        setApps(res.data ?? []);
        setError("");
      }
      setLoading(false);
    })();
  }, [processId]);

  const areas = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => a.departmentPreference && set.add(a.departmentPreference));
    return [...set].sort();
  }, [apps]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (areaFilter !== "all" && a.departmentPreference !== areaFilter)
        return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (a.fullName?.toLowerCase().includes(q) ?? false) ||
        (a.email?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [apps, search, areaFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  useEffect(() => setPage(1), [search, areaFilter, statusFilter, processId]);

  const counts = useMemo(() => {
    const c = { total: apps.length, pending: 0, reviewing: 0, approved: 0, rejected: 0 };
    apps.forEach((a) => {
      if (a.status in c) (c as Record<string, number>)[a.status]++;
    });
    return c;
  }, [apps]);

  async function onStatus(app: AdminApplication, status: ApplicationStatus) {
    const prev = app.status;
    setApps((p) => p.map((x) => (x.id === app.id ? { ...x, status } : x)));
    const res = await updateApplicationStatus(processId, app.id, status);
    if (!res.success) {
      setApps((p) => p.map((x) => (x.id === app.id ? { ...x, status: prev } : x)));
      alert(res.error || "Erro ao atualizar status.");
    }
  }

  return (
    <AdminPage
      title="Processo Seletivo"
      subtitle="Acompanhe e gerencie as inscrições."
      actions={
        processes.length > 0 && (
          <AdminSelect value={processId} onChange={setProcessId}>
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.isActive ? " · ativo" : ""}
              </option>
            ))}
          </AdminSelect>
        )
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Inscrições" value={counts.total} />
        <StatTile label="Pendentes" value={counts.pending} />
        <StatTile label="Em análise" value={counts.reviewing} accent="#b45309" />
        <StatTile label="Aprovados" value={counts.approved} accent="#15803d" />
        <StatTile label="Reprovados" value={counts.rejected} accent="#b91c1c" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou e-mail…"
          className="min-w-[220px] flex-1"
        />
        <AdminSelect value={areaFilter} onChange={setAreaFilter}>
          <option value="all">Todas as áreas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect value={statusFilter} onChange={setStatusFilter}>
          <option value="all">Todos os status</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </AdminSelect>
      </div>

      {loading ? (
        <div className="grid gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-neutral-200 bg-white"
            />
          ))}
        </div>
      ) : error ? (
        <p className="py-12 text-center text-sm text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-400">
          Nenhuma inscrição encontrada.
        </div>
      ) : (
        <>
          <div className="grid gap-2">
            {paged.map((app, i) => (
              <ApplicationRow
                key={app.id}
                app={app}
                index={i}
                onStatus={onStatus}
              />
            ))}
          </div>
          <Pagination
            page={safePage}
            pageCount={pageCount}
            total={filtered.length}
            perPage={PER_PAGE}
            onPage={setPage}
          />
        </>
      )}
    </AdminPage>
  );
}

function ApplicationRow({
  app,
  index,
  onStatus,
}: {
  app: AdminApplication;
  index: number;
  onStatus: (a: AdminApplication, s: ApplicationStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const badge = STATUS_BADGE[app.status];

  return (
    <div
      className="admin-rise overflow-hidden rounded-xl border border-neutral-200 bg-white"
      style={{ animationDelay: `${Math.min(index, 12) * 20}ms` }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
            {initials(app.fullName ?? app.email ?? "?")}
          </span>
          <div className="min-w-0">
            <div className="truncate font-medium text-neutral-900">
              {app.fullName ?? "(sem nome)"}
            </div>
            <div className="truncate text-xs text-neutral-400">
              {app.departmentPreference ?? "sem área"}
              {app.course ? ` · ${app.course}` : ""}
              {app.semester ? ` · ${app.semester}º` : ""}
            </div>
          </div>
          <ChevronDown
            className={`ml-1 h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <span
          className="hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline"
          style={{ backgroundColor: badge.bg, color: badge.color }}
        >
          {STATUSES.find((s) => s.value === app.status)?.label}
        </span>

        <select
          value={app.status}
          onChange={(e) => onStatus(app, e.target.value as ApplicationStatus)}
          onClick={(e) => e.stopPropagation()}
          className="h-8 shrink-0 rounded-md border border-neutral-200 bg-white px-2 text-xs outline-none hover:bg-neutral-50 focus:border-neutral-900"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {open && (
        <div className="admin-rise border-t border-neutral-100 bg-neutral-50 px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Contact icon={Mail} label="E-mail" value={app.email} href={app.email ? `mailto:${app.email}` : undefined} />
            <Contact icon={Phone} label="Telefone" value={app.phone} />
            <Contact
              icon={Instagram}
              label="Instagram"
              value={app.instagram}
              href={
                app.instagram
                  ? `https://instagram.com/${app.instagram.replace("@", "")}`
                  : undefined
              }
            />
            <Contact
              icon={Linkedin}
              label="LinkedIn"
              value={app.linkedinUrl}
              href={app.linkedinUrl ?? undefined}
            />
          </div>
          {app.motivation && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Motivação
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                {app.motivation}
              </p>
            </div>
          )}
          <p className="mt-4 text-xs text-neutral-400">
            Inscrito em {formatDate(app.createdAt)}
          </p>
        </div>
      )}
    </div>
  );
}

function Contact({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string | null;
  href?: string;
}) {
  if (!value) return null;
  const body = (
    <span className="inline-flex items-center gap-2 text-sm text-neutral-700">
      <Icon className="h-4 w-4 text-neutral-400" />
      {value}
    </span>
  );
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <div className="mt-0.5">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-neutral-900 hover:underline"
          >
            <Icon className="h-4 w-4 text-neutral-400" />
            {value}
          </a>
        ) : (
          body
        )}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    });
  } catch {
    return iso;
  }
}
