"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Power, Trash2, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AdminButton,
  AdminPage,
  AdminSelect,
  Pagination,
  SearchInput,
} from "./admin-ui";
import {
  activateMember,
  createMember,
  deactivateMember,
  deleteMember,
  getAdminDepartments,
  getAdminMembers,
  updateMemberProfile,
  updateMemberRole,
  type AdminDepartment,
  type AdminMemberRow,
  type MemberRole,
} from "@/shared/lib/admin-api";

const ROLES: { value: MemberRole; label: string }[] = [
  { value: "presidente", label: "Presidente" },
  { value: "diretor", label: "Diretor(a)" },
  { value: "analista", label: "Analista" },
  { value: "trainee", label: "Trainee" },
  { value: "candidato", label: "Candidato" },
];

const PER_PAGE = 12;

export function MembersView() {
  const [members, setMembers] = useState<AdminMemberRow[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  async function reload() {
    const res = await getAdminMembers();
    if (!res.success) setError(res.error || "Erro ao carregar membros.");
    else {
      setMembers(res.data ?? []);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    void getAdminDepartments().then((r) => {
      if (r.success) setDepartments(r.data ?? []);
    });
    void reload();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (deptFilter !== "all" && m.departmentId !== deptFilter) return false;
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      );
    });
  }, [members, search, deptFilter, roleFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [search, deptFilter, roleFilter]);

  async function onChangeRole(m: AdminMemberRow, role: MemberRole) {
    setBusyId(m.id);
    const res = await updateMemberRole(m.id, role);
    if (res.success)
      setMembers((p) => p.map((x) => (x.id === m.id ? { ...x, role } : x)));
    else alert(res.error || "Erro ao alterar papel.");
    setBusyId(null);
  }

  async function onChangeDept(m: AdminMemberRow, departmentId: string) {
    setBusyId(m.id);
    const dep = departmentId || null;
    const res = await updateMemberProfile(m.id, { departmentId: dep });
    if (res.success) {
      const name = departments.find((d) => d.id === dep)?.name ?? null;
      setMembers((p) =>
        p.map((x) =>
          x.id === m.id ? { ...x, departmentId: dep, departmentName: name } : x,
        ),
      );
    } else alert(res.error || "Erro ao alterar área.");
    setBusyId(null);
  }

  async function onToggleActive(m: AdminMemberRow) {
    setBusyId(m.id);
    const res = m.isActive
      ? await deactivateMember(m.id)
      : await activateMember(m.id);
    if (res.success)
      setMembers((p) =>
        p.map((x) => (x.id === m.id ? { ...x, isActive: !x.isActive } : x)),
      );
    else alert(res.error || "Erro ao atualizar status.");
    setBusyId(null);
  }

  async function onDelete(m: AdminMemberRow) {
    if (!confirm(`Remover ${m.name} permanentemente? Não pode ser desfeito.`))
      return;
    setBusyId(m.id);
    const res = await deleteMember(m.id);
    if (res.success) setMembers((p) => p.filter((x) => x.id !== m.id));
    else alert(res.error || "Erro ao remover.");
    setBusyId(null);
  }

  return (
    <AdminPage
      title="Membros"
      subtitle="Gerencie os membros da Liga: papéis, áreas e status."
      actions={
        <AdminButton onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? (
            <>
              <X className="h-4 w-4" /> Fechar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Adicionar membro
            </>
          )}
        </AdminButton>
      }
    >
      {showAdd && (
        <div className="admin-rise mb-5">
          <AddMemberForm
            departments={departments}
            onCreated={(created) => {
              setMembers((p) => [created, ...p]);
              setShowAdd(false);
            }}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou e-mail…"
          className="min-w-[220px] flex-1"
        />
        <AdminSelect value={deptFilter} onChange={setDeptFilter}>
          <option value="all">Todas as áreas</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect value={roleFilter} onChange={setRoleFilter}>
          <option value="all">Todos os papéis</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </AdminSelect>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : error ? (
        <p className="py-12 text-center text-sm text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-[11px] uppercase tracking-wider text-neutral-400">
                  <th className="px-4 py-3 font-medium">Membro</th>
                  <th className="px-4 py-3 font-medium">Papel</th>
                  <th className="px-4 py-3 font-medium">Área</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-neutral-400"
                    >
                      Nenhum membro encontrado.
                    </td>
                  </tr>
                ) : (
                  paged.map((m, i) => (
                    <tr
                      key={m.id}
                      className="admin-rise border-b border-neutral-100 transition-colors last:border-b-0 hover:bg-neutral-50"
                      style={{ animationDelay: `${Math.min(i, 12) * 20}ms` }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              m.isActive
                                ? "bg-neutral-900 text-white"
                                : "bg-neutral-200 text-neutral-500"
                            }`}
                          >
                            {initials(m.name)}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium text-neutral-900">
                              {m.name}
                            </div>
                            <div className="text-xs text-neutral-400">
                              {m.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={m.role}
                          disabled={busyId === m.id}
                          onChange={(e) =>
                            onChangeRole(m, e.target.value as MemberRole)
                          }
                          className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-xs outline-none hover:bg-neutral-50 focus:border-neutral-900"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={m.departmentId ?? ""}
                          disabled={busyId === m.id}
                          onChange={(e) => onChangeDept(m, e.target.value)}
                          className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-xs outline-none hover:bg-neutral-50 focus:border-neutral-900"
                        >
                          <option value="">— sem área —</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                            m.isActive
                              ? "bg-neutral-900/5 text-neutral-700"
                              : "bg-neutral-100 text-neutral-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              m.isActive ? "bg-green-500" : "bg-neutral-300"
                            }`}
                          />
                          {m.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onToggleActive(m)}
                            disabled={busyId === m.id}
                            title={m.isActive ? "Desativar" : "Ativar"}
                            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                          >
                            <Power className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDelete(m)}
                            disabled={busyId === m.id}
                            title="Remover"
                            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
        </>
      )}
    </AdminPage>
  );
}

function AddMemberForm({
  departments,
  onCreated,
}: {
  departments: AdminDepartment[];
  onCreated: (m: AdminMemberRow) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("trainee");
  const [departmentId, setDepartmentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    const res = await createMember({
      name,
      email,
      role,
      departmentId: departmentId || null,
    });
    setSaving(false);
    if (!res.success || !res.data) {
      setErr(res.error || "Erro ao criar membro.");
      return;
    }
    const dep = departments.find((d) => d.id === departmentId);
    onCreated({
      ...res.data,
      departmentName: dep?.name ?? null,
      departmentId: departmentId || null,
      isActive: true,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-neutral-200 bg-white p-5"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900">
        <UserPlus className="h-4 w-4" /> Novo membro
      </div>
      <div className="grid gap-3 md:grid-cols-[1.2fr_1.4fr_1fr_1fr_auto] md:items-end">
        <Field label="Nome completo *">
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="E-mail *">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Papel">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as MemberRole)}
            className="h-8 w-full rounded-md border border-neutral-200 bg-white px-2 text-sm outline-none focus:border-neutral-900"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Área">
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="h-8 w-full rounded-md border border-neutral-200 bg-white px-2 text-sm outline-none focus:border-neutral-900"
          >
            <option value="">— sem área —</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <AdminButton type="submit" disabled={saving} className="h-8">
          {saving ? "Salvando…" : "Adicionar"}
        </AdminButton>
      </div>
      {err && <p className="mt-3 text-xs text-red-500">{err}</p>}
    </form>
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
    <div className="space-y-1">
      <label className="text-xs font-medium text-neutral-500">{label}</label>
      {children}
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3.5 last:border-b-0"
        >
          <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 animate-pulse rounded bg-neutral-100" />
            <div className="h-2.5 w-56 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      ))}
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
