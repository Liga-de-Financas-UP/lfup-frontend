"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readAdminSession } from "@/shared/lib/admin-api";

export default function AdminHome() {
  const router = useRouter();
  useEffect(() => {
    const session = readAdminSession();
    router.replace(session ? "/admin/membros" : "/admin/login");
  }, [router]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-neutral-400">Redirecionando…</p>
    </div>
  );
}
