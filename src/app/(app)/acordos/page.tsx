import { createClient } from "@/lib/supabase/server";

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  negociacao: { label: "Negociacao", bg: "bg-yellow-100", text: "text-yellow-800" },
  fechado: { label: "Fechado", bg: "bg-blue-100", text: "text-blue-800" },
  homologado: { label: "Homologado", bg: "bg-green-100", text: "text-green-800" },
  quitado: { label: "Quitado", bg: "bg-gray-100", text: "text-gray-600" },
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default async function AcordosPage() {
  const supabase = await createClient();

  const { data: acordos } = await supabase
    .from("acordos")
    .select("id, parte_contraria, valor, num_parcelas, status, clientes(nome)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Acordos</h1>
          <p className="text-muted text-sm mt-1">
            Gerencie os acordos do seu escritorio.
          </p>
        </div>
        <a
          href="/acordos/novo"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          Novo acordo
        </a>
      </div>

      {!acordos || acordos.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted text-lg font-medium">
            Nenhum acordo cadastrado
          </p>
          <p className="text-muted text-sm mt-2">
            Clique em &quot;Novo acordo&quot; para registrar o primeiro acordo.
          </p>
          <a
            href="/acordos/novo"
            className="mt-6 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            Novo acordo
          </a>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card-hover">
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Parte Contraria
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-muted">
                    Valor (R$)
                  </th>
                  <th className="px-6 py-4 text-center font-medium text-muted">
                    Parcelas
                  </th>
                  <th className="px-6 py-4 text-center font-medium text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {acordos.map((acordo) => {
                  const cliente = acordo.clientes as unknown as { nome: string } | null;
                  const status = statusConfig[acordo.status] ?? statusConfig.negociacao;

                  return (
                    <tr
                      key={acordo.id}
                      className="border-b border-border last:border-b-0 hover:bg-card-hover transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">
                        {cliente?.nome ?? "---"}
                      </td>
                      <td className="px-6 py-4">
                        {acordo.parte_contraria ?? "---"}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {formatBRL(acordo.valor ?? 0)}
                      </td>
                      <td className="px-6 py-4 text-center font-mono">
                        {acordo.num_parcelas ?? 1}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
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
