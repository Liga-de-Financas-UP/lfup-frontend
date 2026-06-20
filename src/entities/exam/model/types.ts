export interface ExamArea {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface ExamConfig {
  id: string;
  name: string;
  durationMinutes: number;
  availableFrom: string;
  availableUntil: string;
  questionsPerArea: number;
  maxAreas: number;
  maxViolations: number;
  isOpenNow: boolean;
  areas: ExamArea[];
}

export interface ExamCandidateInfo {
  id: string;
  email: string;
  rgm: string;
  fullName: string | null;
}

export type ExamAttemptStatus =
  | "in_progress"
  | "submitted"
  | "terminated"
  | "expired";

export interface ExamAttempt {
  id: string;
  status: ExamAttemptStatus;
  startedAt: string;
  endsAt: string;
  submittedAt: string | null;
  terminatedAt: string | null;
  terminatedReason: string | null;
  violationCount: number;
}

export interface ExamQuestionView {
  index: number;
  id: string;
  prompt: string;
  areaId: string;
  areaName: string | null;
  answer: string;
}

export interface ExamRuntimeConfig {
  id: string;
  name: string;
  durationMinutes: number;
  maxViolations: number;
}

export interface ExamAttemptView {
  candidate: ExamCandidateInfo;
  attempt: ExamAttempt;
  config: ExamRuntimeConfig;
  areas: { id: string; name: string; slug: string }[];
  questions: ExamQuestionView[];
  token?: string;
}

export interface ExamStatusCheck {
  hasAttempt: boolean;
  attempt: ExamAttempt | null;
}

export interface ExamEventResult {
  accepted: boolean;
  status: ExamAttemptStatus;
  violationCount: number;
  terminated: boolean;
}

export type ExamEventType =
  | "heartbeat"
  | "focus_lost"
  | "focus_return"
  | "paste"
  | "copy"
  | "contextmenu"
  | "tab_hidden"
  | "tab_visible"
  | "question_nav"
  | "autosave"
  | "devtools_keybind"
  | "devtools_detected"
  | "fullscreen_enter"
  | "fullscreen_exit"
  | "resize";
