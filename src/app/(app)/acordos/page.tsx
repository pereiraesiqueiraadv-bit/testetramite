import { createClient } from "@/lib/supabase/server";

const statusConfig: Record<string, { label: string; classes: string }> = {
  negociacao: {
    label: "Negociacao",
    classes: "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20",
  },
  fechado: {
    label: "Fechado",
    classes: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
  },
  homologado: {
    label: "Homologado",
    classes: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
  },
  quitado: {
    label: "Quitado",
    classes: "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20",
  },
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/* ── Inline SVG icons (20x20, stroke only) ── */

function PlusIcon() {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted/40"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
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

export default async function AcordosPage() {
  const supabase = await createClient();

  const { data: acordos } = await supabase
    .from("acordos")
    .select("id, parte_contraria, valor, num_parcelas, status, clientes(nome)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <HandshakeIcon />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Acordos
            </h1>
            <p className="text-muted text-sm mt-0.5">
              Gerencie os acordos do seu escritorio.
            </p>
          </div>
        </div>
        <a
          href="/acordos/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors shadow-sm"
        >
          <PlusIcon />
          Novo acordo
        </a>
      </div>

      {/* ── Content ── */}
      {!acordos || acordos.length === 0 ? (
        /* ── Empty state ── */
        <div className="rounded-xl border border-border bg-card shadow-card px-6 py-16 text-center">
          <div className="flex justify-center mb-4">
            <FileTextIcon />
          </div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Nenhum acordo cadastrado
          </h2>
          <p className="text-muted text-sm mt-1.5 max-w-sm mx-auto">
            Clique em &quot;Novo acordo&quot; para registrar o primeiro acordo do
            escritorio.
          </p>
          <a
            href="/acordos/novo"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors shadow-sm"
          >
            <PlusIcon />
            Novo acordo
          </a>
        </div>
      ) : (
        /* ── Table ── */
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Parte Contraria
                  </th>
                  <th className="px-6 py-3 text-right text-[13px] font-medium text-muted uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-center text-[13px] font-medium text-muted uppercase tracking-wider">
                    Parcelas
                  </th>
                  <th className="px-6 py-3 text-center text-[13px] font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {acordos.map((acordo) => {
                  const cliente = acordo.clientes as unknown as {
                    nome: string;
                  } | null;
                  const status =
                    statusConfig[acordo.status] ?? statusConfig.negociacao;

                  return (
                    <tr
                      key={acordo.id}
                      className="hover:bg-card-hover transition-colors"
                    >
                      <td className="px-6 py-3.5 text-sm font-medium">
                        {cliente?.nome ?? "---"}
                      </td>
                      <td className="px-6 py-3.5 text-sm">
                        {acordo.parte_contraria ?? "---"}
                      </td>
                      <td className="px-6 py-3.5 text-sm text-right font-mono">
                        {formatBRL(acordo.valor ?? 0)}
                      </td>
                      <td className="px-6 py-3.5 text-sm text-center font-mono">
                        {acordo.num_parcelas ?? 1}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span
                          className={`inline-block text-[12px] font-medium px-2.5 py-1 rounded-full ${status.classes}`}
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
