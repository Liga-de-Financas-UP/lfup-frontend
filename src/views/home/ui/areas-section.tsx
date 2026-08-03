"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDepartments } from "@/shared/lib/api";
import { SectionHeader } from "./section-header";

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
    <section id="areas" className="border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <SectionHeader
          index="02"
          eyebrow="Diretorias"
          title="Nossas áreas de atuação"
          description="Cada diretoria é liderada por um diretor e conta com analistas e trainees dedicados a produzir conhecimento e desenvolver projetos reais."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((dept) => (
            <Link
              key={dept.id}
              href={`/areas?id=${dept.id}`}
              className="group rounded-2xl border border-cream/12 bg-ink-soft p-7 transition-colors hover:border-cream/30"
            >
              <h3 className="text-base font-semibold text-cream">{dept.name}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-cream/55">
                {dept.description}
              </p>
              <span className="mt-4 inline-block text-xs uppercase tracking-widest text-cream/35 transition-colors group-hover:text-cream/70">
                Saiba mais &rarr;
              </span>
            </Link>
          ))}

          {/* Tecnologia — destaque */}
          {tech && (
            <Link
              href={`/areas?id=${tech.id}`}
              className="brand-mesh group rounded-2xl border border-cream/20 p-7"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-cream">Tecnologia</h3>
                <span className="rounded-full bg-cream/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cream">
                  Nova
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-cream/75">
                Aprenda com quem constrói o the news: arquitetura de sistemas,
                engenharia de dados, IA aplicada e desenvolvimento de produto em
                escala. Tecnologia real, direto do mercado.
              </p>
              <span className="mt-4 inline-block text-xs uppercase tracking-widest text-cream/50 transition-colors group-hover:text-cream/80">
                Saiba mais &rarr;
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
