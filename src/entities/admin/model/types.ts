export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

export interface LoginResponse {
  user: AdminUser;
  token: string;
}

export type GradeStatus = "pending" | "reviewing" | "approved" | "rejected";
export type AttemptStatus =
  | "in_progress"
  | "submitted"
  | "terminated"
  | "expired";

export interface AdminAttemptRow {
  id: string;
  status: AttemptStatus;
  startedAt: string;
  endsAt: string;
  submittedAt: string | null;
  terminatedAt: string | null;
  terminatedReason: string | null;
  violationCount: number;
  areaIds: string[];
  candidateId: string;
  candidateEmail: string;
  candidateRgm: string;
  candidateName: string | null;
  candidatePhone: string | null;
  gradeStatus: GradeStatus;
  score: string | null;
  gradedAt: string | null;
}

export interface AdminAttemptEvent {
  id: string;
  eventType: string;
  questionIndex: number | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminAttemptDetail {
  candidate: {
    id: string;
    email: string;
    rgm: string;
    fullName: string | null;
  };
  attempt: {
    id: string;
    status: AttemptStatus;
    startedAt: string;
    endsAt: string;
    submittedAt: string | null;
    terminatedAt: string | null;
    terminatedReason: string | null;
    violationCount: number;
  };
  config: {
    id: string;
    name: string;
    durationMinutes: number;
    maxViolations: number;
  };
  areas: { id: string; name: string; slug: string }[];
  questions: {
    index: number;
    id: string;
    prompt: string;
    areaId: string;
    areaName: string | null;
    answer: string;
  }[];
  events: AdminAttemptEvent[];
  grade: {
    status: GradeStatus;
    score: string | null;
    notes: string | null;
    gradedBy: string | null;
    gradedAt: string | null;
  };
}
