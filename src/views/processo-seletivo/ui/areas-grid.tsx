"use client";

import { BRAND } from "@/shared/config/constants";
import type { Department } from "@/entities/department/model/types";

interface AreasGridProps {
  departments: Department[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  loading: boolean;
}

export function AreasGrid({
  departments,
  selected,
  onSelect,
  loading,
}: AreasGridProps) {
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
      <p
        className="mb-5 text-center text-sm font-semibold"
        style={{ color: BRAND.color.primary }}
      >
        Escolha sua área de interesse
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const isSelected = selected === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => onSelect(isSelected ? null : dept.id)}
              className={`flex items-center justify-between rounded-xl border p-5 text-left transition-all ${
                isSelected
                  ? "border-[#100843] bg-[#100843]/[0.02] shadow-sm"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: BRAND.color.primary }}
                >
                  {dept.name}
                </p>
                {dept.description && (
                  <p className="mt-1 text-xs text-gray-400 line-clamp-1">
                    {dept.description}
                  </p>
                )}
              </div>
              {isSelected && (
                <div
                  className="ml-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: BRAND.color.primary }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
