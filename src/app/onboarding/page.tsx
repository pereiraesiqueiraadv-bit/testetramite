"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [nomeEscritorio, setNomeEscritorio] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (usuario) {
        window.location.href = "/dashboard";
        return;
      }

      setNomeUsuario(user.user_metadata?.full_name || user.user_metadata?.name || "");
      setLoading(false);
    }

    checkUser();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.rpc("criar_escritorio_e_seeds", {
      p_nome_escritorio: nomeEscritorio,
      p_nome_usuario: nomeUsuario,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-bold">
            Bem-vindo ao Trâmite
          </h1>
          <p className="text-muted">
            Vamos configurar seu escritório. Leva menos de 1 minuto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Nome do escritório
            </label>
            <input
              type="text"
              value={nomeEscritorio}
              onChange={(e) => setNomeEscritorio(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Ex.: Pereira & Siqueira Advocacia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Seu nome completo
            </label>
            <input
              type="text"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Ex.: Dr. João Pereira"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar meu escritório"}
          </button>

          <p className="text-center text-xs text-muted">
            Você terá 7 dias de teste grátis. Sem cartão de crédito.
          </p>
        </form>
      </div>
    </div>
  );
}
