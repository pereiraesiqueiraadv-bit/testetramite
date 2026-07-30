"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Cliente {
  id: string;
  nome: string;
}

interface Fase {
  id: string;
  nome: string;
  ordem: number;
}

export default function NovoProcessoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fases, setFases] = useState<Fase[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    numero_cnj: "",
    cliente_id: "",
    juizo: "",
    fase_id: "",
    distribuido_em: "",
    valor_causa: "",
    chance_exito: "",
  });

  useEffect(() => {
    async function fetchData() {
      const [clientesRes, fasesRes] = await Promise.all([
        supabase.from("clientes").select("id, nome").order("nome"),
        supabase.from("fases").select("id, nome, ordem").order("ordem"),
      ]);
      setClientes(clientesRes.data ?? []);
      setFases(fasesRes.data ?? []);
    }
    fetchData();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const payload: Record<string, unknown> = {
      numero_cnj: form.numero_cnj || null,
      cliente_id: form.cliente_id || null,
      juizo: form.juizo || null,
      fase_id: form.fase_id || null,
      distribuido_em: form.distribuido_em || null,
      valor_causa: form.valor_causa ? parseFloat(form.valor_causa) : null,
      chance_exito: form.chance_exito ? parseInt(form.chance_exito, 10) : null,
    };

    const { error } = await supabase.from("processos").insert(payload);

    if (error) {
      setErro("Erro ao cadastrar processo. Verifique os dados e tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/processos");
  }

  const inputClasses =
    "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";
  const labelClasses = "block text-sm font-medium mb-1.5";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/processos"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Voltar
        </Link>
        <h1 className="font-heading text-2xl font-bold mt-2">Novo processo</h1>
        <p className="text-muted text-sm mt-1">
          Preencha os dados do processo abaixo.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-8 space-y-6 max-w-2xl"
      >
        {erro && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* Numero CNJ */}
        <div>
          <label htmlFor="numero_cnj" className={labelClasses}>
            Número CNJ
          </label>
          <input
            id="numero_cnj"
            name="numero_cnj"
            type="text"
            placeholder="NNNNNNN-DD.AAAA.J.TR.OOOO"
            value={form.numero_cnj}
            onChange={handleChange}
            className={`${inputClasses} font-mono`}
          />
        </div>

        {/* Cliente */}
        <div>
          <label htmlFor="cliente_id" className={labelClasses}>
            Cliente
          </label>
          <select
            id="cliente_id"
            name="cliente_id"
            value={form.cliente_id}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Juizo */}
        <div>
          <label htmlFor="juizo" className={labelClasses}>
            Juízo
          </label>
          <input
            id="juizo"
            name="juizo"
            type="text"
            placeholder="Ex: 1ª Vara Cível de São Paulo"
            value={form.juizo}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Fase */}
        <div>
          <label htmlFor="fase_id" className={labelClasses}>
            Fase
          </label>
          <select
            id="fase_id"
            name="fase_id"
            value={form.fase_id}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Selecione uma fase</option>
            {fases.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Distribuido em + Valor da Causa (side by side) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="distribuido_em" className={labelClasses}>
              Distribuído em
            </label>
            <input
              id="distribuido_em"
              name="distribuido_em"
              type="date"
              value={form.distribuido_em}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="valor_causa" className={labelClasses}>
              Valor da Causa (R$)
            </label>
            <input
              id="valor_causa"
              name="valor_causa"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={form.valor_causa}
              onChange={handleChange}
              className={`${inputClasses} font-mono`}
            />
          </div>
        </div>

        {/* Chance de exito */}
        <div>
          <label htmlFor="chance_exito" className={labelClasses}>
            Chance de êxito (%)
          </label>
          <input
            id="chance_exito"
            name="chance_exito"
            type="number"
            min="0"
            max="100"
            placeholder="0 a 100"
            value={form.chance_exito}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Cadastrar processo"}
          </button>
          <Link
            href="/processos"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
