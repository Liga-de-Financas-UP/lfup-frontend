"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitApplication } from "@/shared/lib/api";
import type { ApplicationFormData } from "@/entities/department/model/types";

// Borda/estilo únicos para TODOS os campos (input, textarea, select)
const FIELD_BORDER =
  "border-cream/20 bg-transparent text-cream placeholder:text-cream/35 focus-visible:border-cream/60 focus-visible:ring-0";
const INPUT_CLASS = cn("h-11 rounded-lg px-3.5 text-sm", FIELD_BORDER);
const ERROR_BORDER = "border-red-400/70 focus-visible:border-red-400";

interface ApplicationFormProps {
  processId: string;
  selectedDepartment: string | null;
}

// ─── Cursos elegíveis ───────────────────────────────────────────────────────
const BUSINESS_COURSES = [
  "Administração",
  "Ciências Contábeis",
  "Ciências Econômicas",
  "Comércio Exterior",
  "Marketing",
  "Relações Internacionais",
  "Outro"
];

const TECH_COURSES = [
  "Ciência da Computação",
  "Engenharia de Software",
  "Sistemas de Informação",
  "Análise e Desenvolvimento de Sistemas",
  "Ciência de Dados",
  "Segurança da Informação",
  "Redes de Computadores",
  "Outro"
];

const SEMESTERS = ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º", "10º"];

const ALLOWED_DOMAINS = ["up.edu.br", "cs.up.edu.br"];

// ─── Validações ─────────────────────────────────────────────────────────────
function validateName(v: string): string | null {
  const parts = v.trim().split(/\s+/).filter((p) => p.length >= 2);
  if (parts.length < 2)
    return "Informe nome e sobrenome.";
  return null;
}

function validateEmail(v: string): string | null {
  const email = v.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "E-mail inválido.";
  const domain = email.split("@")[1];
  if (!ALLOWED_DOMAINS.includes(domain))
    return "Use seu e-mail institucional @up.edu.br ou @cs.up.edu.br.";
  return null;
}

function phoneDigits(v: string) {
  return v.replace(/\D/g, "").slice(0, 11);
}

function formatPhone(v: string): string {
  const d = phoneDigits(v);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validatePhone(v: string): string | null {
  const d = phoneDigits(v);
  if (d.length === 0) return "Informe um telefone.";
  if (d.length < 10 || d.length > 11)
    return "Telefone inválido. Use DDD + número.";
  return null;
}

type Errors = Partial<Record<keyof ApplicationFormData | "department", string>>;

export function ApplicationForm({
  processId,
  selectedDepartment,
}: ApplicationFormProps) {
  const [form, setForm] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    semester: "",
    instagram: "",
    linkedinUrl: "",
    motivation: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof ApplicationFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateAll(): Errors {
    const e: Errors = {};
    const nameErr = validateName(form.fullName);
    if (nameErr) e.fullName = nameErr;
    const emailErr = validateEmail(form.email);
    if (emailErr) e.email = emailErr;
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) e.phone = phoneErr;
    if (!form.course) e.course = "Selecione seu curso.";
    if (!form.semester) e.semester = "Selecione seu período.";
    if (!selectedDepartment) e.department = "Selecione uma área de interesse acima.";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setErrorMsg("");
    const e = validateAll();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setStatus("error");
      if (e.department) setErrorMsg(e.department);
      return;
    }

    setStatus("loading");
    const res = await submitApplication(processId, {
      ...form,
      email: form.email.trim().toLowerCase(),
      phone: formatPhone(form.phone),
      semester: parseInt(form.semester) || 1,
      departmentPreference: selectedDepartment as string,
    });

    if (res.success) {
      setStatus("success");
    } else {
      setErrorMsg(res.error || "Erro ao enviar candidatura.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cream/12 bg-ink-soft p-12 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sage">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0b1920"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-cream">Inscrição enviada!</h3>
        <p className="mt-2 text-sm text-cream/55">
          Sua candidatura foi registrada com sucesso. Entraremos em contato em
          breve.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-cream/12 bg-ink-soft p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome completo *" error={errors.fullName}>
          <Input
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            onBlur={() =>
              setErrors((p) => ({ ...p, fullName: validateName(form.fullName) ?? undefined }))
            }
            placeholder="Nome e sobrenome"
            aria-invalid={!!errors.fullName}
            className={cn(INPUT_CLASS, errors.fullName && ERROR_BORDER)}
          />
        </Field>
        <Field
          label="E-mail institucional *"
          error={errors.email}
          hint="@up.edu.br ou @cs.up.edu.br"
        >
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() =>
              setErrors((p) => ({ ...p, email: validateEmail(form.email) ?? undefined }))
            }
            placeholder="voce@up.edu.br"
            aria-invalid={!!errors.email}
            className={cn(INPUT_CLASS, errors.email && ERROR_BORDER)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Telefone *" error={errors.phone}>
          <Input
            value={form.phone}
            onChange={(e) => update("phone", formatPhone(e.target.value))}
            onBlur={() =>
              setErrors((p) => ({ ...p, phone: validatePhone(form.phone) ?? undefined }))
            }
            placeholder="(41) 99999-9999"
            inputMode="tel"
            aria-invalid={!!errors.phone}
            className={cn(INPUT_CLASS, errors.phone && ERROR_BORDER)}
          />
        </Field>
        <Field label="Instagram">
          <Input
            value={form.instagram}
            onChange={(e) => update("instagram", e.target.value)}
            placeholder="@seu_usuario"
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Curso *" error={errors.course}>
          <SelectField
            value={form.course}
            onChange={(v) => update("course", v)}
            invalid={!!errors.course}
          >
            <option value="" disabled>
              Selecione seu curso
            </option>
            <optgroup label="Business School">
              {BUSINESS_COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </optgroup>
            <optgroup label="Tecnologia (TI)">
              {TECH_COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </optgroup>
          </SelectField>
        </Field>
        <Field label="Período *" error={errors.semester}>
          <SelectField
            value={form.semester}
            onChange={(v) => update("semester", v)}
            invalid={!!errors.semester}
          >
            <option value="" disabled>
              Selecione o período
            </option>
            {SEMESTERS.map((s, i) => (
              <option key={s} value={String(i + 1)}>
                {s} semestre
              </option>
            ))}
          </SelectField>
        </Field>
      </div>

      <Field label="LinkedIn">
        <Input
          value={form.linkedinUrl}
          onChange={(e) => update("linkedinUrl", e.target.value)}
          placeholder="https://linkedin.com/in/seu-perfil"
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="Por que quer entrar na LFUP?">
        <Textarea
          value={form.motivation}
          onChange={(e) => update("motivation", e.target.value)}
          placeholder="Conte um pouco sobre você e sua motivação..."
          rows={4}
          className={cn("rounded-lg px-3.5 py-2.5 text-sm", FIELD_BORDER)}
        />
      </Field>

      {errorMsg && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        className="w-full rounded-none bg-cream py-6 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-cream/80"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Enviar inscrição"}
      </Button>
    </form>
  );
}

function SelectField({
  value,
  onChange,
  invalid,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`ps-select h-11 w-full appearance-none rounded-lg border bg-transparent px-3.5 pr-9 text-sm outline-none transition-colors focus:border-cream/60 ${invalid ? "border-red-400/70" : "border-cream/20"
          } ${value ? "text-cream" : "text-cream/40"}`}
        style={{ colorScheme: "dark" }}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wider text-cream/50">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-red-300">{error}</p>
      ) : hint ? (
        <p className="text-xs text-cream/30">{hint}</p>
      ) : null}
    </div>
  );
}
