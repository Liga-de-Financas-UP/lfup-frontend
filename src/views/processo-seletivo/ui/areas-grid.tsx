"use client";

import type { Department } from "@/entities/department/model/types";

interface AreasGridProps {
  departments: Department[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  loading: boolean;
}

function StepHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream text-xs font-bold text-ink">
          1
        </span>
        <span className="text-xs uppercase tracking-[0.35em] text-cream/50">
          Escolha sua área
        </span>
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-cream md:text-3xl">
        Onde você quer atuar?
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-cream/55">
        Selecione a diretoria que mais combina com você. Você pode trocar a
        seleção a qualquer momento antes de enviar.
      </p>
    </div>
  );
}

export function AreasGrid({
  departments,
  selected,
  onSelect,
  loading,
}: AreasGridProps) {
  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-6 pt-14 md:pt-16">
        <StepHeader />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-cream/12 bg-ink-soft"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-14 md:pt-16">
      <StepHeader />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const isSelected = selected === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => onSelect(isSelected ? null : dept.id)}
              aria-pressed={isSelected}
              className={`group relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-cream bg-cream/[0.07] ring-1 ring-cream/40"
                  : "border-cream/12 bg-ink-soft hover:-translate-y-0.5 hover:border-cream/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-cream">{dept.name}</p>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? "bg-cream"
                      : "border border-cream/25 group-hover:border-cream/50"
                  }`}
                >
                  {isSelected && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0b1920"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
              </div>
              {dept.description && (
                <p className="mt-2 text-xs leading-relaxed text-cream/45 line-clamp-2">
                  {dept.description}
                </p>
              )}
              <span
                className={`mt-3 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  isSelected ? "text-cream/70" : "text-transparent"
                }`}
              >
                Selecionada
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
