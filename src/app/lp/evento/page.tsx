"use client";

// URL antiga da LP do Endrigo — redireciona para o novo endereço em /eventos.
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NEW_URL = "/eventos/oratoria-para-negocios";

export default function LegacyEventoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(NEW_URL);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <a href={NEW_URL} className="text-sm text-white/60 underline underline-offset-4">
        Redirecionando… clique aqui se não for levado automaticamente.
      </a>
    </div>
  );
}
