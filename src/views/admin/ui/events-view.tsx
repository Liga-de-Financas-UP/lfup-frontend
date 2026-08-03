"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminButton, AdminPage, AdminSelect } from "./admin-ui";
import {
  createEvent,
  deleteEvent,
  getEvents,
  type AdminEventRow,
  type EventType,
} from "@/shared/lib/admin-api";

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "assembleia", label: "Assembleia Geral" },
  { value: "palestra", label: "Palestra" },
  { value: "workshop", label: "Workshop" },
  { value: "reuniao", label: "Reunião" },
  { value: "outro", label: "Outro" },
];

const TYPE_LABEL: Record<string, string> = Object.fromEntries(
  EVENT_TYPES.map((t) => [t.value, t.label]),
);

export function EventsView() {
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  async function reload() {
    const res = await getEvents();
    if (!res.success) setError(res.error || "Erro ao carregar eventos.");
    else {
      setEvents(res.data ?? []);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    void reload();
  }, []);

  const filtered = useMemo(
    () =>
      typeFilter === "all"
        ? events
        : events.filter((e) => e.type === typeFilter),
    [events, typeFilter],
  );

  async function onDelete(ev: AdminEventRow) {
    if (!confirm(`Excluir "${ev.title}" e toda a presença registrada?`)) return;
    const res = await deleteEvent(ev.id);
    if (res.success) setEvents((p) => p.filter((e) => e.id !== ev.id));
    else alert(res.error || "Erro ao excluir.");
  }

  return (
    <AdminPage
      title="Eventos & Assembleias"
      subtitle="Assembleias gerais, palestras, workshops e demais eventos."
      actions={
        <>
          <AdminSelect value={typeFilter} onChange={setTypeFilter}>
            <option value="all">Todos os tipos</option>
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </AdminSelect>
          <AdminButton onClick={() => setShowAdd((v) => !v)}>
            {showAdd ? (
              <>
                <X className="h-4 w-4" /> Fechar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Criar evento
              </>
            )}
          </AdminButton>
        </>
      }
    >
      {showAdd && (
        <div className="admin-rise mb-5">
          <CreateEventForm
            onCreated={(ev) => {
              setEvents((p) => [ev, ...p]);
              setShowAdd(false);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[92px] animate-pulse rounded-xl border border-neutral-200 bg-white"
            />
          ))}
        </div>
      ) : error ? (
        <p className="py-12 text-center text-sm text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center">
          <CalendarDays className="mx-auto h-6 w-6 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-400">
            Nenhum evento ainda. Crie o primeiro para registrar presença.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((ev, i) => (
            <div
              key={ev.id}
              className="admin-rise group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300 sm:flex-row sm:items-center sm:justify-between"
              style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
            >
              <Link
                href={`/admin/eventos/detalhe?id=${ev.id}`}
                className="min-w-0 flex-1"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-neutral-900/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                    {TYPE_LABEL[ev.type]}
                  </span>
                  <h3 className="truncate font-semibold text-neutral-900">
                    {ev.title}
                  </h3>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(ev.startsAt)}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {ev.location}
                    </span>
                  )}
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold tabular-nums text-neutral-900">
                    {ev.presentCount}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                    presentes
                  </div>
                </div>
                <Link
                  href={`/admin/eventos/detalhe?id=${ev.id}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-neutral-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  Presença
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => onDelete(ev)}
                  title="Excluir"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}

function CreateEventForm({
  onCreated,
}: {
  onCreated: (ev: AdminEventRow) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("assembleia");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!startsAt) {
      setErr("Informe a data e horário de início.");
      return;
    }
    setSaving(true);
    const res = await createEvent({
      title,
      type,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      location: location || null,
      description: description || null,
    });
    setSaving(false);
    if (!res.success || !res.data) {
      setErr(res.error || "Erro ao criar evento.");
      return;
    }
    onCreated({ ...res.data, presentCount: 0, attendanceCount: 0 });
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-neutral-200 bg-white p-6"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900">
        <CalendarDays className="h-4 w-4" /> Novo evento
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Título *" className="md:col-span-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Assembleia Geral Ordinária"
            required
          />
        </Field>
        <Field label="Tipo">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
            className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-2 text-sm outline-none focus:border-neutral-900"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Local">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex.: Auditório UP"
          />
        </Field>
        <Field label="Início *">
          <Input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </Field>
        <Field label="Término (opcional)">
          <Input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </Field>
        <Field label="Descrição" className="md:col-span-2">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Pauta, palestrante, observações…"
          />
        </Field>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <AdminButton type="submit" disabled={saving}>
          {saving ? "Criando…" : "Criar evento"}
        </AdminButton>
        {err && <p className="text-xs text-red-500">{err}</p>}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <label className="text-xs font-medium text-neutral-500">{label}</label>
      {children}
    </div>
  );
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
