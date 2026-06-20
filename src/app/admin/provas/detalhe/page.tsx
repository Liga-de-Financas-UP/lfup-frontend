"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminAttemptDetailView } from "@/views/admin/ui/attempt-detail-view";

function Inner() {
  const params = useSearchParams();
  const id = params.get("id");
  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-400">ID da tentativa não informado.</p>
      </div>
    );
  }
  return <AdminAttemptDetailView attemptId={id} />;
}

export default function AdminAttemptDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-400">Carregando...</p>
        </div>
      }
    >
      <Inner />
    </Suspense>
  );
}
