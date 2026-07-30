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
          <h1 className="font-heading text-2xl font-bold">Clientes</h1>
          <p className="text-muted text-sm mt-1">
            Gerencie os clientes do seu escritorio.
          </p>
        </div>
        <Link
          href="/clientes/novo"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          Novo cliente
        </Link>
      </div>

      {lista.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <h2 className="font-heading text-lg font-semibold">
            Nenhum cliente cadastrado
          </h2>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">
            Comece cadastrando seu primeiro cliente para acompanhar processos,
            acordos e mais.
          </p>
          <Link
            href="/clientes/novo"
            className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            Cadastrar primeiro cliente
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card-hover">
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    Nome
                  </th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    CPF/CNPJ
                  </th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    Telefone
                  </th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    Area
                  </th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lista.map((cliente) => {
                  const area = cliente.areas as unknown as { nome: string } | null;

                  return (
                    <tr
                      key={cliente.id}
                      className="hover:bg-card-hover transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">
                        {cliente.nome}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {cliente.cpf_cnpj || "--"}
                      </td>
                      <td className="px-6 py-4">
                        {cliente.telefone || "--"}
                      </td>
                      <td className="px-6 py-4">
                        {area?.nome || "--"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={cliente.status} />
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

function StatusBadge({ status }: { status: string | null }) {
  let classes = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ";

  switch (status) {
    case "prospeccao":
      classes += "bg-yellow-100 text-yellow-800";
      return <span className={classes}>Prospeccao</span>;
    case "ativo":
      classes += "bg-green-100 text-green-800";
      return <span className={classes}>Ativo</span>;
    case "encerrado":
      classes += "bg-gray-100 text-gray-600";
      return <span className={classes}>Encerrado</span>;
    default:
      classes += "bg-gray-100 text-gray-600";
      return <span className={classes}>--</span>;
  }
}
