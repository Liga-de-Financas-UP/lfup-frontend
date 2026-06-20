"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/shared/config/constants";
import { adminLogin, saveAdminSession } from "@/shared/lib/admin-api";

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
    router.replace("/admin/provas");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
      >
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: BRAND.color.primary }}
          >
            LFUP · Admin
          </p>
          <h1
            className="mt-2 text-xl font-bold tracking-tight"
            style={{ color: BRAND.color.primary }}
          >
            Entrar
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Use seu email e senha da LFUP.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@lfup.com.br"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {errorMsg && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </p>
        )}

        <Button
          type="submit"
          className="h-10 w-full rounded-full text-white"
          style={{ backgroundColor: BRAND.color.primary }}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
