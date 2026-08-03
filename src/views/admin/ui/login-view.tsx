"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin, saveAdminSession } from "@/shared/lib/admin-api";

const FONT_STACK =
  '"Helvetica Neue", Helvetica, Arial, ui-sans-serif, system-ui, sans-serif';

export function AdminLoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const res = await adminLogin(email.trim().toLowerCase(), password);
    if (!res.success || !res.data) {
      setErrorMsg(res.error || "Email ou senha inválidos.");
      setLoading(false);
      return;
    }
    saveAdminSession(res.data.token, res.data.user);
    router.replace("/admin/membros");
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 text-neutral-900"
      style={{ fontFamily: FONT_STACK }}
    >
      <form
        onSubmit={handleSubmit}
        className="admin-rise w-full max-w-sm space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="font-display text-3xl leading-none text-neutral-900"
              style={{ letterSpacing: "-0.02em" }}
            >
              lfup.
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Admin
            </span>
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-neutral-900">
            Entrar
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Use seu e-mail e senha da LFUP.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-neutral-500">E-mail</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@lfup.com.br"
            autoComplete="email"
            className="h-10"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-neutral-500">Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="h-10"
            required
          />
        </div>

        {errorMsg && (
          <p className="admin-fade rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-lg bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
