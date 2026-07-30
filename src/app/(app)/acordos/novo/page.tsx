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

  const labelClass = "block text-sm font-medium mb-1.5";
  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Novo acordo</h1>
          <p className="text-muted text-sm mt-1">
            Preencha os dados do acordo.
          </p>
        </div>
        <a
          href="/acordos"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
        >
          Voltar
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-8 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="parte_contraria" className={labelClass}>
              Parte contraria
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
              Telefone da parte
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
              className={inputClass}
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
              className={inputClass}
            />
          </div>
        </div>

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

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Salvar acordo"}
          </button>
          <a
            href="/acordos"
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
