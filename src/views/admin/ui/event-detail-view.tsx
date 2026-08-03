"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import {
  AdminButton,
  AdminPage,
  AdminSelect,
  Pagination,
  SearchInput,
  StatTile,
} from "./admin-ui";
import {
  clearAttendance,
  getEventRoster,
  setAttendance,
  type AdminEventRow,
  type AttendanceStatus,
  type RosterRow,
} from "@/shared/lib/admin-api";

const TYPE_LABEL: Record<string, string> = {
  assembleia: "Assembleia Geral",
  palestra: "Palestra",
  workshop: "Workshop",
  reuniao: "Reunião",
  outro: "Outro",
};

const STATUS_META: Record<
  AttendanceStatus,
  { label: string; bg: string; text: string }
> = {
  present: { label: "Presente", bg: "#16a34a", text: "#fff" },
  absent: { label: "Ausente", bg: "#dc2626", text: "#fff" },
  justified: { label: "Justificado", bg: "#d97706", text: "#fff" },
};

const PER_PAGE = 15;

function EventDetailInner() {
  const params = useSearchParams();
  const eventId = params.get("id");

  const [event, setEvent] = useState<AdminEventRow | null>(null);
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [savingUser, setSavingUser] = useState<string | null>(null);
  const [bulk, setBulk] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!eventId) {
      setError("Evento não informado.");
      setLoading(false);
      return;
    }
    void (async () => {
      const res = await getEventRoster(eventId);
      if (!res.success || !res.data) {
        setError(res.error || "Erro ao carregar o evento.");
        setLoading(false);
        return;
      }
      setEvent(res.data.event);
      setRoster(res.data.roster);
      setLoading(false);
    })();
  }, [eventId]);

  const departments = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of roster)
      if (r.departmentId && r.departmentName)
        map.set(r.departmentId, r.departmentName);
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [roster]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roster.filter((r) => {
      if (deptFilter !== "all" && r.departmentId !== deptFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    });
  }, [roster, search, deptFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  useEffect(() => setPage(1), [search, deptFilter]);

  const counts = useMemo(() => {
    let present = 0,
      absent = 0,
      justified = 0,
      pending = 0;
    for (const r of roster) {
      if (r.status === "present") present++;
      else if (r.status === "absent") absent++;
      else if (r.status === "justified") justified++;
      else pending++;
    }
    return { present, absent, justified, pending, total: roster.length };
  }, [roster]);

  function applyLocal(userId: string, status: AttendanceStatus | null) {
    setRoster((prev) =>
      prev.map((r) => (r.userId === userId ? { ...r, status } : r)),
    );
  }

  async function mark(r: RosterRow, status: AttendanceStatus) {
    if (!eventId) return;
    const next = r.status === status ? null : status;
    setSavingUser(r.userId);
    const prev = r.status;
    applyLocal(r.userId, next);
    const res =
      next === null
        ? await clearAttendance(eventId, r.userId)
        : await setAttendance(eventId, r.userId, next);
    if (!res.success) {
      applyLocal(r.userId, prev);
      alert(res.error || "Erro ao registrar presença.");
    }
    setSavingUser(null);
  }

  async function markAllPresent() {
    if (!eventId) return;
    const targets = filtered.filter((r) => r.status !== "present");
    if (targets.length === 0) return;
    if (!confirm(`Marcar ${targets.length} membro(s) como presente?`)) return;
    setBulk(true);
    targets.forEach((r) => applyLocal(r.userId, "present"));
    const results = await Promise.all(
      targets.map((r) => setAttendance(eventId, r.userId, "present")),
    );
    const failed = results.filter((x) => !x.success).length;
    if (failed) alert(`${failed} não puderam ser salvos. Recarregue a página.`);
    setBulk(false);
  }

  if (loading)
    return (
      <AdminPage title="Registrar presença">
        <p className="py-12 text-center text-sm text-neutral-400">Carregando…</p>
      </AdminPage>
    );

  if (error || !event)
    return (
      <AdminPage title="Registrar presença">
        <p className="py-12 text-center text-sm text-red-500">{error}</p>
        <div className="text-center">
          <Link
            href="/admin/eventos"
            className="text-sm text-neutral-900 underline"
          >
            Voltar aos eventos
          </Link>
        </div>
      </AdminPage>
    );

  return (
    <AdminPage title="Registrar presença">
      <Link
        href="/admin/eventos"
        className="mb-5 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar aos eventos
      </Link>

      {/* Event card */}
      <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-5">
        <span className="rounded-md bg-neutral-900/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
          {TYPE_LABEL[event.type]}
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">
          {event.title}
        </h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatDate(event.startsAt)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          )}
        </div>
        {event.description && (
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {event.description}
          </p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatTile label="Presentes" value={counts.present} accent="#16a34a" />
          <StatTile label="Ausentes" value={counts.absent} accent="#dc2626" />
          <StatTile
            label="Justificados"
            value={counts.justified}
            accent="#d97706"
          />
          <StatTile label="Não registrados" value={counts.pending} />
          <StatTile label="Total" value={counts.total} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar membro…"
          className="min-w-[200px] flex-1"
        />
        <AdminSelect value={deptFilter} onChange={setDeptFilter}>
          <option value="all">Todas as áreas</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </AdminSelect>
        <AdminButton variant="outline" disabled={bulk} onClick={markAllPresent}>
          {bulk ? "Salvando…" : "Marcar todos presentes"}
        </AdminButton>
      </div>

      {/* Roster */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {paged.map((r, i) => (
          <div
            key={r.userId}
            className="admin-rise flex flex-col gap-3 border-b border-neutral-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
            style={{ animationDelay: `${Math.min(i, 12) * 18}ms` }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                {initials(r.name)}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-neutral-900">{r.name}</div>
                <div className="text-xs text-neutral-400">
                  {r.departmentName ?? "sem área"} · {r.email}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {(Object.keys(STATUS_META) as AttendanceStatus[]).map((s) => {
                const active = r.status === s;
                const meta = STATUS_META[s];
                return (
                  <button
                    key={s}
                    onClick={() => mark(r, s)}
                    disabled={savingUser === r.userId || bulk}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? "border-transparent"
                        : "border-neutral-200 text-neutral-500 hover:bg-neutral-100"
                    }`}
                    style={
                      active
                        ? { backgroundColor: meta.bg, color: meta.text }
                        : undefined
                    }
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-neutral-400">
            Nenhum membro encontrado.
          </p>
        )}
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

export function EventDetailView() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-neutral-400">
          Carregando…
        </div>
      }
    >
      <EventDetailInner />
    </Suspense>
  );
}
