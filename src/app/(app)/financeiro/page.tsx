import { createClient } from "@/lib/supabase/server";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function FinanceiroPage() {
  const supabase = await createClient();

  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select("*, categorias_financeiras(nome)")
    .order("data", { ascending: false });

  const items = lancamentos ?? [];

  const realizados = items.filter((l) => l.status === "realizado");
  const totalReceitas = realizados
    .filter((l) => l.tipo === "receita")
    .reduce((sum, l) => sum + Number(l.valor), 0);
  const totalDespesas = realizados
    .filter((l) => l.tipo === "despesa")
    .reduce((sum, l) => sum + Number(l.valor), 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Financeiro</h1>
          <p className="text-muted text-sm mt-1">
            Controle de receitas e despesas do escritorio.
          </p>
        </div>
        <a
          href="/financeiro/novo"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          Novo lancamento
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted">Total Receitas</p>
          <p className="font-mono text-2xl font-bold text-green-600 mt-1">
            {formatBRL(totalReceitas)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted">Total Despesas</p>
          <p className="font-mono text-2xl font-bold text-red-600 mt-1">
            {formatBRL(totalDespesas)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted">Saldo</p>
          <p
            className={`font-mono text-2xl font-bold mt-1 ${
              saldo >= 0 ? "text-accent" : "text-red-600"
            }`}
          >
            {formatBRL(saldo)}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted">
            Nenhum lancamento registrado. Clique em &quot;Novo lancamento&quot;
            para comecar.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card-hover">
                  <th className="px-6 py-3 text-left font-medium text-muted">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted">
                    Descricao
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-muted">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((lancamento) => (
                  <tr
                    key={lancamento.id}
                    className="border-b border-border last:border-0 hover:bg-card-hover transition-colors"
                  >
                    <td className="px-6 py-4 font-mono whitespace-nowrap">
                      {new Date(lancamento.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">{lancamento.descricao}</td>
                    <td className="px-6 py-4 text-muted">
                      {lancamento.categorias_financeiras?.nome ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          lancamento.tipo === "receita"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {lancamento.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono whitespace-nowrap">
                      {formatBRL(Number(lancamento.valor))}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          lancamento.status === "realizado"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {lancamento.status === "realizado"
                          ? "Realizado"
                          : "Previsto"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
