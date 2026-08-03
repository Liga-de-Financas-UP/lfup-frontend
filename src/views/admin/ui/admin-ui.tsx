"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Página de admin: margens generosas + heading sobre hairline. */
export function AdminPage({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Campo de busca com foco animado. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 transition-all focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10",
        className,
      )}
    >
      <Search className="h-4 w-4 text-neutral-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
      />
    </div>
  );
}

/** Select neutro consistente. */
export function AdminSelect({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors hover:bg-neutral-50 focus:border-neutral-900",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <div
        className="text-2xl font-bold tabular-nums text-neutral-900"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wider text-neutral-400">
        {label}
      </div>
    </div>
  );
}

/** Paginação: intervalo + prev/next. */
export function Pagination({
  page,
  pageCount,
  total,
  perPage,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  perPage: number;
  onPage: (p: number) => void;
}) {
  if (total === 0) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
      <span className="admin-fade" key={`${from}-${to}`}>
        {from}–{to} de {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[5rem] text-center text-xs text-neutral-400">
          {page} / {pageCount}
        </span>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Botão primário/secundário neutro (preto & branco). */
export function AdminButton({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
}) {
  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800",
    outline:
      "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
    ghost: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
  };
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
