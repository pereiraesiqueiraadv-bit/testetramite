"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Categoria {
  id: string;
  nome: string;
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
    "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors";

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <a
          href="/financeiro"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Voltar
        </a>
        <h1 className="font-heading text-2xl font-bold mt-2">
          Novo lancamento
        </h1>
        <p className="text-muted text-sm mt-1">
          Registre uma nova receita ou despesa.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="data" className="block text-sm font-medium">
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
            <label htmlFor="tipo" className="block text-sm font-medium">
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
          <label htmlFor="descricao" className="block text-sm font-medium">
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
            <label htmlFor="categoria" className="block text-sm font-medium">
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
            <label htmlFor="valor" className="block text-sm font-medium">
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
          <label htmlFor="status" className="block text-sm font-medium">
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

        {erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar lancamento"}
          </button>
          <a
            href="/financeiro"
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
