"use client";

import { useEffect, useState } from "react";

export function useCountdown(endsAt: string | Date | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (!endsAt) {
    return { minutes: 0, seconds: 0, totalMs: 0, expired: true };
  }

  const end = typeof endsAt === "string" ? new Date(endsAt).getTime() : endsAt.getTime();
  const totalMs = Math.max(0, end - now);
  const minutes = Math.floor(totalMs / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);
  return { minutes, seconds, totalMs, expired: totalMs === 0 };
}
