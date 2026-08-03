import type {
  AdminAttemptDetail,
  AdminAttemptRow,
  AdminUser,
  GradeStatus,
  LoginResponse,
} from "@/entities/admin/model/types";
import type { ExamConfig } from "@/entities/exam/model/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

const TOKEN_KEY = "lfup.admin.token";
const USER_KEY = "lfup.admin.user";

export function saveAdminSession(token: string, user: AdminUser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export function readAdminSession() {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (!token) return null;
    return {
      token,
      user: userRaw ? (JSON.parse(userRaw) as AdminUser) : null,
    };
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function authedFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  const session = readAdminSession();
  if (!session) return { success: false, error: "Não autenticado" };
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    return {
      success: false,
      error: "Sem conexão com o servidor.",
    };
  }
  if (res.status === 401 || res.status === 403) {
    return {
      success: false,
      error: res.status === 401 ? "Sessão expirada" : "Sem permissão",
    };
  }
  try {
    return (await res.json()) as ApiEnvelope<T>;
  } catch {
    return { success: false, error: `HTTP ${res.status}` };
  }
}

export async function adminLogin(email: string, password: string) {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return { success: false, error: "Sem conexão com o servidor." };
  }
  try {
    return (await res.json()) as ApiEnvelope<LoginResponse>;
  } catch {
    return { success: false, error: `HTTP ${res.status}` };
  }
}

export async function adminMe() {
  return authedFetch<AdminUser>(`/auth/me`);
}

export async function getAdminExamConfig() {
  // The public config endpoint is fine — anyone can hit it.
  let res: Response;
  try {
    res = await fetch(`${API_URL}/exam/config`);
  } catch {
    return { success: false, error: "Sem conexão com o servidor." };
  }
  try {
    return (await res.json()) as ApiEnvelope<ExamConfig | null>;
  } catch {
    return { success: false, error: `HTTP ${res.status}` };
  }
}

export async function getAdminAttempts(configId: string) {
  const qs = new URLSearchParams({ configId }).toString();
  return authedFetch<AdminAttemptRow[]>(`/exam/admin/attempts?${qs}`);
}

export async function getAdminAttemptDetail(attemptId: string) {
  return authedFetch<AdminAttemptDetail>(
    `/exam/admin/attempts/${attemptId}`,
  );
}

export async function gradeAttempt(
  attemptId: string,
  payload: {
    gradeStatus: GradeStatus;
    score?: number | null;
    gradeNotes?: string | null;
  },
) {
  return authedFetch(`/exam/admin/attempts/${attemptId}/grade`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ─── Membros ──────────────────────────────────────────────────────────────

export type MemberRole =
  | "presidente"
  | "diretor"
  | "analista"
  | "trainee"
  | "candidato"
  | "admin";

export interface AdminMemberRow {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: MemberRole;
  isActive: boolean;
  phone: string | null;
  course: string | null;
  semester: number | null;
  departmentId: string | null;
  departmentName: string | null;
}

export interface AdminDepartment {
  id: string;
  name: string;
}

export interface CreateMemberInput {
  name: string;
  email: string;
  role: MemberRole;
  departmentId?: string | null;
  course?: string;
  phone?: string;
}

export async function getAdminDepartments() {
  // /departments/public é aberto e serve como lista de áreas para os selects.
  let res: Response;
  try {
    res = await fetch(`${API_URL}/departments/public`);
  } catch {
    return { success: false as const, error: "Sem conexão com o servidor." };
  }
  try {
    return (await res.json()) as ApiEnvelope<AdminDepartment[]>;
  } catch {
    return { success: false as const, error: `HTTP ${res.status}` };
  }
}

export async function getAdminMembers(params?: {
  search?: string;
  departmentId?: string;
  role?: string;
}) {
  const qs = new URLSearchParams({ limit: "200" });
  if (params?.search) qs.set("search", params.search);
  if (params?.departmentId) qs.set("departmentId", params.departmentId);
  if (params?.role) qs.set("role", params.role);
  return authedFetch<AdminMemberRow[]>(`/members?${qs.toString()}`);
}

export async function createMember(input: CreateMemberInput) {
  return authedFetch<AdminMemberRow>(`/members`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateMemberRole(id: string, role: MemberRole) {
  return authedFetch(`/members/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function updateMemberProfile(
  id: string,
  data: { departmentId?: string | null; course?: string; phone?: string },
) {
  return authedFetch(`/members/${id}/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deactivateMember(id: string) {
  return authedFetch(`/members/${id}/deactivate`, { method: "PATCH" });
}

export async function activateMember(id: string) {
  return authedFetch(`/members/${id}/activate`, { method: "PATCH" });
}

export async function deleteMember(id: string) {
  return authedFetch(`/members/${id}`, { method: "DELETE" });
}

// ─── Eventos & Presença ─────────────────────────────────────────────────────

export type EventType =
  | "assembleia"
  | "palestra"
  | "workshop"
  | "reuniao"
  | "outro";

export type AttendanceStatus = "present" | "absent" | "justified";

export interface AdminEventRow {
  id: string;
  title: string;
  type: EventType;
  description: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  presentCount: number;
  attendanceCount: number;
}

export interface RosterRow {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: MemberRole;
  departmentId: string | null;
  departmentName: string | null;
  status: AttendanceStatus | null;
  notedAt: string | null;
}

export interface CreateEventInput {
  title: string;
  type: EventType;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  description?: string | null;
}

export async function getEvents() {
  return authedFetch<AdminEventRow[]>(`/events`);
}

export async function createEvent(input: CreateEventInput) {
  return authedFetch<AdminEventRow>(`/events`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateEvent(id: string, input: Partial<CreateEventInput>) {
  return authedFetch<AdminEventRow>(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteEvent(id: string) {
  return authedFetch(`/events/${id}`, { method: "DELETE" });
}

export async function getEventRoster(id: string) {
  return authedFetch<{ event: AdminEventRow; roster: RosterRow[] }>(
    `/events/${id}/roster`,
  );
}

export async function setAttendance(
  eventId: string,
  userId: string,
  status: AttendanceStatus,
) {
  return authedFetch(`/events/${eventId}/attendance`, {
    method: "POST",
    body: JSON.stringify({ userId, status }),
  });
}

export async function clearAttendance(eventId: string, userId: string) {
  return authedFetch(`/events/${eventId}/attendance/${userId}`, {
    method: "DELETE",
  });
}

// ─── Processo Seletivo (inscrições) ─────────────────────────────────────────

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "rejected";

export interface AdminProcess {
  id: string;
  name: string;
  description: string | null;
  semester: string;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  applicationCount: string;
}

export interface AdminApplication {
  id: string;
  status: ApplicationStatus;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  course: string | null;
  semester: number | null;
  instagram: string | null;
  linkedinUrl: string | null;
  motivation: string | null;
  createdAt: string;
  updatedAt: string;
  departmentPreference: string | null;
}

export async function getAdminProcesses() {
  return authedFetch<AdminProcess[]>(`/processes`);
}

export async function getProcessApplications(processId: string) {
  return authedFetch<AdminApplication[]>(
    `/processes/${processId}/applications`,
  );
}

export async function updateApplicationStatus(
  processId: string,
  applicationId: string,
  status: ApplicationStatus,
) {
  return authedFetch(
    `/processes/${processId}/applications/${applicationId}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}
