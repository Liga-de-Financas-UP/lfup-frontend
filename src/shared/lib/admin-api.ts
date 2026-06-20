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
