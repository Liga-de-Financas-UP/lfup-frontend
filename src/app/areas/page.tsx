"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { PageContainer } from "@/widgets/page-container";
import { MemberCard } from "@/views/areas/ui/member-card";
import { getDepartmentById } from "@/shared/lib/api";
import type { DepartmentDetail, DepartmentMember } from "@/shared/lib/api";

const ROLE_ORDER = ["diretor", "analista", "trainee"];
const ROLE_SECTION_LABELS: Record<string, string> = {
  diretor: "Diretoria",
  analista: "Analistas",
  trainee: "Trainees",
  membro: "Membros",
};

function groupByRole(members: DepartmentMember[]) {
  const groups: Record<string, DepartmentMember[]> = {};
  for (const m of members) {
    const key = ROLE_ORDER.includes(m.role) ? m.role : "membro";
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  }
  return groups;
}

function AreaContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [dept, setDept] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getDepartmentById(id).then((res) => {
      if (res.data) setDept(res.data);
      setLoading(false);
    });
  }, [id]);

  if (!id) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-cream">Áreas da LFUP</h1>
        <Link
          href="/#areas"
          className="mt-4 inline-block text-sm text-cream/50 underline underline-offset-4"
        >
          Ver todas as áreas
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-cream/20 border-t-cream" />
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-cream">Área não encontrada</h1>
        <Link
          href="/#areas"
          className="mt-4 inline-block text-sm text-cream/50 underline underline-offset-4"
        >
          Voltar para as áreas
        </Link>
      </div>
    );
  }

  const groups = groupByRole(dept.members);

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-16 md:pt-24">
        <Link
          href="/#areas"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-cream/50 transition-colors hover:text-cream"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cream/50">
            Diretoria
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-cream md:text-5xl">
            {dept.name}
          </h1>
          {dept.description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/60">
              {dept.description}
            </p>
          )}
          <div className="mt-6">
            <span className="rounded-full border border-cream/15 px-3 py-1 text-xs font-medium text-cream/60">
              {dept.members.length} membro{dept.members.length !== 1 && "s"}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-cream/15">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          {ROLE_ORDER.map((role) => {
            const members = groups[role];
            if (!members || members.length === 0) return null;
            return (
              <div key={role} className="mb-12 last:mb-0">
                <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">
                  {ROLE_SECTION_LABELS[role]}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              </div>
            );
          })}
          {groups["membro"] && groups["membro"].length > 0 && (
            <div>
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">
                Membros
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups["membro"].map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>
          )}
          {dept.members.length === 0 && (
            <p className="text-center text-sm text-cream/50">
              Nenhum membro cadastrado nesta área ainda.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default function AreaPage() {
  return (
    <PageContainer>
      <Suspense fallback={
        <div className="mx-auto max-w-5xl px-6 py-32 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-cream/20 border-t-cream" />
        </div>
      }>
        <AreaContent />
      </Suspense>
    </PageContainer>
  );
}
