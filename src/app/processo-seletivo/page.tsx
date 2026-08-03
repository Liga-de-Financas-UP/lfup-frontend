"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/widgets/page-container";
import { PsHero } from "@/views/processo-seletivo/ui/ps-hero";
import { AreasGrid } from "@/views/processo-seletivo/ui/areas-grid";
import { ApplicationForm } from "@/views/processo-seletivo/ui/application-form";
import { getDepartments, getProcesses } from "@/shared/lib/api";
import type {
  Department,
  Process,
} from "@/entities/department/model/types";

export default function ProcessoSeletivo() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeProcess, setActiveProcess] = useState<Process | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [deptRes, procRes] = await Promise.all([
        getDepartments(),
        getProcesses(),
      ]);
      if (deptRes.data) setDepartments(deptRes.data);
      if (procRes.data) {
        const active = procRes.data.find((p) => p.isActive);
        if (active) setActiveProcess(active);
      }
      setLoading(false);
    }
    load();
  }, []);

  const selectedName =
    departments.find((d) => d.id === selectedDept)?.name ?? null;

  return (
    <PageContainer>
      <PsHero process={activeProcess} />

      <AreasGrid
        departments={departments}
        selected={selectedDept}
        onSelect={setSelectedDept}
        loading={loading}
      />

      {/* Form — Passo 2 */}
      <section id="inscricao" className="mx-auto max-w-2xl px-6 pb-24 pt-16 md:pt-20">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream text-xs font-bold text-ink">
              2
            </span>
            <span className="text-xs uppercase tracking-[0.35em] text-cream/50">
              Preencha seus dados
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-cream md:text-3xl">
            Formulário de inscrição
          </h2>
          {selectedName ? (
            <p className="mt-2 text-sm text-cream/55">
              Área selecionada:{" "}
              <span className="font-medium text-cream">{selectedName}</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-cream/40">
              Selecione uma área acima para concluir a inscrição.
            </p>
          )}
        </div>

        {activeProcess ? (
          <ApplicationForm
            processId={activeProcess.id}
            selectedDepartment={selectedDept}
          />
        ) : (
          <div className="rounded-2xl border border-cream/12 bg-ink-soft p-12 text-center">
            <p className="text-sm text-cream/55">
              {loading
                ? "Carregando..."
                : "Nenhum processo seletivo ativo no momento."}
            </p>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
