"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/shared/config/constants";
import { submitApplication } from "@/shared/lib/api";
import type { ApplicationFormData } from "@/entities/department/model/types";

interface ApplicationFormProps {
  processId: string;
  selectedDepartment: string | null;
}

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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof ApplicationFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!form.fullName || !form.email) {
      setErrorMsg("Nome completo e email são obrigatórios.");
      setStatus("error");
      return;
    }

    if (!selectedDepartment) {
      setErrorMsg("Selecione uma área de interesse acima.");
      setStatus("error");
      return;
    }

    const res = await submitApplication(processId, {
      ...form,
      semester: form.semester ? parseInt(form.semester) : 1,
      departmentPreference: selectedDepartment,
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
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
        <div
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: BRAND.color.primary }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3
          className="text-xl font-bold"
          style={{ color: BRAND.color.primary }}
        >
          Inscrição enviada!
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Sua candidatura foi registrada com sucesso. Entraremos em contato em
          breve.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome completo *">
          <Input
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Seu nome completo"
            required
          />
        </Field>
        <Field label="Email *">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Telefone">
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(41) 99999-9999"
          />
        </Field>
        <Field label="Instagram">
          <Input
            value={form.instagram}
            onChange={(e) => update("instagram", e.target.value)}
            placeholder="@seu_usuario"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Curso">
          <Input
            value={form.course}
            onChange={(e) => update("course", e.target.value)}
            placeholder="Ex: Administração"
          />
        </Field>
        <Field label="Período">
          <Input
            type="number"
            min="1"
            max="12"
            value={form.semester}
            onChange={(e) => update("semester", e.target.value)}
            placeholder="Ex: 3"
          />
        </Field>
      </div>

      <Field label="LinkedIn">
        <Input
          value={form.linkedinUrl}
          onChange={(e) => update("linkedinUrl", e.target.value)}
          placeholder="https://linkedin.com/in/seu-perfil"
        />
      </Field>

      <Field label="Por que quer entrar na LFUP?">
        <Textarea
          value={form.motivation}
          onChange={(e) => update("motivation", e.target.value)}
          placeholder="Conte um pouco sobre você e sua motivação..."
          rows={4}
        />
      </Field>

      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      <Button
        type="submit"
        className="w-full rounded-full py-3 text-white"
        style={{ backgroundColor: BRAND.color.primary }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Enviar inscrição"}
      </Button>
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
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-500">{label}</Label>
      {children}
    </div>
  );
}
