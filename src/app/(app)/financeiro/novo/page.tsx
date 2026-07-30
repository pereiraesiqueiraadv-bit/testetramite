"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Categoria {
  id: string;
  nome: string;
}

function ArrowLeftIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 10h8" />
      <path d="M8 14h4" />
    </svg>
  );
}

export default function NovoLancamentoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState<"realizado" | "previsto">("realizado");

  useEffect(() => {
    async function fetchCategorias() {
      const { data } = await supabase
        .from("categorias_financeiras")
        .select("id, nome")
        .order("nome");
      if (data) setCategorias(data);
    }
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      setErro("Informe um valor valido maior que zero.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("lancamentos").insert({
      data,
      descricao,
      categoria_id: categoriaId || null,
      tipo,
      valor: valorNum,
      status,
    });

    if (error) {
      setErro("Erro ao salvar lancamento. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/financeiro");
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors";

  const labelClass = "block text-[13px] font-medium text-muted uppercase tracking-wider";

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <a
          href="/financeiro"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeftIcon className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
          Voltar ao financeiro
        </a>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
            <ReceiptIcon className="text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Novo lancamento
            </h1>
            <p className="text-muted text-sm mt-0.5">
              Registre uma nova receita ou despesa.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-card p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="data" className={labelClass}>
                Data
              </label>
              <input
                id="data"
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tipo" className={labelClass}>
                Tipo
              </label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value as "receita" | "despesa")
                }
                className={inputClass}
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="descricao" className={labelClass}>
              Descricao
            </label>
            <input
              id="descricao"
              type="text"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Honorarios contrato Silva"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="categoria" className={labelClass}>
                Categoria
              </label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className={inputClass}
              >
                <option value="">Sem categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="valor" className={labelClass}>
                Valor (R$)
              </label>
              <input
                id="valor"
                type="number"
                required
                min="0.01"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className={labelClass}>
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "realizado" | "previsto")
              }
              className={inputClass}
            >
              <option value="realizado">Realizado</option>
              <option value="previsto">Previsto</option>
            </select>
          </div>
        </div>

        {erro && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircleIcon className="shrink-0 mt-0.5 text-red-500" />
            <span>{erro}</span>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            <SaveIcon className="shrink-0" />
            {loading ? "Salvando..." : "Salvar lancamento"}
          </button>
          <a
            href="/financeiro"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
