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

  const inputClasses =
    "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";
  const labelClasses = "block text-sm font-medium mb-1.5";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar para clientes
        </Link>
        <h1 className="font-heading text-2xl font-bold tracking-tight mt-3">
          Novo cliente
        </h1>
        <p className="text-muted text-sm mt-1">
          Preencha os dados para cadastrar um novo cliente.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados pessoais */}
        <div className="rounded-xl border border-border bg-card shadow-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">
              Dados pessoais
            </h2>
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="nome" className={labelClasses}>
              Nome <span className="text-[#DC2626]">*</span>
            </label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo do cliente"
              className={inputClasses}
            />
          </div>

          {/* CPF/CNPJ + Telefone */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cpf_cnpj" className={labelClasses}>
                CPF/CNPJ
              </label>
              <input
                id="cpf_cnpj"
                type="text"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
                className={`${inputClasses} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="telefone" className={labelClasses}>
                Telefone
              </label>
              <input
                id="telefone"
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClasses}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Dados do caso */}
        <div className="rounded-xl border border-border bg-card shadow-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">
              Dados do caso
            </h2>
          </div>

          {/* Area + Tese */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="area_id" className={labelClasses}>
                Area
              </label>
              <select
                id="area_id"
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className={inputClasses}
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
              <label htmlFor="tese_id" className={labelClasses}>
                Tese
              </label>
              <select
                id="tese_id"
                value={teseId}
                onChange={(e) => setTeseId(e.target.value)}
                disabled={!areaId}
                className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
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
            <label htmlFor="parte_contraria" className={labelClasses}>
              Parte contraria
            </label>
            <input
              id="parte_contraria"
              type="text"
              value={parteContraria}
              onChange={(e) => setParteContraria(e.target.value)}
              placeholder="Nome da parte contraria"
              className={inputClasses}
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClasses}>
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClasses}
            >
              <option value="prospeccao">Prospeccao</option>
              <option value="ativo">Ativo</option>
              <option value="encerrado">Encerrado</option>
            </select>
          </div>
        </div>

        {/* Honorarios */}
        <div className="rounded-xl border border-border bg-card shadow-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">
              Honorarios
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="pct_exito" className={labelClasses}>
                Honorarios pro-exito (%)
              </label>
              <input
                id="pct_exito"
                type="number"
                min={0}
                max={100}
                value={pctExito}
                onChange={(e) => setPctExito(e.target.value)}
                className={`${inputClasses} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="pct_sucumbencia" className={labelClasses}>
                Sucumbencia (%)
              </label>
              <input
                id="pct_sucumbencia"
                type="number"
                min={0}
                max={100}
                value={pctSucumbencia}
                onChange={(e) => setPctSucumbencia(e.target.value)}
                className={`${inputClasses} font-mono`}
              />
            </div>
          </div>
        </div>

        {/* Error message */}
        {erro && (
          <div className="flex items-start gap-3 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DC2626"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="text-sm text-[#DC2626]">{erro}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvando ? (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-spin h-4 w-4"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Salvar cliente
              </>
            )}
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
