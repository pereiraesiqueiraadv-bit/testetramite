"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Area {
  id: string;
  nome: string;
}

interface Tese {
  id: string;
  nome: string;
  area_id: string;
}

export default function NovoClientePage() {
  const router = useRouter();
  const supabase = createClient();

  const [areas, setAreas] = useState<Area[]>([]);
  const [teses, setTeses] = useState<Tese[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [areaId, setAreaId] = useState("");
  const [teseId, setTeseId] = useState("");
  const [parteContraria, setParteContraria] = useState("");
  const [status, setStatus] = useState("prospeccao");
  const [pctExito, setPctExito] = useState("30");
  const [pctSucumbencia, setPctSucumbencia] = useState("0");

  // Filtered teses based on selected area
  const tesesFiltradas = areaId
    ? teses.filter((t) => t.area_id === areaId)
    : [];

  useEffect(() => {
    async function carregarDados() {
      const [{ data: areasData }, { data: tesesData }] = await Promise.all([
        supabase.from("areas").select("id, nome").order("nome"),
        supabase.from("teses").select("id, nome, area_id").order("nome"),
      ]);
      setAreas(areasData ?? []);
      setTeses(tesesData ?? []);
    }
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset tese when area changes
  useEffect(() => {
    setTeseId("");
  }, [areaId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("O nome do cliente e obrigatorio.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase.from("clientes").insert({
      nome: nome.trim(),
      cpf_cnpj: cpfCnpj.trim() || null,
      telefone: telefone.trim() || null,
      email: email.trim() || null,
      area_id: areaId || null,
      tese_id: teseId || null,
      parte_contraria: parteContraria.trim() || null,
      status,
      pct_exito: Number(pctExito),
      pct_sucumbencia: Number(pctSucumbencia),
    });

    if (error) {
      setErro("Erro ao salvar cliente. Tente novamente.");
      setSalvando(false);
      return;
    }

    router.push("/clientes");
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/clientes"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Voltar
        </Link>
        <h1 className="font-heading text-2xl font-bold mt-2">Novo cliente</h1>
        <p className="text-muted text-sm mt-1">
          Preencha os dados para cadastrar um novo cliente.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-1.5">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo do cliente"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>

          {/* CPF/CNPJ + Telefone */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="cpf_cnpj"
                className="block text-sm font-medium mb-1.5"
              >
                CPF/CNPJ
              </label>
              <input
                id="cpf_cnpj"
                type="text"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium mb-1.5"
              >
                Telefone
              </label>
              <input
                id="telefone"
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>

          {/* Area + Tese */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="area_id"
                className="block text-sm font-medium mb-1.5"
              >
                Area
              </label>
              <select
                id="area_id"
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              >
                <option value="">Selecione...</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="tese_id"
                className="block text-sm font-medium mb-1.5"
              >
                Tese
              </label>
              <select
                id="tese_id"
                value={teseId}
                onChange={(e) => setTeseId(e.target.value)}
                disabled={!areaId}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {areaId ? "Selecione..." : "Selecione uma area primeiro"}
                </option>
                {tesesFiltradas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Parte contraria */}
          <div>
            <label
              htmlFor="parte_contraria"
              className="block text-sm font-medium mb-1.5"
            >
              Parte contraria
            </label>
            <input
              id="parte_contraria"
              type="text"
              value={parteContraria}
              onChange={(e) => setParteContraria(e.target.value)}
              placeholder="Nome da parte contraria"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1.5"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="prospeccao">Prospeccao</option>
              <option value="ativo">Ativo</option>
              <option value="encerrado">Encerrado</option>
            </select>
          </div>

          {/* Percentuais */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pct_exito"
                className="block text-sm font-medium mb-1.5"
              >
                Honorarios pro-exito (%)
              </label>
              <input
                id="pct_exito"
                type="number"
                min={0}
                max={100}
                value={pctExito}
                onChange={(e) => setPctExito(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="pct_sucumbencia"
                className="block text-sm font-medium mb-1.5"
              >
                Sucumbencia (%)
              </label>
              <input
                id="pct_sucumbencia"
                type="number"
                min={0}
                max={100}
                value={pctSucumbencia}
                onChange={(e) => setPctSucumbencia(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Error message */}
        {erro && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={salvando}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvando ? "Salvando..." : "Salvar cliente"}
          </button>
          <Link
            href="/clientes"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
