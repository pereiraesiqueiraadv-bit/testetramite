import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ClientesPage() {
  const supabase = await createClient();

  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, nome, cpf_cnpj, telefone, status, areas(nome)")
    .order("nome");

  const lista = clientes ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Clientes
          </h1>
          <p className="text-muted text-sm mt-1">
            Gerencie os clientes do seu escritorio.
          </p>
        </div>
        <Link
          href="/clientes/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
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
            <path d="M12 5v14M5 12h14" />
          </svg>
          Novo cliente
        </Link>
      </div>

      {lista.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-border bg-card shadow-card p-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F6F7F4]">
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h2 className="font-heading text-lg font-semibold mt-5">
            Nenhum cliente cadastrado
          </h2>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Comece cadastrando seu primeiro cliente para acompanhar processos,
            acordos e mais.
          </p>
          <Link
            href="/clientes/novo"
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
              <path d="M12 5v14M5 12h14" />
            </svg>
            Cadastrar primeiro cliente
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card-hover">
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    CPF/CNPJ
                  </th>
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-6 py-3.5 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-right text-[13px] font-medium text-muted uppercase tracking-wider">
                    <span className="sr-only">Acoes</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lista.map((cliente) => {
                  const area = cliente.areas as unknown as { nome: string } | null;

                  return (
                    <tr
                      key={cliente.id}
                      className="hover:bg-card-hover transition-colors group"
                    >
                      <td className="px-6 py-3.5 text-sm font-medium">
                        <Link
                          href={`/clientes/${cliente.id}`}
                          className="hover:text-accent transition-colors"
                        >
                          {cliente.nome}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-mono text-xs text-muted">
                        {cliente.cpf_cnpj || "--"}
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        {cliente.telefone || "--"}
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        {area?.nome || "--"}
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        <StatusBadge status={cliente.status} />
                      </td>
                      <td className="px-6 py-3.5 text-sm text-right">
                        <Link
                          href={`/clientes/${cliente.id}`}
                          className="inline-flex items-center gap-1 text-muted opacity-0 group-hover:opacity-100 hover:text-accent transition-all text-xs font-medium"
                        >
                          Ver detalhes
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
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer with count */}
          <div className="border-t border-border px-6 py-3 bg-card-hover">
            <p className="text-xs text-muted">
              {lista.length} {lista.length === 1 ? "cliente" : "clientes"} cadastrado{lista.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const base = "inline-flex items-center text-[12px] font-medium px-2.5 py-1 rounded-full";

  switch (status) {
    case "prospeccao":
      return (
        <span className={`${base} bg-[#FEF3C7] text-[#D97706]`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1.5 h-3 w-3"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Prospeccao
        </span>
      );
    case "ativo":
      return (
        <span className={`${base} bg-[#DCFCE7] text-[#16A34A]`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1.5 h-3 w-3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Ativo
        </span>
      );
    case "encerrado":
      return (
        <span className={`${base} bg-[#F3F4F6] text-[#6B7280]`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1.5 h-3 w-3"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="15" />
            <line x1="15" y1="9" x2="9" y2="15" />
          </svg>
          Encerrado
        </span>
      );
    default:
      return (
        <span className={`${base} bg-[#F3F4F6] text-[#6B7280]`}>--</span>
      );
  }
}
