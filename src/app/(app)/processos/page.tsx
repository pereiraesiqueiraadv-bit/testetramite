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
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Processos
          </h1>
          <p className="text-muted text-sm mt-1">
            Gerencie os processos do escritorio.
          </p>
        </div>
        <Link
          href="/processos/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo processo
        </Link>
      </div>

      {/* Table or empty state */}
      {lista.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-card p-16 text-center flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A8873C"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Nenhum processo cadastrado
          </h2>
          <p className="text-muted text-sm mt-1.5 max-w-sm">
            Comece adicionando o primeiro processo do escritorio para acompanhar prazos, fases e valores.
          </p>
          <Link
            href="/processos/novo"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Novo processo
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card-hover">
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Numero CNJ
                  </th>
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Juizo
                  </th>
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Fase
                  </th>
                  <th className="px-6 py-3.5 text-right text-[13px] font-medium text-muted uppercase tracking-wider">
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
                      <td className="px-6 py-3.5 font-mono text-sm whitespace-nowrap">
                        {processo.numero_cnj ?? "--"}
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        {clienteNome ?? "--"}
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        {processo.juizo ?? "--"}
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        {faseNome ? (
                          <span className="inline-block text-[12px] font-medium px-2.5 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent-dark">
                            {faseNome}
                          </span>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-sm whitespace-nowrap">
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
