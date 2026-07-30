import { createClient } from "@/lib/supabase/server";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function TrendUpIcon({ className }: { className?: string }) {
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
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TrendDownIcon({ className }: { className?: string }) {
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
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function ScaleIcon({ className }: { className?: string }) {
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
      <path d="M12 3v18" />
      <path d="M16 7l-4-4-4 4" />
      <rect x="4" y="14" width="4" height="6" rx="1" />
      <rect x="10" y="11" width="4" height="9" rx="1" />
      <rect x="16" y="16" width="4" height="4" rx="1" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
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

function CalendarIcon({ className }: { className?: string }) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
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
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Financeiro
          </h1>
          <p className="text-muted text-sm mt-1">
            Controle de receitas e despesas do escritorio.
          </p>
        </div>
        <a
          href="/financeiro/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          <PlusIcon className="shrink-0" />
          Novo lancamento
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card shadow-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted uppercase tracking-wider">
              Receitas
            </p>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50">
              <TrendUpIcon className="text-emerald-600" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-emerald-600 mt-3">
            {formatBRL(totalReceitas)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted uppercase tracking-wider">
              Despesas
            </p>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50">
              <TrendDownIcon className="text-red-600" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-red-600 mt-3">
            {formatBRL(totalDespesas)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted uppercase tracking-wider">
              Saldo
            </p>
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                saldo >= 0 ? "bg-accent/10" : "bg-red-50"
              }`}
            >
              <ScaleIcon className={saldo >= 0 ? "text-accent" : "text-red-600"} />
            </div>
          </div>
          <p
            className={`font-mono text-2xl font-bold mt-3 ${
              saldo >= 0 ? "text-accent" : "text-red-600"
            }`}
          >
            {formatBRL(saldo)}
          </p>
        </div>
      </div>

      {/* Table or Empty State */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-card py-16 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-5">
            <ReceiptIcon className="text-accent" />
          </div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Nenhum lancamento registrado
          </h2>
          <p className="text-muted text-sm mt-1.5 max-w-sm">
            Comece registrando sua primeira receita ou despesa para acompanhar as financas do escritorio.
          </p>
          <a
            href="/financeiro/novo"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            <PlusIcon className="shrink-0" />
            Novo lancamento
          </a>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarIcon className="shrink-0 text-muted" />
                      Data
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Descricao
                  </th>
                  <th className="px-6 py-3 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-right text-[13px] font-medium text-muted uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((lancamento) => (
                  <tr
                    key={lancamento.id}
                    className="hover:bg-card-hover transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-sm whitespace-nowrap">
                      {new Date(lancamento.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-3.5 text-sm">
                      {lancamento.descricao}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-muted">
                      {lancamento.categorias_financeiras?.nome ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-sm">
                      <span
                        className={`font-medium ${
                          lancamento.tipo === "receita"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {lancamento.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-sm whitespace-nowrap">
                      <span
                        className={
                          lancamento.tipo === "receita"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      >
                        {formatBRL(Number(lancamento.valor))}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${
                          lancamento.status === "realizado"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {lancamento.status === "realizado" ? (
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                        ) : (
                          <ClockIcon className="w-3.5 h-3.5" />
                        )}
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
