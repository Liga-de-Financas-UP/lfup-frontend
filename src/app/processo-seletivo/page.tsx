"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/widgets/page-container";
import { PsHero } from "@/views/processo-seletivo/ui/ps-hero";
import { AreasGrid } from "@/views/processo-seletivo/ui/areas-grid";
import { ApplicationForm } from "@/views/processo-seletivo/ui/application-form";
import { getDepartments, getProcesses } from "@/shared/lib/api";
import { BRAND } from "@/shared/config/constants";
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

  return (
    <PageContainer>
      <PsHero process={activeProcess} />

      <AreasGrid
        departments={departments}
        selected={selectedDept}
        onSelect={setSelectedDept}
        loading={loading}
      />

      {/* Form */}
      <section className="border-t border-gray-100 bg-[#fafafa]">
        <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
          <h2
            className="mb-8 text-center text-xl font-bold tracking-tight md:text-2xl"
            style={{ color: BRAND.color.primary }}
          >
            Formulário de inscrição
          </h2>
          {activeProcess ? (
            <ApplicationForm
              processId={activeProcess.id}
              selectedDepartment={selectedDept}
            />
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
              <p className="text-sm text-gray-400">
                {loading
                  ? "Carregando..."
                  : "Nenhum processo seletivo ativo no momento."}
              </p>
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
