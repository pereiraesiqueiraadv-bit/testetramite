import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProcessosPage() {
  const supabase = await createClient();

  const { data: processos } = await supabase
    .from("processos")
    .select(
      "id, numero_cnj, juizo, valor_causa, cliente:clientes(nome), fase:fases(nome)"
    )
    .order("created_at", { ascending: false });

  function formatBRL(value: number | null): string {
    if (value == null) return "--";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const lista = processos ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Processos</h1>
          <p className="text-muted text-sm mt-1">
            Gerencie os processos do escritório.
          </p>
        </div>
        <Link
          href="/processos/novo"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          Novo processo
        </Link>
      </div>

      {/* Table or empty state */}
      {lista.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted text-lg">
            Nenhum processo cadastrado ainda.
          </p>
          <p className="text-muted text-sm mt-2">
            Clique em "Novo processo" para adicionar o primeiro.
          </p>
          <Link
            href="/processos/novo"
            className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            Novo processo
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card-hover">
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    Número CNJ
                  </th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    Cliente
                  </th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    Juízo
                  </th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    Fase
                  </th>
                  <th className="px-6 py-3.5 text-right font-medium text-muted">
                    Valor da Causa
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lista.map((processo) => {
                  const cliente = processo.cliente as
                    | { nome: string }[]
                    | { nome: string }
                    | null;
                  const fase = processo.fase as
                    | { nome: string }[]
                    | { nome: string }
                    | null;

                  const clienteNome = Array.isArray(cliente)
                    ? cliente[0]?.nome
                    : cliente?.nome;
                  const faseNome = Array.isArray(fase)
                    ? fase[0]?.nome
                    : fase?.nome;

                  return (
                    <tr
                      key={processo.id}
                      className="transition-colors hover:bg-card-hover"
                    >
                      <td className="px-6 py-4 font-mono text-sm whitespace-nowrap">
                        {processo.numero_cnj ?? "--"}
                      </td>
                      <td className="px-6 py-4">
                        {clienteNome ?? "--"}
                      </td>
                      <td className="px-6 py-4">
                        {processo.juizo ?? "--"}
                      </td>
                      <td className="px-6 py-4">
                        {faseNome ? (
                          <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent-dark">
                            {faseNome}
                          </span>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-mono whitespace-nowrap">
                        {formatBRL(processo.valor_causa)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
