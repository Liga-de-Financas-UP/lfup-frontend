"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ClipboardList,
  ExternalLink,
  Inbox,
  LogOut,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAdminSession, readAdminSession } from "@/shared/lib/admin-api";

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Membros", href: "/admin/membros", icon: Users },
  { label: "Processo Seletivo", href: "/admin/processo", icon: Inbox },
  { label: "Eventos", href: "/admin/eventos", icon: CalendarCheck },
  { label: "Provas", href: "/admin/provas", icon: ClipboardList },
];

const FONT_STACK =
  '"Helvetica Neue", Helvetica, Arial, ui-sans-serif, system-ui, sans-serif';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const isLogin = pathname.startsWith("/admin/login");

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    const session = readAdminSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setUser({
      name: session.user?.name ?? "",
      email: session.user?.email ?? "",
    });
    setReady(true);
  }, [isLogin, router]);

  // Login renders bare (no chrome).
  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-400"
        style={{ fontFamily: FONT_STACK }}
      >
        Carregando…
      </div>
    );
  }

  const current = NAV.find((n) => pathname.startsWith(n.href));
  const initials = (user?.name || user?.email || "?")
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  function logout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-neutral-50 text-neutral-900"
      style={{ fontFamily: FONT_STACK }}
    >
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-neutral-100 px-5">
          <span
            className="font-display text-2xl leading-none text-neutral-900"
            style={{ letterSpacing: "-0.02em" }}
          >
            lfup.
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                  active
                    ? "bg-neutral-900 font-medium text-white"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-100 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-900">
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-xs text-neutral-400">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sair"
              className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-400">Admin</span>
            <span className="text-neutral-300">/</span>
            <span className="font-medium text-neutral-900">
              {current?.label ?? ""}
            </span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ExternalLink className="h-4 w-4" /> Ver site
          </a>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
