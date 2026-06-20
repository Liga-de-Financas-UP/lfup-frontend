import type {
  ExamAttemptView,
  ExamConfig,
  ExamEventResult,
  ExamEventType,
  ExamStatusCheck,
} from "@/entities/exam/model/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

const TOKEN_KEY = "lfup.exam.token";
const ATTEMPT_KEY = "lfup.exam.attemptId";
const CANDIDATE_KEY = "lfup.exam.candidate";

export function saveExamSession(
  token: string,
  attemptId: string,
  candidate: { email: string; rgm: string; fullName: string | null },
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ATTEMPT_KEY, attemptId);
    localStorage.setItem(CANDIDATE_KEY, JSON.stringify(candidate));
  } catch {}
}

export function readExamSession() {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const attemptId = localStorage.getItem(ATTEMPT_KEY);
    const candRaw = localStorage.getItem(CANDIDATE_KEY);
    if (!token || !attemptId) return null;
    const candidate = candRaw ? JSON.parse(candRaw) : null;
    return { token, attemptId, candidate };
  } catch {
    return null;
  }
}

export function clearExamSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ATTEMPT_KEY);
    localStorage.removeItem(CANDIDATE_KEY);
  } catch {}
}

// ─── Fetch helpers ────────────────────────────────────────────────────────

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function publicFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (e) {
    return {
      success: false,
      error:
        "Não consegui me conectar ao servidor. Confira sua conexão e tente novamente.",
    };
  }
  try {
    return (await res.json()) as ApiEnvelope<T>;
  } catch {
    return { success: false, error: `HTTP ${res.status}` };
  }
}

async function authedFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  const session = readExamSession();
  if (!session) return { success: false, error: "Sessão expirada" };
  return publicFetch<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.token}`,
      ...(init?.headers ?? {}),
    },
  });
}

// ─── Public endpoints ─────────────────────────────────────────────────────

export function getExamConfig() {
  return publicFetch<ExamConfig | null>("/exam/config");
}

export function getExamStatus(email: string, rgm: string) {
  const qs = new URLSearchParams({ email, rgm }).toString();
  return publicFetch<ExamStatusCheck>(`/exam/status?${qs}`);
}

export function startExamAttempt(payload: {
  email: string;
  rgm: string;
  fullName: string;
  phone?: string;
  areaIds: string[];
}) {
  return publicFetch<ExamAttemptView>("/exam/attempts/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Authed endpoints ─────────────────────────────────────────────────────

export function getExamAttempt(attemptId: string) {
  return authedFetch<ExamAttemptView>(`/exam/attempts/${attemptId}`);
}

export function saveExamAnswer(
  attemptId: string,
  questionId: string,
  answerText: string,
) {
  return authedFetch<{
    questionId: string;
    charCount: number;
    updatedAt: string;
  }>(`/exam/attempts/${attemptId}/answer`, {
    method: "POST",
    body: JSON.stringify({ questionId, answerText }),
  });
}

export function submitExam(attemptId: string) {
  return authedFetch<{
    id: string;
    status: string;
    submittedAt: string;
  }>(`/exam/attempts/${attemptId}/submit`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function logExamEvent(
  attemptId: string,
  eventType: ExamEventType,
  questionIndex?: number,
  details?: Record<string, unknown>,
) {
  return authedFetch<ExamEventResult>(`/exam/attempts/${attemptId}/event`, {
    method: "POST",
    body: JSON.stringify({ eventType, questionIndex, details }),
    keepalive: true,
  });
}
