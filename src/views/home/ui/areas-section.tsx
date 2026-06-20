"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BRAND } from "@/shared/config/constants";
import { getDepartments } from "@/shared/lib/api";

interface Dept {
  id: string;
  name: string;
  description: string | null;
  memberCount: string;
}

export function AreasSection() {
  const [departments, setDepartments] = useState<Dept[]>([]);

  useEffect(() => {
    getDepartments().then((res) => {
      if (res.data) setDepartments(res.data);
    });
  }, []);

  const tech = departments.find((d) => d.name === "Tecnologia");
  const others = departments.filter((d) => d.name !== "Tecnologia");

  return (
    <section id="areas" className="border-t border-gray-100 bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: BRAND.color.primary }}
          >
            Diretorias
          </p>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-3xl"
            style={{ color: BRAND.color.primary }}
          >
            Nossas áreas de atuação
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-gray-400">
            Conheça as diretorias da LFUP. Cada área é liderada por um diretor e
            conta com analistas e trainees dedicados a produzir conhecimento e
            desenvolver projetos reais.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((dept) => (
            <Link
              key={dept.id}
              href={`/areas?id=${dept.id}`}
              className="group rounded-xl border border-gray-100 bg-white p-7 transition-all hover:border-gray-200 hover:shadow-sm"
            >
              <h3
                className="text-base font-semibold"
                style={{ color: BRAND.color.primary }}
              >
                {dept.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-gray-400">
                {dept.description}
              </p>
              <span className="mt-4 inline-block text-xs font-medium text-gray-300 transition-colors group-hover:text-gray-500">
                Saiba mais &rarr;
              </span>
            </Link>
          ))}

          {/* Tecnologia — destaque */}
          {tech && (
            <Link
              href={`/areas?id=${tech.id}`}
              className="group rounded-xl p-7 text-white"
              style={{ backgroundColor: BRAND.color.primary }}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">Tecnologia</h3>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                  Nova
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-white/75">
                Aprenda com quem constrói o the news: arquitetura de sistemas,
                engenharia de dados, IA aplicada e desenvolvimento de produto em
                escala. Tecnologia real, direto do mercado.
              </p>
              <span className="mt-4 inline-block text-xs font-medium text-white/40 transition-colors group-hover:text-white/70">
                Saiba mais &rarr;
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
