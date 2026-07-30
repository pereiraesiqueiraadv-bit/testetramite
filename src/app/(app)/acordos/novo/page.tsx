"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Cliente {
  id: string;
  nome: string;
}

interface Processo {
  id: string;
  numero_cnj: string;
}

/* ── Inline SVG icons (20x20, stroke only) ── */

function ArrowLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function LoaderIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-accent"
    >
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    </svg>
  );
}

export default function NovoAcordoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProcessos, setLoadingProcessos] = useState(false);

  const [clienteId, setClienteId] = useState("");
  const [processoId, setProcessoId] = useState("");
  const [parteContraria, setParteContraria] = useState("");
  const [telefoneParte, setTelefoneParte] = useState("");
  const [dataAcordo, setDataAcordo] = useState("");
  const [valor, setValor] = useState("");
  const [pctHonorarios, setPctHonorarios] = useState("");
  const [numParcelas, setNumParcelas] = useState("1");
  const [status, setStatus] = useState("negociacao");

  useEffect(() => {
    async function fetchClientes() {
      const { data } = await supabase
        .from("clientes")
        .select("id, nome")
        .order("nome");
      setClientes(data ?? []);
    }
    fetchClientes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!clienteId) {
      setProcessos([]);
      setProcessoId("");
      return;
    }

    async function fetchProcessos() {
      setLoadingProcessos(true);
      const { data } = await supabase
        .from("processos")
        .select("id, numero_cnj")
        .eq("cliente_id", clienteId)
        .order("numero_cnj");
      setProcessos(data ?? []);
      setProcessoId("");
      setLoadingProcessos(false);
    }
    fetchProcessos();
  }, [clienteId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("acordos").insert({
      cliente_id: clienteId || null,
      processo_id: processoId || null,
      parte_contraria: parteContraria || null,
      telefone_parte: telefoneParte || null,
      data_acordo: dataAcordo || null,
      valor: valor ? parseFloat(valor) : null,
      pct_honorarios: pctHonorarios ? parseFloat(pctHonorarios) : null,
      num_parcelas: numParcelas ? parseInt(numParcelas, 10) : 1,
      status,
    });

    if (error) {
      alert("Erro ao salvar acordo: " + error.message);
      setLoading(false);
      return;
    }

    router.push("/acordos");
  }

  const labelClass = "block text-sm font-medium text-ink/80 mb-1.5";
  const inputClass =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-muted/60";

  return (
    <div className="max-w-2xl space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <a
            href="/acordos"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-2"
          >
            <ArrowLeftIcon />
            Voltar para acordos
          </a>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <HandshakeIcon />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Novo acordo
              </h1>
              <p className="text-muted text-sm mt-0.5">
                Preencha os dados do acordo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card shadow-card p-8 space-y-6"
      >
        {/* ── Section: Partes ── */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Partes envolvidas
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cliente_id" className={labelClass}>
                Cliente
              </label>
              <select
                id="cliente_id"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className={inputClass}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="processo_id" className={labelClass}>
                Processo
              </label>
              <select
                id="processo_id"
                value={processoId}
                onChange={(e) => setProcessoId(e.target.value)}
                disabled={!clienteId || loadingProcessos}
                className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {!clienteId
                    ? "Selecione um cliente primeiro"
                    : loadingProcessos
                      ? "Carregando..."
                      : processos.length === 0
                        ? "Nenhum processo encontrado"
                        : "Selecione um processo"}
                </option>
                {processos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.numero_cnj}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ── Section: Parte contraria ── */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Parte contraria
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="parte_contraria" className={labelClass}>
                Nome
              </label>
              <input
                id="parte_contraria"
                type="text"
                value={parteContraria}
                onChange={(e) => setParteContraria(e.target.value)}
                placeholder="Nome da parte contraria"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="telefone_parte" className={labelClass}>
                Telefone
              </label>
              <input
                id="telefone_parte"
                type="text"
                value={telefoneParte}
                onChange={(e) => setTelefoneParte(e.target.value)}
                placeholder="(00) 00000-0000"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ── Section: Valores ── */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Valores e condicoes
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="data_acordo" className={labelClass}>
                Data do acordo
              </label>
              <input
                id="data_acordo"
                type="date"
                value={dataAcordo}
                onChange={(e) => setDataAcordo(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="valor" className={labelClass}>
                Valor (R$)
              </label>
              <input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mt-5">
            <div>
              <label htmlFor="pct_honorarios" className={labelClass}>
                Honorarios (%)
              </label>
              <input
                id="pct_honorarios"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={pctHonorarios}
                onChange={(e) => setPctHonorarios(e.target.value)}
                placeholder="0,00"
                className={`${inputClass} font-mono`}
              />
            </div>

            <div>
              <label htmlFor="num_parcelas" className={labelClass}>
                Numero de parcelas
              </label>
              <input
                id="num_parcelas"
                type="number"
                min="1"
                value={numParcelas}
                onChange={(e) => setNumParcelas(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ── Section: Status ── */}
        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            <option value="negociacao">Negociacao</option>
            <option value="fechado">Fechado</option>
            <option value="homologado">Homologado</option>
            <option value="quitado">Quitado</option>
          </select>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoaderIcon /> : <SaveIcon />}
            {loading ? "Salvando..." : "Salvar acordo"}
          </button>
          <a
            href="/acordos"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
